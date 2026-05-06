import { ComponentProps, ReactNode } from 'react'

import { cn } from '@/utils/tailwind'
import { disablePlugin, enablePlugin } from '../actions'
import { Switch } from '@/components/ui/switch'
import { PluginDialog } from './PluginDialog'
import { Plugin, usePluginStore } from '../stores/usePluginStore'
import { PluginItemContext, usePluginItem } from '../stores/usePluginItem'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { TriangleAlert } from 'lucide-react'

export function PluginItem({ plugin }: { plugin: Plugin }) {
  const manifest = plugin.manifest
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
    <PluginItemContext.Provider
      value={{
        plugin,
        manifest: plugin.manifest,
        namespace: `plugin:${manifest.id}`,
      }}
    >
      <div className="bg-card flex-1 border p-2">
        <PluginItem.Header>
          <PluginItem.Icon />
          <PluginItem.Details>
            <PluginItem.Title>
              <PluginItem.Error />
            </PluginItem.Title>
            <PluginItem.Author />
          </PluginItem.Details>
          <PluginDialog />
          <Switch
            className="self-start"
            title={plugin.enabled ? 'enabled' : 'disabled'}
            checked={plugin.enabled}
            disabled={plugin.error != null}
            onCheckedChange={handleCheckedChange}
          />
        </PluginItem.Header>

        <p className="text-muted-foreground mr-auto line-clamp-2 flex-1 text-xs">
          {manifest.description ?? 'This plugin has no description'}
        </p>
        {manifest.permissions && (
          <div className="mt-2 flex flex-wrap items-center gap-1">
            {manifest.permissions.slice(0, 3).map((perm) => (
              <PluginItem.Permission key={perm}>{perm}</PluginItem.Permission>
            ))}
            {manifest.permissions.length > 3 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-accent-foreground cursor-pointer text-[10px]">
                    +{manifest.permissions.length - 3} more
                  </span>
                </TooltipTrigger>
                <TooltipContent className="flex flex-col gap-1">
                  {manifest.permissions.slice(3).map((perm) => (
                    <span key={perm} className="text-xs">
                      {perm}
                    </span>
                  ))}
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        )}
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
  const { manifest } = usePluginItem()
  return (
    <div className="flex items-center gap-2">
      <h3 className="truncate text-sm font-medium">{manifest.name}</h3>
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
  const { manifest } = usePluginItem()
  return (
    <p
      className={cn(
        'text-muted-foreground text-[10px] whitespace-pre',
        className,
      )}
      {...rest}
    >
      <span>by {manifest.author ?? 'Unknown'}</span>
      {children}
    </p>
  )
}
PluginItem.Permission = function Permission({
  className,
  children,
  ...rest
}: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'bg-muted text-muted-foreground flex h-5 items-center px-1.5 text-[10px]',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
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
