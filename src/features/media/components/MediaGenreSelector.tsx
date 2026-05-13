import { Check, Plus, Search, X } from 'lucide-react'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { getGenres } from '@/features/genres/actions'
import { PersistedGenre } from '@shared/types'
import { Badge } from '@/components/ui/badge'

export function MediaGenreSelector({
  selected = new Set(),
  onSelect,
}: {
  selected?: Set<number>
  onSelect?: (genre: PersistedGenre) => void
}) {
  const [hasOpened, setHasOpened] = useState(false)
  const [query, setQuery] = useState('')

  const { data: genres = [] } = useQuery({
    queryKey: ['genres'],
    queryFn: getGenres,
  })

  const filtered = genres.filter((g) =>
    g.name.toLowerCase().includes(query.toLowerCase()),
  )

  const handleOpenChange = (open: boolean) => {
    if (!open) setQuery('')

    setHasOpened(open)
  }

  return (
    <Popover onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Badge
          variant={'outline'}
          className="border-secondary hover:border-border cursor-pointer transition-colors duration-200 select-none"
        >
          <Plus className="h-3 w-3" />
          Add
        </Badge>
      </PopoverTrigger>
      {hasOpened && (
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
          <div
            onWheel={(e) => e.stopPropagation()}
            className="hide-scroll h-full overflow-y-auto"
          >
            {filtered.length === 0 && (
              <div className="text-muted-foreground px-3 py-4 text-center text-[11px]">
                No genres found
              </div>
            )}
            {filtered.map((genre) => (
              <button
                key={genre.id}
                onClick={() => onSelect?.(genre)}
                className="hover:bg-secondary flex w-full items-center justify-between px-3 py-1.5 text-[11px] transition-colors duration-100"
              >
                <span>{genre.name}</span>
                {selected.has(genre.id) && <Check className="h-3 w-3" />}
              </button>
            ))}
          </div>
          <div className="border-t px-3 py-1.5 font-mono text-[10px] tracking-widest uppercase">
            {selected.size} selected
          </div>
        </PopoverContent>
      )}
    </Popover>
  )
}
