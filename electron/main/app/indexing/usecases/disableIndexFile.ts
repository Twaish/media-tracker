import { IIndexManager } from '../application/ports/IIndexManager'

export default class DisableIndexFile {
  constructor(private readonly indexManager: IIndexManager) {}

  async execute(id: string) {
    return await this.indexManager.disableIndexFile(id)
  }
}
