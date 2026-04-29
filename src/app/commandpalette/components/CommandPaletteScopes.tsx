import { cn } from '@/utils/tailwind'
import { usePalette } from '../stores/paletteStore'
import { useCommandStore } from '../stores/commandStore'

export function CommandPaletteScopes() {
  const scopes = useCommandStore((s) => s.scopes)
  const isInSteps = usePalette((s) => s.stepStack.length > 0)

  if (isInSteps) return null

  return (
    <div className="flex min-h-max gap-1 overflow-x-auto p-1">
      {Object.values(scopes).map((sc) => (
        <ScopeButton key={sc} scope={sc} />
      ))}
    </div>
  )
}

function ScopeButton({ scope }: { scope: string }) {
  const actions = usePalette((s) => s.actions)
  const isActive = usePalette((s) => s.activeScope === scope)
  return (
    <button
      onClick={() => actions.setScope(scope)}
      className={cn(
        'text-muted-foreground border px-2.5 py-1 font-mono text-[10px] leading-3 tracking-wide whitespace-nowrap capitalize',
        isActive && 'text-secondary-foreground bg-secondary',
      )}
    >
      {scope}
    </button>
  )
}
