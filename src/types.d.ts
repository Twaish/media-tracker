import type {
  ThemeModeContext,
  ElectronWindow,
  MediaContext,
  GenresContext,
  NotesContext,
} from '@shared/types'

declare global {
  interface Window {
    themeMode: ThemeModeContext
    electronWindow: ElectronWindow
    media: MediaContext
    genres: GenresContext
    notes: NotesContext
  }
}
