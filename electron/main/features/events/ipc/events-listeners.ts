import { EventsContext } from '@shared/types'
import { EVENTS_GET } from './events-channels'
import { createEventsUseCases } from '../usecases'
import { Modules } from '@/helpers/ipc/types'
import { registerIpcHandlers } from '@/helpers/ipc/register-ipc-handlers'

export function addEventsEventListeners(modules: Modules) {
  const useCases = createEventsUseCases(modules)

  registerIpcHandlers<EventsContext>({
    get: [EVENTS_GET, () => useCases.getEventDefinitions.execute()],
  })
}
