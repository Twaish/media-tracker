import { ComponentProps } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Check } from 'lucide-react'

import { AppTheme, getCurrentTheme } from '../actions'
import {
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
  name: 'System Preference',
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

  const { system = 'dark', local } = theme ?? {}

  const currentTheme = local ?? system

  return (
    <div className="flex flex-col gap-2 p-6">
      <DialogHeader>
        <DialogTitle>Select a theme</DialogTitle>
        <DialogDescription>
          Choose a colour scheme for your workspace.
        </DialogDescription>
      </DialogHeader>
      <div className="max-h-[70vh] overflow-y-auto">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => onSelect(theme.id)}
              className={cn(
                `group bg-secondary/20 border-border relative flex flex-col overflow-hidden border text-left transition-all`,
                currentTheme === theme.id
                  ? 'border-primary'
                  : 'hover:border-primary',
              )}
            >
              {theme.id !== 'system' && <ThemePreview theme={theme} />}
              {theme.id === 'system' && (
                <div className="relative h-32 w-full overflow-hidden">
                  <div
                    className="absolute inset-0 z-50 h-[calc(100%+1px)]"
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
              )}

              <div className="bg-secondary flex items-center justify-between p-3">
                <span
                  className={`text-[10px] font-bold tracking-wider uppercase ${
                    currentTheme === theme.id
                      ? 'text-accent-foreground'
                      : 'text-secondary-foreground/70'
                  }`}
                >
                  {theme.name}
                </span>
                {currentTheme === theme.id && (
                  <Check size={14} className="text-accent-foreground" />
                )}
              </div>
            </button>
          ))}
        </div>
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
        'bg-background relative flex h-32 w-full flex-col gap-2 p-3 transition-colors',
        theme.className,
        className,
      )}
      {...rest}
    >
      {theme.id === 'system' && (
        <div className="absolute inset-0 flex">
          <div className="dark bg-background flex-1" />
          <div className="light bg-background flex-1" />
        </div>
      )}

      <div className="relative z-10 flex items-center justify-between">
        <div className="bg-accent h-2 w-16 rounded-full" />
        <div className="flex gap-1">
          <div className="bg-border h-2 w-2 rounded-full" />
          <div className="bg-border h-2 w-2 rounded-full" />
        </div>
      </div>

      <div className="relative z-10 flex flex-1 gap-2">
        <div className="border-border bg-secondary h-full w-1/4 rounded-sm border" />
        <div className="flex flex-1 flex-col gap-1.5">
          <div className="bg-primary-foreground h-2 w-3/4 rounded-sm" />
          <div className="border-border bg-accent h-8 w-full rounded-sm border" />
          <div className="mt-auto flex justify-end gap-1">
            <div className="bg-accent h-3 w-8 rounded-sm" />
          </div>
        </div>
      </div>
    </div>
  )
}
