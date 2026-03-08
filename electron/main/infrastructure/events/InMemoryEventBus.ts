import { IEventBus, EventHandler } from '@/application/events/IEventBus'

export class InMemoryEventBus implements IEventBus {
  private handlers: Map<string, EventHandler<unknown>[]> = new Map()

  publish<T>(event: string, payload: T): void {
    const eventHandlers = this.handlers.get(event) ?? []
    eventHandlers.forEach((handler) => handler(payload))
  }
  subscribe<T>(event: string, handler: EventHandler<T>): () => void {
    const eventHandlers = this.handlers.get(event) ?? []
    this.handlers.set(event, [...eventHandlers, handler as EventHandler])
    return () => {
      this.unsubscribe(event, handler)
    }
  }
  unsubscribe<T>(event: string, handler: EventHandler<T>): void {
    const eventHandlers = this.handlers.get(event) ?? []
    this.handlers.set(
      event,
      eventHandlers.filter((h) => h !== handler),
    )
  }
}
