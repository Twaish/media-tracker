import { EventDefinition } from '@/features/events/application/ports/IEventRegistry'

export interface EventsContext {
  get(): Promise<EventDefinition[]>
}
