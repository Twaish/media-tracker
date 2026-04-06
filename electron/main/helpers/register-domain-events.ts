import {
  registerMediaEvents,
  subscribeToMediaEvents,
} from '@/features/media/events/media.events'
import { Modules } from '@/helpers/ipc/types'

export function registerDomainEvents(modules: Modules) {
  subscribeEvents(modules)
  registerEvents(modules)
}

function subscribeEvents(modules: Modules) {
  subscribeToMediaEvents(modules)
}

function registerEvents(modules: Modules) {
  registerMediaEvents(modules)
}
