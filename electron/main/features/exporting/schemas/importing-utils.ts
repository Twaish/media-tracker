import fs from 'fs/promises'
import path from 'path'
import * as readline from 'node:readline'
import { createReadStream } from 'node:fs'

import { Modules } from '@/helpers/ipc/types'

import { PersistedRule } from '@/features/automation/domain/entities/rule'
import { PersistedGenre } from '@/features/genres/domain/entities/genre'
import { PersistedMedia } from '@/features/media/domain/entities/media'
import { PersistedTemplate } from '@/features/automation/domain/entities/template'
import { PersistedWatchPlan } from '@/features/watchplan/domain/entities/watchPlan'
import { PersistedMediaEmbedding } from '@/features/media/domain/entities/mediaEmbedding'

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
    registeredMedias: Record<number, number>
  } = {
    registeredGenres: {},
    // We use this to map old media ids to new ones
    registeredMedias: {},
  }

  const mapItemToNewMediaId = <T extends { mediaId: number }>(item: T) => {
    const mapped = context.registeredMedias[item.mediaId]

    if (mapped == null) {
      throw new Error(`Missing media mapping for id ${item.mediaId}`)
    }

    return {
      ...item,
      mediaId: mapped,
    }
  }

  return {
    importGenres: async (stream: AsyncIterable<PersistedGenre>) => {
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

        const mappedGenres = media.genres.map((g) => {
          const id = context.registeredGenres[g.name]

          if (id == null) {
            throw new Error(`Missing genre mapping for "${g.name}"`)
          }

          return id
        })

        const previousId = media.id
        const newMedia = await MediaRepository.add({
          ...media,
          genres: mappedGenres,
        })
        context.registeredMedias[previousId] = newMedia.id
      }
    },

    importRules: async (stream: AsyncIterable<PersistedRule>) => {
      for await (const rule of stream) {
        // TODO: Check for duplicates
        logger.debug(JSON.stringify(rule, null, 2))
        await RuleRepository.add(rule)
      }
    },

    importTemplates: async (stream: AsyncIterable<PersistedTemplate>) => {
      for await (const t of stream) {
        // TODO: Check for duplicates
        logger.debug(JSON.stringify(t, null, 2))
        await TemplateRepository.add(t)
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
        try {
          await MediaEmbeddingRepository.add(mapItemToNewMediaId(emb))
        } catch (err) {
          logger.error(
            `Failed to import embedding ${err instanceof Error ? err.stack : String(err)}`,
          )
        }
      }
    },

    importWatchPlans: async (stream: AsyncIterable<PersistedWatchPlan>) => {
      for await (const plan of stream) {
        // TODO: Check for duplicates
        logger.debug(JSON.stringify(plan, null, 2))

        const mappedSegments = plan.segments.map(mapItemToNewMediaId)

        await WatchPlanRepository.add({
          ...plan,
          segments: mappedSegments,
        })
      }
    },
  }
}
