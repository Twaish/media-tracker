import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import { ComponentProps, useState } from 'react'
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
  onChange,
  value,
  className,
  ...props
}: {
  value?: PersistedMedia['status']
  onChange?: (status: PersistedMedia['status']) => void
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
        {value ? STATUS_LABELS[value] : 'Select status'}
      </SelectTrigger>
      {hasOpened && (
        <SelectContent>
          {MEDIA_STATUS.map((status) => (
            <SelectItem key={status} value={status}>
              {STATUS_LABELS[status]}
            </SelectItem>
          ))}
        </SelectContent>
      )}
    </Select>
  )
}
