import { BrowserWindow, IpcMainInvokeEvent } from 'electron'

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
import { IRuleRepository } from '@/application/db/repositories/IRuleRepository'
import { ITemplateRepository } from '@/application/db/repositories/ITemplateRepository'
import { EventBus } from '@/core/EventBus'
import { EventRegistry } from '@/core/EventRegistry'

declare interface Modules {
  ElectronWindow: ElectronWindow
  StorageService: StorageService
  TaskService: TaskService
  RuleEngine: RuleEngine
  RuleEngineCompiler: RuleEngineCompiler
  RuleEnginePrinter: RuleEnginePrinter
  EventBus: EventBus
  EventRegistry: EventRegistry
  window: BrowserWindow
  logger: ILogger

  AiSettingsProvider: IAiSettingsProvider
  AiService: IAiService

  MediaSimilarityService: MediaSimilarityService

  MediaRepository: IMediaRepository
  GenresRepository: IGenresRepository
  WatchPlanRepository: IWatchPlanRepository
  MediaEmbeddingRepository: IMediaEmbeddingRepository
  RuleRepository: IRuleRepository
  TemplateRepository: ITemplateRepository
}

/**
 * Transforms function to Electron IPC handler signature
 */
type IpcHandler<F> = F extends (...args: infer P) => infer R
  ? (_: IpcMainInvokeEvent, ...args: P) => R | Awaited<R>
  : never

/**
 * Converts a function map into a map of `[channel, IPC handler]` tuples
 *
 * ```
 * type ItemActions = {
 *   addItem: (item: Item) => Promise<Item>
 * }
 *
 * // Defining the handlers
 * type ItemHandlers = IpcHandlers<ItemActions>
 *
 * // would result in
 * type ItemHandlers = {
 *   addItem: [string, (_: IpcMainInvokeEvent, item: Item) => Promise<Item>]
 * }
 * ```
 */
export type IpcHandlers<T> = {
  [K in keyof T]: [channel: string, handler: IpcHandler<T[K]>]
}
