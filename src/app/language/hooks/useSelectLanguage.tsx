import { useModalStore } from '@/stores/modal/useModalStore'
import { setAppLanguage } from '../actions'
import { SelectLanguageDialog } from '../components/SelectLanguageDialog'
import { Language } from '../language'
import i18n from 'i18next'

const createHandleSelect =
  (onSelect?: (language: Language) => void) => (value: Language) => {
    setAppLanguage(value.key, i18n)
    onSelect?.(value)
  }

interface UseSelectLanguageOptions {
  onSelect?: (lang: Language) => void
}

export function useSelectLanguage({ onSelect }: UseSelectLanguageOptions = {}) {
  const open = useModalStore((s) => s.open)

  const selectLanguage = () => {
    open(<SelectLanguageDialog onSelect={createHandleSelect(onSelect)} />)
  }

  return { selectLanguage }
}

export const selectLanguage = ({ onSelect }: UseSelectLanguageOptions = {}) => {
  useModalStore
    .getState()
    .open(<SelectLanguageDialog onSelect={createHandleSelect(onSelect)} />)
}
