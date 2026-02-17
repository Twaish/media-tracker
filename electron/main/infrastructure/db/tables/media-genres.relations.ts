import { relations } from 'drizzle-orm'
import { mediaGenresTable } from './media-genres.table'
import { mediaTable } from './media.table'
import { genresTable } from './genres.table'

export const mediaGenresRelations = relations(mediaGenresTable, ({ one }) => ({
  media: one(mediaTable, {
    fields: [mediaGenresTable.mediaId],
    references: [mediaTable.id],
  }),
  genre: one(genresTable, {
    fields: [mediaGenresTable.genreId],
    references: [genresTable.id],
  }),
}))
