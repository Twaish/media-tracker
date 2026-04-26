import { create } from 'zustand'
import { ReactNode, useRef } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'

interface ModalState {
  isOpen: boolean
  content: ReactNode | null
  open: (content: ReactNode) => void
  close: () => void
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  content: null,
  open: (content) => set({ isOpen: true, content }),
  close: () => set({ isOpen: false }),
}))

export function ModalProvider() {
  const { isOpen, content, close } = useModalStore()

  const lastContent = useRef<ReactNode>(null)
  if (content !== null) lastContent.current = content

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      {content}
    </Dialog>
  )
}
