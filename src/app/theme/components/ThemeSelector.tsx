import { Palette } from 'lucide-react'
import { useSelectTheme } from '../hooks/useSelectTheme'
import { setTheme } from '../actions'

export function ThemeSelector() {
  const { selectTheme } = useSelectTheme({
    onSelect: (theme) => setTheme(theme),
  })

  return (
    <button
      onClick={selectTheme}
      className="no-drag text-muted-foreground hover:text-foreground flex h-full min-w-6 items-center justify-center transition-colors duration-200"
    >
      <Palette className="h-3 w-3" />
    </button>
  )
}
