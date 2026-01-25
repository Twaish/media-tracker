import 'dotenv/config'
import { app, BrowserWindow } from 'electron'
import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'

import config from './core/config'
import StorageService from './core/StorageService'
import { ElectronWindow } from './core/ElectronWindow'

import { seedDatabase } from './db/seeding'
import { runMigrations } from './db/migrate'

import registerListeners from './helpers/ipc/listeners-register'
import registerProtocols from './helpers/ipc/protocols-register'

import { consoleFormat, fileFormat } from './core/logger/formats'
import {
  createConsoleTransport,
  createFileTransport,
} from './core/logger/transports'
import { WinstonLogger } from './core/logger'
import { Modules } from './helpers/ipc/types'

app.whenReady().then(async () => {
  const { DB_PATH, LOG_PATH } = config

  const consoleTransport = createConsoleTransport(consoleFormat)
  const fileTransport = createFileTransport(LOG_PATH, fileFormat)
  const logger = new WinstonLogger([consoleTransport, fileTransport])

  logger.header('Initializing')
  logger.info('Application starting')
  logger.debug(`Log file path: ${LOG_PATH}`)
  logger.debug(`Database path: ${DB_PATH}`)

  try {
    logger.header('Infrastructure')
    logger.info('Initializing database client')
    const dbClient = createClient({ url: DB_PATH })
    const database = drizzle(dbClient)

    logger.info('Creating electron window')
    const electronWindow = new ElectronWindow()

    logger.info('Initializing storage service')
    const storageService = new StorageService('./Media Images')

    const modules: Modules = {
      ElectronWindow: electronWindow,
      window: electronWindow.window,
      Database: database,
      StorageService: storageService,
      logger: logger,
    }

    logger.header('IPC / Protocols')
    logger.info('Registering IPC listeners')
    registerListeners(modules)

    logger.info('Registering custom protocols')
    registerProtocols(modules)

    logger.header('Database')
    logger.info('Running database migrations')
    await runMigrations(database)

    logger.info('Seeding database')
    await seedDatabase(database)

    logger.header('Startup')
    logger.info('Showing main window')
    electronWindow.showWindow()

    logger.info('App ready')
  } catch (err) {
    logger.header('Fatal Error')
    logger.error(
      `Application failed during initialization: ${err instanceof Error ? err : String(err)}`,
    )
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
