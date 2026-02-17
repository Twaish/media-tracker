import { BrowserWindow } from 'electron'

import { ElectronWindow } from '@/core/ElectronWindow'
import { StorageService } from '@/core/StorageService'

import { IAiService } from '@/application/ai/IAiService'
import { ILogger } from '@/application/logging/ILogger'
import { IGenresRepository } from '@/application/db/repositories/IGenresRepository'
import { IMediaRepository } from '@/application/db/repositories/IMediaRepository'

declare interface Modules {
  ElectronWindow: ElectronWindow
  StorageService: StorageService
  window: BrowserWindow
  logger: ILogger
  AiService: IAiService

  MediaRepository: IMediaRepository
  GenresRepository: IGenresRepository
}
