import { createContext, useContext } from 'react'

type MediaInfoContextType = {
  id: number
}

export const MediaInfoContext = createContext<MediaInfoContextType | null>(null)

export function useMediaInfo() {
  const ctx = useContext(MediaInfoContext)
  if (!ctx) {
    throw new Error('useMediaInfo must be used inside MediaInfo provider')
  }
  return ctx
}
