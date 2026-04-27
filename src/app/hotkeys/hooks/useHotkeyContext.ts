import { useEffect } from 'react'
import { hotkeyManager } from '../hotkeyManager'

export const useHotkeyContext = (context: string) => {
  useEffect(() => {
    hotkeyManager.pushContext(context)
    return () => hotkeyManager.popContext(context)
  }, [context])
}
