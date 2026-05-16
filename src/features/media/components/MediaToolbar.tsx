import { Plus, Search } from 'lucide-react'
import { useState } from 'react'
import { useMediaDialog } from '../hooks/useMediaDialog'
import { addMedia } from '../actions'
import { queryClient } from '@/core/queryClient'

export function MediaToolbar() {
  return (
    <div className="flex max-h-8 min-h-8 border-b">
      <MediaToolbar.AddButton />
      <MediaToolbar.SearchField />
    </div>
  )
}

MediaToolbar.AddButton = function AddButton() {
  // TODO: Create mutation hook
  const { add } = useMediaDialog({
    onAdd: (media) => {
      if (media.title == null) {
        throw new Error('Missing required title')
      }
      if (media.currentEpisode == null) {
        throw new Error('Missing required current episode')
      }
      if (media.type == null) {
        throw new Error('Missing required type')
      }
      if (media.status == null) {
        throw new Error('Missing required status')
      }

      addMedia({
        ...media,
        title: media.title,
        currentEpisode: media.currentEpisode,
        type: media.type,
        status: media.status,
        genres: media.genres?.map((g) => g.id) ?? [],
        isFavorite: false,
      })
      queryClient.invalidateQueries({
        queryKey: ['media'],
      })
    },
  })

  return (
    <button
      onClick={() => add()}
      className="hover:bg-secondary/50 flex h-full items-center gap-1 border-r px-2 text-xs"
    >
      <Plus className="h-3.5 w-3.5" />
      New
    </button>
  )
}

MediaToolbar.SearchField = function SearchField() {
  const [value, setValue] = useState('')

  return (
    <div className="flex h-full w-full items-center gap-1.5 px-2">
      <Search size={15} className="text-muted-foreground/50 shrink-0" />
      <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="flex-1 bg-transparent font-mono text-xs outline-none"
          placeholder="Search... Use [genre=Comedy,Fighting] [year>=2015] for specific searches"
        />
      </div>
    </div>
  )
}
