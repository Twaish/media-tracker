import { relations } from 'drizzle-orm'
import { watchPlanSegmentsTable, watchPlansTable } from './watch-plans.table'
import { mediaTable } from './media.table'

export const watchPlansRelations = relations(watchPlansTable, ({ many }) => ({
  segments: many(watchPlanSegmentsTable),
}))

export const watchPlanSegmentsRelations = relations(
  watchPlanSegmentsTable,
  ({ one }) => ({
    plan: one(watchPlansTable, {
      fields: [watchPlanSegmentsTable.watchPlanId],
      references: [watchPlansTable.id],
    }),
    media: one(mediaTable, {
      fields: [watchPlanSegmentsTable.mediaId],
      references: [mediaTable.id],
    }),
  }),
)
