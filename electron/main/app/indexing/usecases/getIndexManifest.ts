import { IIndexRegistry } from '../application/ports/IIndexRegistry'

export default class GetIndexManifest {
  constructor(private readonly registry: IIndexRegistry) {}

  async execute(id: string) {
    return this.registry.get(id)
  }
}
