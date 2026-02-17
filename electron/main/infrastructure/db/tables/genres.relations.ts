import { relations } from 'drizzle-orm'
import { genresTable } from './genres.table'
import { mediaGenresTable } from './media-genres.table'

export const genreRelations = relations(genresTable, ({ many }) => ({
  mediaGenres: many(mediaGenresTable),
}))
