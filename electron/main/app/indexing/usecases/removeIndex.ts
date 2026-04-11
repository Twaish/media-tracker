import { IIndexManager } from '../application/ports/IIndexManager'

export default class RemoveIndex {
  constructor(private readonly indexManager: IIndexManager) {}

  async execute(id: string) {
    return await this.indexManager.removeIndexPackage(id)
  }
}
