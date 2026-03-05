import 'dotenv/config'
import { app, BrowserWindow } from 'electron'

import config from './core/config'
import { StorageService } from './core/StorageService'
import { ElectronWindow } from './core/ElectronWindow'

import { seedDatabase } from './infrastructure/db/seeding'
import { runMigrations } from './infrastructure/db/migrate'

import registerListeners from './helpers/ipc/listeners-register'
import registerProtocols from './helpers/ipc/protocols-register'

import { consoleFormat, fileFormat } from './infrastructure/logging/formats'
import {
  createConsoleTransport,
  createFileTransport,
} from './infrastructure/logging/transports'
import { WinstonLogger } from './infrastructure/logging'
import { Modules } from './helpers/ipc/types'
import { OllamaService } from './infrastructure/ai/OllamaService'
import { createDb } from './infrastructure/db/client'
import { MediaRepositoryDrizzle } from './infrastructure/db/repositories/mediaRepositoryDrizzle'
import { GenresRepositoryDrizzle } from './infrastructure/db/repositories/genresRepositoryDrizzle'
import { JsonStore } from './core/JsonStore'
import { OllamaSettingsProvider } from './infrastructure/ai/OllamaSettingsProvider'
import { TaskService } from './core/TaskService'
import { WatchPlanRepositoryDrizzle } from './infrastructure/db/repositories/watchPlanRepositoryDrizzle'
import { MediaEmbeddingRepositoryDrizzle } from './infrastructure/db/repositories/mediaEmbeddingRepositoryDrizzle'
import { MediaSimilarityService } from './domain/services/MediaSimilarityService'
import { RuleEngine } from './domain/automation/RuleEngine'
import { RuleEnginePrinter } from './domain/automation/RuleEnginePrinter'
import { RuleEngineCompiler } from './domain/automation/RuleEngineCompiler'
import { ActionExecutor } from './domain/automation/ActionExecutor'
import { ExpressionEvaluator } from './domain/automation/ExpressionEvaluator'
import { RuleRepositoryDrizzle } from './infrastructure/db/repositories/ruleRepositoryDrizzle'
import { TemplateRepositoryDrizzle } from './infrastructure/db/repositories/templateRepositoryDrizzle'
import SyncRuleEngine from './usecases/automation/syncRuleEngine'
import { InMemoryEventBus } from './core/EventBus'

app.whenReady().then(async () => {
  const { DB_PATH, LOG_PATH, APP_URL } = config

  const consoleTransport = createConsoleTransport(consoleFormat)
  const fileTransport = createFileTransport(LOG_PATH, fileFormat)
  const logger = new WinstonLogger([consoleTransport, fileTransport])

  logger.debug(`Config:\n${JSON.stringify(config, null, 2)}`)

  const ruleEngineCompiler = new RuleEngineCompiler()
  const ruleEnginePrinter = new RuleEnginePrinter()
  const expressionEvaluator = new ExpressionEvaluator()
  const actionExecutor = new ActionExecutor(expressionEvaluator)

  const ruleEngine = new RuleEngine(expressionEvaluator, actionExecutor)
  const eventBus = new InMemoryEventBus()

  try {
    logger.header('Infrastructure')
    logger.info('Initializing database client & repositories')
    const database = createDb(DB_PATH)
    const mediaRepository = new MediaRepositoryDrizzle(database)
    const genresRepository = new GenresRepositoryDrizzle(database)
    const watchPlanRepository = new WatchPlanRepositoryDrizzle(database)
    const mediaEmbeddingRepository = new MediaEmbeddingRepositoryDrizzle(
      database,
    )
    const ruleRepository = new RuleRepositoryDrizzle(database)
    const templateRepository = new TemplateRepositoryDrizzle(database)

    logger.info('Initializing task service')
    const taskService = new TaskService()

    logger.info('Initializing storage')
    const settingsStore = new JsonStore('./Settings')
    const storageService = new StorageService('./Media Images')
    storageService.on('image-stored', (imagePath) => {
      logger.info(`Stored image ${imagePath}`)
    })

    logger.info('Initializing AI services')
    const ollamaSettings = new OllamaSettingsProvider(settingsStore)
    await ollamaSettings.init()

    const ollamaService = new OllamaService(ollamaSettings)

    const mediaSimilarityService = new MediaSimilarityService(
      ollamaService,
      mediaEmbeddingRepository,
    )

    logger.info('Creating window')
    const mainWindow = new ElectronWindow()
    mainWindow.on('attempted-navigation', (_, url) => {
      logger.warn(`Navigation attempted to: ${url}`)
    })

    const modules: Modules = {
      ElectronWindow: mainWindow,
      StorageService: storageService,
      TaskService: taskService,
      RuleEngine: ruleEngine,
      RuleEngineCompiler: ruleEngineCompiler,
      RuleEnginePrinter: ruleEnginePrinter,
      EventBus: eventBus,
      window: mainWindow.window,
      logger: logger,

      AiSettingsProvider: ollamaSettings,
      AiService: ollamaService,

      MediaSimilarityService: mediaSimilarityService,

      MediaRepository: mediaRepository,
      GenresRepository: genresRepository,
      WatchPlanRepository: watchPlanRepository,
      MediaEmbeddingRepository: mediaEmbeddingRepository,
      RuleRepository: ruleRepository,
      TemplateRepository: templateRepository,
    }

    const syncRuleEngine = new SyncRuleEngine(
      ruleRepository,
      templateRepository,
      ruleEngine,
    )

    logger.header('IPC / Protocols')
    logger.info('Registering IPC listeners')
    registerListeners(modules)

    logger.info('Registering custom protocols')
    registerProtocols(modules)

    mainWindow.loadUrl(APP_URL)

    logger.header('Database')
    logger.info('Running migrations')
    await runMigrations(database)

    logger.info('Seeding')
    await seedDatabase(database)

    await syncRuleEngine.execute()

    logger.header('Startup')
    logger.info('Showing main window')
    mainWindow.showWindow()

    logger.header('App ready')
  } catch (err) {
    logger.header('Fatal Error')
    logger.error(`App failed: ${err instanceof Error ? err : String(err)}`)
    app.quit()
  }
})

//osX only
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    const newWindow = new ElectronWindow()
    newWindow.showWindow()
  }
})
//osX only ends
