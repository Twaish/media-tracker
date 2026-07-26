import { HeaderCheckbox } from '@/app/versioning/components/HistoryCheckbox'
import { HistoryPagination } from '@/app/versioning/components/HistoryPagination'
import { HistoryRow } from '@/app/versioning/components/HistoryRow'
import { HistoryToolbar } from '@/app/versioning/components/HistoryToolbar'
import { useHistoryStore } from '@/app/versioning/stores/historyStore'
import { useEffect } from 'react'

export default function HistoryPage() {
  const load = useHistoryStore((s) => s.load)

  useEffect(() => {
    load()
  }, [load])

  return (
    <div className="flex h-full flex-col">
      <HistoryContent />
    </div>
  )
}

function HistoryContent() {
  const loading = useHistoryStore((s) => s.loading)
  const items = useHistoryStore((s) => s.items)

  if (loading) {
    return (
      <div className="text-muted-foreground flex flex-1 items-center justify-center text-sm">
        Loading...
      </div>
    )
  }

  if (!items.length) {
    return (
      <div className="text-muted-foreground flex flex-1 flex-col items-center justify-center gap-2">
        <span className="text-sm">No history yet</span>
        <span className="text-xs">Changes you make will show up here.</span>
      </div>
    )
  }

  return (
    <>
      <div className="text-muted-foreground flex h-8 items-center gap-3 border-b pl-4 text-xs">
        <HeaderCheckbox />
        <span>{items.length} entries</span>
        <HistoryToolbar />
      </div>

      <div className="flex-1 overflow-auto">
        {items.map((delta) => (
          <HistoryRow key={delta.id} delta={delta} />
        ))}
      </div>

      <HistoryPagination />
    </>
  )
}
