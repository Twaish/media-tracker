import { Modules } from '@/helpers/ipc/types'
import ExportLibrary from './exportLibrary'

export function createExportUseCases({
  ExportWriter,
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
      RuleRepository,
      TemplateRepository,
      GenresRepository,
      MediaRepository,
      MediaEmbeddingRepository,
      WatchPlanRepository,
    ),
  }
}
