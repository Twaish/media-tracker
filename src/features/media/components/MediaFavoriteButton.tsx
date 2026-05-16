import { ComponentProps } from 'react'
import { Heart } from 'lucide-react'
import { cn } from '@/utils/tailwind'
import { MediaIconButton } from './MediaIconButton'

export function MediaFavoriteButton({
  checked,
  ...props
}: ComponentProps<'button'> & { checked?: boolean }) {
  return (
    <MediaIconButton {...props}>
      <Heart
        className={cn(
          'h-4 w-4 transition-colors',
          checked && 'fill-red-500 text-red-500',
        )}
      />
    </MediaIconButton>
  )
}
