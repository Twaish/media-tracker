import { PersistedMediaEmbedding } from '../entities/mediaEmbedding'
import { AddMediaEmbeddingDTO } from '../../application/dto/mediaEmbeddingDto'

export interface IMediaEmbeddingRepository {
  getByMediaId(mediaId: number, model: string): Promise<PersistedMediaEmbedding>
  add(mediaEmbedding: AddMediaEmbeddingDTO): Promise<PersistedMediaEmbedding>
  streamEmbeddingsByModel(model: string): AsyncIterable<{
    mediaId: number
    embedding: number[]
  }>
  getMediaMissingEmbeddings(model: string): Promise<number[]>
  streamAll(batchSize?: number): AsyncIterable<PersistedMediaEmbedding>
}
