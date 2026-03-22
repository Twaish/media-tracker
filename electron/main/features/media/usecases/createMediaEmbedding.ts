import { IAiService } from '@/features/ai/application/ports/IAiService'
import { IMediaEmbeddingRepository } from '../domain/repositories/IMediaEmbeddingRepository'
import { IMediaRepository } from '../domain/repositories/IMediaRepository'
import { normalize } from '@/core/math/vector'
import { IMediaSimilarityService } from '../application/interfaces/IMediaSimilarityService'

export default class CreateMediaEmbedding {
  constructor(
    private readonly mediaRepo: IMediaRepository,
    private readonly embeddingRepo: IMediaEmbeddingRepository,
    private readonly aiService: IAiService,
    private readonly similarityService: IMediaSimilarityService,
  ) {}

  async execute(mediaId: number, model: string) {
    const media = await this.mediaRepo.getById(mediaId)

    const text = this.similarityService.buildText(media)

    const embedding = await this.aiService.embed(text, model)

    const normalizedEmbedding = normalize(embedding)

    return await this.embeddingRepo.add({
      mediaId,
      model,
      embedding: normalizedEmbedding,
    })
  }
}
