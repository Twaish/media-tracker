import { Pagination } from '@/components/pagination/Pagination'
import { useHistoryStore } from '../stores/historyStore'

const LIMIT_OPTIONS = [10, 25, 50, 100] as const

export function HistoryPagination() {
  const page = useHistoryStore((s) => s.page)
  const limit = useHistoryStore((s) => s.limit)
  const setPage = useHistoryStore((s) => s.setPage)
  const setLimit = useHistoryStore((s) => s.setLimit)
  const totalItems = useHistoryStore((s) => s.totalItems)
  const totalPages = useHistoryStore((s) => s.totalPages)

  if (totalPages == null || totalItems == null) return null

  return (
    <Pagination
      page={page}
      totalPages={totalPages}
      totalItems={totalItems}
      limit={limit}
      limitOptions={LIMIT_OPTIONS}
      onPageChange={setPage}
      onLimitChange={setLimit}
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
