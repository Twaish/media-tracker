import 'dotenv/config'
import { app, BrowserWindow } from 'electron'

import config from './core/config'
import { AppInfo } from './core/types'
import { JsonStore } from './core/JsonStore'
import { ElectronWindow } from './core/ElectronWindow'

import { seedDatabase } from './infrastructure/db/seeding'
import { runMigrations } from './infrastructure/db/migrate'
import { createDb } from './infrastructure/db/client'

import { Modules } from './helpers/ipc/types'
import { createOrpcRouter } from './helpers/ipc/create-orpc-router'
import { registerProtocols } from './helpers/ipc/protocols-register'
import { registerOrpcHandler } from './helpers/ipc/register-orpc-handler'
import { registerDomainEvents } from './helpers/register-domain-events'
import { createCryptoServices } from './helpers/create-crypto-services'
import { createActionServices } from './helpers/create-action-services'
import { createExpressionServices } from './helpers/create-expression-services'
import { registerExportSchemas } from './helpers/register-export-schemas'
import { registerImportSchemas } from './helpers/register-import-schemas'
import { registerAutomationSchemas } from './helpers/register-automation-schemas'
import { registerPluginPermissions } from './helpers/register-plugin-permissions'

import { consoleFormat, fileFormat } from './app/logging/infrastructure/formats'
import {
  createConsoleTransport,
  createFileTransport,
} from './app/logging/infrastructure/transports'
import { WinstonLogger } from './app/logging/infrastructure/adapters/WinstonLogger'

import { PluginManager } from './app/plugins/infrastructure/adapters/PluginManager'
import { PluginRegistry } from './app/plugins/infrastructure/adapters/PluginRegistry'
import { PermissionRegistry } from './app/plugins/infrastructure/adapters/PermissionRegistry'

import { SettingsBuilder } from './app/settings/infrastructure/adapters/SettingsBuilder'
import { SettingsRegistry } from './app/settings/infrastructure/adapters/SettingsRegistry'

import { InMemoryEventBus } from './app/events/infrastructure/adapters/InMemoryEventBus'
import { InMemoryEventRegistry } from './app/events/infrastructure/adapters/InMemoryEventRegistry'

import { StorageService } from './app/storage/application/services/StorageService'

import { TaskService } from './app/tasks/application/services/TaskService'

import { ExportManager } from './app/exporting/application/services/ExportManager'
import { ImportManager } from './app/exporting/application/services/ImportManager'

import { OllamaService } from './features/ai/infrastructure/adapters/OllamaService'
import { OllamaSettingsProvider } from './features/ai/infrastructure/adapters/OllamaSettingsProvider'

import { RuleEngine } from './features/automation/application/services/RuleEngine'
import { ActionExecutor } from './features/automation/application/services/ActionExecutor'
import { RuleEnginePrinter } from './features/automation/application/services/RuleEnginePrinter'
import { RuleEngineCompiler } from './features/automation/application/services/RuleEngineCompiler'
import { ExpressionEvaluator } from './features/automation/application/services/ExpressionEvaluator'
import { RuleRepositoryDrizzle } from './features/automation/infrastructure/repositories/ruleRepositoryDrizzle'
import { TemplateRepositoryDrizzle } from './features/automation/infrastructure/repositories/templateRepositoryDrizzle'

import { GenresRepositoryDrizzle } from './features/genres/infrastructure/repositories/genresRepositoryDrizzle'

import { QueryResolver } from './features/media/application/services/QueryResolver'
import { ExternalLinkResolver } from './features/media/application/services/ExternalLinkResolver'
import { MediaSimilarityService } from './features/media/application/services/MediaSimilarityService'
import { MediaRepositoryDrizzle } from './features/media/infrastructure/repositories/mediaRepositoryDrizzle'
import { MediaProgressRepositoryDrizzle } from './features/media/infrastructure/repositories/mediaProgressRepositoryDrizzle'
import { MediaEmbeddingRepositoryDrizzle } from './features/media/infrastructure/repositories/mediaEmbeddingRepositoryDrizzle'
import { subscribeMediaProjections } from './features/media/events/subscribe-media-projections'

import { WatchPlanRepositoryDrizzle } from './features/watchplan/infrastructure/repositories/watchPlanRepositoryDrizzle'
import { DeltaRepositoryDrizzle } from './app/versioning/infrastructure/repositories/deltaRepositoryDrizzle'
import { registerVersioningEvents } from './helpers/register-versioning-events'

app.whenReady().then(async () => {
  const userData = app.getPath('userData')
  const {
    PLUGINS_DIR,
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
    const mediaProgressRepository = new MediaProgressRepositoryDrizzle(database)
    const ruleRepository = new RuleRepositoryDrizzle(database)
    const templateRepository = new TemplateRepositoryDrizzle(database)
    const deltaRepository = new DeltaRepositoryDrizzle(database)

    logger.info('Initializing task service')
    const taskService = new TaskService()

    logger.info('Initializing storage')
    const storageService = new StorageService(MEDIA_DIR, userData)
    storageService.on('image-stored', (imagePath) => {
      logger.info(`Stored image ${imagePath}`)
    })

    logger.info('Initializing settings')
    const settingsStore = new JsonStore({
      basePath: SETTINGS_DIR,
      root: userData,
    })
    const settingsRegistry = new SettingsRegistry()
    const settingsBuilder = new SettingsBuilder(
      {
        store: settingsStore,
        ...createCryptoServices(),
      },
      settingsRegistry,
    )

    logger.info('Initializing plugin system')
    const permissionRegistry = new PermissionRegistry()
    const pluginRegistry = new PluginRegistry()
    const pluginManager = new PluginManager(
      pluginRegistry,
      permissionRegistry,
      settingsBuilder,
    )
    pluginManager.on('error', (err) => logger.error(err))

    logger.info('Initializing AI services')
    const ollamaSettings = new OllamaSettingsProvider(settingsBuilder)
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
      window: mainWindow.window,
      logger,
      appInfo,
      SettingsBuilder: settingsBuilder,

      DeltaRepository: deltaRepository,

      AiService: ollamaService,
      AiSettingsProvider: ollamaSettings,

      RuleEngine: ruleEngine,
      RuleEnginePrinter: ruleEnginePrinter,
      RuleEngineCompiler: ruleEngineCompiler,
      RuleRepository: ruleRepository,
      TemplateRepository: templateRepository,

      EventBus: eventBus,
      EventRegistry: eventRegistry,

      ExportManager: exportManager,
      ImportManager: importManager,

      GenresRepository: genresRepository,

      QueryResolver: queryResolver,
      ExternalLinkResolver: externalLinkResolver,
      MediaSimilarityService: mediaSimilarityService,
      MediaRepository: mediaRepository,
      MediaProgressRepository: mediaProgressRepository,
      MediaEmbeddingRepository: mediaEmbeddingRepository,

      StorageService: storageService,

      TaskService: taskService,

      WatchPlanRepository: watchPlanRepository,
    }

    app.on('before-quit', async () => {
      logger.header('Shutting down...')

      logger.warn('Destroying plugins')
      await pluginManager.destroyAll()

      logger.info('Writing settings')
      await settingsRegistry.flushAll()
    })

    logger.header('Plugins')
    logger.info('Initializing plugins')
    registerPluginPermissions(modules, permissionRegistry)
    await pluginManager.load(PLUGINS_DIR, appInfo.version)
    await pluginManager.setup()
    logger.debug(`Plugins: ${JSON.stringify(pluginRegistry.getAll(), null, 2)}`)

    logger.header('Rule Engine Services')
    logger.info('Creating rule engine services')
    expressionEvaluator.setServices(createExpressionServices(settingsRegistry))
    actionExecutor.setServices(createActionServices(ruleEngine, pluginManager))

    logger.header('Database')
    logger.info('Running migrations')
    await runMigrations(database, MIGRATIONS_PATH)

    logger.info('Seeding')
    await seedDatabase(database)

    logger.header('oRPC / Protocols / Events')
    logger.info('Registering oRPC handlers')
    registerOrpcHandler(createOrpcRouter(modules))

    logger.info('Subscribing to media projections')
    subscribeMediaProjections(modules)

    logger.info('Registering custom protocols')
    registerProtocols(modules)

    logger.info('Registering domain events')
    registerDomainEvents(modules)

    logger.info('Registering versioning events')
    registerVersioningEvents(modules)

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
