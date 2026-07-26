import { ComponentProps, useEffect } from 'react'
import { useMediaQueryStore } from '../stores/mediaQueryStore'
import { useMediaStore } from '../stores/mediaStore'
import { Pagination } from '@/components/pagination/Pagination'

const LIMIT_OPTIONS = [2, 5, 10, 25, 50, 100] as const

export function MediaPagination({
  className,
  ...props
}: ComponentProps<'div'>) {
  const page = useMediaQueryStore((s) => s.page)
  const limit = useMediaQueryStore((s) => s.limit)
  const setPage = useMediaQueryStore((s) => s.setPage)
  const setLimit = useMediaQueryStore((s) => s.setLimit)
  const totalPages = useMediaStore((s) => s.pagination?.totalPages)
  const totalItems = useMediaStore((s) => s.pagination?.totalItems)

  if (totalPages == null || totalItems == null) return null

  useEffect(() => {
    if (totalPages && page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages, setPage])

  return (
    <Pagination
      page={page}
      totalPages={totalPages}
      totalItems={totalItems}
      limit={limit}
      limitOptions={LIMIT_OPTIONS}
      onPageChange={setPage}
      onLimitChange={setLimit}
      {...props}
    >
      <Pagination.PageInput />
      <Pagination.Divider />
      <Pagination.LimitSelect />
      <Pagination.Divider />
      <Pagination.Previous />
      <Pagination.Pages />
      <Pagination.Next />
    </Pagination>
  )
}
