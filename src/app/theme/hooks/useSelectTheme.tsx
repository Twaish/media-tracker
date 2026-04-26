import { queryClient } from '@/App'
import { useModalStore } from '@/stores/modal/useModalStore'
import { openModal } from '@/stores/modal/modalStore'

import { AppTheme, setTheme, ThemePreferences } from '../actions'
import { SelectThemeDialog } from '../components/SelectThemeDialog'

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

export function useSelectTheme({ onSelect }: UseSelectThemeOptions = {}) {
  const open = useModalStore((s) => s.open)

  const selectTheme = () => {
    open(<SelectThemeDialog onSelect={createHandleSelect(onSelect)} />)
  }

  return { selectTheme }
}

export const selectTheme = ({ onSelect }: UseSelectThemeOptions = {}) => {
  openModal(<SelectThemeDialog onSelect={createHandleSelect(onSelect)} />)
}
