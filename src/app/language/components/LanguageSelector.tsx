import { Languages } from 'lucide-react'
import { useSelectLanguage } from '@/app/language/hooks/useSelectLanguage'

export function LanguageSelector() {
  const { selectLanguage } = useSelectLanguage()

  return (
    <button
      onClick={selectLanguage}
      className="no-drag text-muted-foreground hover:text-foreground flex h-full min-w-6 items-center justify-center transition-colors duration-200"
    >
      <Languages className="h-3 w-3" />
    </button>
  )
}
