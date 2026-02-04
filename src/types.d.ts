import type {
  ThemeModeContext,
  WindowContext,
  MediaContext,
  GenresContext,
  StorageContext,
} from '@shared/types'

declare global {
  interface Window {
    themeMode: ThemeModeContext
    electronWindow: WindowContext
    media: MediaContext
    genres: GenresContext
    storage: StorageContext
  }
}
