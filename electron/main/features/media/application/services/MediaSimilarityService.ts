import { TopKHeap } from '@/core/structures/TopKHeap'
import { dotProduct, normalize } from '@/core/math/vector'

import { IAiService } from '@/features/ai/application/ports/IAiService'

import { MediaProps } from '../../domain/entities/media'
import { IMediaEmbeddingRepository } from '../../domain/repositories/IMediaEmbeddingRepository'

import { IMediaSimilarityService } from '../interfaces/IMediaSimilarityService'

export class MediaSimilarityService implements IMediaSimilarityService {
  constructor(
    private readonly aiService: IAiService,
    private readonly repo: IMediaEmbeddingRepository,
  ) {}

  async findTopKSimilarByMedia(
    mediaId: number,
    model: string,
    k: number,
    threshold: number,
  ): Promise<{ item: number; score: number }[]> {
    const source = await this.repo.getByMediaId(mediaId, model)
    if (!source) return []

    const inputEmbedding = new Float32Array(source.embedding)

    return this.findTopK(
      inputEmbedding,
      model,
      k,
      threshold,
      (row) => row.mediaId !== mediaId,
    )
  }

  async findTopKSimilar(
    inputText: string,
    model: string,
    k: number,
    threshold: number,
  ): Promise<{ item: number; score: number }[]> {
    const embedding = await this.aiService.embed(inputText)
    const inputEmbedding = new Float32Array(normalize(embedding))

    return this.findTopK(inputEmbedding, model, k, threshold)
  }

  private async findTopK(
    inputEmbedding: Float32Array,
    model: string,
    k = 10,
    threshold = 0.8,
    filter: (row: { mediaId: number; embedding: number[] }) => boolean = () =>
      true,
  ): Promise<{ item: number; score: number }[]> {
    const heap = new TopKHeap<number>(k)

    for await (const row of this.repo.streamEmbeddingsByModel(model)) {
      if (!filter(row)) continue

      const similarity = dotProduct(
        inputEmbedding,
        new Float32Array(row.embedding),
      )

      if (similarity >= threshold) {
        heap.push(row.mediaId, similarity)
      }
    }

    return heap.toSortedDescending()
  }

  buildText(media: Partial<MediaProps>): string {
    return `
      Title: ${media.title}
      Alternate Titles: ${media.alternateTitles ?? ''}
      Type: ${media.type}
    `.trim()
  }
}
