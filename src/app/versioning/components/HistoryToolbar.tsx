import { Trash2, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { useHistoryStore } from '../stores/historyStore'

export function HistoryToolbar() {
  const load = useHistoryStore((s) => s.load)
  const loading = useHistoryStore((s) => s.loading)
  const selectedCount = useHistoryStore((s) => s.selected.size)
  const removeSelected = useHistoryStore((s) => s.removeSelected)
  const clearSelected = useHistoryStore((s) => s.clearSelected)

  const [confirming, setConfirming] = useState(false)

  const handleDeleteClick = () => {
    if (!confirming) {
      setConfirming(true)
      return
    }
    setConfirming(false)
    removeSelected()
  }

  return (
    <>
      {selectedCount > 0 && (
        <span className="text-muted-foreground text-xs">
          ({selectedCount} selected)
        </span>
      )}

      <div className="ml-auto flex h-full">
        {selectedCount > 0 && (
          <>
            <button
              className="text-muted-foreground hover:bg-secondary/30 flex h-full items-center px-2 text-xs"
              onClick={handleDeleteClick}
              onBlur={() => setConfirming(false)}
            >
              <Trash2 className="mr-1 h-3 w-3" />
              {confirming ? 'Confirm delete' : `Delete (${selectedCount})`}
            </button>
            {!confirming && (
              <button
                className="text-muted-foreground hover:bg-secondary/30 flex h-full items-center px-2 text-xs"
                onClick={clearSelected}
              >
                Clear
              </button>
            )}
          </>
        )}
        <button
          className="text-muted-foreground hover:bg-secondary/30 flex h-full items-center px-2 text-xs"
          onClick={load}
          disabled={loading}
        >
          <RefreshCw className="mr-1 h-3 w-3" />
          Refresh
        </button>
      </div>
    </>
  )
}
