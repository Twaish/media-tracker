import {
  ComponentProps,
  ReactNode,
  useEffect,
  useRef,
  createContext,
  useContext,
} from 'react'
import { cn } from '@/utils/tailwind'
import { Highlight } from '@/components/Highlight'

type SearchItemContextType = {
  icon?: string
  desc?: string
  title?: string
  query: string
  isFocused: boolean
}

const SearchItemContext = createContext<SearchItemContextType | null>(null)

function useSearchItem() {
  const ctx = useContext(SearchItemContext)
  if (!ctx)
    throw new Error(
      'SearchItem compound components must be used inside SearchItem',
    )
  return ctx
}

export function SearchItem({
  icon,
  title,
  desc,
  isFocused,
  query,
  className,
  children,
  ...rest
}: ComponentProps<'div'> & {
  icon?: string
  desc?: string
  title?: string
  isFocused: boolean
  query: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isFocused) {
      ref.current?.scrollIntoView({ block: 'nearest' })
    }
  }, [isFocused])

  return (
    <SearchItemContext.Provider value={{ icon, title, desc, query, isFocused }}>
      <div
        ref={ref}
        className={cn(
          'relative flex min-h-10 cursor-pointer items-center gap-3 border-l-2 px-4 py-2.5',
          isFocused ? 'bg-secondary/50 border-primary' : 'border-transparent',
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    </SearchItemContext.Provider>
  )
}

SearchItem.Icon = function Icon({
  className,
  children,
  ...rest
}: ComponentProps<'div'> & {
  children?: ReactNode
}) {
  const { icon, isFocused } = useSearchItem()

  return (
    <div
      className={cn(
        'bg-muted/50 flex h-6 w-6 items-center justify-center border text-xs',
        !isFocused && 'text-muted-foreground',
        className,
      )}
      {...rest}
    >
      {children ?? icon}
    </div>
  )
}

SearchItem.Title = function Title({
  className,
  children,
  text,
  ...rest
}: ComponentProps<'span'> & {
  children?: ReactNode
  text?: string
}) {
  const { title, query } = useSearchItem()

  if (!text && !children) return null

  return (
    <span
      className={cn(
        'overflow-hidden text-xs font-semibold text-ellipsis whitespace-nowrap',
        className,
      )}
      {...rest}
    >
      {children ?? <Highlight text={text ?? title ?? ''} term={query} />}
    </span>
  )
}

SearchItem.Description = function Description({
  className,
  children,
  text,
  ...rest
}: ComponentProps<'span'> & {
  children?: ReactNode
  text?: string
}) {
  const { desc, query } = useSearchItem()

  if (!text && !children) return null

  return (
    <span
      className={cn(
        'text-muted-foreground overflow-hidden text-[11px] text-ellipsis whitespace-nowrap',
        className,
      )}
      {...rest}
    >
      {children ?? <Highlight text={text ?? desc ?? ''} term={query} />}
    </span>
  )
}

SearchItem.Content = function Content({ children }: { children: ReactNode }) {
  return <div className="flex flex-1 flex-col gap-0.5">{children}</div>
}
