import { IMediaEmbeddingRepository } from '@/application/db/repositories/IMediaEmbeddingRepository'

export default class GetMediaMissingEmbeddings {
  constructor(private readonly repo: IMediaEmbeddingRepository) {}

  async execute(model: string) {
    return await this.repo.getMediaMissingEmbeddings(model)
  }
}
