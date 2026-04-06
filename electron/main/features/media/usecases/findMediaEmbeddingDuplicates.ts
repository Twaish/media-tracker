import { IMediaSimilarityService } from '../application/interfaces/IMediaSimilarityService'
import { IMediaEmbeddingRepository } from '../domain/repositories/IMediaEmbeddingRepository'

export default class FindMediaEmbeddingDuplicates {
  constructor(
    private readonly similarityService: IMediaSimilarityService,
    private readonly embeddingRepo: IMediaEmbeddingRepository,
  ) {}

  async execute(
    model: string,
    k?: number,
    threshold?: number,
  ): Promise<Array<{ a: number; b: number; score: number }>> {
    const duplicates: Array<{ a: number; b: number; score: number }> = []
    const seen = new Set<string>()

    for await (const row of this.embeddingRepo.streamEmbeddingsByModel(model)) {
      const candidates = await this.similarityService.findTopKSimilarByMedia(
        row.mediaId,
        model,
        k,
        threshold,
      )

      for (const candidate of candidates) {
        if (candidate.item === row.mediaId) continue

        const key = [row.mediaId, candidate.item].sort().join(':')
        if (seen.has(key)) continue

        seen.add(key)
        duplicates.push({
          a: row.mediaId,
          b: candidate.item,
          score: candidate.score,
        })
      }
    }

    return duplicates
  }
}
