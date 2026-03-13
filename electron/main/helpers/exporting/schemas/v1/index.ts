import { Modules } from '@/helpers/ipc/types'
import { at, json, jsonStream } from '../../exporting-utils'

/*
TODO: Implement stream functions for all repositories
TODO: Implement the rest of the streams
await this.exportArray("rules", this.ruleRepository.streamRules())
await this.exportArray("ruleEvents", this.ruleRepository.streamEvents())
await this.exportArray("templates", this.templateRepository.streamAll())
await this.exportArray("media", this.mediaRepository.streamAll())
await this.exportArray("mediaGenres", this.mediaRepository.streamGenres())
await writer.exportArray('mediaEmbeddings', this.mediaEmbeddingRepository.streamAll())
await this.exportArray("watchPlans", this.watchPlanRepository.streamAll())
await this.exportArray("watchPlanSegments", this.watchPlanRepository.streamSegments())
await writer.exportArray('genres', this.genresRepository.streamAll())
*/
export const exportSchemaV1 = ({
  StorageService,
  GenresRepository,
  RuleRepository,
  TemplateRepository,
  MediaEmbeddingRepository,
}: Modules) =>
  [
    at('/', [
      json('manifest.json', {
        exportedAt: new Date(),
        version: 1,
      }),
    ]),
    at('assets/thumbnails', [
      (dest: string) => StorageService.exportImages(dest),
    ]),
    at('data', [
      jsonStream('genres.json', {
        genres: () => GenresRepository.streamAll(),
      }),
      json('rules.json', {
        rules: () => RuleRepository.getAllEnabled(),
      }),
      json('templates.json', {
        templates: () => TemplateRepository.getAll(),
      }),
      jsonStream('media_embeddings.json', {
        media_embeddings: () => MediaEmbeddingRepository.streamAll(),
      }),
    ]),
  ].flat()
