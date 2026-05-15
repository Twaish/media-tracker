import { ComponentProps, ReactNode, useEffect, useMemo, useState } from 'react'
import { VisuallyHidden } from 'radix-ui'
import { useQuery } from '@tanstack/react-query'
import { Check, ChevronDown, ChevronUp, CornerDownLeft } from 'lucide-react'

import {
  getCurrentTheme,
  getSystemTheme,
  getThemes,
  getThemeStyleObject,
  isDefaultTheme,
  Theme,
} from '../actions'
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog'
import { DialogSearch } from '@/components/dialog/DialogSearch'
import { DialogFooterHint } from '@/components/dialog/DialogFooterHint'
import { DialogEmptyIndicator } from '@/components/dialog/DialogEmptyIndicator'
import { useHotkey } from '@/app/hotkeys/hooks/useHotkey'
import { SearchItem } from '@/components/SearchItem'
import { defaultThemes } from '../data/defaultThemes'
import { ThemeId, ThemeMode } from '@shared/types'
import { cn } from '@/utils/tailwind'

export function SelectThemeDialog({
  onSelect,
}: {
  onSelect: (v: ThemeId) => void
}) {
  const { data: theme, isLoading: currentThemeLoading } = useQuery({
    queryKey: ['currentTheme'],
    queryFn: getCurrentTheme,
  })
  const { data: themes = [], isLoading: themesLoading } = useQuery({
    queryKey: ['themeOptions'],
    queryFn: getThemes,
  })

  const [query, setQuery] = useState('')
  const [focusedIndex, setFocusedIndex] = useState(0)

  const { system = 'dark', local } = theme ?? {}
  const currentTheme = local ?? system

  const filtered = useMemo(
    () =>
      [...defaultThemes, ...themes].filter((t) =>
        t.name.toLowerCase().includes(query.toLowerCase()),
      ),
    [query, themes],
  )

  const focusedClamped = Math.min(focusedIndex, filtered.length - 1)

  useEffect(() => setFocusedIndex(0), [query])

  useHotkey({
    keys: 'ArrowDown',
    handler(e) {
      e.preventDefault()
      const next = focusedClamped + 1
      if (next < filtered.length) setFocusedIndex(next)
    },
  })

  useHotkey({
    keys: 'ArrowUp',
    handler(e) {
      e.preventDefault()
      const prev = focusedClamped - 1
      if (prev >= 0) setFocusedIndex(prev)
    },
  })

  useHotkey({
    keys: 'Enter',
    handler(e) {
      e.preventDefault()
      const t = filtered[focusedClamped]
      if (t) onSelect(t.id)
    },
  })

  return (
    <DialogContent
      showCloseButton={false}
      className="z-99 flex max-h-[70vh] flex-col gap-0 overflow-hidden rounded-none p-0"
    >
      <VisuallyHidden.Root>
        <DialogTitle>Select Theme</DialogTitle>
        <DialogDescription>
          Choose a colour scheme for your workspace
        </DialogDescription>
      </VisuallyHidden.Root>
      <DialogSearch
        placeholder="Search themes..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {!currentThemeLoading && !themesLoading && (
        <div className="overflow-y-auto">
          {filtered.length === 0 ? (
            <DialogEmptyIndicator>
              No results for this query
            </DialogEmptyIndicator>
          ) : (
            filtered.map((theme, index) => (
              <ThemeItem
                key={theme.id}
                isFocused={index === focusedClamped}
                query={query}
                theme={theme}
                onClick={() => onSelect(theme.id)}
                onMouseEnter={() => setFocusedIndex(index)}
              >
                {currentTheme === theme.id && (
                  <Check size={12} className="text-accent-foreground" />
                )}
              </ThemeItem>
            ))
          )}
        </div>
      )}

      <DialogFooter>
        <DialogFooterHint text="navigate">
          <ChevronUp />
          <ChevronDown />
        </DialogFooterHint>
        <DialogFooterHint text="select">
          <CornerDownLeft />
        </DialogFooterHint>
        <DialogFooterHint text="close">Esc</DialogFooterHint>
        <div className="flex-1" />
        <span className="text-muted-foreground text-[10px] tracking-widest">
          {filtered.length} result{filtered.length !== 1 ? 's' : ''}
        </span>
      </DialogFooter>
    </DialogContent>
  )
}

function ThemeItem({
  children,
  theme,
  ...rest
}: ComponentProps<typeof SearchItem> & { children: ReactNode; theme: Theme }) {
  const [style, setStyle] = useState<React.CSSProperties>({})
  const [systemTheme, setSystemTheme] = useState<ThemeMode>()
  const isDefault = isDefaultTheme(theme.id)

  useEffect(() => {
    if (!isDefault) {
      getThemeStyleObject(theme.id).then(setStyle)
    } else if (theme.id === 'system') {
      getSystemTheme().then(setSystemTheme)
    }
  }, [theme.id])

  return (
    <SearchItem {...rest}>
      <SearchItem.Icon className="h-8 w-8">
        {theme.icon ? <img src={`themeicon://${theme.id}`} /> : ':)'}
      </SearchItem.Icon>
      <SearchItem.Content>
        <SearchItem.Title text={theme.name} />
        <SearchItem.Description text={theme.id} />
      </SearchItem.Content>
      <div
        className={cn(
          'ml-auto flex items-center gap-1',
          isDefault && (theme.id === 'system' ? systemTheme : theme.className),
        )}
        style={style}
      >
        <div className="bg-primary h-3 w-3" />
        <div className="bg-secondary h-3 w-3" />
        <div className="bg-accent h-3 w-3" />
        <div className="bg-muted h-3 w-3" />
        <div className="bg-destructive h-3 w-3" />
        <div className="bg-sidebar h-3 w-3" />
        <div className="bg-sidebar-primary h-3 w-3" />
        <div className="bg-sidebar-accent h-3 w-3" />
      </div>
      {children}
    </SearchItem>
  )
}
