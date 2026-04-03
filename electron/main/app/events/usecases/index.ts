import { Modules } from '@/helpers/ipc/types'
import GetEventDefinitions from './getEventDefinitions'

export function createEventsUseCases({ EventRegistry }: Modules) {
  return {
    getEventDefinitions: new GetEventDefinitions(EventRegistry),
  }
}
