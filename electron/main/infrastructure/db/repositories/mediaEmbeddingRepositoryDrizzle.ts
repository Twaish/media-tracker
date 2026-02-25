import { IMediaEmbeddingRepository } from '@/application/db/repositories/IMediaEmbeddingRepository'
import { DrizzleDb, Executor } from '../types'
import {
  MediaEmbedding,
  PersistedMediaEmbedding,
} from '@/domain/entities/mediaEmbedding'
import { and, eq, isNull } from 'drizzle-orm'
import { mediaEmbeddingsTable, mediaTable } from '../schema'
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

  async *streamEmbeddingsByModel(
    model: string,
  ): AsyncIterable<{ mediaId: number; embedding: number[] }> {
    // Drizzle currently doesn't support iterator for SQLite (25-02-2026)
    // TODO: Use iterator as this loads everything into memory
    const rows = await this.db
      .select({
        mediaId: mediaEmbeddingsTable.mediaId,
        embedding: mediaEmbeddingsTable.embedding,
      })
      .from(mediaEmbeddingsTable)
      .innerJoin(mediaTable, eq(mediaEmbeddingsTable.mediaId, mediaTable.id))
      .where(
        and(
          eq(mediaEmbeddingsTable.model, model),
          isNull(mediaTable.deletedAt),
        ),
      )

    for (const row of rows) {
      yield {
        mediaId: row.mediaId,
        embedding: JSON.parse(row.embedding),
      }
    }
  }

  async getMediaMissingEmbeddings(model: string): Promise<number[]> {
    const rows = await this.db
      .select({ mediaId: mediaTable.id })
      .from(mediaTable)
      .leftJoin(
        mediaEmbeddingsTable,
        and(
          eq(mediaTable.id, mediaEmbeddingsTable.mediaId),
          eq(mediaEmbeddingsTable.model, model),
        ),
      )
      .where(and(isNull(mediaEmbeddingsTable.id), isNull(mediaTable.deletedAt)))

    return rows.map((row) => row.mediaId)
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
