import { Modules } from '@/helpers/ipc/types'
import { at, json, jsonStream } from '../../exporting-utils'

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
      json('genres.json', {
        genres: GenresRepository.get(),
      }),
      json('rules.json', {
        rules: RuleRepository.getAllEnabled(),
      }),
      json('templates.json', {
        templates: TemplateRepository.getAll(),
      }),
      jsonStream('media_embeddings.json', {
        media_embeddings: MediaEmbeddingRepository.streamAll(),
      }),
    ]),
  ].flat()
