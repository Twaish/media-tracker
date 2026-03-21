import { describe, it, expect, vi, beforeEach } from 'vitest'
import { IMediaRepository } from '@/application/db/repositories/IMediaRepository'
import { makeMedia } from '../utils'
import GetMedia from '@/usecases/media/getMedia'

describe('GetMedia', () => {
  let getMedia: GetMedia
  let mockRepo: IMediaRepository

  const defaultPaginationResult = {
    limit: 12,
    page: 1,
    totalItems: 0,
    totalPages: 0,
  }

  const defaultPagination = {
    page: 1,
    limit: 12,
  }

  beforeEach(() => {
    mockRepo = {
      getWithPagination: vi.fn(),
    } as unknown as IMediaRepository

    getMedia = new GetMedia(mockRepo)
  })

  it('should return media from repository', async () => {
    const expectedMedia = {
      data: [makeMedia({ id: 1 }), makeMedia({ id: 2 }), makeMedia({ id: 3 })],
      pagination: defaultPaginationResult,
    }

    vi.mocked(mockRepo.getWithPagination).mockResolvedValue(expectedMedia)

    const result = await getMedia.execute(defaultPagination)

    expect(mockRepo.getWithPagination).toHaveBeenCalledOnce()
    expect(result).toEqual(expectedMedia)
  })

  it('should return empty arrays when no media exist', async () => {
    vi.mocked(mockRepo.getWithPagination).mockResolvedValue({
      data: [],
      pagination: defaultPaginationResult,
    })

    const result = await getMedia.execute(defaultPagination)

    expect(result).toEqual({
      data: [],
      pagination: defaultPaginationResult,
    })
  })

  it('throws if repository fails', async () => {
    const repoError = new Error('Database failed')
    vi.mocked(mockRepo.getWithPagination).mockRejectedValue(repoError)

    await expect(getMedia.execute(defaultPagination)).rejects.toThrow(
      'Database failed',
    )
  })
})
