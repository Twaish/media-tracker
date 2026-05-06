import { PluginModule } from '../../infrastructure/adapters/PluginModule'
import { IPluginManager } from '../../application/ports/IPluginManager'
import { IPluginRegistry } from '../../application/ports/IPluginRegistry'
import { PluginManifest } from '../../application/models/PluginManifest'
import { IPermissionRegistry } from '../../application/ports/IPermissionRegistry'
import { PluginContext } from './PluginContext'

import {
  ISettingsBuilder,
  Schema,
  SettingsInterface,
} from '@/app/settings/application/ports/ISettingsBuilder'

import fs from 'fs/promises'
import path from 'path'
import semver from 'semver'
import EventEmitter from 'events'
import { loadPluginSandboxed } from '../helpers/load-plugin-sandboxed'
import { PluginEntry } from '../../application/models/PluginEntry'

type PluginModuleEntry = PluginEntry & {
  module: PluginModule
  context?: PluginContext
}

const pluginManagerSchema = {
  enabledPlugins: { default: {} as Record<string, boolean> },
} satisfies Schema

export class PluginManager extends EventEmitter implements IPluginManager {
  private plugins: Map<string, PluginModuleEntry> = new Map()
  private settings: SettingsInterface<typeof pluginManagerSchema>

  constructor(
    private readonly pluginRegistry: IPluginRegistry,
    private readonly permissionRegistry: IPermissionRegistry,
    private readonly settingsBuilder: ISettingsBuilder,
  ) {
    super()
    this.settings = this.settingsBuilder.defineSettings(
      'plugins',
      'plugins',
      pluginManagerSchema,
    )
  }

  async init(): Promise<void> {
    await this.settings.init()
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
        if (manifest.dependencies) {
          manifest.dependencies = manifest.dependencies.filter(
            (dep) => dep !== manifest.id,
          )
        }

        this.pluginRegistry.register(manifest.id, manifest)

        this.plugins.set(manifest.id, {
          path: pluginDir,
          manifest,
          module,
          enabled: !!this.settings.enabledPlugins[manifest.id],
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

    for (const manifest of manifests) {
      this.validateDependencies(manifest)
    }

    // Disable plugins whose dependencies are not enabled
    for (const manifest of manifests) {
      const plugin = this.plugins.get(manifest.id)
      if (!plugin?.enabled) continue

      const hasDisabledDep = (manifest.dependencies ?? []).some((dep) => {
        const depPlugin = this.plugins.get(dep)
        return depPlugin && !depPlugin.enabled
      })

      if (!hasDisabledDep) continue

      plugin.enabled = false
      this.emit(
        'error',
        new Error(`Plugin "${manifest.id}" has disabled dependencies`),
      )
    }
  }

  async enable(id: string): Promise<void> {
    const plugin = this.getPluginOrThrow(id)
    if (plugin.enabled) return
    plugin.enabled = true

    const enableDependencies = async (dependencies: string[] = []) => {
      for (const dependencyId of dependencies) {
        const dependency = this.getPluginOrThrow(dependencyId)
        if (dependency.enabled || dependency.error != null) continue

        const dependencyDeps = dependency.manifest.dependencies ?? []
        const allDepsReady = dependencyDeps.every((dep) => {
          if (dep === dependencyId) return true

          return this.getPluginOrThrow(dep).enabled
        })

        let successful = allDepsReady
        if (!allDepsReady) {
          successful = await enableDependencies(dependencyDeps)
        }

        if (successful) {
          await this.enable(dependencyId)
        } else {
          return false
        }
      }
      return true
    }
    await enableDependencies(plugin.manifest.dependencies)

    await this.setupPlugin(id)

    if (plugin.error == null) {
      this.settings.enabledPlugins = {
        ...this.settings.enabledPlugins,
        [id]: true,
      }
    }
  }

  async disable(id: string): Promise<void> {
    const plugin = this.getPluginOrThrow(id)
    if (!plugin.enabled) return
    plugin.enabled = false

    const dependants = this.getDependents(id)
    for (const dependant of dependants) {
      this.disable(dependant)
    }

    if (plugin.context) {
      await this.destroy(id)
    }

    this.settings.enabledPlugins = {
      ...this.settings.enabledPlugins,
      [id]: false,
    }
  }

  getAll(): PluginEntry[] {
    return Array.from(
      this.plugins.values().map(({ module, context, ...entry }) => entry),
    )
  }

  async setup(): Promise<void> {
    for (const batch of this.topologicalBatches()) {
      await Promise.all(batch.map(this.setupPlugin.bind(this)))
    }
  }

  async setupPlugin(id: string): Promise<void> {
    const plugin = this.getPluginOrThrow(id)
    const settings = await this.buildSettings(plugin)

    if (!plugin.enabled) return

    try {
      const context = {
        ...this.buildContext(plugin),
        settings,
      }

      await plugin.module.setup?.(context)
      plugin.context = context
    } catch (err) {
      this.failPlugin(plugin, err, 'setup')
    }
  }

  async execute(id: string, ...args: unknown[]): Promise<void> {
    const plugin = this.getPluginOrThrow(id)
    if (!plugin.enabled) return
    if (!plugin.context) return

    await plugin.module.execute?.(plugin.context, ...args)
  }

  async destroy(id: string): Promise<void> {
    const plugin = this.getPluginOrThrow(id)
    if (!plugin.context) return

    try {
      await plugin.module.destroy?.(plugin.context)
    } catch (err) {
      this.failPlugin(plugin, err, 'destroy')
    }
    plugin.context = undefined
  }

  async destroyAll(): Promise<void> {
    // Reverse for dependents destroyed before their dependencies
    for (const batch of this.topologicalBatches().reverse()) {
      await Promise.allSettled(batch.map(this.destroy))
    }
  }

  private getDependents(id: string): string[] {
    const dependents: string[] = []

    for (const [otherId, entry] of this.plugins) {
      if (otherId === id) continue
      if ((entry.manifest.dependencies ?? []).includes(id)) {
        dependents.push(otherId)
        dependents.push(...this.getDependents(otherId))
      }
    }

    return [...new Set(dependents)]
  }

  private getPluginOrThrow(id: string) {
    const plugin = this.plugins.get(id)
    if (!plugin) throw new Error(`No plugin found with id "${id}"`)
    return plugin
  }

  private failPlugin(plugin: PluginModuleEntry, err: unknown, phase: string) {
    plugin.enabled = false
    plugin.error = err instanceof Error ? err : new Error(String(err))

    this.emit(
      'error',
      new Error(
        `Plugin "${plugin.manifest.name}" failed during ${phase}: ${plugin.error.stack}`,
      ),
    )
  }

  private async buildSettings(plugin: PluginModuleEntry) {
    if (!plugin.module.settings) return

    const existingSettings = plugin.context?.settings
    if (existingSettings) return existingSettings

    const namespace = `plugin:${plugin.manifest.id}`
    const filename = `plugin-${this.getPluginBasicName(plugin.manifest.id)}`

    return this.settingsBuilder
      .defineSettings(namespace, filename, plugin.module.settings)
      .init()
  }

  private buildContext(plugin: PluginModuleEntry) {
    const permissions = plugin.manifest.permissions ?? []

    return {
      ...this.permissionRegistry.buildContext(permissions),
      pluginName: plugin.manifest.name,
      pluginDir: plugin.path,
      pluginId: plugin.manifest.id,
    }
  }

  private validateVersion(manifest: PluginManifest, appVersion: string) {
    if (
      manifest.minAppVersion &&
      semver.gt(manifest.minAppVersion, appVersion)
    ) {
      throw new Error(
        `Plugin with id "${manifest.id}" requires app version ${manifest.minAppVersion}+ (current: ${appVersion}) `,
      )
    }
  }

  private validateDependencies(manifest: PluginManifest) {
    if (!manifest.dependencies) return

    for (const dep of manifest.dependencies) {
      if (this.plugins.has(dep)) continue

      const plugin = this.getPluginOrThrow(manifest.id)
      this.failPlugin(
        plugin,
        new Error(
          `Plugin with id "${manifest.id}" requires "${dep}" which is not loaded`,
        ),
        'dependency-validation',
      )
    }
  }

  private getPluginBasicName(id: string) {
    return id.toLowerCase().replaceAll(' ', '-')
  }

  topologicalBatches(): string[][] {
    const inDegree = new Map<string, number>()
    const adj = new Map<string, string[]>()

    for (const [id] of this.plugins) {
      inDegree.set(id, 0)
      adj.set(id, [])
    }
    for (const [id, entry] of this.plugins) {
      for (const dep of entry.manifest.dependencies ?? []) {
        if (dep === id) continue // Ignore self dependency
        adj.get(dep)?.push(id)
        inDegree.set(id, (inDegree.get(id) ?? 0) + 1)
      }
    }

    const batches: string[][] = []
    let ready = [...inDegree.entries()]
      .filter(([, d]) => d === 0)
      .map(([n]) => n)

    while (ready.length > 0) {
      batches.push(ready)
      const next: string[] = []
      for (const id of ready) {
        for (const dep of adj.get(id) ?? []) {
          const deg = (inDegree.get(dep) ?? 0) - 1
          inDegree.set(dep, deg)
          if (deg === 0) next.push(dep)
        }
      }
      ready = next
    }

    // Mark cycles
    for (const [id, deg] of inDegree) {
      if (deg <= 0) continue

      const plugin = this.getPluginOrThrow(id)
      this.failPlugin(
        plugin,
        `Plugin with id "${id}" is part of a dependency cycle`,
        'dependency-cycle',
      )
    }

    return batches
  }
}
