import type {
  ThemeModeContext,
  WindowContext,
  MediaContext,
  GenresContext,
} from '@shared/types'

declare global {
  interface Window {
    themeMode: ThemeModeContext
    electronWindow: WindowContext
    media: MediaContext
    genres: GenresContext
  }
}
