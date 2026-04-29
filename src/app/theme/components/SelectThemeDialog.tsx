import { ComponentProps, useEffect, useMemo, useRef, useState } from 'react'
import { VisuallyHidden } from 'radix-ui'
import { useQuery } from '@tanstack/react-query'
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CornerDownLeft,
} from 'lucide-react'

import { AppTheme, getCurrentTheme } from '../actions'
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog'
import { DialogSearch } from '@/components/dialog/DialogSearch'
import { DialogFooterHint } from '@/components/dialog/DialogFooterHint'
import { DialogEmptyIndicator } from '@/components/dialog/DialogEmptyIndicator'
import { Highlight } from '@/components/Highlight'
import { useHotkey } from '@/app/hotkeys/hooks/useHotkey'
import { cn } from '@/utils/tailwind'
import { SearchItem } from '@/components/SearchItem'

interface Theme {
  id: AppTheme
  name: string
  className: string
}

const systemTheme: Theme = {
  id: 'system',
  name: 'System',
  className: '',
}
const lightTheme: Theme = {
  id: 'light',
  name: 'Default Light',
  className: 'light',
}
const darkTheme: Theme = {
  id: 'dark',
  name: 'Default Dark',
  className: 'dark',
}
const redTheme: Theme = {
  id: 'red',
  name: 'Red',
  className: 'red',
}

const themes: Theme[] = [systemTheme, lightTheme, darkTheme, redTheme]

export function SelectThemeDialog({
  onSelect,
}: {
  onSelect: (v: AppTheme) => void
}) {
  const { data: theme } = useQuery({
    queryKey: ['currentTheme'],
    queryFn: getCurrentTheme,
  })

  const [query, setQuery] = useState('')
  const [focusedIndex, setFocusedIndex] = useState(0)

  const { system = 'dark', local } = theme ?? {}
  const currentTheme = local ?? system

  const COLS = 2

  const filtered = useMemo(
    () =>
      themes.filter((t) => t.name.toLowerCase().includes(query.toLowerCase())),
    [query],
  )

  const focusedClamped = Math.min(focusedIndex, filtered.length - 1)

  useEffect(() => setFocusedIndex(0), [query])

  useHotkey({
    keys: 'ArrowRight',
    handler(e) {
      e.preventDefault()
      if (filtered.length)
        setFocusedIndex((focusedClamped + 1) % filtered.length)
    },
  })

  useHotkey({
    keys: 'ArrowLeft',
    handler(e) {
      e.preventDefault()
      if (filtered.length)
        setFocusedIndex(
          (focusedClamped - 1 + filtered.length) % filtered.length,
        )
    },
  })

  useHotkey({
    keys: 'ArrowDown',
    handler(e) {
      e.preventDefault()
      const next = focusedClamped + COLS
      if (next < filtered.length) setFocusedIndex(next)
    },
  })

  useHotkey({
    keys: 'ArrowUp',
    handler(e) {
      e.preventDefault()
      const prev = focusedClamped - COLS
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
      <VisuallyHidden.Root asChild>
        <DialogTitle>Select Theme</DialogTitle>
      </VisuallyHidden.Root>
      <VisuallyHidden.Root asChild>
        <DialogDescription>
          Choose a colour scheme for your workspace
        </DialogDescription>
      </VisuallyHidden.Root>
      <DialogSearch
        placeholder="Search themes..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="overflow-y-auto p-3">
        {filtered.length === 0 ? (
          <DialogEmptyIndicator>No results for this query</DialogEmptyIndicator>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {filtered.map((t, index) => (
              <ThemeButton
                key={t.id}
                theme={t}
                query={query}
                isActive={currentTheme === t.id}
                isFocused={index === focusedClamped}
                onClick={() => onSelect(t.id)}
                onMouseEnter={() => setFocusedIndex(index)}
              />
            ))}
          </div>
        )}
      </div>

      <DialogFooter>
        <DialogFooterHint text="navigate">
          <ChevronLeft />
          <ChevronRight />
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

function ThemeButton({
  theme,
  isFocused,
  isActive,
  query,
  className,
  ...rest
}: ComponentProps<'div'> & {
  theme: Theme
  query: string
  isActive: boolean
  isFocused: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isFocused) {
      ref.current?.scrollIntoView({ block: 'nearest' })
    }
  }, [isFocused])

  return (
    <div
      ref={ref}
      className={cn(
        'border-border relative flex flex-col overflow-hidden border text-left transition-colors outline-none',
        isFocused ? 'border-primary' : 'border-border',
        className,
      )}
      {...rest}
    >
      {theme.id === 'system' ? (
        <SystemThemePreview />
      ) : (
        <ThemePreview theme={theme} />
      )}
      <div className="bg-secondary flex h-8 items-center justify-between px-2">
        <span
          className={cn(
            'text-[10px] font-bold tracking-wider uppercase',
            isFocused || isActive
              ? 'text-accent-foreground'
              : 'text-secondary-foreground/70',
          )}
        >
          <Highlight text={theme.name} term={query} />
        </span>
        {isActive && <Check size={12} className="text-accent-foreground" />}
      </div>
    </div>
  )
}

function ThemePreview({
  theme,
  className,
  ...rest
}: ComponentProps<'div'> & { theme: Theme }) {
  return (
    <div
      className={cn(
        'bg-background relative flex h-32 w-full flex-col gap-1.5 p-2',
        theme.className,
        className,
      )}
      {...rest}
    >
      <div className="flex h-2 items-center justify-between">
        <div className="bg-accent h-2 w-12" />
        <div className="flex gap-1">
          <div className="bg-border h-2 w-2" />
          <div className="bg-border h-2 w-2" />
        </div>
      </div>

      <div className="flex flex-1 gap-1.5">
        <div className="bg-secondary border-border w-8 border" />
        <div className="flex flex-1 flex-col gap-1">
          <div className="bg-primary-foreground h-1.5 w-[75%]" />
          <div className="bg-accent border-border flex-1 border" />
          <div className="flex justify-end">
            <div className="bg-accent h-2 w-6" />
          </div>
        </div>
      </div>
    </div>
  )
}

function SystemThemePreview() {
  return (
    <div className="relative h-32 w-full overflow-hidden">
      <div
        className="absolute inset-0 z-50 h-full"
        style={{
          clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0% 100%)',
        }}
      >
        <ThemePreview theme={darkTheme} className="h-full w-full" />
      </div>
      <ThemePreview
        theme={lightTheme}
        className="absolute inset-0 h-full w-full"
      />
    </div>
  )
}
