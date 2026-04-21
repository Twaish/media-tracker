import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Calendar,
  History,
  Library,
  Zap,
  Blocks,
  Settings,
  House,
  Box,
  Info,
} from 'lucide-react'
import { cn } from '@/utils/tailwind'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { Link, useRouterState } from '@tanstack/react-router'
import { ComponentProps, ElementType, useState } from 'react'
import { useCountStore } from '@/stores/useCountStore'

const sections = [
  { id: 'home', label: 'Home', icon: House, path: '/' },
  { id: 'counter', label: 'Counter', icon: Box, path: '/counter-page' },
  { id: 'library', label: 'Library', icon: Library, path: '' },
  {
    id: 'watchplans',
    label: 'Watch Plans',
    icon: Calendar,
    path: '',
  },
  { id: 'automation', label: 'Automation', icon: Zap, path: '' },
  { id: 'plugins', label: 'Plugins', icon: Blocks, path: '' },
  { id: 'statistics', label: 'Statistics', icon: BarChart3, path: '' },
  { id: 'history', label: 'History', icon: History, path: '' },
]

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(true)
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const count = useCountStore((s) => s.count)

  const sectionCounts: Record<string, number | undefined> = {
    counter: count,
    library: 1247,
    watchplans: 12,
    automation: 8,
    plugins: 5,
  }

  return (
    <aside
      className={cn(
        'border-border flex shrink-0 flex-col border-r transition-all duration-150',
        collapsed ? 'w-10' : 'w-54',
      )}
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="text-muted-foreground hover:text-foreground flex min-h-8 items-center justify-center border-b transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>
      <nav className="hide-scroll flex-1 overflow-auto mask-[linear-gradient(to_bottom,black_95%,transparent)] pb-16">
        <span
          className={cn(
            'text-muted-foreground flex h-8 items-center overflow-hidden px-3 text-xs font-bold transition-all duration-200',
            collapsed && 'h-0',
          )}
        >
          {!collapsed && 'Media'}
        </span>
        {sections.map((section) => (
          <SidebarItem
            key={section.label}
            isActive={pathname === section.path}
            collapsed={collapsed}
            count={sectionCounts[section.id]}
            icon={section.icon}
            text={section.label}
            path={section.path}
          />
        ))}
        <div className="relative h-8">
          <span
            className={cn(
              'text-muted-foreground absolute inset-0 flex items-center px-3 text-xs font-bold transition-opacity duration-200',
              collapsed ? 'text-[0px] opacity-0' : 'opacity-100',
            )}
          >
            Plugins
          </span>
          <hr
            className={cn(
              'absolute inset-x-2 top-1/2 -translate-y-1/2 border-t transition-opacity duration-200',
              collapsed ? 'opacity-100' : 'opacity-0',
            )}
          />
        </div>
        {sections.map((section) => (
          <SidebarItem
            key={section.label}
            isActive={pathname === section.path}
            collapsed={collapsed}
            count={sectionCounts[section.id]}
            icon={section.icon}
            text={section.label}
            path={section.path}
          />
        ))}
        {sections.map((section) => (
          <SidebarItem
            key={section.label}
            isActive={pathname === section.path}
            collapsed={collapsed}
            count={sectionCounts[section.id]}
            icon={section.icon}
            text={section.label}
            path={section.path}
          />
        ))}
      </nav>
      <SidebarItem
        isActive={pathname === 'about'}
        collapsed={collapsed}
        icon={Info}
        text="About"
      />
      <SidebarItem
        isActive={pathname === 'settings'}
        collapsed={collapsed}
        icon={Settings}
        text="Settings"
        className="border-t"
      />
    </aside>
  )
}

function SidebarItem({
  isActive,
  collapsed,
  icon: Icon,
  text,
  count,
  path,
  className,
  ...rest
}: ComponentProps<'button'> & {
  isActive: boolean
  collapsed: boolean
  icon: ElementType
  text: string
  count?: number
  path?: string
}) {
  const button = (
    <Link to={path} tabIndex={-1} draggable={false}>
      <button
        className={cn(
          'flex h-8 w-full items-center gap-3 px-3 text-sm transition-colors',
          isActive
            ? 'bg-secondary text-sidebar-accent-foreground'
            : 'text-muted-foreground hover:bg-sidebar-accent/50',
          className,
        )}
        {...rest}
      >
        <Icon className="h-4 w-4 shrink-0" />
        {!collapsed && (
          <>
            <span className="flex-1 truncate text-left">{text}</span>
            {count != null && (
              <span className="text-muted-foreground font-mono text-[10px]">
                {count}
              </span>
            )}
          </>
        )}
      </button>
    </Link>
  )

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent side="right">{text}</TooltipContent>
      </Tooltip>
    )
  }

  return button
}
