import {
  EventDefinition,
  IEventRegistry,
} from '@/application/events/IEventRegistry'

export class InMemoryEventRegistry implements IEventRegistry {
  private events = new Map<string, EventDefinition>()

  register(event: EventDefinition) {
    if (this.events.has(event.name)) {
      throw new Error(`Event "${event.name}" already registered`)
    }

    this.events.set(event.name, event)
  }

  get(name: string): EventDefinition | undefined {
    return this.events.get(name)
  }

  getAll(): EventDefinition[] {
    return Array.from(this.events.values())
  }

  has(name: string) {
    return this.events.has(name)
  }
}
