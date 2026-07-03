import {
  ComponentProps,
  createContext,
  ReactNode,
  useContext,
  useState,
} from 'react'
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
import { useMediaStore } from '../stores/mediaStore'
import { MediaFavoriteButton } from './MediaFavoriteButton'
import { MediaStatusSelector } from './MediaStatusSelector'
import { MediaThumbnail } from './MediaThumbnail'
import { closeMediaDialog, useMediaDialog } from '../hooks/useMediaDialog'
import { MediaGenres } from './MediaGenres'
import { useRemoveMedia, useUpdateMedia } from '../mutations'
import { useConfirmationDialog } from '@/components/confirmation-dialog/useConfirmationDialog'
import { useMediaQueryStore } from '../stores/mediaQueryStore'

// Fetch info directly from store as MediaCard are already created using it
const MediaCardContext = createContext<{
  id: number
} | null>(null)

function useMediaCard<T>(selector: (state: PersistedMedia) => T): T {
  const ctx = useContext(MediaCardContext)
  if (!ctx)
    throw new Error('useMediaCard must be used inside MediaCardProvider')
  return useMediaStore((s) => selector(s.media[ctx.id]))
}

function useMediaCardActions() {
  const ctx = useContext(MediaCardContext)
  if (!ctx)
    throw new Error('useMediaCard must be used inside MediaCardProvider')
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

function MediaCardProvider({
  children,
  id,
}: {
  children: ReactNode
  id: number
}) {
  return (
    <MediaCardContext.Provider value={{ id }}>
      {children}
    </MediaCardContext.Provider>
  )
}

export const MediaCard = ({
  mediaId,
  className,
  ...rest
}: ComponentProps<'div'> & { mediaId: number }) => {
  const entryExists = useMediaStore((s) => !!s.media[mediaId])
  if (!entryExists) return

  return (
    <MediaCardProvider id={mediaId}>
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
              <MediaCard.FavoriteButton />
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
    </MediaCardProvider>
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
  const genres = useMediaCard((s) => s.genres)
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

MediaCard.FavoriteButton = function FavoriteButton() {
  const isFavorite = useMediaCard((s) => s.isFavorite)
  const { update } = useMediaCardActions()

  const handleClick = () => {
    update({ isFavorite: !isFavorite })
  }

  return <MediaFavoriteButton checked={isFavorite} onClick={handleClick} />
}

MediaCard.StatusSelector = function StatusSelector() {
  const status = useMediaCard((s) => s.status)
  const { update } = useMediaCardActions()

  const handleChange = (status: PersistedMedia['status']) => {
    update({ status })
  }

  return <MediaStatusSelector value={status} onChange={handleChange} />
}

MediaCard.ProgressBar = function ProgressBar() {
  const progressPercentage = useMediaCard((s) => {
    return s.maxEpisodes && s.maxEpisodes > 0
      ? Math.min((s.currentEpisode / s.maxEpisodes) * 100, 100)
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
  const currentEpisode = useMediaCard((s) => s.currentEpisode)
  const maxEpisodes = useMediaCard((s) => s.maxEpisodes)
  const { update } = useMediaCardActions()

  const handleEpisodeChange = (newEpisode: number) => {
    newEpisode = newEpisode < 0 ? 0 : newEpisode
    if (maxEpisodes != null && newEpisode >= maxEpisodes) {
      newEpisode = maxEpisodes
    }
    update({ currentEpisode: newEpisode })
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
  const currentEpisode = useMediaCard((s) => s.currentEpisode)
  const maxEpisodes = useMediaCard((s) => s.maxEpisodes)

  return (
    <div className="rounded-md border border-white/20 px-1 py-0.5 text-xs whitespace-pre text-white backdrop-blur-xs">
      {maxEpisodes
        ? `Episode ${currentEpisode} / ${maxEpisodes}`
        : `Episode ${currentEpisode}`}
    </div>
  )
}
MediaCard.OpenButton = function OpenButton() {
  const id = useMediaCard((s) => s.id)
  const externalLink = useMediaCard((s) => s.externalLink)
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
  const watchAfter = useMediaCard((s) => s.watchAfter)
  const hasNext = useMediaCard((s) => {
    const isCompleted =
      s.maxEpisodes != null && s.currentEpisode >= s.maxEpisodes
    return isCompleted && watchAfter
  })
  const setSearch = useMediaQueryStore((s) => s.setSearch)
  if (!hasNext) return null

  return (
    <Button
      size="sm"
      className="h-7 px-3"
      onClick={() => setSearch(`[id=${watchAfter}]`)}
    >
      <ArrowRight className="mr-1 h-3 w-3" />
      Next
    </Button>
  )
}
MediaCard.OptionsButton = function OptionsButton() {
  const [hasOpened, setHasOpened] = useState(false)
  const media = useMediaCard((s) => s)

  const { update, remove } = useMediaCardActions()
  const { edit } = useMediaDialog({
    onEdit: (media) => {
      update(media)
      closeMediaDialog()
    },
  })

  return (
    <DropdownMenu onOpenChange={(open) => open && setHasOpened(open)}>
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
          <DropdownMenuItem onClick={remove} asChild>
            <RemoveButton />
          </DropdownMenuItem>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  )
}
function RemoveButton() {
  const { remove } = useMediaCardActions()
  const { confirm } = useConfirmationDialog({
    onConfirm: remove,
  })
  return (
    <DropdownMenuItem variant={'destructive'} onClick={confirm}>
      <Trash2 className="mr-2 h-4 w-4" />
      Delete
    </DropdownMenuItem>
  )
}

MediaCard.Thumbnail = function Thumbnail() {
  const thumbnail = useMediaCard((s) => s.thumbnail)
  return (
    <MediaThumbnail
      src={thumbnail}
      className="absolute inset-0 h-full w-full brightness-60 select-none"
    />
  )
}
MediaCard.LastUpdateLabel = function LastUpdateLabel() {
  const lastUpdatedLabel = useMediaCard((s) => {
    return s.lastUpdated ? formatLastUpdated(s.lastUpdated.toString()) : null
  })
  if (!lastUpdatedLabel) return null
  return <span className="text-xs text-neutral-400">{lastUpdatedLabel}</span>
}
MediaCard.Title = function Title() {
  const title = useMediaCard((m) => m.title)
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
