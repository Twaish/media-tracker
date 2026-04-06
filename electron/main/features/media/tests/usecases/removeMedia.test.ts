import { describe, it, beforeEach, expect, vi } from 'vitest'
import { IMediaRepository } from '@/features/media/domain/repositories/IMediaRepository'
import RemoveMedia from '@/features/media/usecases/removeMedia'
import { IEventBus } from '@/app/events/application/ports/IEventBus'
import { makeMedia } from './utils'
import { MEDIA_EVENTS } from '@/features/media/events/media.events'

describe('RemoveMedia', () => {
  let usecase: RemoveMedia
  let mockEventBus: IEventBus
  let mockRepo: IMediaRepository

  beforeEach(() => {
    mockRepo = {
      remove: vi.fn(),
      getByIds: vi.fn(),
    } as unknown as IMediaRepository

    mockEventBus = {
      publish: vi.fn(),
    } as unknown as IEventBus

    usecase = new RemoveMedia(mockRepo, mockEventBus)
  })

  it('returns zero deletions when mediaIds is empty', async () => {
    const result = await usecase.execute([])

    expect(result).toEqual({ deleted: 0, ids: [] })
    expect(mockRepo.remove).not.toHaveBeenCalled()
  })

  it('removes media when mediaIds are provided', async () => {
    const mediaToRemove = [
      makeMedia({ id: 1, title: 'Media 1' }),
      makeMedia({ id: 2, title: 'Media 2' }),
      makeMedia({ id: 3, title: 'Media 3' }),
    ]
    const mediaIds = mediaToRemove.map((m) => m.id)
    const repoResult = { deleted: 3, ids: mediaIds }

    vi.mocked(mockRepo.getByIds).mockResolvedValue(mediaToRemove)
    vi.mocked(mockRepo.remove).mockResolvedValue(repoResult)

    const result = await usecase.execute(mediaIds)

    expect(mockRepo.getByIds).toHaveBeenCalledWith(mediaIds)
    expect(mockEventBus.publish).toHaveBeenCalledTimes(3)
    expect(mockEventBus.publish).toHaveBeenNthCalledWith(
      1,
      MEDIA_EVENTS.MEDIA_REMOVED,
      { current: mediaToRemove[0] },
    )

    expect(mockEventBus.publish).toHaveBeenNthCalledWith(
      2,
      MEDIA_EVENTS.MEDIA_REMOVED,
      { current: mediaToRemove[1] },
    )

    expect(mockEventBus.publish).toHaveBeenNthCalledWith(
      3,
      MEDIA_EVENTS.MEDIA_REMOVED,
      { current: mediaToRemove[2] },
    )
    expect(mockRepo.remove).toHaveBeenCalledWith(mediaIds)
    expect(result).toEqual(repoResult)
  })

  it('throws if repository fails', async () => {
    const mediaIds = [1, 2]
    const repoError = new Error('Database failed')

    vi.mocked(mockRepo.remove).mockRejectedValue(repoError)

    await expect(usecase.execute(mediaIds)).rejects.toThrow('Database failed')
  })
})
