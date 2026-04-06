import { Modules } from '@/helpers/ipc/types'
import { MediaProgress } from '../domain/entities/mediaProgress'
import { IMediaProgressRepository } from '../domain/repositories/IMediaProgressRepository'
import { MEDIA_EVENTS, MediaUpdatedPayload } from './media.events'

const onMediaUpdated =
  (progressRepo: IMediaProgressRepository) =>
  async (event: MediaUpdatedPayload) => {
    const prev = event.previous
    const curr = event.current

    if (prev.currentEpisode === curr.currentEpisode) return

    const mediaProgress = MediaProgress.create({
      mediaId: curr.id,
      progress: curr.currentEpisode,
      previousProgress: prev.currentEpisode,
    })
    await progressRepo.add(mediaProgress)
  }

export function subscribeMediaProjections({
  EventBus,
  MediaProgressRepository,
}: Modules) {
  EventBus.subscribe(
    MEDIA_EVENTS.MEDIA_UPDATED,
    onMediaUpdated(MediaProgressRepository),
  )
}
