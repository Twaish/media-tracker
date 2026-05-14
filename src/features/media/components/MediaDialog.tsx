import { StoreApi, UseBoundStore } from 'zustand'
import { Search, X } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { VisuallyHidden } from 'radix-ui'
import {
  ComponentProps,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/utils/tailwind'
import { MediaStatusSelector } from './MediaStatusSelector'
import { MediaGenres } from './MediaGenres'
import { MediaPreview } from './MediaPreview'
import { MediaTypeSelector } from './MediaTypeSelector'
import { MediaGenreSelector } from './MediaGenreSelector'
import { PersistedGenre, PersistedMedia } from '@shared/types'
import { searchMedia } from '../actions'
import { closeMediaDialog } from '../hooks/useMediaDialog'

type Store = UseBoundStore<
  StoreApi<{
    isDirty: boolean
    draft: Partial<PersistedMedia>
    updateMedia(patch: Partial<PersistedMedia>): void
    reset: () => void
  }>
>

type MediaDialogContextType = {
  mediaId?: number | null
  store: Store
  onEdit?: (media: Partial<PersistedMedia>) => void
  onAdd?: (media: Partial<PersistedMedia>) => void
}

const MediaDialogContext = createContext<MediaDialogContextType | null>(null)

function useMediaDialog() {
  const ctx = useContext(MediaDialogContext)
  if (!ctx) {
    throw new Error('useMediaDialog must be used within MediaDialog')
  }
  return ctx
}

export function MediaDialog({
  onEdit,
  onAdd,
  store,
  mediaId,
  className,
  ...props
}: MediaDialogContextType & ComponentProps<'div'>) {
  return (
    <MediaDialogContext.Provider value={{ mediaId, store, onEdit, onAdd }}>
      <DialogContent
        className={cn('max-h-[70vh] gap-0 overflow-auto p-0', className)}
        {...props}
      >
        <VisuallyHidden.Root>
          <DialogTitle>Media dialog</DialogTitle>
        </VisuallyHidden.Root>
        <VisuallyHidden.Root>
          <DialogDescription>Add or edit media</DialogDescription>
        </VisuallyHidden.Root>
        <div className="flex h-full w-full flex-col gap-3 overflow-auto p-4">
          <div className="flex gap-4">
            <MediaDialog.ThumbnailInput />
            <div className="flex w-full flex-col gap-3">
              <MediaDialog.TitleInput />
              <div className="flex w-full gap-2">
                <MediaDialog.TypeInput />
                <MediaDialog.StatusInput />
              </div>
              <MediaDialog.EpisodeInput />
              <MediaDialog.WatchAfterInput />
            </div>
          </div>
          <MediaDialog.AlternateTitlesInput />
          <MediaDialog.ExternalLinkInput />
          <div className="flex flex-col gap-1">
            <FieldTitle>Genres</FieldTitle>
            <div className="flex flex-wrap gap-1">
              <MediaDialog.Genres />
              <MediaDialog.GenresInput />
            </div>
          </div>
        </div>
        <MediaDialog.Footer />
      </DialogContent>
    </MediaDialogContext.Provider>
  )
}

MediaDialog.TitleInput = function TitleInput() {
  const { store } = useMediaDialog()
  const updateMedia = store((s) => s.updateMedia)
  const title = store((s) => s.draft.title) ?? ''

  const handleChange = (title: string) => {
    updateMedia({ title })
  }

  return (
    <div className="flex w-full flex-col gap-1">
      <FieldTitle>Title*</FieldTitle>
      <Input
        onChange={(e) => handleChange(e.target.value)}
        value={title}
        placeholder="One Piece (TV)"
      />
    </div>
  )
}

MediaDialog.TypeInput = function TypeInput() {
  const { store } = useMediaDialog()
  const type = store((s) => s.draft.type) ?? 'anime'
  const updateMedia = store((s) => s.updateMedia)

  const handleChange = (type: PersistedMedia['type']) => {
    updateMedia({ type })
  }

  return (
    <div className="flex w-full flex-col gap-1">
      <FieldTitle>Type</FieldTitle>
      <MediaTypeSelector
        className="border-border px-2 py-3.5"
        value={type}
        onChange={handleChange}
      />
    </div>
  )
}

MediaDialog.StatusInput = function StatusInput() {
  const { store } = useMediaDialog()
  const status = store((s) => s.draft.status) ?? 'plan-to-watch'
  const updateMedia = store((s) => s.updateMedia)

  const handleChange = (status: PersistedMedia['status']) => {
    updateMedia({ status })
  }

  return (
    <div className="flex w-full flex-col gap-1">
      <FieldTitle>Status</FieldTitle>
      <MediaStatusSelector
        className="border-border px-2 py-3.5"
        value={status}
        onChange={handleChange}
      />
    </div>
  )
}

MediaDialog.AlternateTitlesInput = function AlternateTitles() {
  const { store } = useMediaDialog()
  const alternateTitles = store((s) => s.draft.alternateTitles) ?? ''
  const updateMedia = store((s) => s.updateMedia)

  const handleChange = (alternateTitles: string) => {
    updateMedia({
      alternateTitles:
        alternateTitles.trim() === '' ? undefined : alternateTitles,
    })
  }

  return (
    <div className="flex w-full flex-1 flex-col gap-1">
      <FieldTitle>Alternate Titles</FieldTitle>
      <Textarea
        className="flex-1 resize-none!"
        value={alternateTitles}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Alternate titles"
      />
    </div>
  )
}

MediaDialog.EpisodeInput = function EpisodeInput() {
  const { store } = useMediaDialog()
  const currentEpisode = store((s) => s.draft.currentEpisode)
  const maxEpisodes = store((s) => s.draft.maxEpisodes) ?? undefined
  const updateMedia = store((s) => s.updateMedia)

  const handleCurrentChange = (currentEpisode: number) => {
    updateMedia({ currentEpisode })
  }

  const handleMaxChange = (maxEpisodes: string) => {
    updateMedia({
      maxEpisodes: maxEpisodes === '' ? undefined : Number(maxEpisodes),
    })
  }

  return (
    <div className="flex gap-2">
      <div className="flex flex-col gap-1">
        <FieldTitle>Episode*</FieldTitle>
        <Input
          value={currentEpisode}
          type="number"
          min={0}
          step={1}
          onChange={(e) => handleCurrentChange(Number(e.target.value))}
          placeholder="Current"
        />
      </div>
      <div className="flex flex-col gap-1">
        <FieldTitle>Max Episodes</FieldTitle>
        <Input
          value={maxEpisodes}
          type="number"
          min={0}
          step={1}
          onChange={(e) => handleMaxChange(e.target.value)}
          placeholder="Unknown"
        />
      </div>
    </div>
  )
}

MediaDialog.ExternalLinkInput = function ExternalLinkInput() {
  const { store } = useMediaDialog()
  const externalLink = store((s) => s.draft.externalLink) ?? ''
  const updateMedia = store((s) => s.updateMedia)

  const handleChange = (externalLink: string) => {
    updateMedia({
      externalLink: externalLink === '' ? undefined : externalLink,
    })
  }

  return (
    <div className="flex flex-col gap-1">
      <FieldTitle>External Link</FieldTitle>
      <Input
        value={externalLink}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="e.g. https://anime.com/one-piece/{{episode}}"
      />
    </div>
  )
}

type _PersistedMedia = Omit<PersistedMedia, 'isFavorite'> & {
  isFavorite?: boolean
}

MediaDialog.WatchAfterInput = function WatchAfterInput() {
  const { mediaId, store } = useMediaDialog()

  const defaultId = store((s) => s.draft.watchAfter) ?? null
  const updateMedia = store((s) => s.updateMedia)

  const exclude = mediaId ? [mediaId] : undefined

  const handleSelect = (id: number | null) => {
    updateMedia({ watchAfter: id })
  }

  const handleRemove = () => {
    updateMedia({ watchAfter: null })
  }

  const picker = (
    <MediaSelectionPopover
      exclude={exclude}
      onSelect={(media) => handleSelect(media.id)}
    >
      <Button>Change</Button>
    </MediaSelectionPopover>
  )

  return defaultId ? (
    <MediaPreview mediaId={defaultId} className="w-full">
      <div className="mt-auto flex gap-1">
        {picker}
        <Button variant="secondary" onClick={handleRemove}>
          Remove
        </Button>
      </div>
    </MediaPreview>
  ) : (
    picker
  )
}

function MediaSelectionPopover({
  onSelect,
  exclude = [],
  children,
  ...props
}: { onSelect?: (media: _PersistedMedia) => void; exclude?: number[] } & Omit<
  ComponentProps<typeof PopoverTrigger>,
  'onSelect'
>) {
  const [open, setOpen] = useState(false)

  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(query)
    }, 250)

    return () => clearTimeout(timeout)
  }, [query])

  const { data: results = { data: [] }, isLoading } = useQuery({
    queryKey: ['media-search', debouncedQuery],
    queryFn: () => searchMedia(debouncedQuery),
    enabled: open,
  })

  const filtered = results.data.filter((m) => !exclude.includes(m.id))

  const handleSelect = (media: _PersistedMedia) => {
    onSelect?.(media)
    setOpen(false)
    setQuery('')
  }

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild {...props}>
        {children}
      </PopoverTrigger>
      {open && (
        <PopoverContent
          side={'top'}
          className="hide-scroll flex max-h-70 flex-col gap-0 p-0"
        >
          <div className="flex items-center gap-2 border-b px-3 py-2">
            <Search className="h-3 w-3" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search media..."
              className="w-full flex-1 text-sm outline-none"
            />
            {query && (
              <button onClick={() => setQuery('')}>
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
          <div
            onWheel={(e) => e.stopPropagation()}
            className="hide-scroll flex h-full max-h-70 flex-1 flex-col overflow-y-auto"
          >
            {isLoading && (
              <div className="text-muted-foreground w-full py-3 text-center text-sm">
                Searching...
              </div>
            )}
            {!isLoading && filtered.length === 0 && (
              <div className="text-muted-foreground w-full py-3 text-center text-sm">
                No media found
              </div>
            )}
            {filtered.map((media) => (
              <button
                key={media.id}
                className="hover:bg-muted/50 flex px-2 py-2"
              >
                <MediaPreview
                  onClick={() => handleSelect(media)}
                  mediaId={media.id}
                />
              </button>
            ))}
          </div>
        </PopoverContent>
      )}
    </Popover>
  )
}

MediaDialog.Genres = function Genres() {
  const { store } = useMediaDialog()
  const genres = store((s) => s.draft.genres) ?? []

  if (!genres.length) return null

  return (
    <MediaGenres genres={genres}>
      <MediaGenres.Badges />
    </MediaGenres>
  )
}
MediaDialog.GenresInput = function GenresInput() {
  const { store } = useMediaDialog()
  const genres = store((s) => s.draft.genres) ?? []
  const updateMedia = store((s) => s.updateMedia)
  const selectedIds = useMemo(() => new Set(genres.map((g) => g.id)), [genres])

  const toggleGenre = (genre: PersistedGenre) => {
    const isSelected = selectedIds.has(genre.id)
    const nextGenres = isSelected
      ? genres.filter((g) => g.id !== genre.id)
      : [...genres, genre]

    updateMedia({ genres: nextGenres })
  }

  return <MediaGenreSelector selected={selectedIds} onSelect={toggleGenre} />
}

MediaDialog.ThumbnailInput = function ThumbnailInput() {
  const { store } = useMediaDialog()
  const thumbnail = store((s) => s.draft.thumbnail)
  const [localPreview, setLocalPreview] = useState<string | null>(null)

  const preview = localPreview
    ? localPreview
    : thumbnail
      ? `images://${thumbnail}`
      : null

  const updateMedia = store((s) => s.updateMedia)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return

    if (localPreview) {
      URL.revokeObjectURL(localPreview)
    }

    const url = URL.createObjectURL(file)
    setLocalPreview(url)
    updateMedia({ thumbnail: url })
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    handleFile(file)
  }

  const onPaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData.items

    for (const item of items) {
      if (!item.type.startsWith('image/')) continue

      const file = item.getAsFile()
      if (file) handleFile(file)
      break
    }
  }

  const handleRemove = () => {
    if (localPreview) {
      URL.revokeObjectURL(localPreview)
    }
    setLocalPreview(null)
    updateMedia({ thumbnail: undefined })
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  useEffect(() => {
    if (!thumbnail?.startsWith('blob:')) {
      setLocalPreview(null)
      return
    }

    const img = new Image()

    img.onload = () => {
      setLocalPreview(thumbnail)
    }
    img.onerror = () => {
      setLocalPreview(null)
      updateMedia({ thumbnail: undefined })
    }

    img.src = thumbnail
  }, [thumbnail])

  return (
    <div
      tabIndex={0}
      onPaste={onPaste}
      className="group focus:ring-ring relative flex aspect-5/7 w-48 min-w-48 items-center justify-center overflow-hidden rounded-md border border-dashed outline-none focus:ring-2"
    >
      {preview ? (
        <img src={preview} className="h-full w-full object-cover" />
      ) : (
        <div className="flex flex-col items-center gap-2 px-4 text-center">
          <span className="text-muted-foreground text-xs leading-relaxed">
            Paste a thumbnail or{' '}
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="text-foreground font-medium underline underline-offset-2 hover:opacity-70"
            >
              browse
            </button>
          </span>
        </div>
      )}
      {preview && (
        <Button
          variant={'secondary'}
          className="absolute top-0 right-0 m-1 h-5 w-5 p-0 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={handleRemove}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileChange}
      />
    </div>
  )
}

MediaDialog.Footer = function Footer() {
  const { mediaId, store, onEdit, onAdd } = useMediaDialog()
  const isEditing = mediaId != null

  const isDirty = store((s) => s.isDirty) ?? false
  const reset = store((s) => s.reset)

  const save = () => {
    onEdit?.(store.getState().draft)
    closeMediaDialog()
  }
  const add = () => {
    onAdd?.(store.getState().draft)
    closeMediaDialog()
  }

  return (
    <DialogFooter className="max-h-10 px-2">
      <div className="ml-auto flex h-full items-center gap-2">
        {isEditing && isDirty && (
          <>
            <button
              onClick={reset}
              className="text-muted-foreground hover:text-secondary-foreground h-full text-xs"
            >
              reset
            </button>
            <Button onClick={save}>Save</Button>
          </>
        )}
        {!isEditing && <Button onClick={add}>Add</Button>}
      </div>
    </DialogFooter>
  )
}

function FieldTitle({ className, children, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('text-muted-foreground font-mono text-xs', className)}
      {...props}
    >
      {children}
    </div>
  )
}
