import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { useTranslation } from 'react-i18next'
import { Check, Search, X } from 'lucide-react'
import { cn } from '@/utils/tailwind'
import { useMemo, useState } from 'react'
import langs from '../langs'
import { Language } from '../language'

export function SelectLanguageDialog({
  onSelect,
}: {
  onSelect: (v: Language) => void
}) {
  const { i18n } = useTranslation()
  const currentLang = i18n.language
  const [query, setQuery] = useState('')

  const filtered = useMemo(
    () =>
      langs.filter(
        (l) =>
          l.nativeName.toLowerCase().includes(query.toLowerCase()) ||
          l.key.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  )

  return (
    <div className="flex flex-col">
      <div className="p-3 pb-0">
        <DialogHeader>
          <DialogTitle className="mb-1 font-mono text-xs leading-none font-bold tracking-[0.08em] uppercase">
            Select Language
          </DialogTitle>
          <DialogDescription className="font-mono text-xs leading-[1.4]">
            Choose your preferred display language.
          </DialogDescription>
        </DialogHeader>
      </div>

      <div className="px-2 py-2">
        <div
          className={cn(
            'border-border bg-background flex h-8 items-center gap-1.5 border pl-2',
            query ? 'pr-1' : 'pr-2',
          )}
        >
          <Search
            size={13}
            className="text-muted-foreground shrink-0"
            strokeWidth={1.75}
          />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search languages…"
            spellCheck={false}
            className="flex-1 bg-transparent text-xs outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-muted-foreground hover:text-foreground flex h-6 w-6 items-center justify-center"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      <div className="border-border mx-2 border-t" />

      <div className="max-h-72 overflow-y-auto p-2">
        {filtered.length === 0 ? (
          <div className="text-muted-foreground py-6 text-center text-xs">
            No languages match &ldquo;{query}&rdquo;
          </div>
        ) : (
          <div className="flex flex-col gap-0.5">
            {filtered.map((lang) => {
              const isActive = currentLang === lang.key

              return (
                <button
                  key={lang.key}
                  onClick={() => onSelect(lang)}
                  className={cn(
                    'flex h-8 w-full items-center justify-between px-2 py-1.5 text-left',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent hover:text-accent-foreground',
                  )}
                >
                  <span className="flex items-center gap-2 text-sm">
                    <span className="text-sm">{lang.prefix}</span>
                    <span>{lang.nativeName}</span>
                  </span>

                  {isActive && (
                    <Check size={13} strokeWidth={2.5} className="shrink-0" />
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>

      <div className="border-border border-t" />
      <div className="text-muted-foreground px-4 py-1.5 font-mono text-[11px] tracking-[0.04em]">
        {filtered.length} / {langs.length} languages
      </div>
    </div>
  )
}
