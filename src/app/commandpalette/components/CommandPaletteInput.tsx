import { useEffect, useRef } from 'react'
import { usePalette } from '../stores/paletteStore'
import { DialogSearch } from '@/components/dialog/DialogSearch'

export function CommandPaletteInput() {
  const inputRef = useRef<HTMLInputElement>(null)

  const isInSteps = usePalette((s) => s.stepStack.length > 0)
  const query = usePalette((s) => s.query)
  const actions = usePalette((s) => s.actions)
  const stepStackSize = usePalette((s) => s.stepStack.length)
  const currentFrame = usePalette((s) =>
    isInSteps ? s.stepStack[s.stepStack.length - 1] : null,
  )
  const currentStep = usePalette((s) =>
    currentFrame ? currentFrame.command.steps[currentFrame.stepIndex] : null,
  )

  const placeholder =
    isInSteps && currentStep
      ? (currentStep.placeholder ?? 'Search…')
      : 'Type a command or search…'

  useEffect(() => {
    inputRef.current?.focus()
  }, [stepStackSize, currentFrame?.stepIndex])

  return (
    <DialogSearch
      ref={inputRef}
      value={query}
      placeholder={placeholder}
      onChange={(e) => actions.setQuery(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Backspace' && query === '' && isInSteps) {
          e.preventDefault()
          actions.goBack()
        }
      }}
    />
  )
}
