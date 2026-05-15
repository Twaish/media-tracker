import { ComponentProps, ReactNode } from 'react'

import { cn } from '@/utils/tailwind'
import { disablePlugin, enablePlugin } from '../actions'
import { Switch } from '@/components/ui/switch'
import { PluginDialog } from './PluginDialog'
import { Plugin, usePluginStore } from '../stores/usePluginStore'
import { PluginItemContext, usePluginItem } from '../hooks/usePluginItem'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { TriangleAlert } from 'lucide-react'
import { Highlight } from '@/components/Highlight'

export function PluginItem({
  plugin,
  query,
}: {
  plugin: Plugin
  query: string
}) {
  return (
    <PluginItemContext.Provider
      value={{
        query,
        plugin,
        manifest: plugin.manifest,
        namespace: `plugin:${plugin.manifest.id}`,
      }}
    >
      <div className="bg-card flex-1 border-t p-2">
        <PluginItem.Header>
          <PluginItem.Icon />
          <PluginItem.Details>
            <PluginItem.Title>
              <PluginItem.Error />
            </PluginItem.Title>
            <PluginItem.Author />
          </PluginItem.Details>
          <PluginDialog />
          <PluginItem.Toggle />
        </PluginItem.Header>
        <PluginItem.Description />
      </div>
    </PluginItemContext.Provider>
  )
}

PluginItem.Header = function Header({
  children,
  className,
  ...rest
}: ComponentProps<'div'> & { children?: ReactNode }) {
  return (
    <div
      className={cn(
        'mb-2 flex max-h-8 items-center justify-between gap-2',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
PluginItem.Toggle = function Toggle() {
  const { plugin, manifest } = usePluginItem()
  const refresh = usePluginStore((s) => s.refresh)

  const handleCheckedChange = async (shouldEnable: boolean) => {
    if (shouldEnable) {
      await enablePlugin(manifest.id)
      refresh()
    } else {
      await disablePlugin(manifest.id)
      refresh()
    }
  }

  return (
    <Switch
      className="self-start"
      title={plugin.enabled ? 'enabled' : 'disabled'}
      checked={plugin.enabled}
      disabled={plugin.error != null}
      onCheckedChange={handleCheckedChange}
    />
  )
}
PluginItem.Description = function Description() {
  const { manifest } = usePluginItem()
  return (
    <p className="text-muted-foreground mr-auto line-clamp-2 flex-1 text-xs">
      {manifest.description ?? 'This plugin has no description'}
    </p>
  )
}
PluginItem.Icon = function Icon() {
  const { manifest } = usePluginItem()
  return manifest.icon ? (
    <img className="h-8 w-8" src={`pluginicon://${manifest.id}`} />
  ) : (
    <div className="flex h-8 w-8 items-center justify-center">{':)'}</div>
  )
}
PluginItem.Details = function Details({ children }: { children?: ReactNode }) {
  return <div className="flex-1 overflow-hidden">{children}</div>
}
PluginItem.Title = function Title({ children }: { children?: ReactNode }) {
  const { manifest, query } = usePluginItem()
  return (
    <div className="flex items-center gap-2">
      <h3 className="truncate text-sm font-medium">
        <Highlight text={manifest.name} term={query} />
      </h3>
      {manifest.version && (
        <span className="text-muted-foreground shrink-0 font-mono text-[10px]">
          v{manifest.version}
        </span>
      )}
      {children}
    </div>
  )
}
PluginItem.Author = function Author({
  children,
  className,
  ...rest
}: ComponentProps<'p'> & { children?: ReactNode }) {
  const { manifest, query } = usePluginItem()
  return (
    <p
      className={cn(
        'text-muted-foreground text-[10px] whitespace-pre',
        className,
      )}
      {...rest}
    >
      <span>
        by{' '}
        {manifest.author ? (
          <Highlight text={manifest.author} term={query} />
        ) : (
          'Unknown'
        )}
      </span>
      {children}
    </p>
  )
}
PluginItem.Error = function Error({
  className,
  children,
  ...rest
}: ComponentProps<'svg'>) {
  const { plugin } = usePluginItem()

  if (plugin.error == null) return null

  return (
    <Tooltip>
      <TooltipTrigger>
        <TriangleAlert
          className={cn(
            'text-destructive-foreground flex h-3.5 w-3.5 items-center justify-center self-start',
            className,
          )}
          {...rest}
        />
      </TooltipTrigger>
      <TooltipContent>{plugin.error}</TooltipContent>
    </Tooltip>
  )
}
