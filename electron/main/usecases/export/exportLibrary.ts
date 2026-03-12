import { IGenresRepository } from '@/application/db/repositories/IGenresRepository'
import { IMediaEmbeddingRepository } from '@/application/db/repositories/IMediaEmbeddingRepository'
import { IMediaRepository } from '@/application/db/repositories/IMediaRepository'
import { IRuleRepository } from '@/application/db/repositories/IRuleRepository'
import { ITemplateRepository } from '@/application/db/repositories/ITemplateRepository'
import { IWatchPlanRepository } from '@/application/db/repositories/IWatchPlanRepository'
import { FileExportWriter } from '@/domain/services/FileExportWriter'
import { ExportManager } from '@/infrastructure/export/ExportManager'

/*
TODO: SWITCH TO DIFFERENT EXPORTING SCHEMA
Use a folder instead as images also need to be included.
Folder name format: export-{unixtime}
Files:
- manifest.json
- data/{rules.ndjson, ruleEvents.ndjson, ...}
- assets/{thumbnails/{media1.webp, media2.webp, ...}, ...}

Manifest contains:
{
  "version": 1,
  "exportedAt": "2026-03-11T12:00:00Z",
  "appVersion": "1.4.0"
}
*/

export default class ExportLibrary {
  constructor(
    private readonly exportWriter: FileExportWriter,
    private readonly exportManager: ExportManager,
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
    await writer.exportArray(
      'mediaEmbeddings',
      this.mediaEmbeddingRepository.streamAll(),
    )
    // await this.exportArray("watchPlans", this.watchPlanRepository.streamAll())
    // await this.exportArray("watchPlanSegments", this.watchPlanRepository.streamSegments())
    await writer.exportArray('genres', this.genresRepository.streamAll())

    await writer.endObject()

    await writer.close()
  }
}
