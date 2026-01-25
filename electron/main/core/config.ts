import { app } from 'electron'
import path from 'path'

const userData = app.getPath('userData')
const databaseFileName = 'local.db'
const logFileName = 'app.log'

export default {
  DB_PATH: `file:${path.join(userData, databaseFileName)}`,
  LOG_PATH: path.join(userData, logFileName),
}
