import { cn } from '@/utils/tailwind'
import { usePalette } from '../stores/paletteStore'

export function CommandPaletteBreadcrumbs() {
  const isInSteps = usePalette((s) => s.stepStack.length > 0)
  const currentFrame = usePalette((s) =>
    isInSteps ? s.stepStack[s.stepStack.length - 1] : null,
  )
  const currentStep = usePalette((s) =>
    currentFrame ? currentFrame.command.steps[currentFrame.stepIndex] : null,
  )

  const breadcrumbItems = currentFrame
    ? [
        currentFrame.command.title,
        ...currentFrame.collectedValues,
        currentStep?.label ?? '',
      ]
    : []

  if (!isInSteps) return null

  return (
    <div className="bg-muted/35 flex h-8 shrink-0 items-center overflow-hidden border-b px-4">
      {breadcrumbItems.map((crumb, i) => (
        <span key={i} className="flex items-center">
          {i > 0 && (
            <span className="text-muted-foreground/50 px-1.5 text-[11px]">
              {'>'}
            </span>
          )}
          <span
            className={cn(
              'text-[10px] font-semibold tracking-wide whitespace-nowrap',
              i === 0
                ? 'text-muted-foreground/50'
                : i === breadcrumbItems.length - 1
                  ? 'text-secondary-foreground'
                  : 'text-secondary-foreground/50',
            )}
          >
            {crumb}
          </span>
        </span>
      ))}
    </div>
  )
}
