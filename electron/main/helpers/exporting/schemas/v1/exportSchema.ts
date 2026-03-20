import { Modules } from '@/helpers/ipc/types'
import { json, jsonStream } from '../../exporting-utils'
import { at } from '../../schema-utils'

export const exportSchemaV1 = ({
  appInfo,
  StorageService,
  GenresRepository,
  RuleRepository,
  MediaRepository,
  TemplateRepository,
  MediaEmbeddingRepository,
  WatchPlanRepository,
}: Modules) =>
  [
    at('/', [
      json('manifest.json', {
        exportedAt: new Date(),
        version: 1,
        appVersion: appInfo.version,
      }),
    ]),
    at('assets/thumbnails', [
      (dest: string) => StorageService.exportImages(dest),
    ]),
    at('data', [
      jsonStream('genres.json', {
        genres: () => GenresRepository.streamAll(),
      }),
      jsonStream('rules.json', {
        rules: () => RuleRepository.streamAll(),
      }),
      jsonStream('media.json', {
        media: () => MediaRepository.streamAll(),
      }),
      jsonStream('templates.json', {
        templates: () => TemplateRepository.streamAll(),
      }),
      jsonStream('media_embeddings.json', {
        media_embeddings: () => MediaEmbeddingRepository.streamAll(),
      }),
      jsonStream('watch_plans.json', {
        watch_plans: () => WatchPlanRepository.streamAll(),
      }),
    ]),
  ].flat()
