import pkg from './manifest.json' with { type: 'json' }
import fs from 'fs/promises'
import path from 'path'

const outputDir = 'out'
const state = {}

export default {
  state,

  setup(modules, pluginDir) {
    modules.logger.info(`Setting up plugin "${pkg.name}" at ${pluginDir}`)
    this.state.pluginDir = pluginDir
  },

  async execute(modules, ...args) {
    const { pluginDir } = this.state

    const outDir = path.join(pluginDir, outputDir)
    await fs.mkdir(outDir, { recursive: true })

    const filePath = path.join(outDir, 'args.json')
    const fileContent = JSON.stringify({ arguments: args })

    await fs.writeFile(filePath, fileContent)

    modules.logger.info(`Executing plugin "${pkg.name}"`)

    modules.logger.info(`Writing arguments to file at ${filePath}`)
  },

  destroy(modules) {
    modules.logger.warn(`Destroying plugin "${pkg.name}"`)
  },
}
