import type {
  ThemeModeContext,
  WindowContext,
  MediaContext,
  GenresContext,
  NotesContext,
} from '@shared/types'

declare global {
  interface Window {
    themeMode: ThemeModeContext
    electronWindow: WindowContext
    media: MediaContext
    genres: GenresContext
    notes: NotesContext
  }
}
