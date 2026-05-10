import { Heart } from 'lucide-react'
import { selectMedia, useMediaStore } from '../stores/mediaStore'
import { useMediaInfo } from '../contexts/useMediaInfo'
import { cn } from '@/utils/tailwind'
import { ComponentProps, MouseEvent } from 'react'
import { MediaIconButton } from './MediaIconButton'

export function MediaFavoriteButton({
  onClick,
  ...props
}: ComponentProps<'button'>) {
  const { id } = useMediaInfo()
  const isFavorite = useMediaStore((s) => selectMedia(id)(s).isFavorite)
  const updateMedia = useMediaStore((s) => s.updateMedia)

  const handleFavoriteToggle = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) => {
    updateMedia(id, { isFavorite: !isFavorite })
    onClick?.(e)
  }

  return (
    <MediaIconButton onClick={handleFavoriteToggle} {...props}>
      <Heart
        className={cn(
          'h-4 w-4 transition-colors',
          isFavorite && 'fill-red-500 text-red-500',
        )}
      />
    </MediaIconButton>
  )
}
