import { BrowserWindow } from 'electron'

import { AppInfo } from '@/core/types'
import { ElectronWindow } from '@/core/ElectronWindow'

import { ILogger } from '@/application/logging/ILogger'
import { ISettingsBuilder } from '@/app/settings/application/ports/ISettingsBuilder'

import { IEventBus } from '@/app/events/application/ports/IEventBus'
import { IEventRegistry } from '@/app/events/application/ports/IEventRegistry'

import { IStorageService } from '@/app/storage/application/interfaces/IStorageService'

import { ITaskService } from '@/app/tasks/application/interfaces/ITaskService'

import { IAiService } from '@/features/ai/application/ports/IAiService'
import { IAiSettingsProvider } from '@/features/ai/application/ports/IAiSettingsProvider'

import { IRuleEngine } from '@/features/automation/application/interfaces/IRuleEngine'
import { IRuleEnginePrinter } from '@/features/automation/application/interfaces/IRuleEnginePrinter'
import { IRuleEngineCompiler } from '@/features/automation/application/interfaces/IRuleEngineCompiler'
import { IRuleRepository } from '@/features/automation/domain/repositories/IRuleRepository'
import { ITemplateRepository } from '@/features/automation/domain/repositories/ITemplateRepository'

import { IExportManager } from '@/features/exporting/application/interfaces/IExportManager'
import { IImportManager } from '@/features/exporting/application/interfaces/IImportManager'

import { IGenresRepository } from '@/features/genres/domain/repositories/IGenresRepository'

import { IQueryResolver } from '@/features/media/application/interfaces/IQueryResolver'
import { IExternalLinkResolver } from '@/features/media/application/interfaces/IExternalLinkResolver'
import { IMediaRepository } from '@/features/media/domain/repositories/IMediaRepository'
import { IMediaSimilarityService } from '@/features/media/application/interfaces/IMediaSimilarityService'
import { IMediaEmbeddingRepository } from '@/features/media/domain/repositories/IMediaEmbeddingRepository'

import { IWatchPlanRepository } from '@/features/watchplan/domain/repositories/IWatchPlanRepository'

declare interface Modules {
  ElectronWindow: ElectronWindow
  window: BrowserWindow
  logger: ILogger
  appInfo: AppInfo
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
  ExternalLinkResolver: IExternalLinkResolver
  MediaSimilarityService: IMediaSimilarityService
  MediaRepository: IMediaRepository
  MediaEmbeddingRepository: IMediaEmbeddingRepository

  StorageService: IStorageService

  TaskService: ITaskService

  WatchPlanRepository: IWatchPlanRepository
}
