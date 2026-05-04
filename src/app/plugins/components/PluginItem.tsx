import { ComponentProps, ReactNode } from 'react'

import { cn } from '@/utils/tailwind'
import { disablePlugin, enablePlugin } from '../actions'
import { Switch } from '@/components/ui/switch'
import { PluginDialog } from './PluginDialog'
import { Plugin } from '../stores/usePluginStore'
import { PluginItemContext, usePluginItem } from '../stores/usePluginItem'

export function PluginItem({ plugin }: { plugin: Plugin }) {
  const manifest = plugin.manifest

  const handleCheckedChange = (shouldEnable: boolean) => {
    if (shouldEnable) {
      enablePlugin(manifest.id)
    } else {
      disablePlugin(manifest.id)
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
      <div className="bg-card border p-2">
        <PluginItem.Header>
          <PluginItem.Icon />
          <PluginItem.Details>
            <PluginItem.Title />
            <PluginItem.Author />
          </PluginItem.Details>
          <PluginDialog />
          <Switch
            className="self-start"
            title={plugin.enabled ? 'enabled' : 'disabled'}
            defaultChecked={plugin.enabled}
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
              <span className="text-muted-foreground text-[10px]">
                +{manifest.permissions.length - 3}
              </span>
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
        'bg-card mb-2 flex max-h-8 items-center justify-between gap-2',
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
