import { useCommandStore } from './commandStore'
import { PaletteState } from './paletteStore'

export function selectFilteredCount(s: PaletteState): number {
  const { query, stepStack, activeScope } = s
  const isInSteps = stepStack.length > 0
  const q = query.toLowerCase().trim()

  if (isInSteps) {
    const frame = stepStack.at(-1)
    const step = frame?.command.steps[frame.stepIndex]
    if (!step || step.type !== 'list') return 0
    return step.options.filter(
      (o) =>
        !q ||
        o.title.toLowerCase().includes(q) ||
        (o.desc && o.desc.toLowerCase().includes(q)),
    ).length
  }

  const groups = useCommandStore.getState().getFiltered(query, activeScope)
  return Object.values(groups).reduce((sum, cmds) => sum + cmds.length, 0)
}
