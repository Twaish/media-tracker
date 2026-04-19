import { ipc } from '@/ipc'

export async function getEventDefinitions() {
  return ipc.client.events.get()
}
