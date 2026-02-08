import 'dotenv/config'
import { app, BrowserWindow } from 'electron'
import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'

import config from './core/config'
import { StorageService } from './core/StorageService'
import { ElectronWindow } from './core/ElectronWindow'

import { seedDatabase } from './infrastructure/db/seeding'
import { runMigrations } from './infrastructure/db/migrate'

import registerListeners from './helpers/ipc/listeners-register'
import registerProtocols from './helpers/ipc/protocols-register'

import { consoleFormat, fileFormat } from './infrastructure/logging/formats'
import {
  createConsoleTransport,
  createFileTransport,
} from './infrastructure/logging/transports'
import { WinstonLogger } from './infrastructure/logging'
import { Modules } from './helpers/ipc/types'
import { OllamaAiService } from './infrastructure/ai/OllamaAiService'

app.whenReady().then(async () => {
  const { DB_PATH, LOG_PATH } = config

  const consoleTransport = createConsoleTransport(consoleFormat)
  const fileTransport = createFileTransport(LOG_PATH, fileFormat)
  const logger = new WinstonLogger([consoleTransport, fileTransport])

  logger.debug(`Config:\n${JSON.stringify(config, null, 2)}`)

  try {
    logger.header('Infrastructure')
    logger.info('Initializing database client')
    const dbClient = createClient({ url: DB_PATH })
    const database = drizzle(dbClient)

    logger.info('Initializing storage')
    const storageService = new StorageService('./Media Images')
    storageService.on('image-stored', (imagePath) => {
      logger.info(`Stored image ${imagePath}`)
    })

    logger.info('Initializing AI services')
    const aiService = new OllamaAiService()

    logger.info('Creating window')
    const electronWindow = new ElectronWindow()
    electronWindow.on('attempted-navigation', (_, url) => {
      logger.warn(`Navigation attempted to: ${url}`)
    })

    const modules: Modules = {
      ElectronWindow: electronWindow,
      window: electronWindow.window,
      Database: database,
      StorageService: storageService,
      AiService: aiService,
      logger: logger,
    }

    logger.header('IPC / Protocols')
    logger.info('Registering IPC listeners')
    registerListeners(modules)

    logger.info('Registering custom protocols')
    registerProtocols(modules)

    logger.header('Database')
    logger.info('Running migrations')
    await runMigrations(database)

    logger.info('Seeding')
    await seedDatabase(database)

    logger.header('Startup')
    logger.info('Showing main window')
    electronWindow.showWindow()

    logger.header('App ready')
  } catch (err) {
    logger.header('Fatal Error')
    logger.error(`App failed: ${err instanceof Error ? err : String(err)}`)
    app.quit()
  }
})

//osX only
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    const newWindow = new ElectronWindow()
    newWindow.showWindow()
  }
})
//osX only ends
