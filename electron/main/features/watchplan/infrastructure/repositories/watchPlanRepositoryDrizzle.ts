import { inArray, eq, gt } from 'drizzle-orm'
import {
  watchPlanSegmentsTable,
  watchPlansTable,
} from '@/infrastructure/db/schema'

import { AddWatchPlanDTO, UpdateWatchPlanDTO } from '@shared/types/watchPlans'

import { DrizzleDb, Executor } from '@/infrastructure/db/types'

import { IWatchPlanRepository } from '../../domain/repositories/IWatchPlanRepository'
import {
  PersistedWatchPlan,
  WatchPlan,
  WatchPlanSegment,
} from '../../domain/entities/watchPlan'

export class WatchPlanRepositoryDrizzle implements IWatchPlanRepository {
  constructor(private readonly db: DrizzleDb) {}

  async getById(id: number, executor: Executor = this.db) {
    const result = await executor.query.watchPlansTable.findFirst({
      where: (m) => eq(m.id, id),
      with: {
        segments: {
          orderBy: (s, { asc }) => [asc(s.order)],
        },
      },
    })

    if (!result) throw new Error(`WatchPlan with id ${id} not found`)

    return this.toDomain(result)
  }

  async getAll() {
    const rows = await this.db.query.watchPlansTable.findMany({
      with: {
        segments: {
          orderBy: (s, { asc }) => [asc(s.order)],
        },
      },
      orderBy: (wp, { desc }) => [desc(wp.createdAt)],
    })
    return rows.map(this.toDomain)
  }

  async add(input: AddWatchPlanDTO) {
    return this.db.transaction(async (tx) => {
      const { segments, ...watchPlanData } = input

      const [inserted] = await tx
        .insert(watchPlansTable)
        .values(watchPlanData)
        .returning()

      await tx.insert(watchPlanSegmentsTable).values(
        segments.map((segment, index) => ({
          watchPlanId: inserted.id,
          mediaId: segment.mediaId,
          startEpisode: segment.startEpisode,
          endEpisode: segment.endEpisode,
          order: index,
        })),
      )

      return this.getById(inserted.id, tx)
    })
  }

  async update(input: UpdateWatchPlanDTO) {
    return this.db.transaction(async (tx) => {
      const { id, segments, ...watchPlanUpdates } = input

      if (Object.keys(watchPlanUpdates).length > 0) {
        await tx
          .update(watchPlansTable)
          .set(watchPlanUpdates)
          .where(eq(watchPlansTable.id, id))
      }

      if (segments) {
        await tx
          .delete(watchPlanSegmentsTable)
          .where(eq(watchPlanSegmentsTable.watchPlanId, id))

        if (segments.length > 0) {
          await tx.insert(watchPlanSegmentsTable).values(
            segments.map((segment, index) => ({
              watchPlanId: id,
              mediaId: segment.mediaId,
              startEpisode: segment.startEpisode,
              endEpisode: segment.endEpisode,
              order: index,
            })),
          )
        }
      }

      return this.getById(id, tx)
    })
  }

  async remove(ids: number[]) {
    if (!ids.length) return { deleted: 0, ids: [] }

    const rows = await this.db
      .delete(watchPlansTable)
      .where(inArray(watchPlansTable.id, ids))
      .returning({ id: watchPlansTable.id })

    return {
      deleted: rows.length,
      ids: rows.map((r) => r.id),
    }
  }

  async *streamAll(batchSize: number = 10): AsyncIterable<PersistedWatchPlan> {
    let lastId: number | undefined

    while (true) {
      const rows = await this.db.query.watchPlansTable.findMany({
        where: lastId ? gt(watchPlansTable.id, lastId) : undefined,
        limit: batchSize,
        orderBy: watchPlansTable.id,
        with: {
          segments: {
            orderBy: (s, { asc }) => [asc(s.order)],
          },
        },
      })

      if (rows.length === 0) return

      for (const row of rows) {
        yield this.toDomain(row)
        lastId = row.id
      }
    }
  }

  private toDomain(
    row: typeof watchPlansTable.$inferSelect & {
      segments: (typeof watchPlanSegmentsTable.$inferSelect)[]
    },
  ): PersistedWatchPlan {
    const segments = row.segments.map((segment) =>
      WatchPlanSegment.create(segment).withId(segment.id).toDTO(),
    )

    return WatchPlan.create({ ...row, segments })
      .withId(row.id)
      .toDTO()
  }
}
