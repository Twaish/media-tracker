import { IndexExtractionSchema } from '../application/models/IndexFileManifest'
import { IIndexManager } from '../application/ports/IIndexManager'

export default class UpdateExtractionSchema {
  constructor(private readonly indexManager: IIndexManager) {}

  async execute(params: { id: string; extraction: IndexExtractionSchema }) {
    return await this.indexManager.updateExtractionSchema(params)
  }
}
