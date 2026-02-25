import { IMediaEmbeddingRepository } from '@/application/db/repositories/IMediaEmbeddingRepository'
import { DrizzleDb, Executor } from '../types'
import {
  MediaEmbedding,
  PersistedMediaEmbedding,
} from '@/domain/entities/mediaEmbedding'
import { and, eq } from 'drizzle-orm'
import { mediaEmbeddingsTable } from '../schema'
import { AddMediaEmbeddingDTO } from '@shared/types/mediaEmbedding'

export class MediaEmbeddingRepositoryDrizzle implements IMediaEmbeddingRepository {
  constructor(private readonly db: DrizzleDb) {}

  async getByMediaId(
    mediaId: number,
    model: string,
    executor: Executor = this.db,
  ): Promise<PersistedMediaEmbedding> {
    const embedding = await executor.query.mediaEmbeddingsTable.findFirst({
      where: (me) => and(eq(me.mediaId, mediaId), eq(me.model, model)),
    })

    if (!embedding)
      throw new Error(
        `Media embedding with id ${mediaId} and model ${model} not found`,
      )

    return this.toDomain(embedding)
  }

  async add(
    mediaEmbedding: AddMediaEmbeddingDTO,
  ): Promise<PersistedMediaEmbedding> {
    return this.db.transaction(async (tx) => {
      const embedding = JSON.stringify(mediaEmbedding.embedding)

      await tx.insert(mediaEmbeddingsTable).values({
        ...mediaEmbedding,
        embedding,
      })

      return this.getByMediaId(mediaEmbedding.mediaId, mediaEmbedding.model, tx)
    })
  }

  private toDomain(
    row: typeof mediaEmbeddingsTable.$inferSelect,
  ): PersistedMediaEmbedding {
    const embedding = JSON.parse(row.embedding) as number[]
    return MediaEmbedding.create({ ...row, embedding })
      .withId(row.id)
      .toDTO()
  }
}
