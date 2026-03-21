import { createReadStream } from 'node:fs'
import * as readline from 'node:readline'
import fs from 'fs/promises'
import path from 'path'
import { Modules } from '../ipc/types'
import { PersistedMedia } from '@/domain/entities/media'
import { PersistedRule, PersistedTemplate } from '@/domain/entities/rule'
import { PersistedMediaEmbedding } from '@/domain/entities/mediaEmbedding'
import { PersistedWatchPlan } from '@/domain/entities/watchPlan'
import { PersistedGenre } from '@/domain/entities/genre'

export async function* createJsonStream<T>(filePath: string): AsyncIterable<T> {
  const stream = createReadStream(filePath, { encoding: 'utf-8' })

  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity,
  })

  for await (const line of rl) {
    if (!line.trim()) continue
    yield JSON.parse(line) as T
  }
}

export const json =
  <T>(filename: string, handler: (data: T) => Promise<void>) =>
  async (src: string) => {
    const filePath = path.join(src, filename)
    const raw = await fs.readFile(filePath, 'utf-8')
    const parsed = JSON.parse(raw) as T
    await handler(parsed)
  }

async function* streamJsonArray<T>(
  filePath: string,
  rootKey: string,
): AsyncIterable<T> {
  const stream = createReadStream(filePath, { encoding: 'utf-8' })

  let buffer = ''
  let depth = 0
  let inString = false
  let escape = false
  let arrayStarted = false
  let objectBuffer = ''
  let capturing = false

  const marker = `"${rootKey}"`

  for await (const chunk of stream) {
    buffer += chunk

    if (!arrayStarted) {
      const keyIndex = buffer.indexOf(marker)
      if (keyIndex === -1) continue

      const afterKey = buffer.indexOf('[', keyIndex + marker.length)
      if (afterKey === -1) continue

      buffer = buffer.slice(afterKey + 1)
      arrayStarted = true
    }

    for (let i = 0; i < buffer.length; i++) {
      const char = buffer[i]

      if (escape) {
        escape = false
        if (capturing) objectBuffer += char
        continue
      }

      if (char === '\\' && inString) {
        escape = true
        if (capturing) objectBuffer += char
        continue
      }

      if (char === '"') {
        inString = !inString
        if (capturing) objectBuffer += char
        continue
      }

      if (inString) {
        if (capturing) objectBuffer += char
        continue
      }

      if (char === '{') {
        depth++
        if (depth === 1) {
          capturing = true
          objectBuffer = '{'
        } else if (capturing) {
          objectBuffer += char
        }
        continue
      }

      if (char === '}') {
        if (capturing) objectBuffer += char
        depth--

        if (depth === 0 && capturing) {
          yield JSON.parse(objectBuffer) as T
          objectBuffer = ''
          capturing = false
        }
        continue
      }

      if (char === ']' && depth === 0) {
        return
      }

      if (capturing) objectBuffer += char
    }

    buffer = capturing ? '' : ''
    buffer = ''
  }
}

export const jsonStream =
  <T>(
    filename: string,
    handlers: {
      [K in string]: (stream: AsyncIterable<T>) => Promise<void>
    },
  ) =>
  async (src: string) => {
    const filePath = path.join(src, filename)

    for (const [key, handler] of Object.entries(handlers)) {
      const stream = streamJsonArray<T>(filePath, key)
      await handler(stream)
    }
  }

export const createImportUseCases = ({
  MediaRepository,
  RuleRepository,
  TemplateRepository,
  MediaEmbeddingRepository,
  WatchPlanRepository,
  GenresRepository,
  logger,
}: Modules) => {
  const context: {
    registeredGenres: Record<string, number>
  } = {
    registeredGenres: {},
  }
  return {
    importGenres: async (stream: AsyncIterable<PersistedGenre>) => {
      context.registeredGenres ??= {}

      const genres = await GenresRepository.get()
      genres.forEach((value) => {
        context.registeredGenres[value.name] = value.id
      })

      for await (const genre of stream) {
        const registeredGenre = context.registeredGenres[genre.name]
        if (registeredGenre != null) {
          logger.info(
            `Skipping existing genre "${genre.name}" with mapped id ${registeredGenre}`,
          )
          continue
        }

        const created = await GenresRepository.add(genre)
        context.registeredGenres[genre.name] = created.id
        logger.info(`Created genre "${genre.name}" with id ${created.id}`)
      }
    },

    importMedia: async (stream: AsyncIterable<PersistedMedia>) => {
      for await (const media of stream) {
        // TODO: Check for duplicates
        logger.debug(JSON.stringify(media, null, 2))
        // const mappedGenres = media.genres.map(
        //   (g) => context.registeredGenres[g.name],
        // )
        // await MediaRepository.add({
        //   ...media,
        //   genres: mappedGenres,
        // })
      }
    },

    importRules: async (stream: AsyncIterable<PersistedRule>) => {
      for await (const rule of stream) {
        // TODO: Check for duplicates
        logger.debug(JSON.stringify(rule, null, 2))
        // await RuleRepository.add(rule)
      }
    },

    importTemplates: async (stream: AsyncIterable<PersistedTemplate>) => {
      for await (const t of stream) {
        // TODO: Check for duplicates
        logger.debug(JSON.stringify(t, null, 2))
        // await TemplateRepository.add(t)
      }
    },

    importMediaEmbeddings: async (
      stream: AsyncIterable<PersistedMediaEmbedding>,
    ) => {
      // TODO: Check for duplicates
      for await (const emb of stream) {
        logger.debug(
          JSON.stringify({ mediaId: emb.mediaId, model: emb.model }, null, 2),
        )
        // try {
        //   await MediaEmbeddingRepository.add({
        //     ...emb,
        //     mediaId: emb.mediaId,
        //   })
        // } catch {}
      }
    },

    importWatchPlans: async (stream: AsyncIterable<PersistedWatchPlan>) => {
      for await (const plan of stream) {
        // TODO: Check for duplicates
        logger.debug(JSON.stringify(plan, null, 2))
        // await WatchPlanRepository.add({
        //   ...plan,
        // })
      }
    },
  }
}
