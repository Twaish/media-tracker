import { VisuallyHidden } from 'radix-ui'
import { FolderOpen, Link, Settings } from 'lucide-react'
import { ComponentProps, ReactNode } from 'react'

import { cn } from '@/utils/tailwind'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { DialogFooterHint } from '@/components/dialog/DialogFooterHint'
import { setSettingValue } from '@/app/settings/actions'
import { openFolder, openLink } from '@/app/instance/actions'
import { PluginItem, usePluginItem } from './PluginItem'
import { PluginSettings } from './PluginSettings'
import { queryClient } from '@/core/queryClient'
import { usePluginSettingsStore } from '../stores/usePluginSettingsStore'

export function PluginDialog() {
  const { plugin, manifest } = usePluginItem()

  const handleOpenLocation = () => {
    openFolder(plugin.path)
  }

  const handleOpenSource = () => {
    if (manifest.repository) openLink(manifest.repository)
  }

  return (
    <PluginDialog.Content className="flex max-h-[70vh] flex-col overflow-hidden">
      <PluginItem.Header className="mb-0 max-h-12 p-2">
        <PluginItem.Icon />
        <PluginItem.Details>
          <PluginItem.Title>
            <button
              onClick={handleOpenLocation}
              title={'Open folder'}
              className="opacity-50 transition-opacity duration-100 hover:opacity-100"
            >
              <FolderOpen className="h-3.5 w-3.5" />
            </button>
            {manifest.repository && (
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    title={manifest.repository}
                    className="opacity-50 transition-opacity duration-100 hover:opacity-100"
                  >
                    <Link className="h-3.5 w-3.5" />
                  </button>
                </DialogTrigger>
                <DialogContent className="gap-0 rounded-none p-0">
                  <DialogHeader className="gap-0">
                    <DialogTitle className="flex h-12 items-center border-b p-2 px-4 text-sm">
                      Open this link?
                    </DialogTitle>
                    <VisuallyHidden.Root>
                      <DialogDescription className="p-2">
                        Are you sure you want to open {manifest.repository}
                      </DialogDescription>
                    </VisuallyHidden.Root>
                    <div className="m-2 flex max-h-12 flex-col gap-0.5 border px-2 py-1">
                      <div className="text-muted-foreground/70 font-mono text-[10px] font-semibold tracking-widest uppercase">
                        Link
                      </div>
                      <div className="text-accent-foreground/90 flex items-center gap-1 font-mono text-xs">
                        <Link className="h-3.5 w-3.5" />
                        <span className="w-full">{manifest.repository}</span>
                      </div>
                    </div>
                  </DialogHeader>
                  <DialogFooter className="gap-2">
                    <DialogFooterHint text="close">Esc</DialogFooterHint>
                    <div className="flex-1"></div>
                    <DialogClose asChild>
                      <Button className="text-xs" variant={'secondary'}>
                        cancel
                      </Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button onClick={handleOpenSource} className="text-xs">
                        Open
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
            <div className="text-muted-foreground mr-12 ml-auto font-mono text-[10px]">
              ID: {manifest.id}
            </div>
          </PluginItem.Title>
          <PluginItem.Author />
        </PluginItem.Details>
      </PluginItem.Header>

      <PluginSettings />

      <PluginDialog.Footer />
    </PluginDialog.Content>
  )
}

PluginDialog.Content = function Content({
  children,
  className,
  ...rest
}: ComponentProps<typeof DialogContent> & { children?: ReactNode }) {
  const { manifest } = usePluginItem()
  const reset = usePluginSettingsStore((s) => s.reset)

  const handleOpenChange = (open: boolean) => {
    if (!open) reset(manifest.id)
  }

  return (
    <Dialog onOpenChange={handleOpenChange}>
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

PluginDialog.Footer = function Footer() {
  const { manifest, namespace } = usePluginItem()
  const pending = usePluginSettingsStore((s) => s.pending[manifest.id])
  const original = usePluginSettingsStore((s) => s.original[manifest.id])
  const isDirty = usePluginSettingsStore((s) => s.isDirty(manifest.id))
  const reset = usePluginSettingsStore((s) => s.reset)
  const commit = usePluginSettingsStore((s) => s.commit)

  const handleSave = () => {
    if (!pending) return

    Object.entries(pending).forEach(([fieldId, value]) => {
      if (original?.[fieldId] !== value) {
        setSettingValue(namespace, fieldId, value)
        queryClient.invalidateQueries({
          queryKey: ['setting', manifest.id, fieldId],
        })
      }
    })

    commit(manifest.id)
  }

  const handleReset = () => {
    reset(manifest.id)
  }

  return (
    <DialogFooter>
      {manifest.minAppVersion && (
        <div className="text-muted-foreground/70 font-mono text-[10px] tracking-widest uppercase">
          min. app version:{' '}
          <span className="lowercase">v{manifest.minAppVersion}</span>
        </div>
      )}

      <div className="ml-auto flex items-center gap-3">
        {isDirty && (
          <>
            <Button
              onClick={handleReset}
              variant={'link'}
              className="text-muted-foreground text-xs"
            >
              reset changes
            </Button>
            <Button onClick={handleSave} className="text-xs">
              Save
            </Button>
          </>
        )}
      </div>
    </DialogFooter>
  )
}
