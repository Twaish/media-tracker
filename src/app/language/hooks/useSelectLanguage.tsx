import { useModalStore } from '@/stores/modal/useModalStore'
import { setAppLanguage } from '../actions'
import { SelectLanguageDialog } from '../components/SelectLanguageDialog'
import { Language } from '../language'
import i18n from 'i18next'
import { closeModal, openModal } from '@/stores/modal/modalStore'

const createHandleSelect =
  (onSelect?: (language: Language) => void) => (value: Language) => {
    setAppLanguage(value.key, i18n)
    onSelect?.(value)
  }

interface UseSelectLanguageOptions {
  onSelect?: (lang: Language) => void
}

export const openSelectLanguage = ({
  onSelect,
}: UseSelectLanguageOptions = {}) => {
  openModal(<SelectLanguageDialog onSelect={createHandleSelect(onSelect)} />)
}

export const closeSelectLanguage = () => {
  closeModal()
}

export function useSelectLanguage(props: UseSelectLanguageOptions = {}) {
  return { selectLanguage: () => openSelectLanguage(props) }
}
