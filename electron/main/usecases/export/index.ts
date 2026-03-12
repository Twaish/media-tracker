import { Modules } from '@/helpers/ipc/types'
import ExportLibrary from './exportLibrary'

export function createExportUseCases({
  ExportWriter,
  ExportManager,
  RuleRepository,
  TemplateRepository,
  GenresRepository,
  MediaRepository,
  MediaEmbeddingRepository,
  WatchPlanRepository,
}: Modules) {
  return {
    exportLibrary: new ExportLibrary(
      ExportWriter,
      ExportManager,
      RuleRepository,
      TemplateRepository,
      GenresRepository,
      MediaRepository,
      MediaEmbeddingRepository,
      WatchPlanRepository,
    ),
  }
}
