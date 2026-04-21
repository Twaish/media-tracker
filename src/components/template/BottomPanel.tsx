import {
  ChevronUp,
  ChevronDown,
  Terminal,
  X,
  Check,
  TriangleAlert,
  Logs,
} from 'lucide-react'
import { cn } from '@/utils/tailwind'
import { ComponentProps, useState } from 'react'

type LogType = 'info' | 'success' | 'warning' | 'error'

interface Log {
  time: string
  type: LogType
  message: string
}

const messages: Record<LogType, string[]> = {
  info: [
    'Query parsed: title:"{title}" year:>={year}',
    'Rule [{rule}] executed successfully',
    'Plugin [{plugin}] synced {n} items',
    'Import completed: {n} items added',
    'Cache refreshed for {n} entries',
  ],
  success: [
    'Found {n} matching results in {ms}ms',
    "Tagged {n} items with '{tag}'",
    'Metadata updated for {n} items',
    'Export completed successfully',
  ],
  warning: [
    'Duplicate detected: {title} ({year}) - possible variant',
    'Rate limit approaching for plugin [{plugin}]',
    'Missing metadata for {n} items',
  ],
  error: [
    'Failed to fetch metadata for item #{id}',
    'Plugin [{plugin}] timed out after {ms}ms',
    'Rule [{rule}] failed: invalid condition',
  ],
}

const titles = [
  'Steins;Gate',
  'Evangelion',
  'Cowboy Bebop',
  'Vinland Saga',
  'Mushishi',
]
const rules = ['auto-tag-sci-fi', 'mark-watched', 'auto-rate', 'flag-duplicate']
const plugins = ['mal-sync', 'anilist-sync', 'tmdb-fetch', 'nfo-export']
const tags = ['Sci-Fi', 'Action', 'Drama', 'Thriller', 'Fantasy']

function fill(template: string): string {
  return template
    .replace('{title}', titles[Math.floor(Math.random() * titles.length)])
    .replace('{year}', String(2000 + Math.floor(Math.random() * 25)))
    .replace('{rule}', rules[Math.floor(Math.random() * rules.length)])
    .replace('{plugin}', plugins[Math.floor(Math.random() * plugins.length)])
    .replace('{tag}', tags[Math.floor(Math.random() * tags.length)])
    .replace('{n}', String(Math.floor(Math.random() * 50) + 1))
    .replace('{ms}', (Math.random() * 10).toFixed(1))
    .replace('{id}', String(Math.floor(Math.random() * 9000) + 1000))
}

function randomTime(): string {
  const h = String(Math.floor(Math.random() * 24)).padStart(2, '0')
  const m = String(Math.floor(Math.random() * 60)).padStart(2, '0')
  const s = String(Math.floor(Math.random() * 60)).padStart(2, '0')
  return `${h}:${m}:${s}`
}

function generateLogs(n: number): Log[] {
  const types = Object.keys(messages) as LogType[]

  return Array.from({ length: n }, () => {
    const type = types[Math.floor(Math.random() * types.length)]
    const pool = messages[type]
    const template = pool[Math.floor(Math.random() * pool.length)]

    return { time: randomTime(), type, message: fill(template) }
  })
}

const mockLogs = generateLogs(20)

const logTypeStyles = {
  info: { icon: Terminal, color: 'text-muted-foreground' },
  success: { icon: Check, color: 'text-[oklch(0.65_0.2_145)]' },
  warning: { icon: TriangleAlert, color: 'text-[oklch(0.75_0.15_50)]' },
  error: { icon: X, color: 'text-[oklch(0.55_0.2_25)]' },
}

export function BottomPanel() {
  const [expanded, setExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState<'logs' | 'rules' | 'console'>(
    'logs',
  )

  return (
    <div
      className={cn(
        'bg-card flex max-h-48 min-h-8 flex-col transition-all duration-150',
        expanded ? 'h-48 min-h-48' : 'h-8',
      )}
    >
      <div className="flex h-8 shrink-0 items-center justify-between border-t border-b">
        <div className="flex h-full">
          <PanelButton
            text={'Logs'}
            isActive={activeTab === 'logs'}
            onClick={() => setActiveTab('logs')}
          />
          <PanelButton
            text={'Rule Output'}
            isActive={activeTab === 'rules'}
            onClick={() => setActiveTab('rules')}
          />
          <PanelButton
            text={'Console'}
            isActive={activeTab === 'console'}
            onClick={() => setActiveTab('console')}
          />
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-muted-foreground hover:text-foreground hover:bg-secondary flex h-full w-8 items-center justify-center transition-colors"
        >
          {expanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronUp className="h-4 w-4" />
          )}
        </button>
      </div>

      {expanded && (
        <div className="flex-1 overflow-auto font-mono text-[11px]">
          {activeTab === 'logs' &&
            mockLogs.map((log, i) => {
              const LogIcon =
                logTypeStyles[log.type as keyof typeof logTypeStyles].icon
              const color =
                logTypeStyles[log.type as keyof typeof logTypeStyles].color
              return (
                <div
                  key={i}
                  className={cn(
                    'hover:bg-secondary/30 flex h-8 max-h-8 items-start gap-2 px-3 py-1.5',
                    i !== 0 && 'border-t',
                  )}
                >
                  <span className="text-muted-foreground shrink-0">
                    {log.time}
                  </span>
                  <LogIcon
                    className={cn('mt-0.5 h-3.5 w-3.5 shrink-0', color)}
                  />
                  <span className="text-foreground">{log.message}</span>
                </div>
              )
            })}
          {activeTab === 'rules' && (
            <div className="text-muted-foreground p-3">
              <p>No rule execution in progress.</p>
              <p className="mt-1">
                Last execution: Rule [auto-tag-sci-fi] at 14:31:45
              </p>
            </div>
          )}
          {activeTab === 'console' && (
            <div className="p-3">
              <div className="text-muted-foreground flex items-center gap-2">
                <span className="text-primary">{'>'}</span>
                <span className="animate-pulse">_</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function PanelButton({
  text,
  isActive,
  className,
  ...rest
}: ComponentProps<'button'> & {
  text: string
  isActive: boolean
}) {
  return (
    <button
      className={cn(
        'flex h-full items-center gap-2 px-4 text-[12px] transition-colors',
        isActive
          ? 'bg-secondary text-foreground'
          : 'text-muted-foreground hover:text-foreground',
      )}
      {...rest}
    >
      {text}
    </button>
  )
}
