import { IGenresRepository } from '@/application/db/repositories/IGenresRepository'
import { IMediaEmbeddingRepository } from '@/application/db/repositories/IMediaEmbeddingRepository'
import { IMediaRepository } from '@/application/db/repositories/IMediaRepository'
import { IRuleRepository } from '@/application/db/repositories/IRuleRepository'
import { ITemplateRepository } from '@/application/db/repositories/ITemplateRepository'
import { IWatchPlanRepository } from '@/application/db/repositories/IWatchPlanRepository'
import { FileExportWriter } from '@/domain/services/FileExportWriter'

export default class ExportLibrary {
  constructor(
    private readonly exportWriter: FileExportWriter,
    private readonly ruleRepository: IRuleRepository,
    private readonly templateRepository: ITemplateRepository,
    private readonly genresRepository: IGenresRepository,
    private readonly mediaRepository: IMediaRepository,
    private readonly mediaEmbeddingRepository: IMediaEmbeddingRepository,
    private readonly watchPlanRepository: IWatchPlanRepository,
  ) {}

  async execute(path: string) {
    const { exportWriter: writer } = this
    await writer.open(path)

    await writer.beginObject()

    // TODO: Implement the rest of the streams
    // await this.exportArray("rules", this.ruleRepository.streamRules())
    // await this.exportArray("ruleEvents", this.ruleRepository.streamEvents())
    // await this.exportArray("templates", this.templateRepository.streamAll())
    // await this.exportArray("media", this.mediaRepository.streamAll())
    // await this.exportArray("mediaGenres", this.mediaRepository.streamGenres())
    await this.exportArray(
      'mediaEmbeddings',
      this.mediaEmbeddingRepository.streamAll(),
    )
    // await this.exportArray("watchPlans", this.watchPlanRepository.streamAll())
    // await this.exportArray("watchPlanSegments", this.watchPlanRepository.streamSegments())
    await this.exportArray('genres', this.genresRepository.streamAll())

    await writer.endObject()

    await writer.close()
  }

  private async exportArray<T>(name: string, stream: AsyncIterable<T>) {
    const { exportWriter } = this

    await exportWriter.beginArray(name)

    for await (const item of stream) {
      await exportWriter.writeItem(item)
    }

    await exportWriter.endArray()
  }
}
