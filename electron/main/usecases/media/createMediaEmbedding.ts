import { IAiService } from '@/application/ai/IAiService'
import { IMediaEmbeddingRepository } from '@/application/db/repositories/IMediaEmbeddingRepository'
import { IMediaRepository } from '@/application/db/repositories/IMediaRepository'
import { normalize } from '@/core/math/vector'
import { PersistedMedia } from '@/domain/entities/media'

export default class CreateMediaEmbedding {
  constructor(
    private readonly mediaRepo: IMediaRepository,
    private readonly embeddingRepo: IMediaEmbeddingRepository,
    private readonly aiService: IAiService,
  ) {}

  async execute(mediaId: number, model: string) {
    const media = await this.mediaRepo.getById(mediaId)

    const text = this.buildEmbeddingText(media)

    const embedding = await this.aiService.embed(text, model)

    const normalizedEmbedding = normalize(embedding)

    return await this.embeddingRepo.add({
      mediaId,
      model,
      embedding: normalizedEmbedding,
    })
  }

  private buildEmbeddingText(media: PersistedMedia) {
    return `
      Title: ${media.title}
      Alternate Titles: ${media.alternateTitles ?? ''}
      Type: ${media.type}
    `.trim()
  }
}
