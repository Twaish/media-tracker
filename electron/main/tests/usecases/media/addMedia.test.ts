import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MediaRepository } from '@/domain/repositories/mediaRepository'
import { Media } from '@/domain/entities/media'
import { MediaCreateInput, StoredImageResult } from '@shared/types'
import { StorageService } from '@/core/StorageService'
import AddMedia from '@/usecases/media/addMedia'
import { makeMedia } from '../utils'

describe('AddMedia', () => {
  let usecase: AddMedia
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
      add: vi.fn(),
    } as unknown as MediaRepository

    mockStorage = {
      storeImage: vi.fn(),
    } as unknown as StorageService

    usecase = new AddMedia(mockRepo, mockStorage)
  })

  it('stores thumbnail and adds media with stored path', async () => {
    const input = {
      title: 'Movie',
      thumbnail: 'image/path',
      genres: [],
    }
    const media = makeMedia()

    vi.mocked(mockStorage.storeImage).mockResolvedValue(imageResult)

    vi.mocked(mockRepo.add).mockResolvedValue(media)

    const result = await usecase.execute(input)

    expect(mockStorage.storeImage).toHaveBeenCalledWith(input.thumbnail)

    expect(mockRepo.add).toHaveBeenCalledWith({
      ...input,
      thumbnail: '/images/thumb.jpg',
    })

    expect(result).toEqual(media)
  })

  it('adds media without storing image when thumbnail missing', async () => {
    const input = {
      title: 'Movie',
      genres: [],
    }
    const media = makeMedia()

    vi.mocked(mockRepo.add).mockResolvedValue(media)

    const result = await usecase.execute(input)

    expect(mockStorage.storeImage).not.toHaveBeenCalled()

    expect(mockRepo.add).toHaveBeenCalledWith({
      ...input,
      thumbnail: undefined,
    })

    expect(result).toEqual(media)
  })

  it('throws if storage fails', async () => {
    const storageError = new Error('Storage failed')
    const input = {
      title: 'Movie',
      thumbnail: 'image/path',
      genres: [],
    }

    vi.mocked(mockStorage.storeImage).mockRejectedValue(storageError)

    await expect(usecase.execute(input)).rejects.toThrow('Storage failed')

    expect(mockRepo.add).not.toHaveBeenCalled()
  })

  it('throws if repository fails', async () => {
    const repoError = new Error('Database failed')
    const input = {
      title: 'Movie',
      thumbnail: 'image/path',
      genres: [],
    }

    vi.mocked(mockStorage.storeImage).mockResolvedValue(imageResult)

    vi.mocked(mockRepo.add).mockRejectedValue(repoError)

    await expect(usecase.execute(input)).rejects.toThrow('Database failed')
  })
})
