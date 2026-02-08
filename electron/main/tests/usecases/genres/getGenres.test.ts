import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GenresRepository } from '@/application/db/repositories/genresRepository'
import { Genre } from '@/domain/entities/genre'
import GetGenres from '@/usecases/genres/getGenres'

describe('GetGenres', () => {
  let getGenres: GetGenres
  let mockRepo: GenresRepository

  beforeEach(() => {
    mockRepo = {
      get: vi.fn(),
    } as unknown as GenresRepository

    getGenres = new GetGenres(mockRepo)
  })

  it('should return genres from repository', async () => {
    const expectedGenres = [
      { id: 1, name: 'Action', isDeletable: false },
      { id: 2, name: 'Comedy', isDeletable: false },
      { id: 3, name: 'Drama', isDeletable: false },
    ] as Genre[]

    vi.mocked(mockRepo.get).mockResolvedValue(expectedGenres)

    const result = await getGenres.execute()

    expect(mockRepo.get).toHaveBeenCalledOnce()
    expect(result).toEqual(expectedGenres)
  })

  it('should return empty array when no genres exist', async () => {
    vi.mocked(mockRepo.get).mockResolvedValue([])

    const result = await getGenres.execute()

    expect(result).toEqual([])
  })

  it('should handle repository errors', async () => {
    const repoError = new Error('Database connection failed')
    vi.mocked(mockRepo.get).mockRejectedValue(repoError)

    await expect(getGenres.execute()).rejects.toThrow(
      'Database connection failed',
    )
  })
})
