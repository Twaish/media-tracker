import { MediaRepositoryDrizzle } from '@/db/repositories/mediaRepositoryDrizzle'
import { Modules } from '@/helpers/ipc/types'
import RemoveMedia from './removeMedia'
import AddMedia from './addMedia'
import GetMedia from './getMedia'

export function createMediaUseCases({ Database, StorageService }: Modules) {
  const repo = new MediaRepositoryDrizzle(Database)

  return {
    removeMedia: new RemoveMedia(repo),
    addMedia: new AddMedia(repo, StorageService),
    getMedia: new GetMedia(repo),
  }
}
