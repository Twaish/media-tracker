import { PluginModule } from '../../infrastructure/adapters/PluginModule'
import { IPluginManager } from '../../application/ports/IPluginManager'
import { IPluginRegistry } from '../../application/ports/IPluginRegistry'
import { PluginManifest } from '../../application/models/PluginManifest'
import { Modules } from '@/helpers/ipc/types'

import fs from 'fs/promises'
import path from 'path'
import semver from 'semver'
import { pathToFileURL } from 'url'

export type PluginState =
  | 'unloaded'
  | 'loaded' // manifest + module imported
  | 'setting-up'
  | 'running' // setup() completed
  | 'error' // failed at any stage
  | 'destroyed'

type PluginEntry = {
  path: string
  manifest: PluginManifest
  module: PluginModule
  state: PluginState
  error?: Error
}

export class PluginManager implements IPluginManager {
  private modules?: Modules
  private plugins: Map<string, PluginEntry> = new Map()
  constructor(private readonly registry: IPluginRegistry) {}

  setModules(modules: Modules) {
    this.modules = modules
  }

  async load(pluginsPath: string): Promise<void> {
    const modules = this.getModules()
    await fs.mkdir(pluginsPath, { recursive: true })

    const dirs = await fs.readdir(pluginsPath)
    const loaded: PluginManifest[] = []

    for (const dir of dirs) {
      try {
        const pluginDir = path.join(pluginsPath, dir)
        const { manifest, module } = await this.loadPlugin(pluginDir)

        this.validateVersion(manifest, modules.appInfo.version)

        if (manifest.icon) {
          manifest.icon = path.join(pluginDir, manifest.icon)
        }

        this.registry.register(manifest.name, manifest)
        this.plugins.set(manifest.name, {
          path: pluginDir,
          manifest,
          module,
          state: 'loaded',
        })
        loaded.push(manifest)
      } catch (err) {
        modules.logger.error(
          `Couldn't import plugin at ${dir}. ${err instanceof Error ? err.stack : String(err)}`,
        )
      }
    }

    for (const manifest of loaded) {
      this.validateDependencies(manifest)
    }
  }

  async setup(): Promise<void> {
    const modules = this.getModules()

    for (const batch of this.topologicalBatches()) {
      await Promise.all(
        batch.map(async (name) => {
          const entry = this.plugins.get(name)!
          entry.state = 'setting-up'
          try {
            await entry.module.setup?.(modules, entry.path)
            entry.state = 'running'
          } catch (err) {
            entry.state = 'error'
            entry.error = err instanceof Error ? err : new Error(String(err))
            modules.logger.error(
              `Plugin "${name}" failed during setup: ${entry.error.stack}`,
            )
          }
        }),
      )
    }
  }

  async execute(pluginName: string, ...args: unknown[]): Promise<void> {
    const modules = this.getModules()
    const plugin = this.plugins.get(pluginName)
    if (!plugin) {
      throw new Error(`No plugin found with name "${pluginName}"`)
    }
    if (!plugin.module.execute) {
      throw new Error(`Plugin "${pluginName}" has no execute method`)
    }
    await plugin.module.execute(modules, ...args)
  }

  async destroy(pluginName: string): Promise<void> {
    const modules = this.getModules()
    const plugin = this.plugins.get(pluginName)
    if (!plugin) {
      throw new Error(`No plugin found with name "${pluginName}"`)
    }
    if (!plugin.module.destroy) {
      throw new Error(`Plugin "${pluginName}" has no destroy method`)
    }
    await plugin.module.destroy(modules)
  }

  async destroyAll(): Promise<void> {
    const modules = this.getModules()
    // Reverse for dependents destroyed before their dependencies
    for (const batch of this.topologicalBatches().reverse()) {
      await Promise.allSettled(
        batch.map(async (name) => {
          const entry = this.plugins.get(name)!
          try {
            await entry.module.destroy?.(modules)
            entry.state = 'destroyed'
          } catch (err) {
            modules.logger.error(
              `Plugin "${name}" failed during destroy: ${err instanceof Error ? err.stack : String(err)}`,
            )
          }
        }),
      )
    }
  }

  private async loadPlugin(
    dir: string,
  ): Promise<{ manifest: PluginManifest; module: PluginModule }> {
    const manifest = JSON.parse(
      await fs.readFile(path.join(dir, 'manifest.json'), 'utf-8'),
    ) as PluginManifest

    if (manifest.name == null) {
      throw new Error(`Plugin at ${dir} is missing a required name`)
    }

    const modulePath = pathToFileURL(path.join(dir, 'index.js'))
    const module = (await import(modulePath.href)).default as PluginModule
    return { manifest, module }
  }

  private getModules() {
    if (!this.modules) {
      throw new Error(`Modules has not been set in PluginManager`)
    }
    return this.modules!
  }

  private validateVersion(manifest: PluginManifest, appVersion: string) {
    if (
      manifest.minAppVersion &&
      semver.gt(manifest.minAppVersion, appVersion)
    ) {
      throw new Error(
        `Plugin "${manifest.name}" requires app version ${manifest.minAppVersion}+ (current: ${appVersion}) `,
      )
    }
  }

  private validateDependencies(manifest: PluginManifest) {
    for (const dep of manifest.dependencies ?? []) {
      if (!this.plugins.has(dep)) {
        const entry = this.plugins.get(manifest.name)!
        entry.state = 'error'
        entry.error = new Error(
          `Plugin "${manifest.name}" requires "${dep}" which is not loaded`,
        )
        this.getModules().logger.error(entry.error.message)
      }
    }
  }

  topologicalBatches(): string[][] {
    const inDegree = new Map<string, number>()
    const adj = new Map<string, string[]>()

    for (const [name] of this.plugins) {
      inDegree.set(name, 0)
      adj.set(name, [])
    }
    for (const [name, entry] of this.plugins) {
      for (const dep of entry.manifest.dependencies ?? []) {
        if (dep === name) continue // Ignore self dependency
        adj.get(dep)?.push(name)
        inDegree.set(name, (inDegree.get(name) ?? 0) + 1)
      }
    }

    const batches: string[][] = []
    let ready = [...inDegree.entries()]
      .filter(([, d]) => d === 0)
      .map(([n]) => n)

    while (ready.length > 0) {
      batches.push(ready)
      const next: string[] = []
      for (const name of ready) {
        for (const dep of adj.get(name) ?? []) {
          const deg = (inDegree.get(dep) ?? 0) - 1
          inDegree.set(dep, deg)
          if (deg === 0) next.push(dep)
        }
      }
      ready = next
    }

    // Mark cycles
    for (const [name, deg] of inDegree) {
      if (deg > 0) {
        const entry = this.plugins.get(name)!
        entry.state = 'error'
        entry.error = new Error(
          `Plugin "${name}" is part of a dependency cycle`,
        )
      }
    }

    return batches
  }
}
