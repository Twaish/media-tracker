import { closeModal, openModal } from '@/stores/modal/modalStore'

import { AppTheme, setTheme, ThemePreferences } from '../actions'
import { SelectThemeDialog } from '../components/SelectThemeDialog'
import { queryClient } from '@/core/queryClient'

const createHandleSelect =
  (onSelect?: (theme: AppTheme) => void) => (value: AppTheme) => {
    setTheme(value)
    onSelect?.(value)

    queryClient.setQueryData(['currentTheme'], (old: ThemePreferences) => ({
      ...old,
      local: value,
    }))
  }

interface UseSelectThemeOptions {
  onSelect?: (theme: AppTheme) => void
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
