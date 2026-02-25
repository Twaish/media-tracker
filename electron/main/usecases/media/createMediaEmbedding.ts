import { IAiService } from '@/application/ai/IAiService'
import { IMediaEmbeddingRepository } from '@/application/db/repositories/IMediaEmbeddingRepository'
import { IMediaRepository } from '@/application/db/repositories/IMediaRepository'
import { normalize } from '@/core/math/vector'
import { MediaSimilarityService } from '@/domain/services/MediaSimilarityService'

export default class CreateMediaEmbedding {
  constructor(
    private readonly mediaRepo: IMediaRepository,
    private readonly embeddingRepo: IMediaEmbeddingRepository,
    private readonly aiService: IAiService,
    private readonly similarityService: MediaSimilarityService,
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
