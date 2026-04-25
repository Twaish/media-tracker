import { useTranslation } from 'react-i18next'
import { Languages } from 'lucide-react'
import { useSelectLanguage } from '@/app/language/hooks/useSelectLanguage'
import { setAppLanguage } from '@/app/language/actions'

export function LanguageSelector() {
  const { i18n } = useTranslation()

  const { selectLanguage } = useSelectLanguage({
    onSelect: (language) => setAppLanguage(language.key, i18n),
  })

  return (
    <button
      onClick={selectLanguage}
      className="no-drag text-muted-foreground hover:text-foreground flex h-full min-w-6 items-center justify-center transition-colors duration-200"
    >
      <Languages className="h-3 w-3" />
    </button>
  )
}
