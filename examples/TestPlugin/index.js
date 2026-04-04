import pkg from './manifest.json' with { type: 'json' }
import fs from 'fs/promises'
import path from 'path'

const outputDir = 'out'
const state = {}

export default {
  state,

  getSettings() {
    return {
      callCount: { default: 0 },
      encryptedCount: { default: 0, secret: true },
    }
  },

  async setup(modules, pluginDir) {
    modules.logger.info(`Setting up plugin "${pkg.name}" at ${pluginDir}`)

    const outDir = path.join(pluginDir, outputDir)
    await fs.mkdir(outDir, { recursive: true })

    const filePath = path.join(outDir, 'args.json')

    this.state = {
      pluginDir,
      settings,
      outDir,
      filePath,
    }
  },

  async execute(modules, ...args) {
    modules.logger.info(`Executing plugin "${pkg.name}"`)
    const { filePath, settings } = this.state

    await fs.writeFile(filePath, JSON.stringify({ arguments: args }))
    modules.logger.info(`Writing arguments to file at ${filePath}`)

    const newCount = settings.get('callCount') + 1
    await settings.set('callCount', newCount)
    await settings.set('encryptedCount', '' + newCount)
    modules.logger.info(`${pkg.name} has been executed ${newCount} times`)
  },

  destroy(modules) {
    modules.logger.warn(`Destroying plugin "${pkg.name}"`)
  },
}
