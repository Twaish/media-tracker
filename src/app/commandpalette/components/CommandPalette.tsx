import { Command } from 'lucide-react'
import { useCommandPalette } from '../hooks/useCommandPalette'

export function CommandPalette() {
  const { openCommandPalette } = useCommandPalette()

  return (
    <button
      onClick={openCommandPalette}
      className="no-drag text-muted-foreground hover:text-foreground flex h-full min-w-6 items-center justify-center transition-colors duration-200"
    >
      <Command className="h-3 w-3" />
    </button>
  )
}
