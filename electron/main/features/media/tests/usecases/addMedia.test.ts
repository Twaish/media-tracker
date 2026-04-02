import { describe, it, expect, vi, beforeEach } from 'vitest'
import { IMediaRepository } from '@/features/media/domain/repositories/IMediaRepository'
import AddMedia from '@/features/media/usecases/addMedia'
import { makeMedia } from './utils'
import { IEventBus } from '@/features/events/application/ports/IEventBus'
import { MEDIA_EVENTS } from '@/features/media/usecases/media.events'
import { IStorageService } from '@/features/storage/application/interfaces/IStorageService'

describe('AddMedia', () => {
  let usecase: AddMedia
  let mockEventBus: IEventBus
  let mockRepo: IMediaRepository
  let mockStorage: IStorageService

  const imageResult = {
    relativePath: '/images/thumb.jpg',
    hash: '',
    filename: '',
    fullPath: '',
    width: 480,
    height: 480,
    size: 12345,
  }
  const defaultProps = makeMedia()

  beforeEach(() => {
    mockRepo = {
      add: vi.fn(),
    } as unknown as IMediaRepository

    mockStorage = {
      storeImage: vi.fn(),
    } as unknown as IStorageService

    mockEventBus = {
      publish: vi.fn(),
    } as unknown as IEventBus

    usecase = new AddMedia(mockRepo, mockStorage, mockEventBus)
  })

  it('stores thumbnail and adds media with stored path', async () => {
    const input = {
      ...defaultProps,
      title: 'Movie',
      thumbnail: 'image/path',
      genres: [],
    }
    const media = makeMedia({ id: 1 })

    vi.mocked(mockStorage.storeImage).mockResolvedValue(imageResult)

    vi.mocked(mockRepo.add).mockResolvedValue(media)

    const result = await usecase.execute(input)

    expect(mockStorage.storeImage).toHaveBeenCalledWith({
      imagePath: input.thumbnail,
    })

    expect(mockRepo.add).toHaveBeenCalledWith({
      ...input,
      thumbnail: '/images/thumb.jpg',
    })

    expect(mockEventBus.publish).toHaveBeenCalledWith(
      MEDIA_EVENTS.MEDIA_ADDED,
      {
        current: media,
      },
    )

    expect(result).toEqual(media)
  })

  it('adds media without storing image when thumbnail missing', async () => {
    const input = {
      ...defaultProps,
      title: 'Movie',
      genres: [],
    }
    const media = makeMedia({ id: 1 })

    vi.mocked(mockRepo.add).mockResolvedValue(media)

    const result = await usecase.execute(input)

    expect(mockStorage.storeImage).not.toHaveBeenCalled()

    expect(mockRepo.add).toHaveBeenCalledWith({
      ...input,
      thumbnail: null,
    })

    expect(result).toEqual(media)
  })

  it('throws if storage fails', async () => {
    const storageError = new Error('Storage failed')
    const input = {
      ...defaultProps,
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
      ...defaultProps,
      title: 'Movie',
      thumbnail: 'image/path',
      genres: [],
    }

    vi.mocked(mockStorage.storeImage).mockResolvedValue(imageResult)

    vi.mocked(mockRepo.add).mockRejectedValue(repoError)

    await expect(usecase.execute(input)).rejects.toThrow('Database failed')
  })
})
