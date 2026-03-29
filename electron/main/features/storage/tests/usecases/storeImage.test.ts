import { describe, it, beforeEach, expect, vi } from 'vitest'
import { StorageService } from '@/core/StorageService'
import { StoreImageOptions } from '@shared/types'
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
    const imagePath = '/tmp/image.jpg'
    const options: StoreImageOptions = {
      maxWidth: 480,
      maxHeight: 480,
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

    const result = await usecase.execute(imagePath, options)

    expect(mockStorage.storeImage).toHaveBeenCalledWith(imagePath, options)
    expect(result).toEqual(storageResult)
  })

  it('throws if storage fails', async () => {
    const imagePath = '/tmp/image.jpg'
    const options = {}
    const storageError = new Error('Storage failed')

    vi.mocked(mockStorage.storeImage).mockRejectedValue(storageError)

    await expect(usecase.execute(imagePath, options)).rejects.toThrow(
      'Storage failed',
    )
  })
})
