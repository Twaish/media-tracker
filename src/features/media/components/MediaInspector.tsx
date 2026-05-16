import { ComponentProps } from 'react'
import { ArrowRight, SquareArrowOutUpRight, X } from 'lucide-react'
import { cn } from '@/utils/tailwind'
import { MediaInfoContext, useMediaInfo } from '../contexts/useMediaInfo'
import { selectMedia, selectProp, useMediaStore } from '../stores/mediaStore'
import { useMediaInspectorStore } from '../stores/mediaInspectorStore'
import { openMediaLink, resolveExternalMediaLink } from '../actions'
import { MediaFavoriteButton } from './MediaFavoriteButton'
import { MediaStatusSelector } from './MediaStatusSelector'
import { MediaTypeSelector } from './MediaTypeSelector'
import { MediaIconButton } from './MediaIconButton'
import { MediaThumbnail } from './MediaThumbnail'
import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/react-query'
import { MediaGenreSelector } from './MediaGenreSelector'
import { MediaGenres } from './MediaGenres'
import { PersistedGenre, PersistedMedia } from '@shared/types'
import { MediaPreview } from './MediaPreview'

export const MediaInspector = () => {
  const selectedMedia = useMediaInspectorStore((s) => s.selectedMedia)
  if (selectedMedia == null) return null

  const overlayStyles =
    'rounded-md border border-white/20 bg-black/40 backdrop-blur-md'

  // TODO: Add action buttons for editing, deleting, exporting
  return (
    <MediaInfoContext.Provider value={{ id: selectedMedia }}>
      <div
        className={cn(
          'hide-scroll relative w-full max-w-70 overflow-auto border-l',
        )}
      >
        <div className="relative max-h-100 overflow-hidden">
          <MediaInspector.Thumbnail />
          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-2">
            <div className="flex items-center gap-1">
              <MediaInspector.IdDisplay className={overlayStyles} />
              <MediaInspector.StatusSelector />
            </div>
            <div className="flex items-center gap-1">
              <MediaInspector.FavoriteButton className={overlayStyles} />
              <MediaInspector.CloseButton className={overlayStyles} />
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-3">
            <div className="flex flex-wrap gap-1 pt-1">
              <MediaInspector.TypeSelector />
              <MediaInspector.EpisodeDisplay className={overlayStyles} />
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-3 py-3">
          <MediaInspector.Title />
          <MediaInspector.AlternateTitles />
          <MediaInspector.ExternalLink />
          <MediaInspector.WatchAfter />
          <MediaInspector.Genres />
          <MediaInspector.DateDisplay />
        </div>
      </div>
    </MediaInfoContext.Provider>
  )
}

function FieldTitle({ children, className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'text-muted-foreground text-[10px] tracking-widest uppercase',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}

MediaInspector.NextPreview = function NextPreview() {
  const selectedMedia = useMediaInspectorStore((s) => s.selectedMedia)!
  const nextMediaId = useMediaStore(selectProp(selectedMedia, 'watchAfter'))
  if (!nextMediaId) return null

  return (
    <MediaPreview mediaId={nextMediaId}>
      <Button size="sm" variant={'outline'} className="mt-auto h-7 w-min px-3">
        <ArrowRight className="mr-1 h-3 w-3" />
        Next
      </Button>
    </MediaPreview>
  )
}

MediaInspector.FavoriteButton = function FavoriteButton({
  onClick,
  ...props
}: ComponentProps<typeof MediaFavoriteButton>) {
  const { id } = useMediaInfo()
  const isFavorite = useMediaStore(selectProp(id, 'isFavorite'))
  const updateMedia = useMediaStore((s) => s.updateMedia)

  const handleClick = () => {
    updateMedia(id, { isFavorite: !isFavorite })
  }

  return (
    <MediaFavoriteButton
      checked={isFavorite}
      onClick={handleClick}
      {...props}
    />
  )
}

MediaInspector.Thumbnail = function Thumbnail() {
  const { id } = useMediaInfo()
  const thumbnail = useMediaStore(selectProp(id, 'thumbnail'))

  return <MediaThumbnail src={thumbnail} className="w-full select-none" />
}

MediaInspector.IdDisplay = function IdDisplay({
  className,
  ...props
}: ComponentProps<'div'>) {
  const { id } = useMediaInfo()
  return (
    <div
      className={cn(
        className,
        'max-h-6 px-1.5 py-1 font-mono text-[10px] text-white',
      )}
      {...props}
    >
      #{id}
    </div>
  )
}

MediaInspector.CloseButton = function CloseButton({
  ...props
}: ComponentProps<'button'>) {
  const inspectMedia = useMediaInspectorStore((s) => s.selectMedia)

  return (
    <MediaIconButton onClick={() => inspectMedia(null)} {...props}>
      <X className="h-4 w-4" />
    </MediaIconButton>
  )
}

MediaInspector.EpisodeDisplay = function EpisodeDisplay({
  className,
  ...props
}: ComponentProps<'div'>) {
  const { id } = useMediaInfo()
  const currentEpisode = useMediaStore(selectProp(id, 'currentEpisode'))
  const maxEpisodes = useMediaStore(selectProp(id, 'maxEpisodes'))

  return (
    <div
      className={cn(
        'flex items-center px-1.5 py-0.5 font-mono text-[10px] font-light tracking-widest text-white',
        className,
      )}
      {...props}
    >
      EP {currentEpisode}
      {maxEpisodes && ` / ${maxEpisodes}`}
    </div>
  )
}

MediaInspector.TypeSelector = function TypeSelector() {
  const { id } = useMediaInfo()
  const type = useMediaStore((s) => selectMedia(id)(s).type)
  const updateMedia = useMediaStore((s) => s.updateMedia)

  const handleChange = (type: PersistedMedia['type']) => {
    updateMedia(id, { type })
  }

  return (
    <MediaTypeSelector
      className="bg-black/40!"
      value={type}
      onChange={handleChange}
    />
  )
}

MediaInspector.StatusSelector = function StatusSelector() {
  const { id } = useMediaInfo()
  const status = useMediaStore((s) => selectMedia(id)(s).status)
  const updateMedia = useMediaStore((s) => s.updateMedia)

  const handleChange = (status: PersistedMedia['status']) => {
    updateMedia(id, { status })
  }

  return (
    <MediaStatusSelector
      className="bg-black/40!"
      value={status}
      onChange={handleChange}
    />
  )
}

MediaInspector.Title = function Title() {
  const { id } = useMediaInfo()
  const title = useMediaStore(selectProp(id, 'title'))
  return (
    <div className="flex flex-col">
      <FieldTitle>Title</FieldTitle>
      <div className="line-clamp-1 text-xs opacity-80">{title}</div>
    </div>
  )
}

MediaInspector.AlternateTitles = function AlternateTitles() {
  const { id } = useMediaInfo()
  const alternateTitles = useMediaStore(selectProp(id, 'alternateTitles'))
  if (!alternateTitles) return null

  return (
    <div className="flex flex-col">
      <FieldTitle>Alternate Titles</FieldTitle>
      <div className="line-clamp-1 text-xs opacity-80">{alternateTitles}</div>
    </div>
  )
}

MediaInspector.ExternalLink = function ExternalLink() {
  const { id } = useMediaInfo()
  const externalLink = useMediaStore(selectProp(id, 'externalLink'))
  const { data: resolvedLink, isLoading } = useQuery({
    queryKey: [id, 'resolvedLink'],
    queryFn: () => resolveExternalMediaLink(id),
  })
  if (!externalLink || isLoading) return null

  return (
    <div className="flex flex-col">
      <FieldTitle>Link</FieldTitle>
      <div className="bg-secondary/50 flex items-center gap-1 rounded-md border px-1.5 py-1 text-xs">
        <input className="w-full outline-none" value={externalLink} readOnly />
        <span title={resolvedLink ?? undefined}>
          <SquareArrowOutUpRight
            onClick={() => openMediaLink(id)}
            className="h-3 w-3 cursor-pointer opacity-70 transition-opacity duration-200 hover:opacity-100"
          />
        </span>
      </div>
    </div>
  )
}

MediaInspector.WatchAfter = function WatchAfter() {
  const { id } = useMediaInfo()
  const watchAfter = useMediaStore(selectProp(id, 'watchAfter'))
  if (watchAfter == null) return null

  return (
    <div className="flex flex-col gap-1">
      <FieldTitle>Next</FieldTitle>
      <MediaInspector.NextPreview />
    </div>
  )
}

MediaInspector.Genres = function Genres() {
  const { id } = useMediaInfo()
  const genres = useMediaStore(selectProp(id, 'genres'))
  const updateMedia = useMediaStore((s) => s.updateMedia)

  const selectedIds = new Set(genres.map((g) => g.id))

  const toggleGenre = (genre: PersistedGenre) => {
    if (selectedIds.has(genre.id)) {
      updateMedia(id, { genres: genres.filter((g) => g.id !== genre.id) })
    } else {
      updateMedia(id, { genres: [...genres, genre] })
    }
  }

  return (
    <div className="flex flex-col gap-0.5">
      <FieldTitle>Genres</FieldTitle>
      <MediaGenres genres={genres}>
        <MediaGenres.Badges />
        <MediaGenreSelector selected={selectedIds} onSelect={toggleGenre} />
      </MediaGenres>
    </div>
  )
}

MediaInspector.DateDisplay = function DateDisplay({
  className,
  ...props
}: ComponentProps<'div'>) {
  const { id } = useMediaInfo()
  const createdAt = useMediaStore(selectProp(id, 'createdAt'))
  const lastUpdated = useMediaStore(selectProp(id, 'lastUpdated'))

  return (
    <div className={cn('grid grid-cols-2 gap-3', className)} {...props}>
      <div className="flex flex-col">
        <FieldTitle>Created</FieldTitle>
        <p className="text-foreground text-sm font-medium">
          {createdAt?.toLocaleDateString()}
        </p>
        <p className="text-muted-foreground text-xs">
          {createdAt?.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>

      <div className="flex flex-col">
        <FieldTitle>Last Updated</FieldTitle>
        <p className="text-foreground text-sm font-medium">
          {lastUpdated?.toLocaleDateString()}
        </p>
        <p className="text-muted-foreground text-xs">
          {lastUpdated?.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  )
}
