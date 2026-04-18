import { ipc } from '@/ipc'

export async function getGenres() {
  return ipc.client.genres.get()
}

export async function addGenre(name: string) {
  return ipc.client.genres.add({ name })
}

export async function getGenreById(id: number) {
  return ipc.client.genres.getById(id)
}
