import { describe, it, beforeEach, expect, vi } from 'vitest'
import { MediaRepository } from '@/domain/repositories/mediaRepository'
import { StorageService } from '@/core/StorageService'
import UpdateMedia from '@/usecases/media/updateMedia'
import { makeMedia } from '../utils'

describe('UpdateMedia', () => {
  let usecase: UpdateMedia
  let mockRepo: MediaRepository
  let mockStorage: StorageService

  const imageResult = {
    relativePath: '/images/thumb.jpg',
    hash: '',
    filename: '',
    fullPath: '',
    width: 480,
    height: 480,
    size: 12345,
  }

  beforeEach(() => {
    mockRepo = {
      update: vi.fn(),
    } as unknown as MediaRepository

    mockStorage = {
      storeImage: vi.fn(),
    } as unknown as StorageService

    usecase = new UpdateMedia(mockRepo, mockStorage)
  })

  it('stores thumbnail and updates media with stored path', async () => {
    const input = {
      id: 1,
      title: 'Movie',
      thumbnail: 'image/path',
      genres: [],
    }

    const updatedMedia = makeMedia({ ...input, thumbnail: '/images/thumb.jpg' })

    vi.mocked(mockStorage.storeImage).mockResolvedValue(imageResult)
    vi.mocked(mockRepo.update).mockResolvedValue(updatedMedia)

    const result = await usecase.execute(input)

    expect(mockStorage.storeImage).toHaveBeenCalledWith(input.thumbnail)

    expect(mockRepo.update).toHaveBeenCalledWith({
      ...input,
      thumbnail: '/images/thumb.jpg',
    })

    expect(result).toEqual(updatedMedia)
  })

  it('updates media without storing image when thumbnail missing', async () => {
    const input = {
      id: 1,
      title: 'Movie',
      genres: [],
    }
    const updatedMedia = makeMedia(input)

    vi.mocked(mockRepo.update).mockResolvedValue(updatedMedia)

    const result = await usecase.execute(input)

    expect(mockStorage.storeImage).not.toHaveBeenCalled()

    expect(mockRepo.update).toHaveBeenCalledWith({
      ...input,
    })

    expect(result).toEqual(updatedMedia)
  })

  it('throws if storage fails', async () => {
    const input = {
      id: 1,
      title: 'Movie',
      thumbnail: 'image/path',
      genres: [],
    }

    const storageError = new Error('Storage failed')

    vi.mocked(mockStorage.storeImage).mockRejectedValue(storageError)

    await expect(usecase.execute(input)).rejects.toThrow('Storage failed')

    expect(mockRepo.update).not.toHaveBeenCalled()
  })

  it('throws if repository fails', async () => {
    const input = {
      id: 1,
      title: 'Movie',
      thumbnail: 'image/path',
      genres: [],
    }

    vi.mocked(mockStorage.storeImage).mockResolvedValue(imageResult)

    const repoError = new Error('Database failed')
    vi.mocked(mockRepo.update).mockRejectedValue(repoError)

    await expect(usecase.execute(input)).rejects.toThrow('Database failed')
  })
})
