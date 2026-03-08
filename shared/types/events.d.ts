import { EventDefinition } from '@/application/events/IEventRegistry'
export { EventDefinition } from '@/application/events/IEventRegistry'

export interface EventsContext {
  get(): Promise<EventDefinition[]>
}
