import { Badge } from '@/components/ui/badge'
import { cn } from '@/utils/tailwind'
import { PersistedGenre } from '@shared/types'
import { ComponentProps, createContext, useContext } from 'react'

type MediaGenresContextType = {
  genres: PersistedGenre[]
}

const MediaGenresContext = createContext<MediaGenresContextType | null>(null)

function useMediaGenres() {
  const ctx = useContext(MediaGenresContext)
  if (!ctx) {
    throw new Error(`useMediaGenres must be used within MediaGenres`)
  }
  return ctx
}

export function MediaGenres({
  genres = [],
  className,
  children,
  ...props
}: { genres?: PersistedGenre[] } & ComponentProps<'div'>) {
  return (
    <MediaGenresContext.Provider value={{ genres }}>
      <div className={cn('flex flex-wrap gap-1', className)} {...props}>
        {children}
      </div>
    </MediaGenresContext.Provider>
  )
}

MediaGenres.Badge = function MediaBadge({
  className,
  children,
  ...props
}: ComponentProps<typeof Badge>) {
  return (
    <Badge
      variant={'outline'}
      className={cn('border-secondary text-[unset]', className)}
      {...props}
    >
      {children}
    </Badge>
  )
}

MediaGenres.Badges = function Badges({
  ...props
}: ComponentProps<typeof Badge>) {
  const { genres } = useMediaGenres()
  if (genres.length === 0) return null

  return (
    <>
      {genres.map((g) => (
        <MediaGenres.Badge key={g.id} {...props}>
          {g.name}
        </MediaGenres.Badge>
      ))}
    </>
  )
}
