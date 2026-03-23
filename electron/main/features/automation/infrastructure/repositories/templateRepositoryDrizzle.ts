import { eq, gt, inArray } from 'drizzle-orm'

import { DrizzleDb, Executor } from '@/infrastructure/db/types'
import { templatesTable } from '@/infrastructure/db/schema'

import {
  AddTemplateRepoDTO,
  UpdateTemplateRepoDTO,
} from '../../application/dto/automationDto'

import { ITemplateRepository } from '../../domain/repositories/ITemplateRepository'
import { PersistedTemplate, Template } from '../../domain/entities/template'

export class TemplateRepositoryDrizzle implements ITemplateRepository {
  constructor(private readonly db: DrizzleDb) {}

  async getById(
    id: number,
    executor: Executor = this.db,
  ): Promise<PersistedTemplate> {
    const row = await executor.query.templatesTable.findFirst({
      where: eq(templatesTable.id, id),
    })

    if (!row) throw new Error(`Template with id ${id} not found`)

    return this.toDomain(row)
  }
  async getAll(): Promise<PersistedTemplate[]> {
    const rows = await this.db.query.templatesTable.findMany()

    return rows.map(this.toDomain)
  }

  async add(template: AddTemplateRepoDTO): Promise<PersistedTemplate> {
    return this.db.transaction(async (tx) => {
      const ast = JSON.stringify(template.ast)
      const [inserted] = await tx
        .insert(templatesTable)
        .values({ ...template, ast })
        .returning()

      return this.getById(inserted.id, tx)
    })
  }
  async remove(ids: number[]): Promise<{ deleted: number; ids: number[] }> {
    if (!ids.length) return { deleted: 0, ids: [] }

    const rows = await this.db
      .delete(templatesTable)
      .where(inArray(templatesTable.id, ids))
      .returning({ id: templatesTable.id })

    return {
      deleted: rows.length,
      ids: rows.map((r) => r.id),
    }
  }
  async update(template: UpdateTemplateRepoDTO): Promise<PersistedTemplate> {
    return this.db.transaction(async (tx) => {
      const { id, ast, ...templateUpdates } = template

      if (Object.keys(templateUpdates).length > 0) {
        await tx
          .update(templatesTable)
          .set(templateUpdates)
          .where(eq(templatesTable.id, id))
      }

      if (ast) {
        const astString = JSON.stringify(ast)

        await tx
          .update(templatesTable)
          .set({ ast: astString })
          .where(eq(templatesTable.id, id))
      }

      return this.getById(id, tx)
    })
  }

  async *streamAll(batchSize: number = 10): AsyncIterable<PersistedTemplate> {
    let lastId: number | undefined

    while (true) {
      const rows = await this.db.query.templatesTable.findMany({
        where: lastId ? gt(templatesTable.id, lastId) : undefined,
        limit: batchSize,
        orderBy: templatesTable.id,
      })

      if (rows.length === 0) return

      for (const row of rows) {
        yield this.toDomain(row)
        lastId = row.id
      }
    }
  }

  private toDomain(row: typeof templatesTable.$inferSelect): PersistedTemplate {
    const ast = JSON.parse(row.ast)
    return Template.create({ ...row, ast })
      .withId(row.id)
      .toDTO()
  }
}
