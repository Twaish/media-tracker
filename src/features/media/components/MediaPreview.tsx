import { ComponentProps } from 'react'
import { MediaThumbnail } from './MediaThumbnail'
import { cn } from '@/utils/tailwind'
import { useQuery } from '@tanstack/react-query'
import { getMediaByIdQueryOptions } from '../queries'

export function MediaPreview({
  mediaId,
  className,
  children,
  ...props
}: { mediaId: number } & ComponentProps<'div'>) {
  const { data } = useQuery(getMediaByIdQueryOptions(mediaId))
  if (!data) return

  return (
    <div className={cn('flex gap-2', className)} {...props}>
      <MediaThumbnail className="h-20 w-14 rounded-md" src={data.thumbnail} />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="line-clamp-2 text-sm leading-tight font-medium">
            {data.title}
          </div>
        </div>
        <div className="text-muted-foreground flex text-xs">
          Episode {data.currentEpisode}{' '}
          {data.maxEpisodes && `/ ${data.maxEpisodes}`}
        </div>
        {children}
      </div>
    </div>
  )
}
