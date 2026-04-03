import { IEventRegistry } from '../application/ports/IEventRegistry'

export default class GetEventDefinitions {
  constructor(private readonly registry: IEventRegistry) {}

  async execute() {
    return this.registry.getAll()
  }
}
