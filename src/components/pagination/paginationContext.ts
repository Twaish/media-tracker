import { createContext, useContext } from 'react'

type PaginationContextValue = {
  page: number
  totalPages: number
  totalItems: number
  limit: number
  limitOptions: readonly number[]

  draft: string
  setDraft(value: string): void

  setPage(page: number): void
  commitDraft(): void

  setLimit(limit: number): void

  pages: (number | '...')[]
}

export const PaginationContext = createContext<PaginationContextValue | null>(
  null,
)

export function usePagination() {
  const ctx = useContext(PaginationContext)
  if (!ctx)
    throw new Error('Pagination components must be inside Pagination.Root')
  return ctx
}
