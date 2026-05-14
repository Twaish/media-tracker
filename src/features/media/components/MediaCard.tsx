import { ComponentProps, useState } from 'react'
import {
  ChevronUp,
  ChevronDown,
  MoreVertical,
  Trash2,
  Edit,
  ArrowRight,
  Link,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/utils/tailwind'
import { Progress, ProgressIndicator } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { PersistedMedia } from '@shared/types'
import { openMediaLink } from '../actions'
import { useMediaStore, selectMedia, selectProp } from '../stores/mediaStore'
import { MediaInfoContext, useMediaInfo } from '../contexts/useMediaInfo'
import { MediaFavoriteButton } from './MediaFavoriteButton'
import { MediaStatusSelector } from './MediaStatusSelector'
import { MediaThumbnail } from './MediaThumbnail'
import { useMediaDialog } from '../hooks/useMediaDialog'
import { MediaGenres } from './MediaGenres'

export const MediaCard = ({
  mediaId,
  className,
  ...rest
}: ComponentProps<'div'> & { mediaId: number }) => {
  const entryExists = useMediaStore((s) => !!selectMedia(mediaId)(s))

  if (!entryExists) return

  return (
    <MediaInfoContext.Provider value={{ id: mediaId }}>
      <div
        tabIndex={0}
        className={cn(
          'relative max-h-[calc(var(--spacing)*80-0.5px)] overflow-hidden transition-all duration-50',
          className,
        )}
        {...rest}
      >
        <MediaCard.Thumbnail />
        <div className="relative flex h-80 flex-col p-2">
          <div className="mb-auto flex items-start justify-between pb-3">
            <MediaCard.StatusSelector />
            <div className="flex h-6 items-center justify-center rounded-md border border-white/20 backdrop-blur-xs">
              <MediaFavoriteButton />
              <MediaCard.OptionsButton />
            </div>
          </div>
          <MediaCard.Title />
          <MediaCard.Genres />
          <MediaCard.ProgressBar />
          <div className="mb-2 flex items-center justify-between">
            <MediaCard.EpisodeDisplay />
            <MediaCard.EpisodeControls />
          </div>
          <div className="flex items-center justify-between border-t border-neutral-700/50 pt-2">
            <MediaCard.LastUpdateLabel />
            <div className="flex gap-1">
              <MediaCard.OpenButton />
              <MediaCard.NextButton />
            </div>
          </div>
        </div>
      </div>
    </MediaInfoContext.Provider>
  )
}

function EpisodeButton({
  children,
  disabled,
  ...rest
}: ComponentProps<'button'>) {
  return (
    <button
      className={cn(
        'flex h-7 w-7 items-center justify-center p-0 text-white/50 transition-colors duration-100',
        !disabled ? 'hover:text-white' : 'cursor-default',
      )}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  )
}

MediaCard.Genres = function Genres() {
  const { id } = useMediaInfo()
  const genres = useMediaStore(selectProp(id, 'genres'))

  if (genres.length === 0) return null

  const { visible: visibleGenres, remaining: remainingGenres } =
    getDisplayedGenres(genres)

  return (
    <div className="mb-3 flex flex-wrap gap-1">
      <MediaGenres genres={visibleGenres}>
        <MediaGenres.Badges className="border-white/20 text-white backdrop-blur-xs" />
        {remainingGenres > 0 && (
          <MediaGenres.Badge className="border-white/20 text-white backdrop-blur-xs">
            +{remainingGenres} more
          </MediaGenres.Badge>
        )}
      </MediaGenres>
    </div>
  )
}

MediaCard.StatusSelector = function StatusSelector() {
  const { id } = useMediaInfo()
  const status = useMediaStore(selectProp(id, 'status'))
  const updateMedia = useMediaStore((s) => s.updateMedia)

  const handleChange = (status: PersistedMedia['status']) => {
    updateMedia(id, { status })
  }

  return <MediaStatusSelector value={status} onChange={handleChange} />
}

MediaCard.ProgressBar = function ProgressBar() {
  const { id } = useMediaInfo()
  const progressPercentage = useMediaStore((s) => {
    const media = selectMedia(id)(s)
    return media.maxEpisodes && media.maxEpisodes > 0
      ? Math.min((media.currentEpisode / media.maxEpisodes) * 100, 100)
      : null
  })

  if (progressPercentage == null) return null

  return (
    <Progress className="mb-2 h-2 border border-white/20 bg-transparent backdrop-blur-xs">
      <ProgressIndicator className="bg-white" value={progressPercentage} />
    </Progress>
  )
}
MediaCard.EpisodeControls = function EpisodeControls() {
  const { id } = useMediaInfo()
  const currentEpisode = useMediaStore(selectProp(id, 'currentEpisode'))
  const maxEpisodes = useMediaStore(selectProp(id, 'maxEpisodes'))
  const updateMedia = useMediaStore((s) => s.updateMedia)

  const handleEpisodeChange = (newEpisode: number) => {
    newEpisode = newEpisode < 0 ? 0 : newEpisode
    if (maxEpisodes != null && newEpisode >= maxEpisodes) {
      newEpisode = maxEpisodes
    }
    updateMedia(id, { currentEpisode: newEpisode })
  }

  const handleEpisodeInputSubmit = (newEpisode: number) => {
    if (newEpisode === currentEpisode) return
    handleEpisodeChange(newEpisode)
  }

  return (
    <div className="flex items-center">
      <EpisodeButton
        onClick={() => handleEpisodeChange(currentEpisode - 1)}
        disabled={currentEpisode <= 0}
      >
        <ChevronDown className="h-4 w-4" />
      </EpisodeButton>

      <Input
        key={currentEpisode}
        defaultValue={currentEpisode}
        type="number"
        onBlur={(e) => handleEpisodeInputSubmit(Number(e.target.value))}
        className="h-7 w-16 rounded-md border-white/20 text-center text-sm text-white backdrop-blur-xs [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />

      <EpisodeButton
        onClick={() => handleEpisodeChange(currentEpisode + 1)}
        disabled={maxEpisodes != null ? currentEpisode >= maxEpisodes : false}
      >
        <ChevronUp className="h-4 w-4" />
      </EpisodeButton>
    </div>
  )
}
MediaCard.EpisodeDisplay = function EpisodeDisplay() {
  const { id } = useMediaInfo()
  const currentEpisode = useMediaStore(selectProp(id, 'currentEpisode'))
  const maxEpisodes = useMediaStore(selectProp(id, 'maxEpisodes'))

  return (
    <div className="rounded-md border border-white/20 px-1 py-0.5 text-xs whitespace-pre text-white backdrop-blur-xs">
      {maxEpisodes
        ? `Episode ${currentEpisode} / ${maxEpisodes}`
        : `Episode ${currentEpisode}`}
    </div>
  )
}
MediaCard.OpenButton = function OpenButton() {
  const { id } = useMediaInfo()
  const externalLink = useMediaStore(selectProp(id, 'externalLink'))
  if (!externalLink) return null

  return (
    <Button
      variant="secondary"
      onClick={() => openMediaLink(id)}
      className="h-7 border-white/20 bg-transparent px-3 text-white backdrop-blur-xs"
      title={externalLink}
    >
      <Link className="mr-1 h-3 w-3" />
      Open
    </Button>
  )
}
MediaCard.NextButton = function NextButton() {
  const { id } = useMediaInfo()
  const hasNext = useMediaStore((s) => {
    const media = selectMedia(id)(s)
    const isCompleted =
      media.maxEpisodes != null && media.currentEpisode >= media.maxEpisodes
    const hasNextEntry = media.watchAfter
    return isCompleted && hasNextEntry
  })

  if (!hasNext) return null

  return (
    <Button size="sm" className="h-7 px-3">
      <ArrowRight className="mr-1 h-3 w-3" />
      Next
    </Button>
  )
}
MediaCard.OptionsButton = function OptionsButton() {
  const { id } = useMediaInfo()
  const [hasOpened, setHasOpened] = useState(false)
  const updateMedia = useMediaStore((s) => s.updateMedia)
  const { edit } = useMediaDialog({
    onEdit: (media) => {
      if (!media.id) {
        throw new Error('Missing required Id on edit draft')
      }
      updateMedia(media.id, media)
    },
  })

  const media = useMediaStore(selectMedia(id))

  return (
    <DropdownMenu
      onOpenChange={(open) => {
        setHasOpened(open)
      }}
    >
      <DropdownMenuTrigger asChild>
        <button className="h-6 w-6 p-0 text-white/50 outline-none hover:text-white focus-visible:text-white">
          <MoreVertical className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      {hasOpened && (
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => edit(media)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  )
}
MediaCard.Thumbnail = function Thumbnail() {
  const { id } = useMediaInfo()
  const thumbnail = useMediaStore(selectProp(id, 'thumbnail'))

  return (
    <MediaThumbnail
      src={thumbnail}
      className="absolute inset-0 h-full w-full brightness-60 select-none"
    />
  )
}
MediaCard.LastUpdateLabel = function LastUpdateLabel() {
  const { id } = useMediaInfo()
  const lastUpdatedLabel = useMediaStore((s) => {
    const lastUpdated = selectProp(id, 'lastUpdated')(s)

    return lastUpdated ? formatLastUpdated(lastUpdated.toString()) : null
  })

  if (!lastUpdatedLabel) return null

  return <span className="text-xs text-neutral-400">{lastUpdatedLabel}</span>
}
MediaCard.Title = function Title() {
  const { id } = useMediaInfo()
  const title = useMediaStore(selectProp(id, 'title'))
  return (
    <div className="mt-auto mb-2 line-clamp-2 text-lg leading-tight font-semibold text-white">
      {title}
    </div>
  )
}

function formatLastUpdated(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const diffDays = Math.floor(
    (nowOnly.getTime() - dateOnly.getTime()) / (1000 * 60 * 60 * 24),
  )
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays <= 7) return `${diffDays} days ago`
  return date.toLocaleDateString()
}

function getDisplayedGenres(genres: PersistedMedia['genres']) {
  const maxVisible = 2
  return {
    visible: genres.slice(0, maxVisible),
    remaining: genres.length - maxVisible,
  }
}
