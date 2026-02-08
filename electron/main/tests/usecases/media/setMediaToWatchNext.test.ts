import { describe, it, beforeEach, expect, vi } from 'vitest'
import { MediaRepository } from '@/application/db/repositories/mediaRepository'
import SetMediaToWatchNext from '@/usecases/media/setMediaToWatchNext'

describe('SetMediaToWatchNext', () => {
  let usecase: SetMediaToWatchNext
  let mockRepo: MediaRepository

  beforeEach(() => {
    mockRepo = {
      update: vi.fn(),
    } as unknown as MediaRepository

    usecase = new SetMediaToWatchNext(mockRepo)
  })

  it('throws when mediaId and nextMediaId are the same', async () => {
    const mediaId = 1

    await expect(usecase.execute(mediaId, mediaId)).rejects.toThrow(
      'A media item cannot be set to follow itself',
    )

    expect(mockRepo.update).not.toHaveBeenCalled()
  })

  it('updates media watchAfter when ids are different', async () => {
    const mediaId = 1
    const nextMediaId = 2

    await usecase.execute(mediaId, nextMediaId)

    expect(mockRepo.update).toHaveBeenCalledWith({
      id: mediaId,
      watchAfter: nextMediaId,
    })
  })

  it('throws if repository fails', async () => {
    const mediaId = 1
    const nextMediaId = 2
    const repoError = new Error('Database failed')

    vi.mocked(mockRepo.update).mockRejectedValue(repoError)

    await expect(usecase.execute(mediaId, nextMediaId)).rejects.toThrow(
      'Database failed',
    )
  })
})
