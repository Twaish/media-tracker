import { closeModal, openModal } from '@/stores/modal/modalStore'
import { ReactNode } from 'react'
import { ConfirmationDialog } from './ConfirmationDialog'

type useConfirmationDialogOptions = {
  onConfirm?: () => void
  content?: ReactNode
  title?: string
  description?: string
}

export const openConfirmationDialog = ({
  content,
  ...props
}: useConfirmationDialogOptions) => {
  openModal(<ConfirmationDialog {...props}>{content}</ConfirmationDialog>)
}

export const closeConfirmationDialog = () => {
  closeModal()
}

export function useConfirmationDialog(
  props: useConfirmationDialogOptions = {},
) {
  return { confirm: () => openConfirmationDialog(props) }
}
