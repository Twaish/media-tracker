import { closeModal, openModal } from '@/stores/modal/modalStore'

import { setTheme, ThemePreferences } from '../actions'
import { SelectThemeDialog } from '../components/SelectThemeDialog'
import { queryClient } from '@/core/queryClient'
import { ThemeId } from '@shared/types'

const createHandleSelect =
  (onSelect?: (theme: ThemeId) => void) => (value: ThemeId) => {
    setTheme(value)
    onSelect?.(value)

    queryClient.setQueryData(['currentTheme'], (old: ThemePreferences) => ({
      ...old,
      local: value,
    }))
  }

interface UseSelectThemeOptions {
  onSelect?: (theme: ThemeId) => void
}

export const openSelectTheme = ({ onSelect }: UseSelectThemeOptions = {}) => {
  openModal(<SelectThemeDialog onSelect={createHandleSelect(onSelect)} />)
}

export const closeSelectTheme = () => {
  closeModal()
}

export function useSelectTheme(props: UseSelectThemeOptions = {}) {
  return { selectTheme: () => openSelectTheme(props) }
}
