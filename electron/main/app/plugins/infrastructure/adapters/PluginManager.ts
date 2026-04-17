import { PluginModule } from '../../infrastructure/adapters/PluginModule'
import { IPluginManager } from '../../application/ports/IPluginManager'
import { IPluginRegistry } from '../../application/ports/IPluginRegistry'
import { PluginManifest } from '../../application/models/PluginManifest'
import { IPermissionRegistry } from '../../application/ports/IPermissionRegistry'
import { PluginContext } from './PluginContext'

import { ISettingsBuilder } from '@/app/settings/application/ports/ISettingsBuilder'

import fs from 'fs/promises'
import path from 'path'
import semver from 'semver'
import EventEmitter from 'events'
import { loadPluginSandboxed } from '../helpers/load-plugin-sandboxed'

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
  context?: PluginContext
  error?: Error
}

export class PluginManager extends EventEmitter implements IPluginManager {
  private plugins: Map<string, PluginEntry> = new Map()

  constructor(
    private readonly pluginRegistry: IPluginRegistry,
    private readonly permissionRegsitry: IPermissionRegistry,
    private readonly settingsBuilder: ISettingsBuilder,
  ) {
    super()
  }

  async load(pluginsPath: string, appVersion: string): Promise<void> {
    await fs.mkdir(pluginsPath, { recursive: true })
    const dirs = await fs.readdir(pluginsPath)

    const manifests: PluginManifest[] = []

    for (const dir of dirs) {
      const pluginDir = path.join(pluginsPath, dir)

      try {
        const { manifest, module } = await loadPluginSandboxed(pluginDir)

        this.validateVersion(manifest, appVersion)

        if (manifest.icon) {
          manifest.icon = path.join(pluginDir, manifest.icon)
        }

        this.pluginRegistry.register(manifest.name, manifest)

        this.plugins.set(manifest.name, {
          path: pluginDir,
          manifest,
          module,
          state: 'loaded',
        })

        manifests.push(manifest)
      } catch (err) {
        this.emit(
          'error',
          new Error(
            `Failed loading plugin "${dir}": ${err instanceof Error ? err.stack : String(err)}`,
          ),
        )
      }
    }

    manifests.forEach((m) => this.validateDependencies(m))
  }

  async setup(): Promise<void> {
    const setupPlugin = async (name: string) => {
      const plugin = this.getPluginOrThrow(name)
      plugin.state = 'setting-up'

      try {
        const settings = await this.buildSettings(plugin)
        const context = {
          ...this.buildContext(plugin),
          settings,
        }

        await plugin.module.setup?.(context)
        plugin.context = context
        plugin.state = 'running'
      } catch (err) {
        this.failPlugin(plugin, err, 'setup')
      }
    }

    for (const batch of this.topologicalBatches()) {
      await Promise.all(batch.map(setupPlugin))
    }
  }

  async execute(pluginName: string, ...args: unknown[]): Promise<void> {
    const plugin = this.getPluginOrThrow(pluginName)
    if (!plugin.context) {
      throw new Error(`Plugin "${pluginName}" is not initialized`)
    }
    if (!plugin.module.execute) {
      throw new Error(`Plugin "${pluginName}" has no execute method`)
    }
    await plugin.module.execute(plugin.context, ...args)
  }

  async destroy(pluginName: string): Promise<void> {
    const plugin = this.getPluginOrThrow(pluginName)
    if (!plugin.context) {
      throw new Error(`Plugin "${pluginName}" is not initialized`)
    }
    if (!plugin.module.destroy) {
      throw new Error(`Plugin "${pluginName}" has no destroy method`)
    }
    await plugin.module.destroy(plugin.context)
    plugin.state = 'destroyed'
  }

  async destroyAll(): Promise<void> {
    const destroyPlugin = async (name: string) => {
      try {
        this.destroy(name)
      } catch (err) {
        this.emit(
          'error',
          new Error(
            `Plugin "${name}" failed during destroy: ${err instanceof Error ? err.stack : String(err)}`,
          ),
        )
      }
    }

    // Reverse for dependents destroyed before their dependencies
    for (const batch of this.topologicalBatches().reverse()) {
      await Promise.allSettled(batch.map(destroyPlugin))
    }
  }

  private getPluginOrThrow(name: string) {
    const plugin = this.plugins.get(name)
    if (!plugin) throw new Error(`No plugin found with name "${name}"`)
    return plugin
  }

  private failPlugin(plugin: PluginEntry, err: unknown, phase: string) {
    plugin.state = 'error'
    plugin.error = err instanceof Error ? err : new Error(String(err))

    this.emit(
      'error',
      new Error(
        `Plugin "${plugin.manifest.name}" failed during ${phase}: ${plugin.error.stack}`,
      ),
    )
  }

  private async buildSettings(plugin: PluginEntry) {
    if (!plugin.module.settings) return

    const namespace = `plugin:${plugin.manifest.name}`
    const filename = `plugin-${this.getPluginBasicName(plugin.manifest.name)}`

    return this.settingsBuilder
      .defineSettings(namespace, filename, plugin.module.settings)
      .init()
  }

  private buildContext(plugin: PluginEntry) {
    const permissions = plugin.manifest.permissions ?? []

    return {
      ...this.permissionRegsitry.buildContext(permissions),
      pluginName: plugin.manifest.name,
      pluginDir: plugin.path,
    }
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
      if (this.plugins.has(dep)) continue

      const plugin = this.getPluginOrThrow(manifest.name)

      const error = new Error(
        `Plugin "${manifest.name}" requires "${dep}" which is not loaded`,
      )
      this.failPlugin(plugin, error, 'dependency-validation')
    }
  }

  private getPluginBasicName(pluginName: string) {
    return pluginName.toLowerCase().replaceAll(' ', '-')
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
      if (deg <= 0) continue

      const plugin = this.getPluginOrThrow(name)
      this.failPlugin(
        plugin,
        `Plugin "${name}" is part of a dependency cycle`,
        'dependency-cycle',
      )
    }

    return batches
  }
}
