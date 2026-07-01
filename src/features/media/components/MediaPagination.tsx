import { cn } from '@/utils/tailwind'
import { ComponentProps, useEffect, useRef, useState } from 'react'
import { getMediaQueryOptions } from '../queries'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight } from 'lucide-react'

function getPages(current: number, total: number): (number | '...')[] {
  if (total <= 1) return total === 1 ? [1] : []
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const set = new Set<number>()

  set.add(1)
  set.add(total)

  for (
    let i = Math.max(2, current - 1);
    i <= Math.min(total - 1, current + 1);
    i++
  ) {
    set.add(i)
  }

  const sorted = Array.from(set).sort((a, b) => a - b)
  const result: (number | '...')[] = []

  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      result.push('...')
    }
    result.push(sorted[i])
  }

  return result
}

const LIMIT_OPTIONS = [2, 5, 10, 25, 50, 100] as const

export function MediaPagination({
  className,
  page,
  limit,
  onPageChange,
  onLimitChange,
  ...props
}: ComponentProps<'div'> & {
  page: number
  limit: number
  onPageChange: (page: number) => void
  onLimitChange: (limit: number) => void
}) {
  const { data } = useQuery(getMediaQueryOptions(page, limit)) ?? {}

  const [draft, setDraft] = useState(String(page))
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setDraft(String(page))
  }, [page])

  if (!data) return null

  const { totalPages } = data.pagination

  const safePage = Math.min(page, totalPages || 1)
  if (safePage !== page) {
    onPageChange(safePage)
    return null
  }

  const pages = getPages(page, totalPages)

  function commitDraft() {
    const n = parseInt(draft, 10)
    if (!isNaN(n) && n >= 1 && n <= totalPages) {
      onPageChange(n)
    } else {
      setDraft(String(page))
    }
  }

  return (
    <div
      className={cn(
        'bg-background sticky bottom-0 flex min-h-8 items-center justify-center border-t text-sm',
        className,
      )}
      {...props}
    >
      <label className="text-muted-foreground ml-2 flex items-center gap-1 text-xs">
        Page
        <input
          ref={inputRef}
          type="number"
          min={1}
          max={totalPages}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitDraft}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              commitDraft()
              inputRef.current?.blur()
            }
            if (e.key === 'Escape') {
              setDraft(String(page))
              inputRef.current?.blur()
            }
          }}
          className={cn(
            'border-border bg-background w-10 rounded border px-1.5 py-0.5 text-center text-xs',
            'focus:border-ring focus:outline-none',
            '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
          )}
        />
        <span className="text-muted-foreground">of {totalPages}</span>
      </label>

      <Divider />

      <label className="text-muted-foreground flex items-center gap-1 text-xs">
        Show
        <select
          value={limit}
          onChange={(e) => {
            const newLimit = Number(e.target.value)
            onLimitChange(newLimit)
            const approxNewTotal = Math.ceil(
              data.pagination.totalItems / newLimit,
            )
            if (page > approxNewTotal) {
              onPageChange(Math.max(1, approxNewTotal))
            }
          }}
          className={cn(
            'border-border bg-background rounded border px-1 py-0.5 text-xs',
            'focus:border-ring focus:outline-none',
          )}
        >
          {LIMIT_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        per page
      </label>

      <Divider />

      <PageButton
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        title="Previous page"
        className="ml-auto"
      >
        <ChevronLeft className="h-4 w-4" />
      </PageButton>

      {pages.map((item, i) =>
        item === '...' ? (
          <span
            key={`ellipsis-${i}`}
            className="text-muted-foreground flex aspect-square h-full items-center justify-center font-mono text-xs"
          >
            ...
          </span>
        ) : (
          <button
            key={item}
            onClick={() => onPageChange(item)}
            aria-label={`Page ${item}`}
            aria-current={item === page ? 'page' : undefined}
            className={cn(
              'flex aspect-square h-full items-center justify-center text-xs transition-colors',
              item === page
                ? 'bg-primary text-primary-foreground font-medium'
                : 'hover:bg-accent',
            )}
          >
            {item}
          </button>
        ),
      )}
      <PageButton
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        title="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </PageButton>
    </div>
  )
}

function PageButton({
  className,
  children,
  ...props
}: ComponentProps<'button'>) {
  return (
    <button
      className={cn(
        'hover:bg-secondary/50 flex aspect-square h-full items-center justify-center disabled:cursor-default disabled:opacity-40',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <div className="bg-border mx-2 h-full w-px" />
}
