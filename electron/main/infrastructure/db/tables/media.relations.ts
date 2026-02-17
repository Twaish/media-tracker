import { relations } from 'drizzle-orm'
import { mediaTable } from './media.table'
import { mediaGenresTable } from './media-genres.table'

export const mediaRelations = relations(mediaTable, ({ many, one }) => ({
  mediaGenres: many(mediaGenresTable),
  watchAfterMedia: one(mediaTable, {
    fields: [mediaTable.watchAfter],
    references: [mediaTable.id],
  }),
}))
