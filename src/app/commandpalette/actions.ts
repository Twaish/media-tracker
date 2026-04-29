import { useModalStore } from '@/stores/modal/modalStore'
import {
  closeCommandPalette,
  openCommandPalette,
} from './hooks/useCommandPalette'

export function toggleCommandPalette() {
  if (useModalStore.getState().isOpen) {
    closeCommandPalette()
  } else {
    openCommandPalette()
  }
}
