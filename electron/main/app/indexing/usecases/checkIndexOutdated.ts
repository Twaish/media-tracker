import { IIndexManager } from '../application/ports/IIndexManager'

export default class CheckIndexOutdated {
  constructor(private readonly indexManager: IIndexManager) {}

  async execute(id: string) {
    return this.indexManager.isOutdated(id)
  }
}
