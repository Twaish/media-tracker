import { describe, it, beforeEach, expect, vi } from 'vitest'
import { StorageService } from '@/core/StorageService'
import StoreImage from '@/features/storage/usecases/storeImage'

describe('StoreImage', () => {
  let usecase: StoreImage
  let mockStorage: StorageService

  beforeEach(() => {
    mockStorage = {
      storeImage: vi.fn(),
    } as unknown as StorageService

    usecase = new StoreImage(mockStorage)
  })

  it('stores image with provided path and options', async () => {
    const storeImageArgs = {
      imagePath: '/tmp/image.jpg',
      options: {
        maxWidth: 480,
        maxHeight: 480,
      },
    }

    const storageResult = {
      relativePath: '/images/image.jpg',
      fullPath: '/var/images/image.jpg',
      filename: 'image.jpg',
      hash: 'abc123',
      size: 12345,
      width: 480,
      height: 480,
    }

    vi.mocked(mockStorage.storeImage).mockResolvedValue(storageResult)

    const result = await usecase.execute(storeImageArgs)

    expect(mockStorage.storeImage).toHaveBeenCalledWith(storeImageArgs)
    expect(result).toEqual(storageResult)
  })

  it('throws if storage fails', async () => {
    const storeImageArgs = {
      imagePath: '/tmp/image.jpg',
    }
    const storageError = new Error('Storage failed')

    vi.mocked(mockStorage.storeImage).mockRejectedValue(storageError)

    await expect(usecase.execute(storeImageArgs)).rejects.toThrow(
      'Storage failed',
    )
  })
})
