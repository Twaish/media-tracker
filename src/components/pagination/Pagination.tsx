import { getPages } from '@/utils/pagination'
import { PaginationContext, usePagination } from './paginationContext'
import { ComponentProps, useEffect, useRef, useState } from 'react'
import { cn } from '@/utils/tailwind'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type PaginationRootProps = {
  page: number
  limit: number
  totalPages: number
  totalItems: number
  limitOptions: readonly number[]
  onPageChange: (page: number) => void
  onLimitChange: (limit: number) => void
}

export function Pagination({
  page,
  totalPages,
  totalItems,
  limit,
  limitOptions,
  onPageChange,
  onLimitChange,
  children,
  className,
}: ComponentProps<'div'> & PaginationRootProps) {
  const [draft, setDraft] = useState(String(page))

  useEffect(() => {
    setDraft(String(page))
  }, [page])

  const commitDraft = () => {
    const n = parseInt(draft, 10)

    if (!isNaN(n) && n >= 1 && n <= totalPages) {
      onPageChange(n)
    } else {
      setDraft(String(page))
    }
  }

  const value = {
    page,
    totalPages,
    totalItems,
    limit,
    limitOptions,
    draft,
    setDraft,
    setPage: onPageChange,
    setLimit: onLimitChange,
    commitDraft,
    pages: getPages(page, totalPages),
  }

  return (
    <PaginationContext.Provider value={value}>
      <div
        className={cn(
          'bg-background sticky bottom-0 flex min-h-8 items-center border-t text-sm',
          className,
        )}
      >
        {children}
      </div>
    </PaginationContext.Provider>
  )
}

Pagination.PageInput = function PageInput() {
  const { page, totalPages, draft, setDraft, commitDraft } = usePagination()
  const ref = useRef<HTMLInputElement>(null)

  return (
    <label className="text-muted-foreground ml-2 flex items-center gap-1 text-xs">
      Page
      <input
        ref={ref}
        type="number"
        min={1}
        max={totalPages}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commitDraft}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            commitDraft()
            ref.current?.blur()
          }

          if (e.key === 'Escape') {
            setDraft(String(page))
            ref.current?.blur()
          }
        }}
        className={cn(
          'border-border bg-background w-10 rounded border px-1.5 py-0.5 text-center text-xs',
          'focus:border-ring focus:outline-none',
          '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
        )}
      />
      <span className="text-muted-foreground hidden lg:flex">
        of {totalPages}
      </span>
    </label>
  )
}

Pagination.Pages = function Pages() {
  const { pages, page, setPage } = usePagination()

  return (
    <>
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
            onClick={() => setPage(item)}
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
    </>
  )
}

Pagination.Previous = function Previous() {
  const { page, setPage } = usePagination()

  return (
    <PageButton
      disabled={page === 1}
      onClick={() => setPage(page - 1)}
      title="Previous page"
      className="ml-auto"
    >
      <ChevronLeft className="h-4 w-4" />
    </PageButton>
  )
}

Pagination.Next = function Next() {
  const { page, totalPages, setPage } = usePagination()

  return (
    <PageButton
      disabled={page === totalPages}
      onClick={() => setPage(page + 1)}
      title="Next page"
    >
      <ChevronRight className="h-4 w-4" />
    </PageButton>
  )
}

Pagination.LimitSelect = function LimitSelect() {
  const { limit, limitOptions, setLimit, page, totalItems, setPage } =
    usePagination()

  return (
    <label className="text-muted-foreground flex items-center gap-1 text-xs">
      Show
      <select
        value={limit}
        onChange={(e) => {
          const newLimit = Number(e.target.value)
          setLimit(newLimit)
          const approxNewTotal = Math.ceil(totalItems / newLimit)
          if (page > approxNewTotal) {
            setPage(Math.max(1, approxNewTotal))
          }
        }}
        className={cn(
          'border-border bg-background rounded border px-1 py-0.5 text-xs',
          'focus:border-ring focus:outline-none',
        )}
      >
        {limitOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <span className="hidden lg:flex">per page</span>
    </label>
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

Pagination.Divider = function Divider() {
  return <div className="bg-border mx-2 h-full w-px" />
}
