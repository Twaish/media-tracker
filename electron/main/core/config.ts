import { is } from '@electron-toolkit/utils'
import { app } from 'electron'
import path from 'path'

const userData = app.getPath('userData')
const databaseFileName = 'local.db'
const logFileName = 'app.log'

const devUrl = process.env['ELECTRON_RENDERER_URL']

export default {
  DB_PATH: `file:${path.join(userData, databaseFileName)}`,
  LOG_PATH: path.join(userData, logFileName),
  APP_URL:
    is.dev && devUrl ? devUrl : path.join(__dirname, `../renderer/index.html`),

  // Relative to %userData%
  SETTINGS_DIR: './Settings',
  MEDIA_DIR: './Media Images',
}
