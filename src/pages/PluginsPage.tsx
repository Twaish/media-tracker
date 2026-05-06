import { useState, useMemo } from 'react'
import { PluginItem } from '@/app/plugins/components/PluginItem'
import { usePluginStore } from '@/app/plugins/stores/usePluginStore'
import { Search, Puzzle } from 'lucide-react'
import { cn } from '@/utils/tailwind'
import { Button } from '@/components/ui/button'

type FilterType = 'all' | 'enabled' | 'disabled' | 'error'

export default function PluginsPage() {
  const plugins = usePluginStore((s) => s.plugins)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')

  const stats = useMemo(
    () => ({
      total: plugins.length,
      enabled: plugins.filter((p) => p.enabled && !p.error).length,
      errors: plugins.filter((p) => !!p.error).length,
    }),
    [plugins],
  )

  const filtered = useMemo(() => {
    return plugins.filter((p) => {
      const q = search.toLowerCase()
      const matchesSearch =
        !q ||
        p.manifest.name.toLowerCase().includes(q) ||
        p.manifest.id.toLowerCase().includes(q) ||
        p.manifest.author?.toLowerCase().includes(q)

      const matchesFilter =
        filter === 'all' ||
        (filter === 'enabled' && p.enabled && !p.error) ||
        (filter === 'disabled' && !p.enabled && !p.error) ||
        (filter === 'error' && !!p.error)

      return matchesSearch && matchesFilter
    })
  }, [plugins, search, filter])

  const filters: { label: string; value: FilterType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Enabled', value: 'enabled' },
    { label: 'Disabled', value: 'disabled' },
    { label: 'Errors', value: 'error' },
  ]

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex h-8 shrink-0 items-center border-b">
        <div className="relative w-full">
          <Search className="absolute top-1/2 left-2 h-3 w-3 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="filter plugins..."
            className="h-8 w-full pl-6 font-mono text-[11px] outline-none"
          />
        </div>

        <div className="flex h-full">
          {filters.map((f) => (
            <Button
              variant={'ghost'}
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                'hover:bg-secondary/50 h-full rounded-none border-transparent px-2.5 text-[11px] transition-colors',
                filter === f.value && 'bg-secondary hover:bg-secondary',
              )}
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="text-muted-foreground flex flex-col items-center justify-center gap-2 py-20">
            <span className="text-xs">No results for this query</span>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-1 p-1">
            {filtered.map((plugin) => (
              <PluginItem key={plugin.manifest.id} plugin={plugin} />
            ))}
          </div>
        )}
      </div>
      <div className="mt-auto flex h-8 items-center border-t">
        <div className="flex h-full shrink-0">
          {[
            { label: 'Total', value: stats.total },
            { label: 'Enabled', value: stats.enabled },
            {
              label: 'Disabled',
              value: stats.total - stats.enabled - stats.errors,
            },
            { label: 'Errors', value: stats.errors },
          ].map((s, i) => (
            <div
              key={s.label}
              className={cn(
                'flex h-full items-center gap-2 border-r px-4 font-mono',
              )}
            >
              <span className={cn('text-sm leading-none font-semibold')}>
                {s.value}
              </span>
              <span className="text-muted-foreground text-[10px] tracking-widest uppercase">
                {s.label}
              </span>
            </div>
          ))}
        </div>
        <span className="text-muted-foreground mr-2 ml-auto font-mono text-xs">
          Showing {filtered.length} / {stats.total}
        </span>
      </div>
    </div>
  )
}
