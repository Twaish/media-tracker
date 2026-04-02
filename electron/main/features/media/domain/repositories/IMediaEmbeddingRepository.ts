import {
  MediaEmbeddingProps,
  PersistedMediaEmbedding,
} from '../entities/mediaEmbedding'

export interface IMediaEmbeddingRepository {
  getByMediaId(mediaId: number, model: string): Promise<PersistedMediaEmbedding>
  add(mediaEmbedding: MediaEmbeddingProps): Promise<PersistedMediaEmbedding>
  streamEmbeddingsByModel(model: string): AsyncIterable<{
    mediaId: number
    embedding: number[]
  }>
  getMediaMissingEmbeddings(model: string): Promise<number[]>
  streamAll(batchSize?: number): AsyncIterable<PersistedMediaEmbedding>
}
