import { ArrowRight, Trash2 } from 'lucide-react'

import { cn } from '@/utils/tailwind'
import { PersistedDelta } from '@shared/types'
import { useHistoryStore } from '../stores/historyStore'
import { Checkbox } from '@/components/ui/checkbox'

export function HistoryRow({ delta }: { delta: PersistedDelta }) {
  const selected = useHistoryStore((s) => s.selected.has(delta.id))
  const toggleSelected = useHistoryStore((s) => s.toggleSelected)
  const remove = useHistoryStore((s) => s.remove)

  const before = delta.before ? JSON.parse(delta.before) : null
  const after = delta.after ? JSON.parse(delta.after) : null
  const changedKeys = delta.type === 'update' ? Object.keys(after) : []

  const isCompact =
    delta.type === 'remove' || delta.type === 'add' || changedKeys.length <= 1

  return (
    <div
      data-state={selected ? 'selected' : undefined}
      className={cn(
        'group data-[state=selected]:bg-muted/30 hover:bg-muted/30 flex min-h-8 gap-3 px-4',
      )}
      onClick={() => toggleSelected(delta.id)}
    >
      <Checkbox checked={selected} className="mt-2 shrink-0" />
      <div className="flex h-min w-full min-w-0 gap-2">
        <div className="text-muted-foreground my-1 flex h-min items-center gap-2 font-mono text-xs">
          <span className="whitespace-pre select-none">
            {delta.createdAt ? formatDate(delta.createdAt) : ''}
          </span>
          <span className="capitalize">{delta.entity}</span> #{delta.entityId}
          <span className={'bg-secondary/50 rounded px-1.5 py-1'}>
            {delta.type}
          </span>
        </div>
        {delta.type !== 'add' && (
          <div className="my-1 flex items-center overflow-hidden">
            <div className="bg-secondary/30 flex flex-wrap gap-x-4 gap-y-1 overflow-auto rounded p-1 text-xs">
              {isCompact ? (
                delta.type === 'remove' ? (
                  <span className="text-muted-foreground">{before?.title}</span>
                ) : (
                  <ChangeChip
                    field={changedKeys[0]}
                    before={before?.[changedKeys[0]]}
                    after={after?.[changedKeys[0]]}
                  />
                )
              ) : (
                changedKeys.map((key) => (
                  <ChangeChip
                    key={key}
                    field={key}
                    before={before?.[key]}
                    after={after?.[key]}
                  />
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <button
        className="text-muted-foreground hover:text-secondary-foreground my-0.5 shrink-0 opacity-0 transition-colors group-hover:opacity-100"
        onClick={() => remove([delta.id])}
        aria-label="Delete entry"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  )
}

function formatDate(date: Date) {
  const pad = (n: number) => n.toString().padStart(2, '0')

  return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function formatValue(value: unknown) {
  if (value === null || value === undefined) return 'null'
  if (typeof value === 'object') return JSON.stringify(value)
  const displayValue = String(value)
  if (displayValue.trim() === '') return 'null'
  return displayValue
}

function ChangeChip({
  field,
  before,
  after,
}: {
  field: string
  before: unknown
  after: unknown
}) {
  return (
    <div className="flex w-full gap-1.5 font-mono">
      <span className="text-muted-foreground">{field}:</span>
      <span className="whitespace-pre">{formatValue(before)}</span>
      <ArrowRight className="text-muted-foreground h-3 min-h-3 w-3 min-w-3 translate-y-0.5" />
      <span className="whitespace-pre">{formatValue(after)}</span>
    </div>
  )
}
