import { BrowserWindow } from 'electron'

import { AppInfo } from '@/core/types'
import { ElectronWindow } from '@/core/ElectronWindow'

import { ExternalLinkResolver } from '@/domain/services/ExternalLinkResolver'

import { ILogger } from '@/application/logging/ILogger'
import { ISettingsBuilder } from '@/application/ports/settings/ISettingsBuilder'

import { IAiService } from '@/features/ai/application/ports/IAiService'
import { IAiSettingsProvider } from '@/features/ai/application/ports/IAiSettingsProvider'

import { IRuleEngine } from '@/features/automation/application/interfaces/IRuleEngine'
import { IRuleEnginePrinter } from '@/features/automation/application/interfaces/IRuleEnginePrinter'
import { IRuleEngineCompiler } from '@/features/automation/application/interfaces/IRuleEngineCompiler'
import { IRuleRepository } from '@/features/automation/domain/repositories/IRuleRepository'
import { ITemplateRepository } from '@/features/automation/domain/repositories/ITemplateRepository'

import { IEventBus } from '@/features/events/application/ports/IEventBus'
import { IEventRegistry } from '@/features/events/application/ports/IEventRegistry'

import { IExportManager } from '@/features/exporting/application/interfaces/IExportManager'
import { IImportManager } from '@/features/exporting/application/interfaces/IImportManager'

import { IGenresRepository } from '@/features/genres/domain/repositories/IGenresRepository'

import { IQueryResolver } from '@/features/media/application/interfaces/IQueryResolver'
import { IMediaRepository } from '@/features/media/domain/repositories/IMediaRepository'
import { IMediaSimilarityService } from '@/features/media/application/interfaces/IMediaSimilarityService'
import { IMediaEmbeddingRepository } from '@/features/media/domain/repositories/IMediaEmbeddingRepository'

import { IStorageService } from '@/features/storage/application/interfaces/IStorageService'

import { ITaskService } from '@/features/tasks/application/interfaces/ITaskService'

import { IWatchPlanRepository } from '@/features/watchplan/domain/repositories/IWatchPlanRepository'

declare interface Modules {
  ElectronWindow: ElectronWindow
  window: BrowserWindow
  logger: ILogger
  appInfo: AppInfo
  ExternalLinkResolver: ExternalLinkResolver
  SettingsBuilder: ISettingsBuilder

  AiService: IAiService
  AiSettingsProvider: IAiSettingsProvider

  RuleEngine: IRuleEngine
  RuleEngineCompiler: IRuleEngineCompiler
  RuleEnginePrinter: IRuleEnginePrinter
  RuleRepository: IRuleRepository
  TemplateRepository: ITemplateRepository

  EventBus: IEventBus
  EventRegistry: IEventRegistry

  ExportManager: IExportManager
  ImportManager: IImportManager

  GenresRepository: IGenresRepository

  QueryResolver: IQueryResolver
  MediaSimilarityService: IMediaSimilarityService
  MediaRepository: IMediaRepository
  MediaEmbeddingRepository: IMediaEmbeddingRepository

  StorageService: IStorageService

  TaskService: ITaskService

  WatchPlanRepository: IWatchPlanRepository
}
