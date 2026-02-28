import { BrowserWindow } from 'electron'

import { ElectronWindow } from '@/core/ElectronWindow'
import { StorageService } from '@/core/StorageService'

import { IAiService } from '@/application/ai/IAiService'
import { ILogger } from '@/application/logging/ILogger'
import { IGenresRepository } from '@/application/db/repositories/IGenresRepository'
import { IMediaRepository } from '@/application/db/repositories/IMediaRepository'
import { IAiSettingsProvider } from '@/application/ai/IAiSettingsProvider'
import { TaskService } from '@/core/TaskService'
import { IWatchPlanRepository } from '@/application/db/repositories/IWatchPlanRepository'
import { IMediaEmbeddingRepository } from '@/application/db/repositories/IMediaEmbeddingRepository'
import { MediaSimilarityService } from '@/domain/services/MediaSimilarityService'
import { RuleEngine } from '@/domain/automation/RuleEngine'
import { RuleEngineCompiler } from '@/domain/automation/RuleEngineCompiler'
import { RuleEnginePrinter } from '@/domain/automation/RuleEnginePrinter'

declare interface Modules {
  ElectronWindow: ElectronWindow
  StorageService: StorageService
  TaskService: TaskService
  RuleEngine: RuleEngine
  RuleEngineCompiler: RuleEngineCompiler
  RuleEnginePrinter: RuleEnginePrinter
  window: BrowserWindow
  logger: ILogger

  AiSettingsProvider: IAiSettingsProvider
  AiService: IAiService

  MediaSimilarityService: MediaSimilarityService

  MediaRepository: IMediaRepository
  GenresRepository: IGenresRepository
  WatchPlanRepository: IWatchPlanRepository
  MediaEmbeddingRepository: IMediaEmbeddingRepository
}
