import { VisuallyHidden } from 'radix-ui'
import { Code2, FolderOpen, Settings } from 'lucide-react'
import { ComponentProps, createContext, ReactNode, useContext } from 'react'
import { useQuery } from '@tanstack/react-query'

import { Switch } from '@/components/ui/switch'
import { cn } from '@/utils/tailwind'
import { PluginEntry, PluginManifest } from '@shared/types/features'
import { disablePlugin, enablePlugin } from '../actions'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { getSettingsSchema } from '@/app/settings/actions'

type Plugin = Omit<PluginEntry, 'error'> & { error?: string | null }

type PluginItemContextType = {
  plugin: Plugin
  manifest: PluginManifest
}

const PluginItemContext = createContext<PluginItemContextType | null>(null)

function usePluginItem() {
  const ctx = useContext(PluginItemContext)
  if (!ctx) {
    throw new Error(
      'PluginItem compound components must be used inside PluginItem',
    )
  }
  return ctx
}

export function PluginItem({ plugin }: { plugin: Plugin }) {
  const manifest = plugin.manifest

  const handleCheckedChange = (shouldEnable: boolean) => {
    if (shouldEnable) {
      enablePlugin(manifest.id)
    } else {
      disablePlugin(manifest.id)
    }
  }

  const handleOpenLocation = () => {
    console.log('OPEN ', plugin.path)
  }

  const handleOpenSource = () => {
    console.log('SOURCE ', manifest.repository)
  }

  return (
    <PluginItemContext.Provider value={{ plugin, manifest: plugin.manifest }}>
      <div className="bg-card border p-2">
        <PluginItem.Header>
          <PluginItem.Icon />
          <PluginItem.Details>
            <PluginItem.Title />
            <PluginItem.Author />
          </PluginItem.Details>
          <PluginDialog>
            <PluginItem.Header className="mb-0 max-h-12 p-2">
              <PluginItem.Icon />
              <PluginItem.Details>
                <PluginItem.Title>
                  <button
                    onClick={handleOpenLocation}
                    className="opacity-50 transition-opacity duration-100 hover:opacity-100"
                  >
                    <FolderOpen className="h-4 w-4" />
                  </button>
                  {manifest.repository && (
                    <button
                      onClick={handleOpenSource}
                      className="opacity-50 transition-opacity duration-100 hover:opacity-100"
                    >
                      <Code2 className="h-4 w-4" />
                    </button>
                  )}
                  <div className="text-muted-foreground mr-12 ml-auto font-mono text-[10px]">
                    ID: {manifest.id}
                  </div>
                </PluginItem.Title>
                <PluginItem.Author />
              </PluginItem.Details>
            </PluginItem.Header>

            <PluginSettings />

            <DialogFooter>
              {manifest.minAppVersion && (
                <div className="text-muted-foreground/70 font-mono text-[10px] tracking-widest uppercase">
                  min. app version:{' '}
                  <span className="lowercase">v{manifest.minAppVersion}</span>
                </div>
              )}
              <button className="bg-secondary hover:bg-secondary/50 ml-auto border px-2 py-1 text-xs transition duration-100">
                Save
              </button>
            </DialogFooter>
          </PluginDialog>
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
  return <div className="flex-1">{children}</div>
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
    <p className={cn('text-muted-foreground text-[10px]', className)} {...rest}>
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

function PluginDialog({
  children,
  className,
  ...rest
}: ComponentProps<typeof DialogContent> & { children?: ReactNode }) {
  const { manifest } = usePluginItem()
  return (
    <Dialog>
      <VisuallyHidden.Root>
        <DialogTitle>{manifest.name} settings</DialogTitle>
      </VisuallyHidden.Root>
      <VisuallyHidden.Root>
        <DialogDescription>
          Modify settings for {manifest.name}
        </DialogDescription>
      </VisuallyHidden.Root>
      <DialogTrigger asChild>
        <button
          title="Settings"
          className="self-start opacity-50 transition-opacity duration-100 hover:opacity-200"
        >
          <Settings className="h-4 w-4" />
        </button>
      </DialogTrigger>
      <DialogContent
        className={cn('gap-0 rounded-none p-0', className)}
        {...rest}
      >
        {children}
      </DialogContent>
    </Dialog>
  )
}

function PluginSettings() {
  const { manifest } = usePluginItem()

  const { data: settings } = useQuery({
    queryKey: [`settings:${manifest.id}`],
    queryFn: () => getSettingsSchema(`plugin:${manifest.id}`),
  })

  // TODO: Dynamically create fields for plugin settings
  if (!Object.keys(settings ?? {}).length) return null

  return (
    <pre className="text-muted-foreground bg-secondary/40 m-2 mt-0 overflow-auto border p-2 font-mono text-xs">
      {JSON.stringify(settings, null, 2)}
    </pre>
  )
}
