import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import { ComponentProps, useState } from 'react'
import { PersistedMedia } from '@shared/types'
import { cn } from '@/utils/tailwind'
import { MEDIA_TYPES } from '@shared/constants/features/media'

const TYPE_LABELS: Record<PersistedMedia['type'], string> = {
  anime: 'Anime',
  manga: 'Manga',
  manhua: 'Manhua',
  manhwa: 'Manhwa',
} as const

export function MediaTypeSelector({
  onChange,
  defaultValue,
  value,
  className,
  ...props
}: {
  value?: PersistedMedia['type']
  onChange?: (type: PersistedMedia['type']) => void
} & Omit<ComponentProps<typeof SelectTrigger>, 'onChange' | 'value'>) {
  const [hasOpened, setHasOpened] = useState(false)

  return (
    <Select
      value={value ?? ''}
      onValueChange={onChange}
      onOpenChange={(open) => {
        if (open) setHasOpened(true)
      }}
    >
      <SelectTrigger
        className={cn(
          'max-h-6 w-auto border-white/20 bg-transparent p-0 px-2 text-xs text-white backdrop-blur-xs select-none',
          className,
        )}
        {...props}
      >
        {value ? TYPE_LABELS[value] : 'Select type'}
      </SelectTrigger>
      {hasOpened && (
        <SelectContent>
          {MEDIA_TYPES.map((type) => (
            <SelectItem key={type} value={type}>
              {TYPE_LABELS[type]}
            </SelectItem>
          ))}
        </SelectContent>
      )}
    </Select>
  )
}
