export type EventDefinition = {
  name: string
  description: string
}

export interface EventRegistry {
  /**
   * Registers an event to the event registry
   *
   * @param event The event definition
   */
  register(event: EventDefinition): void

  /**
   * Gets an event definition by its name
   *
   * @param name The name of the event
   * @returns The event definition or undefined if not in registry
   */
  get(name: string): EventDefinition | undefined

  /**
   * Gets all events in the registry
   *
   * @returns A list containing all events
   */
  getAll(): EventDefinition[]

  /**
   * Checks if the registry contains an event by its name
   *
   * @param name The name of the event
   * @returns Whether it contains the event
   */
  has(name: string): boolean
}

export class InMemoryEventRegistry implements EventRegistry {
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
