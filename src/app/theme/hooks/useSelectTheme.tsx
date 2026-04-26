import { openModal, useModalStore } from '@/stores/useModalStore'
import { AppTheme, setTheme, ThemePreferences } from '../actions'
import { SelectThemeDialog } from '../components/SelectThemeDialog'
import { queryClient } from '@/App'

interface UseSelectThemeOptions {
  onSelect?: (theme: AppTheme) => void
}

export function useSelectTheme({ onSelect }: UseSelectThemeOptions = {}) {
  const open = useModalStore((s) => s.open)

  const handleSelect = (value: AppTheme) => {
    setTheme(value)
    onSelect?.(value)

    queryClient.setQueryData(['currentTheme'], (old: ThemePreferences) => ({
      ...old,
      local: value,
    }))
  }

  const selectTheme = () => {
    open(<SelectThemeDialog onSelect={handleSelect} />)
  }

  return { selectTheme }
}
