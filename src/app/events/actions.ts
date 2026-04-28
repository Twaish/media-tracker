import { ipc } from '@/core/ipc'

export async function getEventDefinitions() {
  return ipc.client.events.get()
}
