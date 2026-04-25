import { useQueryClient } from '@tanstack/react-query'
import { useModalStore } from '@/stores/useModalStore'
import { AppTheme, ThemePreferences } from '../actions'
import { SelectThemeDialog } from '../components/SelectThemeDialog'

interface UseSelectThemeOptions {
  onSelect?: (theme: AppTheme) => void
}

export function useSelectTheme({ onSelect }: UseSelectThemeOptions = {}) {
  const queryClient = useQueryClient()

  const open = useModalStore((s) => s.open)

  const handleSelect = (value: AppTheme) => {
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
