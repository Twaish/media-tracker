import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { VisuallyHidden } from 'radix-ui'
import { Check, ChevronDown, ChevronUp, CornerDownLeft } from 'lucide-react'
import {
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogFooter,
} from '@/components/ui/dialog'
import { SearchItem } from '@/components/SearchItem'
import { DialogFooterHint } from '@/components/dialog/DialogFooterHint'
import { DialogSearch } from '@/components/dialog/DialogSearch'
import { useHotkey } from '@/app/hotkeys/hooks/useHotkey'
import { Language } from '../language'
import langs from '../langs'
import { DialogEmptyIndicator } from '@/components/dialog/DialogEmptyIndicator'

export function SelectLanguageDialog({
  onSelect,
}: {
  onSelect: (v: Language) => void
}) {
  const { i18n } = useTranslation()
  const currentLang = i18n.language
  const [query, setQuery] = useState('')
  const [focusedIndex, setFocusedIndex] = useState(0)

  const filtered = useMemo(
    () =>
      langs.filter(
        (l) =>
          l.nativeName.toLowerCase().includes(query.toLowerCase()) ||
          l.key.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  )

  const focusedClamped = Math.min(focusedIndex, filtered.length - 1)

  useEffect(() => setFocusedIndex(0), [query])

  useHotkey({
    keys: 'ArrowDown',
    handler(e) {
      e.preventDefault()
      if (filtered.length)
        setFocusedIndex((focusedClamped + 1) % filtered.length)
    },
  })

  useHotkey({
    keys: 'ArrowUp',
    handler(e) {
      e.preventDefault()
      if (filtered.length)
        setFocusedIndex(
          (focusedClamped - 1 + filtered.length) % filtered.length,
        )
    },
  })

  useHotkey({
    keys: 'Enter',
    handler(e) {
      e.preventDefault()
      const lang = filtered[focusedClamped]
      if (lang) onSelect(lang)
    },
  })

  return (
    <DialogContent
      showCloseButton={false}
      className="z-99 flex max-h-[70vh] flex-col gap-0 overflow-hidden rounded-none p-0"
    >
      <VisuallyHidden.Root asChild>
        <DialogTitle>Select Language</DialogTitle>
      </VisuallyHidden.Root>
      <VisuallyHidden.Root asChild>
        <DialogDescription>
          Choose your preferred display language
        </DialogDescription>
      </VisuallyHidden.Root>

      <DialogSearch
        autoFocus
        value={query}
        placeholder="Search languages..."
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="overflow-y-auto">
        {filtered.length === 0 ? (
          <DialogEmptyIndicator>No results for this query</DialogEmptyIndicator>
        ) : (
          filtered.map((lang, index) => (
            <SearchItem
              key={lang.key}
              isFocused={index === focusedClamped}
              query={query}
              onClick={() => onSelect(lang)}
              onMouseEnter={() => setFocusedIndex(index)}
            >
              <SearchItem.Icon>{lang.prefix}</SearchItem.Icon>
              <SearchItem.Content>
                <SearchItem.Title text={lang.nativeName} />
                <SearchItem.Description text={lang.key} />
              </SearchItem.Content>
              {currentLang === lang.key && (
                <Check
                  size={13}
                  strokeWidth={2.5}
                  className="text-muted-foreground shrink-0"
                />
              )}
            </SearchItem>
          ))
        )}
      </div>

      <DialogFooter>
        <DialogFooterHint text="navigate">
          <ChevronUp />
          <ChevronDown />
        </DialogFooterHint>
        <DialogFooterHint text="select">
          <CornerDownLeft />
        </DialogFooterHint>
        <DialogFooterHint text="close">Esc</DialogFooterHint>
        <div className="flex-1" />
        <span className="text-muted-foreground text-[10px] tracking-widest">
          {filtered.length} result{filtered.length !== 1 ? 's' : ''}
        </span>
      </DialogFooter>
    </DialogContent>
  )
}
