import { useRef, useState } from 'react'
import { Check, Code2, Command, Copy, Info } from 'lucide-react'
import { cn } from '@/utils/tailwind'

export function DSLSearch() {
  const [query, setQuery] = useState('title CONTAINS "Steins" AND score > 8.5')
  const [showAST, setShowAST] = useState(false)

  const [copied, setCopied] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const timeoutRef = useRef<NodeJS.Timeout>(null)

  const handleCopy = async () => {
    const text = JSON.stringify(mockAST, null, 2)

    try {
      await navigator.clipboard.writeText(text)
    } catch {}

    setCopied(true)
    setClickCount((c) => c + 1)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setCopied(false)
      setClickCount(0)
    }, 1000)
  }

  const renderHighlightedQuery = () => {
    const parts = query.split(/(\s+)/)
    return parts.map((part, i) => {
      if (['AND', 'OR', 'IF', 'THEN', 'NOT'].includes(part.toUpperCase())) {
        return (
          <span key={i} className="font-bold text-indigo-600">
            {part}
          </span>
        )
      }
      if (['=', '!=', '<', '<=', '>', '>=', 'CONTAINS', ':'].includes(part)) {
        return (
          <span key={i} className="text-[#f472b6]">
            {part}
          </span>
        )
      }
      if (part.startsWith('"') && part.endsWith('"')) {
        return (
          <span key={i} className="text-[#4ade80]">
            {part}
          </span>
        )
      }
      if (!isNaN(Number(part)) && part.trim() !== '') {
        return (
          <span key={i} className="text-[#4ade80]">
            {part}
          </span>
        )
      }
      if (
        ['title', 'score', 'year', 'genre', 'status'].includes(
          part.toLowerCase(),
        )
      ) {
        return (
          <span key={i} className="text-indigo-600 italic">
            {part}
          </span>
        )
      }
      return <span key={i}>{part}</span>
    })
  }

  const mockAST = {
    type: 'LogicalExpression',
    operator: 'AND',
    left: {
      type: 'BinaryExpression',
      left: 'title',
      operator: 'CONTAINS',
      right: 'Steins',
    },
    right: {
      type: 'BinaryExpression',
      left: 'score',
      operator: '>',
      right: 8.5,
    },
  }

  return (
    <div className="no-drag flex h-6 w-full min-w-50 flex-col">
      <div
        className={cn(
          `border-border relative flex h-full items-center border transition-all duration-200`,
        )}
      >
        <div className="text-muted-foreground pl-2.5 text-[11px]">/</div>

        <div className="relative flex flex-1 items-center overflow-hidden px-2 font-mono text-[11px]">
          <div className="pointer-events-none absolute inset-0 flex items-center px-2 whitespace-pre opacity-0">
            {query}
          </div>
          <div className="pointer-events-none absolute inset-0 flex items-center px-2 whitespace-pre">
            {renderHighlightedQuery()}
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="caret-primary z-10 w-full border-none bg-transparent text-transparent outline-none"
            spellCheck={false}
          />
        </div>

        {/* <button
          onClick={() => setShowAST(!showAST)}
          className={cn(
            `hover:bg-secondary z-1 flex aspect-square h-full items-center justify-center p-1 transition-colors`,
            showAST
              ? 'text-muted-foreground bg-muted'
              : 'text-secondary-foreground',
          )}
        >
          <Code2 size={12} />
        </button>

        <div
          className={cn(
            'bg-background transition-height absolute top-full -left-px h-[calc(var(--spacing)*80+1px)] w-[calc(100%+2px)] min-w-80 origin-top overflow-hidden border duration-100',
            showAST
              ? 'max-h-[calc(var(--spacing)*80+1px)]'
              : 'max-h-0 opacity-0',
          )}
        >
          <div className="flex h-full flex-col overflow-hidden p-3 font-mono text-[10px] leading-relaxed">
            <div className="pixel-border-b flex items-center justify-between pb-2">
              <span className="text-muted-foreground flex items-center gap-2">
                <Info size={10} />
                Parsed AST
              </span>
              <span className="rounded bg-[#4ade80]/10 px-1 text-[9px] text-[#4ade80]">
                Valid Syntax
              </span>
            </div>
            <div className="relative overflow-hidden">
              <pre className="bg-muted/40 h-full min-w-0 overflow-auto p-2 pr-10 whitespace-pre-wrap">
                {JSON.stringify(mockAST, null, 2)}
              </pre>

              <button
                onClick={handleCopy}
                className="hover:border-border absolute top-0 right-0 mt-2 mr-4 flex items-center gap-1 rounded border border-transparent p-1"
              >
                {copied ? (
                  <Check className="h-3 w-3 text-green-500" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
                {clickCount > 1 && (
                  <span className="text-[9px]">x{clickCount}</span>
                )}
              </button>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  )
}
