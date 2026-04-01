import type {
  MediaContext,
  GenresContext,
  TasksContext,
  AiContext,
} from '@shared/types'

declare global {
  interface Window {
    media: MediaContext
    genres: GenresContext
    tasks: TasksContext
    ai: AiContext
  }
}
