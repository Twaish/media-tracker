import { IRuleRepository } from '@/application/db/repositories/IRuleRepository'
import { PersistedRule, Rule } from '@/domain/entities/rule'
import { AddRuleRepoDTO, UpdateRuleRepoDTO } from '@shared/types/automation'
import { rulesTable } from '../tables/automation.table'
import { DrizzleDb, Executor } from '../types'
import { and, eq, inArray } from 'drizzle-orm'
import { ruleEventsTable } from '../schema'

export class RuleRepositoryDrizzle implements IRuleRepository {
  constructor(private readonly db: DrizzleDb) {}

  async getById(
    id: number,
    executor: Executor = this.db,
  ): Promise<PersistedRule> {
    const row = await executor.query.rulesTable.findFirst({
      where: eq(rulesTable.id, id),
      with: {
        events: true,
      },
    })

    if (!row) throw new Error(`Rule with id ${id} not found`)

    return this.toDomain(row)
  }
  async add(rule: AddRuleRepoDTO): Promise<PersistedRule> {
    return this.db.transaction(async (tx) => {
      const { events, ast, ...ruleData } = rule
      const astString = JSON.stringify(ast)
      const [inserted] = await tx
        .insert(rulesTable)
        .values({
          ...ruleData,
          ast: astString,
        })
        .returning()

      await this.insertEvents(tx, inserted.id, events)

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
      const { id, ast, events, ...ruleUpdates } = rule

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

      if (events) {
        await tx.delete(ruleEventsTable).where(eq(ruleEventsTable.ruleId, id))

        await this.insertEvents(tx, id, events)
      }

      return this.getById(id, tx)
    })
  }
  async getAllEnabled(): Promise<PersistedRule[]> {
    const rows = await this.db.query.rulesTable.findMany({
      where: eq(rulesTable.enabled, true),
      with: { events: true },
    })

    return rows.map(this.toDomain)
  }

  private toDomain(
    row: typeof rulesTable.$inferSelect & {
      events?: (typeof ruleEventsTable.$inferSelect)[]
    },
  ): PersistedRule {
    const ast = JSON.parse(row.ast)
    return Rule.create({
      ...row,
      ast,
      events: row.events?.map((e) => e.name) ?? [],
    })
      .withId(row.id)
      .toDTO()
  }

  private async insertEvents(tx: Executor, ruleId: number, events: string[]) {
    if (!events.length) throw new Error(`Rule must have at least one event`)

    await tx.insert(ruleEventsTable).values(
      events.map((event) => ({
        ruleId,
        name: event,
      })),
    )
  }
}
