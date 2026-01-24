import { app } from 'electron'
import path from 'path'

const userData = app.getPath('userData')
const databaseFileName = 'local.db'

export default {
  DB_PATH: `file:${path.join(userData, databaseFileName)}`,
}
