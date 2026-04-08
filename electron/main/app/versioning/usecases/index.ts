import { Modules } from '@/helpers/ipc/types'
import AddDelta from './addDelta'
import GetDeltas from './getDeltas'
import RemoveDeltas from './removeDeltas'

export function createVersioningUseCases({ DeltaRepository }: Modules) {
  return {
    addDelta: new AddDelta(DeltaRepository),
    getDeltas: new GetDeltas(DeltaRepository),
    removeDeltas: new RemoveDeltas(DeltaRepository),
  }
}
