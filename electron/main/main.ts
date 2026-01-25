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

app.whenReady().then(async () => {
  const { DB_PATH, LOG_PATH } = config

  const consoleTransport = createConsoleTransport(consoleFormat)
  const fileTransport = createFileTransport(LOG_PATH, fileFormat)
  const logger = new WinstonLogger([consoleTransport, fileTransport])
  logger.header('Initializing')
  try {
    const dbClient = createClient({ url: DB_PATH })
    const database = drizzle(dbClient)
    const electronWindow = new ElectronWindow()
    const storageService = new StorageService('./Media Images')

    const modules = {
      ElectronWindow: electronWindow,
      window: electronWindow.window,
      Database: database,
      StorageService: storageService,
    }

    registerListeners(modules)
    registerProtocols(modules)

    await runMigrations(database)
    await seedDatabase(database)

    electronWindow.showWindow()
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
