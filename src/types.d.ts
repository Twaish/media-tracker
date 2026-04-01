import type {
  ThemeModeContext,
  MediaContext,
  GenresContext,
  TasksContext,
  AiContext,
} from '@shared/types'

declare global {
  interface Window {
    themeMode: ThemeModeContext
    media: MediaContext
    genres: GenresContext
    tasks: TasksContext
    ai: AiContext
  }
}
