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

  async findTopKSimilar(
    inputText: string,
    model: string,
    k = 10,
    threshold = 0.8,
  ): Promise<{ item: number; score: number }[]> {
    const inputEmbedding = normalize(await this.aiService.embed(inputText))

    const heap = new TopKHeap<number>(k)

    for await (const row of this.repo.streamEmbeddingsByModel(model)) {
      const similarity = dotProduct(
        new Float32Array(inputEmbedding),
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
