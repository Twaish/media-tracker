import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import { useMediaInfo } from '../contexts/useMediaInfo'
import { selectMedia, useMediaStore } from '../stores/mediaStore'
import { ComponentProps } from 'react'
import { PersistedMedia } from '@shared/types'
import { cn } from '@/utils/tailwind'
import { MEDIA_TYPES } from '@shared/constants/features/media'

const TYPE_LABELS: Record<PersistedMedia['type'], string> = {
  anime: 'Anime',
  manga: 'Manga',
  manhua: 'manhua',
  manhwa: 'manhwa',
} as const

export function MediaTypeSelector({
  className,
  ...props
}: ComponentProps<typeof SelectTrigger>) {
  const { id } = useMediaInfo()
  const type = useMediaStore((s) => selectMedia(id)(s).type)
  const updateMedia = useMediaStore((s) => s.updateMedia)

  const handleTypeChange = (type: PersistedMedia['type']) => {
    updateMedia(id, { type })
  }

  return (
    <Select value={type} onValueChange={handleTypeChange}>
      <SelectTrigger
        className={cn(
          'max-h-6 w-auto border-white/20 bg-transparent p-0 px-2 text-xs text-white backdrop-blur-xs select-none',
          className,
        )}
        {...props}
      >
        {TYPE_LABELS[type]}
      </SelectTrigger>
      <SelectContent>
        {MEDIA_TYPES.map((type) => (
          <SelectItem key={type} value={type}>
            {TYPE_LABELS[type]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
