import { IIndexManager } from '../application/ports/IIndexManager'

export default class RefreshIndexFile {
  constructor(private readonly indexManager: IIndexManager) {}

  async execute(id: string) {
    return await this.indexManager.refreshIndexFile(id)
  }
}
