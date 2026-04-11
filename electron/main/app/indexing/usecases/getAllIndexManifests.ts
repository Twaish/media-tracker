import { IIndexRegistry } from '../application/ports/IIndexRegistry'

export default class GetAllIndexManifests {
  constructor(private readonly registry: IIndexRegistry) {}

  async execute() {
    const manifests = this.registry.getAll()
    console.log(manifests)
    return this.registry.getAll()
  }
}
