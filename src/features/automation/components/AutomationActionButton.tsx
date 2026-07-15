import { ComponentProps } from 'react'
import { cn } from '@/utils/tailwind'

export function AutomationActionButton({
  className,
  children,
  ...props
}: ComponentProps<'button'>) {
  return (
    <button
      className={cn(
        'text-muted-foreground hover:text-foreground hover:bg-secondary flex h-full items-center px-2 text-xs transition-colors',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
