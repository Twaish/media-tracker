import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { Command, StackFrame } from '../types'

export type PaletteState = {
  open: boolean
  query: string
  activeScope: string
  focusedIndex: number
  stepStack: StackFrame[]
  actions: {
    reset: () => void
    openPalette: () => void
    closePalette: () => void
    setQuery: (q: string) => void
    setScope: (s: string) => void
    setFocused: (i: number) => void
    selectCommand: (cmd: Command) => void
    advanceStep: (value: string) => void
    goBack: () => void
  }
}

export const usePalette = create<PaletteState>()(
  immer((set, get) => {
    const resetNavigation = (s: PaletteState) => {
      s.query = ''
      s.focusedIndex = 0
    }

    const close = (s: PaletteState) => {
      s.open = false
    }

    const resetPalette = (s: PaletteState) => {
      s.open = true
      s.activeScope = 'all'
      s.stepStack = []
      resetNavigation(s)
    }

    const finish = (cmd: Command, values: Record<string, string>) => {
      set(close)
      if (cmd.action) setTimeout(() => cmd.action!(values), 0)
    }

    return {
      open: false,
      query: '',
      activeScope: 'all',
      focusedIndex: 0,
      stepStack: [] as StackFrame[],
      actions: {
        reset: () => set(resetPalette),
        openPalette: () => set(resetPalette),
        closePalette: () => set(close),
        setQuery: (q) => set({ query: q, focusedIndex: 0 }),
        setScope: (sc) => set({ activeScope: sc, focusedIndex: 0 }),
        setFocused: (i) => set({ focusedIndex: i }),
        selectCommand: (cmd) => {
          if (!cmd.steps.length) return finish(cmd, {})
          set((s) => {
            s.stepStack.push({
              command: cmd,
              stepIndex: 0,
              collectedValues: [],
              values: {},
            })
            resetNavigation(s)
          })
        },
        advanceStep: (value) => {
          const frame = get().stepStack.at(-1)
          if (!frame) return

          const step = frame.command.steps[frame.stepIndex]
          const newValues: Record<string, string> = {
            ...frame.values,
            [step.name]: value,
          }

          const hasMore = frame.stepIndex + 1 < frame.command.steps.length

          if (!hasMore) return finish(frame.command, newValues)

          set((s) => {
            const f = s.stepStack.at(-1)!
            f.collectedValues.push(value)
            f.values = newValues
            f.stepIndex++
            resetNavigation(s)
          })
        },
        goBack: () =>
          set((s) => {
            const frame = s.stepStack.at(-1)
            if (!frame) return
            if (frame.stepIndex === 0) s.stepStack.pop()
            else {
              frame.collectedValues.pop()
              frame.stepIndex--
            }
            resetNavigation(s)
          }),
      },
    }
  }),
)
