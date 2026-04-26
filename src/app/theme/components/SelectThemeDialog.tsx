import { ComponentProps, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Check, Search, X } from 'lucide-react'

import { AppTheme, getCurrentTheme } from '../actions'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/utils/tailwind'

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

  const filtered = useMemo(
    () =>
      themes.filter((t) => t.name.toLowerCase().includes(query.toLowerCase())),
    [query],
  )

  const { system = 'dark', local } = theme ?? {}
  const currentTheme = local ?? system

  return (
    <DialogContent className="flex flex-col gap-0 rounded-none p-0">
      <div className="p-3">
        <DialogHeader>
          <DialogTitle className="mb-1 font-mono text-xs leading-none font-bold tracking-[0.08em] uppercase">
            Select Theme
          </DialogTitle>
          <DialogDescription className="font-mono text-xs leading-[1.4]">
            Choose a colour scheme for your workspace.
          </DialogDescription>
        </DialogHeader>
      </div>

      <div className="px-2 py-2">
        <div
          className={cn(
            'border-border bg-background flex h-8 items-center gap-1.5 border pl-2',
            query ? 'pr-1' : 'pr-2',
          )}
        >
          <Search
            size={13}
            className="text-muted-foreground shrink-0"
            strokeWidth={1.75}
          />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search themes..."
            spellCheck={false}
            className="flex-1 bg-transparent text-xs outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-muted-foreground hover:text-foreground flex h-6 w-6 items-center justify-center"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      <div className="border-border mx-2 border-t" />

      <div className="max-h-72 overflow-y-auto p-2">
        {filtered.length === 0 ? (
          <div className="text-muted-foreground py-6 text-center text-xs">
            No themes match &ldquo;{query}&rdquo;
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {filtered.map((t) => {
              const isActive = currentTheme === t.id

              return (
                <button
                  key={t.id}
                  onClick={() => onSelect(t.id)}
                  className={cn(
                    'group border-border relative flex flex-col overflow-hidden border text-left transition-colors outline-none',
                    isActive
                      ? 'border-primary'
                      : 'hover:border-primary focus-visible:border-primary',
                  )}
                >
                  {t.id === 'system' ? (
                    <SystemThemePreview />
                  ) : (
                    <ThemePreview theme={t} />
                  )}

                  <div className="bg-secondary flex h-8 items-center justify-between px-2">
                    <span
                      className={`text-[10px] font-bold tracking-wider uppercase ${
                        isActive
                          ? 'text-accent-foreground'
                          : 'text-secondary-foreground/70'
                      }`}
                    >
                      {t.name}
                    </span>

                    {isActive && (
                      <Check size={12} className="text-accent-foreground" />
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      <div className="border-border border-t" />
      <div className="text-muted-foreground px-4 py-1.5 font-mono text-[11px] tracking-[0.04em]">
        {filtered.length} / {themes.length} themes
      </div>
    </DialogContent>
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
