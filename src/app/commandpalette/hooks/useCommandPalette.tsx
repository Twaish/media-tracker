import { useModalStore } from '@/stores/modal/useModalStore'
import { PaletteDialog } from '../components/CommandPaletteDialog'
import { usePalette } from '../stores/paletteStore'
import { useEffect } from 'react'

export const openCommandPalette = () => {
  usePalette.getState().actions.reset()
  useModalStore.getState().open(<PaletteDialog />)
}

export const closeCommandPalette = () => {
  useModalStore.getState().close()
}

export function useCommandPalette() {
  const isOpen = usePalette((s) => s.open)

  useEffect(() => {
    if (!isOpen) {
      closeCommandPalette()
    }
  }, [isOpen])

  return { openCommandPalette, closeCommandPalette }
}
