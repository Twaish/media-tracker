import { relations } from 'drizzle-orm'
import { ruleEventsTable } from './rule-events.table'
import { rulesTable } from './automation.table'

export const ruleEventsRelations = relations(ruleEventsTable, ({ one }) => ({
  rule: one(rulesTable, {
    fields: [ruleEventsTable.ruleId],
    references: [rulesTable.id],
  }),
}))

export const rulesRelations = relations(rulesTable, ({ many }) => ({
  events: many(ruleEventsTable),
}))
