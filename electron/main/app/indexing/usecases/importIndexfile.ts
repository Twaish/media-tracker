import { IndexExtractionSchema } from '../application/models/IndexFileManifest'
import { IIndexManager } from '../application/ports/IIndexManager'

export default class ImportIndexFile {
  constructor(private readonly indexManager: IIndexManager) {}

  async execute(params: { source: string; extraction: IndexExtractionSchema }) {
    return await this.indexManager.importIndexFile(params)
  }
}
