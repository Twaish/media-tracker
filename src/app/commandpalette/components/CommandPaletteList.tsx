import { ChevronRight, PencilLine, CornerDownLeft } from 'lucide-react'
import { useMemo } from 'react'

import { cn } from '@/utils/tailwind'
import { Kbd } from '@/components/Kbd'
import { SearchItem } from '@/components/SearchItem'
import { useHotkey } from '@/app/hotkeys/hooks/useHotkey'

import { usePalette } from '../stores/paletteStore'
import { useCommandStore } from '../stores/commandStore'

import { Command, StepOption } from '../types'
import { DialogEmptyIndicator } from '@/components/dialog/DialogEmptyIndicator'

const isMac = navigator.platform.toUpperCase().includes('MAC')

const hotkeyToKeys = (hotkey: string): string[] =>
  hotkey
    .toLowerCase()
    .replace('mod', isMac ? '⌘' : 'ctrl')
    .replace('meta', '⌘')
    .replace('alt', isMac ? '⌥' : 'alt')
    .replace('ctrl', isMac ? '⌃' : 'ctrl')
    .split('+')

export function CommandPaletteList() {
  const getFiltered = useCommandStore((s) => s.getFiltered)
  const query = usePalette((s) => s.query)
  const stepStack = usePalette((s) => s.stepStack)
  const activeScope = usePalette((s) => s.activeScope)
  const focusedIndex = usePalette((s) => s.focusedIndex)
  const actions = usePalette((s) => s.actions)

  const isInSteps = stepStack.length > 0

  const currentFrame = isInSteps ? stepStack[stepStack.length - 1] : null

  const currentStep = currentFrame
    ? currentFrame.command.steps[currentFrame.stepIndex]
    : null

  const groups = useMemo(
    () => (isInSteps ? {} : getFiltered(query, activeScope)),
    [query, activeScope, isInSteps],
  )

  const filteredItems = useMemo<Array<StepOption | Command>>(() => {
    if (isInSteps) {
      if (!currentStep || currentStep.type !== 'list') return []
      const q = query.toLowerCase().trim()
      return currentStep.options.filter(
        (o) =>
          !q ||
          o.title.toLowerCase().includes(q) ||
          (o.desc && o.desc.toLowerCase().includes(q)),
      )
    }
    return Object.values(groups).flat()
  }, [isInSteps, currentStep, query, groups])

  const focusedClamped = Math.min(focusedIndex, filteredItems.length - 1)

  useHotkey({
    keys: 'ArrowDown',
    handler(e) {
      e.preventDefault()
      if (filteredItems.length)
        actions.setFocused((focusedClamped + 1) % filteredItems.length)
    },
  })
  useHotkey({
    keys: 'ArrowUp',
    handler(e) {
      e.preventDefault()
      if (filteredItems.length)
        actions.setFocused(
          (focusedClamped - 1 + filteredItems.length) % filteredItems.length,
        )
    },
  })
  useHotkey({
    keys: 'Enter',
    handler(e) {
      e.preventDefault()
      if (!isInSteps) {
        const it = filteredItems[focusedClamped] as Command
        if (it) actions.selectCommand(it)
      } else if (currentStep?.type === 'list') {
        const o = filteredItems[focusedClamped] as StepOption
        if (o) actions.advanceStep(o.title)
      } else if (currentStep?.type === 'input') {
        if (query.trim()) actions.advanceStep(query.trim())
      }
    },
  })

  const EmptyIndicator = () =>
    filteredItems.length === 0 ? (
      <DialogEmptyIndicator>No results for this query</DialogEmptyIndicator>
    ) : null

  return (
    <div className="overflow-y-auto">
      {!isInSteps ? (
        <>
          {Object.entries(groups).map(([scope, items]) => (
            <div key={scope}>
              <div className="text-muted-foreground/50 flex items-center gap-4 px-4 pt-3 pb-1.5 font-mono text-[10px] font-bold tracking-widest uppercase">
                <span>{scope}</span>
                <div className="bg-muted h-px flex-1" />
              </div>
              {items.map((item) => {
                const globalIndex = (filteredItems as Command[]).indexOf(item)
                const handleClick = () => {
                  actions.setFocused(globalIndex)
                  actions.selectCommand(item)
                }
                const handleMouseEnter = () => actions.setFocused(globalIndex)
                return (
                  <SearchItem
                    key={`${scope}_${item.title}`}
                    isFocused={globalIndex === focusedIndex}
                    query={query}
                    onClick={handleClick}
                    onMouseEnter={handleMouseEnter}
                  >
                    <SearchItem.Icon>{item.icon}</SearchItem.Icon>
                    <SearchItem.Content>
                      <SearchItem.Title text={item.title} />
                      <SearchItem.Description text={item.desc} />
                    </SearchItem.Content>
                    <div className="flex shrink-0 items-center gap-1.5">
                      {item.hotkey && <Kbd keys={hotkeyToKeys(item.hotkey)} />}
                      {item.steps.length > 0 && (
                        <span
                          className={cn(
                            'px-1.5',
                            globalIndex === focusedClamped
                              ? 'text-secondary-foreground'
                              : 'text-muted-foreground/50',
                          )}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </span>
                      )}
                    </div>
                  </SearchItem>
                )
              })}
            </div>
          ))}
          <EmptyIndicator />
        </>
      ) : currentStep?.type === 'list' ? (
        <>
          {(filteredItems as StepOption[]).map((option, index) => (
            <SearchItem
              key={`${option.title}_${option.desc}`}
              isFocused={index === focusedIndex}
              query={query}
              onClick={() => {
                actions.setFocused(index)
                actions.advanceStep(option.title)
              }}
              onMouseEnter={() => actions.setFocused(index)}
            >
              <SearchItem.Icon>{option.icon}</SearchItem.Icon>
              <SearchItem.Content>
                <SearchItem.Title>{option.title}</SearchItem.Title>
                <SearchItem.Description>{option.desc}</SearchItem.Description>
              </SearchItem.Content>
            </SearchItem>
          ))}
          <EmptyIndicator />
        </>
      ) : (
        <div className="border-l-primary/50 bg-muted/50 mx-4 my-3 flex items-center gap-4 border-l-2 px-5 py-8">
          <span className="opacity-70">
            <PencilLine />
          </span>
          <span className="text-muted-foreground flex items-center gap-1 text-xs tracking-wide">
            Type a value and press
            <Kbd>
              <CornerDownLeft />
            </Kbd>
            to continue
          </span>
        </div>
      )}
    </div>
  )
}
