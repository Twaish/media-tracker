import { useModalStore } from '@/stores/modal/modalStore'
import {
  closeCommandPalette,
  openCommandPalette,
} from './hooks/useCommandPalette'

export function toggleCommandPalette() {
  useModalStore.getState().isOpen ? closeCommandPalette() : openCommandPalette()
}
