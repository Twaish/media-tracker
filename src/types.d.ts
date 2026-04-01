import type { MediaContext, GenresContext, AiContext } from '@shared/types'

declare global {
  interface Window {
    media: MediaContext
    genres: GenresContext
    ai: AiContext
  }
}
