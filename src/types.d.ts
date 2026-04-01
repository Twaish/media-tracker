import type {
  ThemeModeContext,
  WindowContext,
  MediaContext,
  GenresContext,
  TasksContext,
  AiContext,
} from '@shared/types'

declare global {
  interface Window {
    themeMode: ThemeModeContext
    electronWindow: WindowContext
    media: MediaContext
    genres: GenresContext
    tasks: TasksContext
    ai: AiContext
  }
}
