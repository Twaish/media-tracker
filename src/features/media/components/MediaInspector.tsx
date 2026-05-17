import { ComponentProps, createContext, ReactNode, useContext } from 'react'
import { ArrowRight, SquareArrowOutUpRight, X } from 'lucide-react'
import { cn } from '@/utils/tailwind'
import { useMediaStore } from '../stores/mediaStore'
import { useMediaInspectorStore } from '../stores/mediaInspectorStore'
import { openMediaLink } from '../actions'
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
import {
  getMediaByIdQueryOptions,
  resolveExternalMediaLinkQueryOptions,
} from '../queries'
import { useRemoveMedia, useUpdateMedia } from '../mutations'

const MediaInspectorContext = createContext<{
  id: number
} | null>(null)

function useMediaInspector<T>(selector: (state: PersistedMedia) => T): T {
  const ctx = useContext(MediaInspectorContext)
  if (!ctx)
    throw new Error(
      'useMediaInspector must be used inside MediaInspectorProvider',
    )
  return useMediaStore((s) => {
    const media = s.media[ctx.id]
    if (!media) return undefined as T
    return selector(media)
  })
}

function useMediaInspectorActions() {
  const ctx = useContext(MediaInspectorContext)
  if (!ctx)
    throw new Error(
      'useMediaInspectorActions must be used inside MediaInspectorProvider',
    )
  const { mutate: remove } = useRemoveMedia()
  const { mutate: update } = useUpdateMedia()
  return {
    update(partial: Partial<PersistedMedia>) {
      update({ id: ctx.id, patch: partial })
    },
    remove() {
      remove(ctx.id)
    },
  }
}

function MediaInspectorProvider({
  children,
  id,
}: {
  children: ReactNode
  id: number
}) {
  return (
    <MediaInspectorContext.Provider value={{ id }}>
      {children}
    </MediaInspectorContext.Provider>
  )
}

export const MediaInspector = () => {
  const selectedMedia = useMediaInspectorStore((s) => s.selectedMedia)
  if (selectedMedia == null) return null

  const overlayStyles =
    'rounded-md border border-white/20 bg-black/40 backdrop-blur-md'

  // TODO: Add action buttons for editing, deleting, exporting
  return (
    <MediaInspectorProvider id={selectedMedia}>
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
    </MediaInspectorProvider>
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

MediaInspector.WatchAfter = function WatchAfter() {
  const watchAfter = useMediaInspector((s) => s.watchAfter)
  const { data } = useQuery({
    ...getMediaByIdQueryOptions(watchAfter ?? 0),
    enabled: watchAfter != null,
  })

  if (!data) return null

  return (
    <div className="flex flex-col gap-1">
      <FieldTitle>Next</FieldTitle>
      <MediaPreview mediaId={data.id}>
        <Button
          size="sm"
          variant={'outline'}
          className="mt-auto h-7 w-min px-3"
        >
          <ArrowRight className="mr-1 h-3 w-3" />
          Next
        </Button>
      </MediaPreview>
    </div>
  )
}

MediaInspector.FavoriteButton = function FavoriteButton({
  onClick,
  ...props
}: ComponentProps<typeof MediaFavoriteButton>) {
  const isFavorite = useMediaInspector((s) => s.isFavorite)
  const { update } = useMediaInspectorActions()

  const handleClick = () => {
    update({ isFavorite: !isFavorite })
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
  const thumbnail = useMediaInspector((s) => s.thumbnail)

  return <MediaThumbnail src={thumbnail} className="w-full select-none" />
}

MediaInspector.IdDisplay = function IdDisplay({
  className,
  ...props
}: ComponentProps<'div'>) {
  const id = useMediaInspector((s) => s.id)
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
  const currentEpisode = useMediaInspector((s) => s.currentEpisode)
  const maxEpisodes = useMediaInspector((s) => s.maxEpisodes)

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
  const type = useMediaInspector((s) => s.type)
  const { update } = useMediaInspectorActions()

  const handleChange = (type: PersistedMedia['type']) => {
    update({ type })
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
  const status = useMediaInspector((s) => s.status)
  const { update } = useMediaInspectorActions()

  const handleChange = (status: PersistedMedia['status']) => {
    update({ status })
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
  const title = useMediaInspector((s) => s.title)
  return (
    <div className="flex flex-col">
      <FieldTitle>Title</FieldTitle>
      <div className="line-clamp-1 text-xs opacity-80">{title}</div>
    </div>
  )
}

MediaInspector.AlternateTitles = function AlternateTitles() {
  const alternateTitles = useMediaInspector((s) => s.alternateTitles)
  if (!alternateTitles) return null

  return (
    <div className="flex flex-col">
      <FieldTitle>Alternate Titles</FieldTitle>
      <pre className="hide-scroll overflow-auto text-xs opacity-80">
        {alternateTitles}
      </pre>
    </div>
  )
}

MediaInspector.ExternalLink = function ExternalLink() {
  const id = useMediaInspector((s) => s.id)
  const externalLink = useMediaInspector((s) => s.externalLink)
  const { data: resolvedLink } = useQuery(
    resolveExternalMediaLinkQueryOptions(id),
  )
  if (!externalLink || !resolvedLink) return null

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
MediaInspector.Genres = function Genres() {
  const genres = useMediaInspector((s) => s.genres) ?? []
  const { update } = useMediaInspectorActions()

  const selectedIds = new Set(genres.map((g) => g.id))

  const toggleGenre = (genre: PersistedGenre) => {
    if (selectedIds.has(genre.id)) {
      update({ genres: genres.filter((g) => g.id !== genre.id) })
    } else {
      update({ genres: [...genres, genre] })
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
  const createdAt = useMediaInspector((s) => s.createdAt)
  const lastUpdated = useMediaInspector((s) => s.lastUpdated)

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
