import 'dotenv/config'
import { app, BrowserWindow } from 'electron'

import config from './core/config'
import { AppInfo } from './core/types'
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
import { OllamaService } from './features/ai/infrastructure/adapters/OllamaService'
import { createDb } from './infrastructure/db/client'
import { MediaRepositoryDrizzle } from './features/media/infrastructure/repositories/mediaRepositoryDrizzle'
import { GenresRepositoryDrizzle } from './features/genres/infrastructure/repositories/genresRepositoryDrizzle'
import { JsonStore } from './core/JsonStore'
import { OllamaSettingsProvider } from './features/ai/infrastructure/adapters/OllamaSettingsProvider'
import { TaskService } from './features/tasks/application/services/TaskService'
import { WatchPlanRepositoryDrizzle } from './features/watchplan/infrastructure/repositories/watchPlanRepositoryDrizzle'
import { MediaEmbeddingRepositoryDrizzle } from './features/media/infrastructure/repositories/mediaEmbeddingRepositoryDrizzle'
import { MediaSimilarityService } from './features/media/application/services/MediaSimilarityService'
import { RuleEngine } from './features/automation/application/services/RuleEngine'
import { RuleEnginePrinter } from './features/automation/application/services/RuleEnginePrinter'
import { RuleEngineCompiler } from './features/automation/application/services/RuleEngineCompiler'
import { RuleRepositoryDrizzle } from './features/automation/infrastructure/repositories/ruleRepositoryDrizzle'
import { TemplateRepositoryDrizzle } from './features/automation/infrastructure/repositories/templateRepositoryDrizzle'
import { InMemoryEventBus } from './features/events/infrastructure/adapters/InMemoryEventBus'
import { InMemoryEventRegistry } from './features/events/infrastructure/adapters/InMemoryEventRegistry'
import { registerDomainEvents } from './helpers/ipc/register-domain-events'
import { ExportManager } from './features/exporting/application/services/ExportManager'
import { registerAutomationSchemas } from './helpers/register-automation-schemas'
import { createExpressionServices } from './helpers/create-expression-services'
import { createActionServices } from './helpers/create-action-services'
import { ImportManager } from './features/exporting/application/services/ImportManager'
import { ExternalLinkResolver } from './domain/services/ExternalLinkResolver'
import { QueryResolver } from './features/media/application/services/QueryResolver'
import { ActionExecutor } from './features/automation/application/services/ActionExecutor'
import { ExpressionEvaluator } from './features/automation/application/services/ExpressionEvaluator'
import { registerExportSchemas } from './helpers/register-export-schemas'
import { registerImportSchemas } from './helpers/register-import-schemas'

app.whenReady().then(async () => {
  const userData = app.getPath('userData')
  const {
    DB_PATH,
    MIGRATIONS_PATH,
    LOG_PATH,
    APP_URL,
    SETTINGS_DIR,
    MEDIA_DIR,
  } = config

  const appInfo: AppInfo = {
    version: app.getVersion(),
  }

  const consoleTransport = createConsoleTransport(consoleFormat)
  const fileTransport = createFileTransport(LOG_PATH, fileFormat)
  const logger = new WinstonLogger([consoleTransport, fileTransport])

  logger.debug(`Config:\n${JSON.stringify(config, null, 2)}`)

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
    const settingsStore = new JsonStore({
      basePath: SETTINGS_DIR,
      root: userData,
    })
    const storageService = new StorageService(MEDIA_DIR, userData)
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

    logger.info('Initializing export and import services')
    const exportManager = new ExportManager()
    const importManager = new ImportManager()

    logger.info('Initializing rule engine')
    const ruleEngineCompiler = new RuleEngineCompiler()
    const ruleEnginePrinter = new RuleEnginePrinter()
    const expressionEvaluator = new ExpressionEvaluator()
    const actionExecutor = new ActionExecutor(expressionEvaluator)
    const ruleEngine = new RuleEngine(expressionEvaluator, actionExecutor)

    expressionEvaluator.setServices(createExpressionServices())
    actionExecutor.setServices(createActionServices(ruleEngine))

    const eventBus = new InMemoryEventBus()
    const eventRegistry = new InMemoryEventRegistry()

    logger.info('Initializing external link and query resolvers')
    const externalLinkResolver = new ExternalLinkResolver()
    const queryResolver = new QueryResolver()

    logger.info('Creating window')
    const mainWindow = new ElectronWindow()
    mainWindow.on('attempted-navigation', (_, url) => {
      logger.warn(`Navigation attempted to: ${url}`)
    })

    const modules: Modules = {
      ElectronWindow: mainWindow,
      StorageService: storageService,
      ExternalLinkResolver: externalLinkResolver,
      QueryResolver: queryResolver,
      TaskService: taskService,
      ExportManager: exportManager,
      ImportManager: importManager,
      RuleEngine: ruleEngine,
      RuleEngineCompiler: ruleEngineCompiler,
      RuleEnginePrinter: ruleEnginePrinter,
      EventBus: eventBus,
      EventRegistry: eventRegistry,
      window: mainWindow.window,
      logger: logger,
      appInfo: appInfo,

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

    logger.header('Database')
    logger.info('Running migrations')
    await runMigrations(database, MIGRATIONS_PATH)

    logger.info('Seeding')
    await seedDatabase(database)

    logger.header('IPC / Protocols / Events')
    logger.info('Registering IPC listeners')
    registerListeners(modules)

    logger.info('Registering custom protocols')
    registerProtocols(modules)

    logger.info('Registering domain events')
    registerDomainEvents(modules)

    logger.info('Registering exporting & importing schemas')
    registerExportSchemas(modules)
    registerImportSchemas(modules)

    logger.info('Registering rules & templates')
    await registerAutomationSchemas(modules)

    mainWindow.loadUrl(APP_URL)

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
