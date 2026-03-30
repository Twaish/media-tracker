import { PluginModule } from '@/application/ports/plugins/PluginModule'
import { IPluginManager } from '@/application/ports/plugins/IPluginManager'
import { IPluginRegistry } from '@/application/ports/plugins/IPluginRegistry'
import { PluginManifest } from '@/application/ports/plugins/PluginManifest'
import { Modules } from '@/helpers/ipc/types'

import fs from 'fs/promises'
import path from 'path'
import semver from 'semver'
import { pathToFileURL } from 'url'

export class PluginManager implements IPluginManager {
  private modules?: Modules
  private pluginModules: Map<string, PluginModule> = new Map()
  private pluginPaths: Map<string, string> = new Map()
  constructor(private readonly registry: IPluginRegistry) {}

  setModules(modules: Modules) {
    this.modules = modules
  }

  async load(pluginsPath: string): Promise<void> {
    const modules = this.getModules()
    await fs.mkdir(pluginsPath, { recursive: true })

    const dirs = await fs.readdir(pluginsPath)

    for (const dir of dirs) {
      try {
        const pluginDir = path.join(pluginsPath, dir)
        const { manifest, module } = await this.loadPlugin(pluginDir)

        if (
          manifest.minAppVersion &&
          semver.gt(manifest.minAppVersion, modules.appInfo.version)
        ) {
          throw new Error(
            `Plugin "${manifest.name}" requires app version ${manifest.minAppVersion} or higher (current: ${modules.appInfo.version}) `,
          )
        }

        if (manifest.icon) {
          manifest.icon = path.join(pluginDir, manifest.icon)
        }

        this.registry.register(manifest.name, manifest)
        this.pluginModules.set(manifest.name, module)
        this.pluginPaths.set(manifest.name, pluginDir)
      } catch (err) {
        modules.logger.error(
          `Couldn't import plugin at ${dir}. ${err instanceof Error ? err.stack : String(err)}`,
        )
      }
    }
  }

  async setup(): Promise<void> {
    const modules = this.getModules()
    await Promise.all(
      this.pluginModules
        .entries()
        .map(([name, module]) =>
          module.setup?.(modules, this.pluginPaths.get(name)!),
        ),
    )
  }

  async execute(pluginName: string, ...args: unknown[]): Promise<void> {
    const modules = this.getModules()
    const plugin = this.pluginModules.get(pluginName)
    if (!plugin) {
      throw new Error(`No plugin found with name "${pluginName}"`)
    }
    if (!plugin.execute) {
      throw new Error(`Plugin "${pluginName}" has no execute method`)
    }
    await plugin.execute(modules, ...args)
  }

  async destroy(pluginName: string): Promise<void> {
    const modules = this.getModules()
    const plugin = this.pluginModules.get(pluginName)
    if (!plugin) {
      throw new Error(`No plugin found with name "${pluginName}"`)
    }
    if (!plugin.destroy) {
      throw new Error(`Plugin "${pluginName}" has no destroy method`)
    }
    await plugin.destroy(modules)
  }

  async destroyAll(): Promise<void> {
    const modules = this.getModules()
    await Promise.all(
      this.pluginModules.values().map((p) => p.destroy?.(modules)),
    )
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
}
