import fs from 'fs/promises'
import path from 'path'
import EventEmitter from 'events'
import { themeModes, themeTokens } from '@shared/constants'
import type { ThemeTokenMap } from '@shared/types'
import { IThemeManager } from '../../application/ports/IThemeManager'
import { IThemeRegistry } from '../../application/ports/IThemeRegistry'
import { ThemeManifest } from '../../application/models/ThemeManifest'

export class ThemeManager extends EventEmitter implements IThemeManager {
  constructor(private readonly registry: IThemeRegistry) {
    super()
  }

  async load(themesPath: string): Promise<void> {
    await fs.mkdir(themesPath, { recursive: true })
    const dirs = await fs.readdir(themesPath)

    for (const dir of dirs) {
      const themeDir = path.join(themesPath, dir)
      try {
        const theme = await this.loadTheme(themeDir)
        this.registry.register(theme)
      } catch (err) {
        this.emit(
          'error',
          new Error(
            `Failed loading theme "${dir}": ${err instanceof Error ? err.stack : String(err)}`,
          ),
        )
      }
    }
  }

  private async loadTheme(themeDir: string) {
    const filePath = path.join(themeDir, 'manifest.json')
    const manifest = JSON.parse(
      await fs.readFile(filePath, 'utf-8'),
    ) as ThemeManifest

    if (!manifest.id) {
      throw new Error(`Theme at ${themeDir} is missing required id`)
    }
    if (!manifest.name) {
      throw new Error(`Theme at ${themeDir} is missing required name`)
    }
    if ((themeModes as readonly string[]).includes(manifest.id)) {
      throw new Error(
        `Theme id "${manifest.id}" is reserved for built-in themes`,
      )
    }
    if (manifest.icon) {
      manifest.icon = path.join(themeDir, manifest.icon)
      if (!path.resolve(manifest.icon).startsWith(themeDir)) {
        throw new Error(
          `Theme at ${themeDir} must point to an icon within its folder`,
        )
      }
    }

    return {
      id: manifest.id,
      name: manifest.name,
      icon: manifest.icon,
      colors: this.validateTokens(manifest.colors ?? {}),
    }
  }

  private validateTokens(overrides: ThemeTokenMap): ThemeTokenMap {
    const base: ThemeTokenMap = {}
    for (const [token, value] of Object.entries(overrides)) {
      if (!themeTokens.includes(token as (typeof themeTokens)[number])) {
        throw new Error(`Unsupported theme token "${token}"`)
      }
      if (typeof value !== 'string' || value.trim().length === 0) {
        throw new Error(`Token "${token}" must be a non-empty string`)
      }
      base[token as keyof ThemeTokenMap] = value
    }

    return base
  }
}
