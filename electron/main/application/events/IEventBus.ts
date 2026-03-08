export type EventHandler<T = unknown> = (payload: T) => void | Promise<void>

export interface IEventBus {
  /**
   * Publishes an event with optional payload to all subscribers
   *
   * @param event The event name to publish to
   * @param payload The data passed to handlers
   */
  publish<T>(event: string, payload: T): void

  /**
   * Subscribes a handler to an event
   *
   * @param event The event name to listen to
   * @param handler The function to call when the event is published
   * @returns A clean up function to unsubscribe handler
   */
  subscribe<T>(event: string, handler: EventHandler<T>): () => void

  /**
   * Removes a handler from an event
   *
   * @param event The event name
   * @param handler The handler to remove
   */
  unsubscribe<T>(event: string, handler: EventHandler<T>): void
}
