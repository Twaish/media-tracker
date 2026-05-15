import { Blocks } from 'lucide-react'
import { usePluginMenu } from '../hooks/usePluginMenu'

export function PluginMenuButton() {
  const { openPluginMenu } = usePluginMenu()

  return (
    <button
      onClick={openPluginMenu}
      className="no-drag text-muted-foreground hover:text-foreground flex h-full min-w-6 items-center justify-center transition-colors duration-200"
    >
      <Blocks className="h-3.5 w-3.5" />
    </button>
  )
}
