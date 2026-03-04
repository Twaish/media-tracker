import { IRuleRepository } from '@/application/db/repositories/IRuleRepository'
import { PersistedRule, Rule } from '@/domain/entities/rule'
import { AddRuleRepoDTO, UpdateRuleRepoDTO } from '@shared/types/automation'
import { rulesTable } from '../tables/automation.table'
import { DrizzleDb, Executor } from '../types'
import { eq, inArray } from 'drizzle-orm'

export class RuleRepositoryDrizzle implements IRuleRepository {
  constructor(private readonly db: DrizzleDb) {}

  async getById(
    id: number,
    executor: Executor = this.db,
  ): Promise<PersistedRule> {
    const row = await executor.query.rulesTable.findFirst({
      where: eq(rulesTable.id, id),
    })

    if (!row) throw new Error(`Rule with id ${id} not found`)

    return this.toDomain(row)
  }
  async add(rule: AddRuleRepoDTO): Promise<PersistedRule> {
    return this.db.transaction(async (tx) => {
      const ast = JSON.stringify(rule.ast)
      const [inserted] = await tx
        .insert(rulesTable)
        .values({
          ...rule,
          ast,
        })
        .returning()

      return this.getById(inserted.id, tx)
    })
  }
  async remove(ids: number[]): Promise<{ deleted: number; ids: number[] }> {
    if (!ids.length) return { deleted: 0, ids: [] }

    const rows = await this.db
      .delete(rulesTable)
      .where(inArray(rulesTable.id, ids))
      .returning({ id: rulesTable.id })

    return {
      deleted: rows.length,
      ids: rows.map((r) => r.id),
    }
  }
  async update(rule: UpdateRuleRepoDTO): Promise<PersistedRule> {
    return this.db.transaction(async (tx) => {
      const { id, ast, ...ruleUpdates } = rule

      if (Object.keys(ruleUpdates).length > 0) {
        await tx
          .update(rulesTable)
          .set(ruleUpdates)
          .where(eq(rulesTable.id, id))
      }

      if (ast) {
        const astString = JSON.stringify(ast)

        await tx
          .update(rulesTable)
          .set({ ast: astString })
          .where(eq(rulesTable.id, id))
      }

      return this.getById(id, tx)
    })
  }
  async getAllEnabled(): Promise<PersistedRule[]> {
    const rows = await this.db
      .select()
      .from(rulesTable)
      .where(eq(rulesTable.enabled, true))

    return rows.map(this.toDomain)
  }

  private toDomain(row: typeof rulesTable.$inferSelect): PersistedRule {
    const ast = JSON.parse(row.ast)
    return Rule.create({ ...row, ast })
      .withId(row.id)
      .toDTO()
  }
}
