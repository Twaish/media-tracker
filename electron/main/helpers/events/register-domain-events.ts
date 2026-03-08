import {
  registerMediaEvents,
  subscribeToMediaEvents,
} from '@/usecases/media/media.events'
import { Modules } from '../ipc/types'

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
