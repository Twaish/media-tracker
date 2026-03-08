import { describe, it, beforeEach, expect, vi } from 'vitest'
import { IMediaRepository } from '@/application/db/repositories/IMediaRepository'
import RemoveMedia from '@/usecases/media/removeMedia'

describe('RemoveMedia', () => {
  let usecase: RemoveMedia
  let mockRepo: IMediaRepository

  beforeEach(() => {
    mockRepo = {
      remove: vi.fn(),
    } as unknown as IMediaRepository

    usecase = new RemoveMedia(mockRepo)
  })

  it('returns zero deletions when mediaIds is empty', async () => {
    const result = await usecase.execute([])

    expect(result).toEqual({ deleted: 0, ids: [] })
    expect(mockRepo.remove).not.toHaveBeenCalled()
  })

  it('removes media when mediaIds are provided', async () => {
    const mediaIds = [1, 2, 3]
    const repoResult = { deleted: 3, ids: mediaIds }

    vi.mocked(mockRepo.remove).mockResolvedValue(repoResult)

    const result = await usecase.execute(mediaIds)

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
