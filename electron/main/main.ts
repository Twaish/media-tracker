import 'dotenv/config'
import { app, BrowserWindow } from 'electron'
import { drizzle } from 'drizzle-orm/libsql'

import StorageService from './core/StorageService'
import { ElectronWindow } from './core/ElectronWindow'
import { seedDefaultGenres } from './db/seeding'
import registerListeners from './helpers/ipc/listeners-register'
import registerProtocols from './helpers/ipc/protocols-register'

app.whenReady().then(async () => {
  console.log('INITIALIZING')
  const database = drizzle(process.env.DB_FILE_NAME!)
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

  await seedDefaultGenres(database)

  electronWindow.showWindow()
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
