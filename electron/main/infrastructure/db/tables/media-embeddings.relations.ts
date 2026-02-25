import { relations } from 'drizzle-orm'
import { mediaEmbeddingsTable } from './media-embeddings.table'
import { mediaTable } from './media.table'

export const mediaEmbeddingsRelations = relations(
  mediaEmbeddingsTable,
  ({ one }) => ({
    media: one(mediaTable, {
      fields: [mediaEmbeddingsTable.mediaId],
      references: [mediaTable.id],
    }),
  }),
)
