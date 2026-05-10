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
import { MEDIA_STATUS } from '@shared/constants/features/media'

const STATUS_LABELS: Record<PersistedMedia['status'], string> = {
  completed: 'Completed',
  dropped: 'Dropped',
  'on-hold': 'On-Hold',
  'plan-to-watch': 'Plan to Watch',
  watching: 'Watching',
} as const

export function MediaStatusSelector({
  className,
  ...props
}: ComponentProps<typeof SelectTrigger>) {
  const { id } = useMediaInfo()
  const status = useMediaStore((s) => selectMedia(id)(s).status)
  const updateMedia = useMediaStore((s) => s.updateMedia)

  const handleStatusChange = (status: PersistedMedia['status']) => {
    updateMedia(id, { status })
  }

  return (
    <Select value={status} onValueChange={handleStatusChange}>
      <SelectTrigger
        className={cn(
          'max-h-6 w-auto border-white/20 bg-transparent p-0 px-2 text-xs text-white backdrop-blur-xs select-none',
          className,
        )}
        {...props}
      >
        {STATUS_LABELS[status]}
      </SelectTrigger>
      <SelectContent>
        {MEDIA_STATUS.map((status) => (
          <SelectItem key={status} value={status}>
            {STATUS_LABELS[status]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
