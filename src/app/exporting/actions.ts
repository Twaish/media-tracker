import { ipc } from '@/ipc'

export async function exportLibrary(path: string) {
  return ipc.client.exporting.exportLibrary(path)
}

export async function importLibrary(path: string) {
  return ipc.client.exporting.importLibrary(path)
}
