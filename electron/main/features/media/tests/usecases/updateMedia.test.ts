import { describe, it, beforeEach, expect, vi } from 'vitest'
import { IMediaRepository } from '@/features/media/domain/repositories/IMediaRepository'
import { StorageService } from '@/core/StorageService'
import UpdateMedia from '@/features/media/usecases/updateMedia'
import { makeMedia } from './utils'
import { MEDIA_EVENTS } from '@/features/media/usecases/media.events'
import { IEventBus } from '@/features/events/application/ports/IEventBus'

describe('UpdateMedia', () => {
  let usecase: UpdateMedia
  let mockEventBus: IEventBus
  let mockRepo: IMediaRepository
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
      getById: vi.fn(),
    } as unknown as IMediaRepository

    mockStorage = {
      storeImage: vi.fn(),
    } as unknown as StorageService

    mockEventBus = {
      publish: vi.fn(),
    } as unknown as IEventBus

    usecase = new UpdateMedia(mockRepo, mockStorage, mockEventBus)
  })

  it('stores thumbnail and updates media with stored path', async () => {
    const input = {
      id: 1,
      title: 'Movie',
      thumbnail: 'image/path',
      genres: [],
    }

    const previousMedia = makeMedia({ ...input })
    const updatedMedia = makeMedia({
      ...input,
      thumbnail: 'fullpath/images/thumb.jpg',
    })

    vi.mocked(mockStorage.storeImage).mockResolvedValue(imageResult)
    vi.mocked(mockRepo.getById).mockResolvedValue(previousMedia)
    vi.mocked(mockRepo.update).mockResolvedValue(updatedMedia)

    const result = await usecase.execute(input)

    expect(mockStorage.storeImage).toHaveBeenCalledWith({
      imagePath: input.thumbnail,
    })

    expect(mockRepo.update).toHaveBeenCalledWith({
      ...input,
      thumbnail: '/images/thumb.jpg',
    })

    expect(mockEventBus.publish).toHaveBeenCalledWith(
      MEDIA_EVENTS.MEDIA_UPDATED,
      {
        previous: previousMedia,
        current: updatedMedia,
      },
    )

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
