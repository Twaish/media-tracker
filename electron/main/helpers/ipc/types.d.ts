import { BrowserWindow } from 'electron'

import { ElectronWindow } from '@/core/ElectronWindow'
import { ISettingsBuilder } from '@/application/ports/settings/ISettingsBuilder'

import { IAiService } from '@/features/ai/application/ports/IAiService'
import { ILogger } from '@/application/logging/ILogger'
import { IMediaRepository } from '@/features/media/domain/repositories/IMediaRepository'
import { IAiSettingsProvider } from '@/features/ai/application/ports/IAiSettingsProvider'
import { ITaskService } from '@/features/tasks/application/interfaces/ITaskService'
import { IMediaEmbeddingRepository } from '@/features/media/domain/repositories/IMediaEmbeddingRepository'
import { IRuleRepository } from '@/features/automation/domain/repositories/IRuleRepository'
import { ITemplateRepository } from '@/features/automation/domain/repositories/ITemplateRepository'
import { IEventBus } from '@/features/events/application/ports/IEventBus'
import { IEventRegistry } from '@/features/events/application/ports/IEventRegistry'
import { AppInfo } from '@/core/types'
import { IExportManager } from '@/features/exporting/application/interfaces/IExportManager'
import { IImportManager } from '@/features/exporting/application/interfaces/IImportManager'
import { ExternalLinkResolver } from '@/domain/services/ExternalLinkResolver'
import { IQueryResolver } from '@/features/media/application/interfaces/IQueryResolver'
import { IRuleEngine } from '@/features/automation/application/interfaces/IRuleEngine'
import { IRuleEngineCompiler } from '@/features/automation/application/interfaces/IRuleEngineCompiler'
import { IRuleEnginePrinter } from '@/features/automation/application/interfaces/IRuleEnginePrinter'
import { IGenresRepository } from '@/features/genres/domain/repositories/IGenresRepository'
import { IMediaSimilarityService } from '@/features/media/application/interfaces/IMediaSimilarityService'
import { IWatchPlanRepository } from '@/features/watchplan/domain/repositories/IWatchPlanRepository'
import { IStorageService } from '@/features/storage/application/interfaces/IStorageService'

declare interface Modules {
  ElectronWindow: ElectronWindow
  SettingsBuilder: ISettingsBuilder

  ExternalLinkResolver: ExternalLinkResolver
  QueryResolver: IQueryResolver

  TaskService: ITaskService
  ExportManager: IExportManager
  ImportManager: IImportManager
  RuleEngine: IRuleEngine
  RuleEngineCompiler: IRuleEngineCompiler
  RuleEnginePrinter: IRuleEnginePrinter
  EventBus: IEventBus
  EventRegistry: IEventRegistry
  window: BrowserWindow
  logger: ILogger
  appInfo: AppInfo

  StorageService: IStorageService

  AiSettingsProvider: IAiSettingsProvider
  AiService: IAiService

  MediaSimilarityService: IMediaSimilarityService

  MediaRepository: IMediaRepository
  GenresRepository: IGenresRepository
  WatchPlanRepository: IWatchPlanRepository
  MediaEmbeddingRepository: IMediaEmbeddingRepository
  RuleRepository: IRuleRepository
  TemplateRepository: ITemplateRepository
}
