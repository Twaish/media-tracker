import { useMemo, createContext, useContext } from 'react'
import { PluginItem } from '@/app/plugins/components/PluginItem'
import { usePluginStore } from '@/app/plugins/stores/usePluginStore'
import { cn } from '@/utils/tailwind'
import { DialogSearch } from '@/components/dialog/DialogSearch'
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { VisuallyHidden } from 'radix-ui'
import { DialogEmptyIndicator } from '@/components/dialog/DialogEmptyIndicator'
import { DialogFooterHint } from '@/components/dialog/DialogFooterHint'

type FilterType = 'all' | 'enabled' | 'disabled' | 'error'

interface PluginMenuState {
  query: string
  filter: FilterType

  setQuery: (query: string) => void
  setFilter: (filter: FilterType) => void
}

export const usePluginMenuStore = create<PluginMenuState>()(
  immer((set) => ({
    query: '',
    filter: 'all',

    setQuery: (query) =>
      set((state) => {
        state.query = query
      }),

    setFilter: (filter) =>
      set((state) => {
        state.filter = filter
      }),
  })),
)

function useFilteredPlugins() {
  const plugins = usePluginStore((s) => s.plugins)
  const query = usePluginMenuStore((s) => s.query)
  const filter = usePluginMenuStore((s) => s.filter)

  return useMemo(() => {
    const q = query.toLowerCase()

    return plugins.filter((p) => {
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
  }, [plugins, query, filter])
}

function usePluginMenuContext() {
  const query = usePluginMenuStore((s) => s.query)
  const filtered = useFilteredPlugins()
  return { query, filtered }
}

const PluginMenuContext = createContext<ReturnType<
  typeof usePluginMenuContext
> | null>(null)

function usePluginMenu() {
  const ctx = useContext(PluginMenuContext)
  if (!ctx) throw new Error('usePluginMenu must be used within PluginMenu')
  return ctx
}

export function PluginMenuDialog() {
  const ctx = usePluginMenuContext()

  return (
    <PluginMenuContext.Provider value={ctx}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[70vh] w-150 flex-col overflow-hidden rounded-none p-0"
      >
        <VisuallyHidden.Root>
          <DialogTitle>Plugin Menu</DialogTitle>
          <DialogDescription>Manage your plugins</DialogDescription>
        </VisuallyHidden.Root>
        <div className="flex h-full flex-col overflow-hidden">
          <PluginMenuDialog.Search />
          <PluginMenuDialog.Filters />
          <PluginMenuDialog.Plugins />
          <PluginMenuDialog.Footer />
        </div>
      </DialogContent>
    </PluginMenuContext.Provider>
  )
}

PluginMenuDialog.Search = function Search() {
  const query = usePluginMenuStore((s) => s.query)
  const setQuery = usePluginMenuStore((s) => s.setQuery)
  return (
    <DialogSearch
      value={query}
      placeholder="Filter plugins..."
      onChange={(e) => setQuery(e.target.value)}
    />
  )
}

const filters: { label: string; value: FilterType }[] = [
  { label: 'All', value: 'all' },
  { label: 'Enabled', value: 'enabled' },
  { label: 'Disabled', value: 'disabled' },
  { label: 'Errors', value: 'error' },
]

PluginMenuDialog.Filters = function Filters() {
  return (
    <div className="flex min-h-max gap-1 overflow-x-auto p-1">
      {filters.map((f) => (
        <FilterButton key={f.value} filter={f.value} />
      ))}
    </div>
  )
}

function FilterButton({ filter }: { filter: FilterType }) {
  const isActive = usePluginMenuStore((s) => s.filter === filter)
  const setFilter = usePluginMenuStore((s) => s.setFilter)
  return (
    <button
      onClick={() => setFilter(filter)}
      className={cn(
        'text-muted-foreground border px-2.5 py-1 font-mono text-[10px] leading-3 tracking-wide whitespace-nowrap capitalize',
        isActive && 'text-secondary-foreground bg-secondary',
      )}
    >
      {filter}
    </button>
  )
}

PluginMenuDialog.Plugins = function Plugins() {
  const { query, filtered } = usePluginMenu()

  return (
    <div className="hide-scroll flex-1 overflow-y-auto">
      {filtered.length === 0 ? (
        <DialogEmptyIndicator>No results for this query</DialogEmptyIndicator>
      ) : (
        filtered.map((plugin) => (
          <PluginItem key={plugin.manifest.id} plugin={plugin} query={query} />
        ))
      )}
    </div>
  )
}

PluginMenuDialog.Footer = function Footer() {
  const { filtered } = usePluginMenu()
  return (
    <DialogFooter>
      <DialogFooterHint text="close">Esc</DialogFooterHint>
      <div className="flex-1" />
      <span className="text-muted-foreground text-[10px] tracking-widest">
        {filtered.length} result{filtered.length !== 1 ? 's' : ''}
      </span>
    </DialogFooter>
  )
}
