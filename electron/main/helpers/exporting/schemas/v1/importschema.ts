import { Modules } from '@/helpers/ipc/types'
import { createImportUseCases, json, jsonStream } from '../../importing-utils'
import fs from 'fs/promises'
import path from 'path'
import { ImportSchema } from '@/application/exporting/IImportManager'
import { at } from '../../schema-utils'

export const importSchemaV1 = (modules: Modules): ImportSchema[] => {
  const useCases = createImportUseCases(modules)

  return [
    at('/', [
      json('manifest.json', async (manifest: { version: number }) => {
        if (manifest.version !== 1) {
          throw new Error(`Unsupported version: ${manifest.version}`)
        }
      }),
    ]),

    at('assets/thumbnails', [
      async (src: string) => {
        const files = await fs.readdir(src)
        files.forEach(async (file) => {
          const filePath = path.join(src, file)
          await modules.StorageService.storeImage(filePath)
        })
      },
    ]),

    at('data', [
      jsonStream('genres.json', {
        genres: useCases.importGenres,
      }),
      jsonStream('media.json', {
        media: useCases.importMedia,
      }),
      jsonStream('media_embeddings.json', {
        media_embeddings: useCases.importMediaEmbeddings,
      }),
      jsonStream('rules.json', {
        rules: useCases.importRules,
      }),
      jsonStream('templates.json', {
        templates: useCases.importTemplates,
      }),
      jsonStream('watch_plans.json', {
        watch_plans: useCases.importWatchPlans,
      }),
    ]),
  ]
    .flat()
    .map((entry, index) => ({ ...entry, order: index }))
}
