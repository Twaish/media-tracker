import { Check, Plus, Search, X } from 'lucide-react'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { cn } from '@/utils/tailwind'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { getGenres } from '@/features/genres/actions'
import { useMediaInfo } from '../contexts/useMediaInfo'
import { selectMedia, useMediaStore } from '../stores/mediaStore'
import { PersistedGenre } from '@shared/types'
import { Badge } from '@/components/ui/badge'

export function MediaGenreSelector() {
  const { id } = useMediaInfo()
  const mediaGenres = useMediaStore((s) => selectMedia(id)(s).genres)
  const updateMedia = useMediaStore((s) => s.updateMedia)

  const { data: genres = [] } = useQuery({
    queryKey: ['genres'],
    queryFn: getGenres,
  })

  const [query, setQuery] = useState('')

  const selectedIds = new Set(mediaGenres.map((g) => g.id))

  const filtered = genres.filter((g) =>
    g.name.toLowerCase().includes(query.toLowerCase()),
  )

  const toggleGenre = (genre: PersistedGenre) => {
    if (selectedIds.has(genre.id)) {
      updateMedia(id, { genres: mediaGenres.filter((g) => g.id !== genre.id) })
    } else {
      updateMedia(id, { genres: [...mediaGenres, genre] })
    }
  }

  return (
    <Popover onOpenChange={(open) => !open && setQuery('')}>
      <PopoverTrigger asChild>
        <Badge
          variant={'outline'}
          className="border-secondary hover:border-border cursor-pointer transition-colors duration-200 select-none"
        >
          <Plus className="h-3 w-3" />
          Add
        </Badge>
      </PopoverTrigger>
      <PopoverContent className="flex h-55 w-52 flex-col gap-0 p-0">
        <div className="flex items-center gap-2 border-b px-3 py-2">
          <Search className="h-3 w-3" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Action, Comedy"
            className="w-full flex-1 text-[11px] outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')}>
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
        <div className="hide-scroll h-full overflow-y-auto">
          {filtered.length === 0 && (
            <div className="text-muted-foreground px-3 py-4 text-center text-[11px]">
              No genres found
            </div>
          )}
          {filtered.map((genre) => (
            <button
              key={genre.id}
              onClick={() => toggleGenre(genre)}
              className="hover:bg-secondary flex w-full items-center justify-between px-3 py-1.5 text-[11px] transition-colors duration-100"
            >
              <span>{genre.name}</span>
              {selectedIds.has(genre.id) && <Check className="h-3 w-3" />}
            </button>
          ))}
        </div>
        <div className="border-t px-3 py-1.5 font-mono text-[10px] tracking-widest uppercase">
          {selectedIds.size} selected
        </div>
      </PopoverContent>
    </Popover>
  )
}
