const pkg = require('./manifest.json')
const path = require('path')
const fs = require('fs/promises')

const OUTPUT_DIR = 'out'

module.exports = {
  state: {},

  settings: {
    callCount: { default: 0 },
    encryptedCount: { default: 0, secret: true },
  },

  async setup(ctx) {
    const { pluginDir, events, logger } = ctx
    const eventName = `plugin:${pkg.name}`

    logger.info(`Setting up plugin "${pkg.name}" at ${pluginDir}`)

    const outDir = path.join(pluginDir, OUTPUT_DIR)
    await fs.mkdir(outDir, { recursive: true })

    const filePath = path.join(outDir, 'args.json')

    const unsubscribe = events.subscribe(eventName, (value) => {
      logger.debug(`[${eventName}] ${JSON.stringify(value, null, 2)}`)
    })

    this.state = {
      filePath,
      eventName,
      cleanup: [unsubscribe],
    }
  },

  async execute(ctx, ...args) {
    const { settings, events, logger } = ctx
    const { filePath, eventName } = this.state

    logger.info(`Executing plugin "${pkg.name}"`)

    const data = {
      arguments: args,
      timestamp: new Date().toISOString(),
    }

    await fs.writeFile(path.join(filePath), JSON.stringify(data, null, 2))
    logger.info(`Wrote arguments to ${filePath}`)

    const newCount = settings.get('callCount') + 1
    settings.set('callCount', newCount)
    settings.set('encryptedCount', String(newCount))

    events.emit(eventName, `${pkg.name} has been executed ${newCount} times`)
  },

  destroy(ctx) {
    ctx.logger.warn(`Destroying plugin "${pkg.name}"`)
    this.state.cleanup.forEach((c) => c())
  },
}
