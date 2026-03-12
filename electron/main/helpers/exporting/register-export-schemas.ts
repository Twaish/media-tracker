import { Modules } from '../ipc/types'
import fs from 'fs/promises'
import path from 'path'

const at = <T, K>(path: T, callbacks: K[]) =>
  callbacks.flat().map((callback) => ({ path, callback }))

const sub = <T, K extends { path: string }>(path: T, items: K[]) =>
  items.flat().map((item) => ({ ...item, path: `${path}/${item.path}` }))

const resolveDeep = async <T>(obj: T): Promise<T | T[]> => {
  if (obj instanceof Promise) return resolveDeep(await obj)

  if (Array.isArray(obj)) {
    return Promise.all(obj.map(resolveDeep))
  }

  if (obj && typeof obj === 'object' && obj.constructor === Object) {
    const entries = await Promise.all(
      Object.entries(obj).map(async ([k, v]) => [k, await resolveDeep(v)]),
    )
    return Object.fromEntries(entries)
  }

  return obj
}

const json = (filename: string, content: object) => async (dest: string) => {
  const value = typeof content === 'function' ? await content() : content
  const resolved = await resolveDeep(value)

  fs.writeFile(path.join(dest, filename), JSON.stringify(resolved, null, 2))
}

const isAsyncIterable = <T = unknown>(v: unknown): v is AsyncIterable<T> =>
  typeof v === 'object' &&
  v != null &&
  Symbol.asyncIterator in v &&
  typeof v[Symbol.asyncIterator] === 'function'

const jsonStream =
  <T>(filename: string, content: Record<string, T>) =>
  async (dest: string) => {
    const file = await fs.open(path.join(dest, filename), 'w')

    await file.write('{\n')

    const entries = Object.entries(content)

    for (let i = 0; i < entries.length; i++) {
      const [key, value] = entries[i]

      await file.write(`  "${key}": `)

      if (isAsyncIterable(value)) {
        await file.write('[')
        let first = true

        for await (const item of value) {
          if (!first) await file.write(',')
          first = false
          await file.write(JSON.stringify(item))
        }

        await file.write(']')
      } else {
        const resolved = await value
        await file.write(JSON.stringify(resolved))
      }

      if (i < entries.length - 1) {
        await file.write(',')
      }

      await file.write('\n')
    }

    await file.write('}')
    await file.close()
  }

const exporting = {
  v1: ({
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
    ].flat(),
}

export function registerExportSchemas(
  modules: Modules,
  version: keyof typeof exporting = 'v1',
) {
  const { ExportManager } = modules
  const schemas = exporting[version](modules)

  ExportManager.addExportSchemas(schemas)
}
