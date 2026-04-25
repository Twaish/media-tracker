import { useModalStore } from '@/stores/useModalStore'
import { useTranslation } from 'react-i18next'
import { setAppLanguage } from '../actions'
import { SelectLanguageDialog } from '../components/SelectLanguageDialog'
import { Language } from '../language'

interface UseSelectLanguageOptions {
  onSelect?: (lang: Language) => void
}

export function useSelectLanguage({ onSelect }: UseSelectLanguageOptions = {}) {
  const open = useModalStore((s) => s.open)
  const { i18n } = useTranslation()

  const handleSelect = (value: Language) => {
    setAppLanguage(value.key, i18n)
    onSelect?.(value)
  }

  const selectLanguage = () => {
    open(<SelectLanguageDialog onSelect={handleSelect} />)
  }

  return { selectLanguage }
}
