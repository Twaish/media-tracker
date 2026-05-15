import { closeModal, openModal } from '@/stores/modal/modalStore'
import { PluginMenuDialog } from '../components/PluginMenuDialog'

export const openPluginMenu = () => {
  openModal(<PluginMenuDialog />)
}

export const closePluginMenu = () => {
  closeModal()
}

export function usePluginMenu() {
  return { openPluginMenu, closePluginMenu }
}
