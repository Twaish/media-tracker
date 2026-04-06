import { DrizzleDb, Executor } from '@/infrastructure/db/types'
import { IMediaProgressRepository } from '../../domain/repositories/IMediaProgressRepository'
import { mediaProgressTable } from '@/infrastructure/db/tables/media-progress.table'
import { eq } from 'drizzle-orm'
import {
  MediaProgress,
  PersistedMediaProgress,
} from '../../domain/entities/mediaProgress'

export class MediaProgressRepositoryDrizzle implements IMediaProgressRepository {
  constructor(private readonly db: DrizzleDb) {}

  async getById(id: number, executor: Executor = this.db) {
    const mediaProgress = await executor.query.mediaProgressTable.findFirst({
      where: (m) => eq(m.id, id),
    })

    if (!mediaProgress)
      throw new Error(`Media progress with id ${id} not found`)

    return this.toDomain(mediaProgress)
  }

  async add(mediaProgress: MediaProgress) {
    return this.db.transaction(async (tx) => {
      const [inserted] = await tx
        .insert(mediaProgressTable)
        .values({
          mediaId: mediaProgress.mediaId,
          progress: mediaProgress.progress,
          previousProgress: mediaProgress.previousProgress,
          // ...mediaProgress.props,
        })
        .returning()

      return this.getById(inserted.id, tx)
    })
  }
  async getByMediaId(mediaId: number) {
    const rows = await this.db.query.mediaProgressTable.findMany({
      where: (m) => eq(m.mediaId, mediaId),
      orderBy: (m) => m.createdAt,
    })
    return rows.map((r) => this.toDomain(r))
  }

  private toDomain(
    row: typeof mediaProgressTable.$inferSelect,
  ): PersistedMediaProgress {
    return MediaProgress.create({
      ...row,
    })
      .withId(row.id)
      .toDTO()
  }
}
