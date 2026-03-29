import { describe, it, beforeEach, expect, vi } from 'vitest'
import CheckAiCompatibility from '@/features/ai/usecases/checkAiCompatibility'
import { IAiService } from '@/features/ai/application/ports/IAiService'

describe('CheckAiCompatibility', () => {
  let usecase: CheckAiCompatibility
  let mockAiService: IAiService

  beforeEach(() => {
    mockAiService = {
      getVersion: vi.fn(),
      listModels: vi.fn(),
    } as unknown as IAiService

    usecase = new CheckAiCompatibility(mockAiService)
  })

  it('returns available=true with version and models when AI service succeeds', async () => {
    const version = '0.1.26'
    const models = ['llama3', 'mistral']

    vi.mocked(mockAiService.getVersion).mockResolvedValue(version)
    vi.mocked(mockAiService.listModels).mockResolvedValue(models)

    const result = await usecase.execute()

    expect(mockAiService.getVersion).toHaveBeenCalledOnce()
    expect(mockAiService.listModels).toHaveBeenCalledOnce()

    expect(result).toEqual({
      available: true,
      version,
      models,
    })
  })

  it('returns available=false when getVersion throws', async () => {
    vi.mocked(mockAiService.getVersion).mockRejectedValue(
      new Error('Ollama not running'),
    )

    const result = await usecase.execute()

    expect(result).toEqual({
      available: false,
      error: 'Ollama not running',
    })
  })

  it('returns available=false when listModels throws', async () => {
    vi.mocked(mockAiService.getVersion).mockResolvedValue('0.1.26')
    vi.mocked(mockAiService.listModels).mockRejectedValue(
      new Error('Failed to list models'),
    )

    const result = await usecase.execute()

    expect(result).toEqual({
      available: false,
      error: 'Failed to list models',
    })
  })

  it('handles string errors gracefully', async () => {
    vi.mocked(mockAiService.getVersion).mockRejectedValue('Connection refused')

    const result = await usecase.execute()

    expect(result).toEqual({
      available: false,
      error: 'Connection refused',
    })
  })

  it('falls back to default message for unknown error types', async () => {
    vi.mocked(mockAiService.getVersion).mockRejectedValue({})

    const result = await usecase.execute()

    expect(result).toEqual({
      available: false,
      error: 'Ollama not available',
    })
  })
})
