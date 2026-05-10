import { cn } from '@/utils/tailwind'
import { ComponentProps } from 'react'

export function MediaIconButton({
  className,
  children,
  ...props
}: ComponentProps<'button'>) {
  return (
    <button
      className={cn(
        'flex h-6 w-6 items-center justify-center p-0 text-white/50 outline-none hover:text-white focus-visible:text-white',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
