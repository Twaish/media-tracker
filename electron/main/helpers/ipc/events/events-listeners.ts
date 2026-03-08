import { createEventsUseCases } from '@/usecases/events'
import { Modules } from '../types'
import { registerIpcHandlers } from '../register-ipc-handlers'
import { EventsContext } from '@shared/types'
import { EVENTS_GET } from './events-channels'

export function addEventsEventListeners(modules: Modules) {
  const useCases = createEventsUseCases(modules)

  registerIpcHandlers<EventsContext>({
    get: [EVENTS_GET, () => useCases.getEventDefinitions.execute()],
  })
}
