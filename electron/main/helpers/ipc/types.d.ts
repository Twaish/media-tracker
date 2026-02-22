import { BrowserWindow } from 'electron'

import { ElectronWindow } from '@/core/ElectronWindow'
import { StorageService } from '@/core/StorageService'

import { IAiService } from '@/application/ai/IAiService'
import { ILogger } from '@/application/logging/ILogger'
import { IGenresRepository } from '@/application/db/repositories/IGenresRepository'
import { IMediaRepository } from '@/application/db/repositories/IMediaRepository'
import { IAiSettingsProvider } from '@/application/ai/IAiSettingsProvider'
import { TaskService } from '@/core/TaskService'

declare interface Modules {
  ElectronWindow: ElectronWindow
  StorageService: StorageService
  TaskService: TaskService
  window: BrowserWindow
  logger: ILogger
  AiSettingsProvider: IAiSettingsProvider
  AiService: IAiService

  MediaRepository: IMediaRepository
  GenresRepository: IGenresRepository
}
