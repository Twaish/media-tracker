import { useEffect, useLayoutEffect, useRef } from 'react'
import { hotkeyManager } from '../hotkeyManager'
import { Hotkey } from '../types'

export const useHotkey = (hotkey: Hotkey) => {
  const handlerRef = useRef(hotkey.handler)
  useLayoutEffect(() => {
    handlerRef.current = hotkey.handler
  })

  useEffect(() => {
    return hotkeyManager.register({
      ...hotkey,
      handler: (e) => handlerRef.current(e),
    })
  }, [])
}
