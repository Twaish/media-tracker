import { IIndexManager } from '../application/ports/IIndexManager'

export default class EnableIndexFile {
  constructor(private readonly indexManager: IIndexManager) {}

  async execute(id: string) {
    return await this.indexManager.enableIndexFile(id)
  }
}
