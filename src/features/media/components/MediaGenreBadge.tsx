import { Badge } from '@/components/ui/badge'
import { cn } from '@/utils/tailwind'
import { ComponentProps } from 'react'

export function MediaGenreBadge({
  children,
  className,
  ...rest
}: ComponentProps<typeof Badge>) {
  return (
    <Badge
      variant={'outline'}
      className={cn('border-white/20 text-white backdrop-blur-xs', className)}
      {...rest}
    >
      {children}
    </Badge>
  )
}
