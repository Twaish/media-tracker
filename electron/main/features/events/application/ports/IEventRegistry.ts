export type EventDefinition = {
  name: string
  description: string
}

export interface IEventRegistry {
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
