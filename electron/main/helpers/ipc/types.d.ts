import { IAiService } from '@/application/ai/aiService'
import { ILogger } from '@/application/logging/ILogger'
import { ElectronWindow } from '@/core/ElectronWindow'
import { StorageService } from '@/core/StorageService'
import { LibSQLDatabase } from 'drizzle-orm/libsql'
import { BrowserWindow } from 'electron'

declare interface Modules {
  ElectronWindow: ElectronWindow
  StorageService: StorageService
  Database: LibSQLDatabase
  window: BrowserWindow
  logger: ILogger
  AiService: IAiService
}
