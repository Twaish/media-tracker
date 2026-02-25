import { IAiService } from '@/application/ai/IAiService'
import { IMediaEmbeddingRepository } from '@/application/db/repositories/IMediaEmbeddingRepository'
import { dotProduct, normalize } from '@/core/math/vector'
import { TopKHeap } from '@/core/structures/TopKHeap'
import { MediaProps } from '@/domain/entities/media'

export class MediaSimilarityService {
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

  computeSimilarity(
    inputText: string,
    model: string,
    candidates: { id: number; embedding?: number[] }[],
  ): Promise<{ id: number; similarity: number }[]> {
    throw new Error('Method not implemented.')
  }

  buildText(media: MediaProps): string {
    return `
      Title: ${media.title}
      Alternate Titles: ${media.alternateTitles ?? ''}
      Type: ${media.type}
    `.trim()
  }
}
