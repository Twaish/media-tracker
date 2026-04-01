import type { GenresContext, AiContext } from '@shared/types'

declare global {
  interface Window {
    genres: GenresContext
    ai: AiContext
  }
}
