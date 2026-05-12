import { ComponentProps } from 'react'
import { MediaThumbnail } from './MediaThumbnail'
import { selectMedia, useMediaStore } from '../stores/mediaStore'
import { cn } from '@/utils/tailwind'

export function MediaPreview({
  mediaId,
  className,
  children,
  ...props
}: { mediaId?: number | null } & ComponentProps<'div'>) {
  const nextMedia = useMediaStore((s) =>
    mediaId ? selectMedia(mediaId)(s) : null,
  )
  if (!nextMedia) return

  return (
    <div className={cn('flex gap-2', className)} {...props}>
      <MediaThumbnail
        className="h-20 w-14 rounded-md"
        src={nextMedia.thumbnail}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="line-clamp-2 text-sm leading-tight font-medium">
            {nextMedia.title}
          </div>
        </div>
        <div className="text-muted-foreground flex text-xs">
          Episode {nextMedia.currentEpisode}{' '}
          {nextMedia.maxEpisodes && `/ ${nextMedia.maxEpisodes}`}
        </div>
        {children}
      </div>
    </div>
  )
}
