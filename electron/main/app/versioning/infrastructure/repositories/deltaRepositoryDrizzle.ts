import { count, eq, inArray } from 'drizzle-orm'
import { DrizzleDb, Executor } from '@/infrastructure/db/types'

import { Pagination, PaginationResult } from '@shared/types'
import { IDeltaRepository } from '../../domain/repositories/IDeltaRepository'
import { Delta, PersistedDelta } from '../../domain/entities/delta'
import { deltasTable } from '@/infrastructure/db/schema'

export class DeltaRepositoryDrizzle implements IDeltaRepository {
  constructor(private readonly db: DrizzleDb) {}

  async getById(id: number, executor: Executor = this.db) {
    const delta = await executor.query.deltasTable.findFirst({
      where: (m) => eq(m.id, id),
    })

    if (!delta) throw new Error(`Delta with id ${id} not found`)

    return this.toDomain(delta)
  }

  add(delta: Delta): Promise<PersistedDelta> {
    return this.db.transaction(async (tx) => {
      const [inserted] = await tx
        .insert(deltasTable)
        .values(delta.props)
        .returning()

      return this.getById(inserted.id, tx)
    })
  }

  async remove(ids: number[]): Promise<{ deleted: number; ids: number[] }> {
    if (!ids.length) return { deleted: 0, ids: [] }

    const rows = await this.db
      .delete(deltasTable)
      .where(inArray(deltasTable.id, ids))
      .returning({ id: deltasTable.id })

    return {
      deleted: rows.length,
      ids: rows.map((r) => r.id),
    }
  }

  async get(options?: Pagination): Promise<PaginationResult<PersistedDelta>> {
    const page = options?.page ?? 1
    const limit = options?.limit ?? 12
    const offset = (page - 1) * limit

    const [rows, totalItems] = await Promise.all([
      this.db.query.deltasTable.findMany({
        limit,
        offset,
        orderBy: (m, { desc }) => [desc(m.createdAt)],
      }),
      this.db
        .select({ count: count() })
        .from(deltasTable)
        .then((r) => Number(r[0]?.count ?? 0)),
    ])

    const totalPages = Math.ceil(totalItems / limit)

    return {
      data: rows.map((r) => this.toDomain(r)),
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
      },
    }
  }

  private toDomain(row: typeof deltasTable.$inferSelect): PersistedDelta {
    return Delta.create(row).withId(row.id).toDTO()
  }
}
