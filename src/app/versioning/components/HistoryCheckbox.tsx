import { Checkbox } from '@/components/ui/checkbox'
import { useHistoryStore } from '../stores/historyStore'

export function HeaderCheckbox() {
  const items = useHistoryStore((s) => s.items)
  const selected = useHistoryStore((s) => s.selected)
  const toggleAllSelected = useHistoryStore((s) => s.toggleAllSelected)

  const allSelected = items.length > 0 && items.every((i) => selected.has(i.id))
  const someSelected = !allSelected && items.some((i) => selected.has(i.id))

  return (
    <Checkbox
      checked={allSelected ? true : someSelected ? 'indeterminate' : false}
      onCheckedChange={toggleAllSelected}
      aria-label="Select all rows"
    />
  )
}
