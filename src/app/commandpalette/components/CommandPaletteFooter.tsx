import { ChevronUp, ChevronDown, CornerDownLeft, MoveLeft } from 'lucide-react'
import { selectFilteredCount } from '../stores/paletteSelectors'
import { usePalette } from '../stores/paletteStore'
import { DialogFooterHint } from '@/components/dialog/DialogFooterHint'
import { DialogFooter } from '@/components/ui/dialog'

export function CommandPaletteFooter() {
  const isInSteps = usePalette((s) => s.stepStack.length > 0)
  const isFreeInput = usePalette((s) => {
    const currentFrame = isInSteps ? s.stepStack[s.stepStack.length - 1] : null

    const currentStep = currentFrame
      ? currentFrame.command.steps[currentFrame.stepIndex]
      : null

    return isInSteps && currentStep?.type === 'input'
  })
  const filteredCount = usePalette(selectFilteredCount)

  return (
    <DialogFooter>
      <DialogFooterHint text="navigate">
        <ChevronUp />
        <ChevronDown />
      </DialogFooterHint>
      <DialogFooterHint text="select">
        <CornerDownLeft />
      </DialogFooterHint>
      {isInSteps && (
        <DialogFooterHint text="back">
          <MoveLeft />
        </DialogFooterHint>
      )}
      <DialogFooterHint text="close">Esc</DialogFooterHint>
      <div className="flex-1" />
      <span className="text-muted-foreground text-[10px] tracking-widest">
        {isFreeInput
          ? 'free input'
          : `${filteredCount} result${filteredCount !== 1 ? 's' : ''}`}
      </span>
    </DialogFooter>
  )
}
