import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ExternalLinkResolver } from '@/domain/services/ExternalLinkResolver'
import { IMediaRepository } from '@/application/db/repositories/IMediaRepository'
import ResolveExternalMediaLink from '@/usecases/media/resolveExternalMediaLink'
import { makeMedia } from '../utils'

describe('ResolveExternalMediaLink', () => {
  let usecase: ResolveExternalMediaLink
  let mockRepo: IMediaRepository
  let mockResolver: ExternalLinkResolver

  beforeEach(() => {
    mockRepo = {
      getById: vi.fn(),
    } as unknown as IMediaRepository

    mockResolver = {
      resolveExternalLink: vi.fn(),
    } as unknown as ExternalLinkResolver

    usecase = new ResolveExternalMediaLink(mockRepo, mockResolver)
  })

  it('returns null when media does not exist', async () => {
    // @ts-expect-error
    vi.mocked(mockRepo.getById).mockResolvedValue(null)

    const result = await usecase.execute(1)

    expect(result).toBeNull()
    expect(mockResolver.resolveExternalLink).not.toHaveBeenCalled()
  })

  it('returns null when media has no external link', async () => {
    const media = makeMedia({
      externalLink: null,
      maxEpisodes: null,
      currentEpisode: 1,
    })

    vi.mocked(mockRepo.getById).mockResolvedValue(media)

    const result = await usecase.execute(1)

    expect(result).toBeNull()
    expect(mockResolver.resolveExternalLink).not.toHaveBeenCalled()
  })

  it('resolves external link using next episode', async () => {
    const media = makeMedia({
      externalLink: 'https://example.com/episode/{{episode}}',
      currentEpisode: 3,
      maxEpisodes: null,
    })

    vi.mocked(mockRepo.getById).mockResolvedValue(media)
    vi.mocked(mockResolver.resolveExternalLink).mockReturnValue(
      'https://example.com/episode/4',
    )

    const result = await usecase.execute(1)

    expect(mockResolver.resolveExternalLink).toHaveBeenCalledWith(
      'https://example.com/episode/{{episode}}',
      4,
    )
    expect(result).toBe('https://example.com/episode/4')
  })

  it('caps next episode at max episodes when exceeded', async () => {
    const media = makeMedia({
      externalLink: 'https://example.com/episode/{{episode}}',
      currentEpisode: 12,
      maxEpisodes: 12,
    })

    vi.mocked(mockRepo.getById).mockResolvedValue(media)
    vi.mocked(mockResolver.resolveExternalLink).mockReturnValue(
      'https://example.com/episode/12',
    )

    const result = await usecase.execute(1)

    expect(mockResolver.resolveExternalLink).toHaveBeenCalledWith(
      'https://example.com/episode/{{episode}}',
      12,
    )
    expect(result).toBe('https://example.com/episode/12')
  })

  it('propagates errors from the repository', async () => {
    const error = new Error('Database failure')
    vi.mocked(mockRepo.getById).mockRejectedValue(error)

    await expect(usecase.execute(1)).rejects.toThrow('Database failure')
  })
})
