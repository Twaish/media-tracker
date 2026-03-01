import { ITemplateRepository } from '@/application/db/repositories/ITemplateRepository'
import { AddTemplateDTO, UpdateTemplateDTO } from '@shared/types/template'
import { DrizzleDb, Executor } from '../types'
import { templatesTable } from '../schema'
import { eq, inArray } from 'drizzle-orm'
import { PersistedTemplate, Template } from '@/domain/entities/rule'

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

  async add(template: AddTemplateDTO): Promise<PersistedTemplate> {
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
  async update(template: UpdateTemplateDTO): Promise<PersistedTemplate> {
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

  private toDomain(row: typeof templatesTable.$inferSelect): PersistedTemplate {
    const ast = JSON.parse(row.ast)
    return Template.create({ ...row, ast })
      .withId(row.id)
      .toDTO()
  }
}
