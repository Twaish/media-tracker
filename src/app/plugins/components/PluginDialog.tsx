import { VisuallyHidden } from 'radix-ui'
import { AlertTriangle, FolderOpen, Link, Settings } from 'lucide-react'
import { ComponentProps, ReactNode, useState } from 'react'

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
import { openFolder, openLink } from '@/app/instance/actions'
import { PluginItem } from './PluginItem'
import { PluginSettings } from './PluginSettings'
import { usePluginItem } from '../hooks/usePluginItem'
import { PluginDependencies } from './PluginDependencies'
import { usePluginSettings } from '../hooks/usePluginSettings'

export function PluginDialog() {
  return (
    <PluginDialog.Content className="flex max-h-[70vh] flex-col overflow-hidden">
      <PluginItem.Header className="mb-0 max-h-12 p-2">
        <PluginItem.Icon />
        <PluginItem.Details>
          <PluginItem.Title>
            <PluginDialog.Location />
            <PluginDialog.Manifest />
            <PluginDialog.Id />
          </PluginItem.Title>
          <PluginItem.Author />
        </PluginItem.Details>
      </PluginItem.Header>
      <PluginDialog.Permissions />
      <PluginDependencies />
      <PluginSettings />
      <PluginDialog.Footer />
    </PluginDialog.Content>
  )
}

PluginDialog.Location = function Location() {
  const { plugin } = usePluginItem()
  const handleOpenLocation = () => {
    openFolder(plugin.path)
  }

  return (
    <button
      onClick={handleOpenLocation}
      title={'Open folder'}
      className="opacity-50 transition-opacity duration-100 hover:opacity-100"
    >
      <FolderOpen className="h-3.5 w-3.5" />
    </button>
  )
}
PluginDialog.Manifest = function Manifest() {
  const { manifest } = usePluginItem()
  const [hasOpened, setHasOpened] = useState(false)

  if (!manifest.repository) return null

  const handleOpenSource = () => {
    if (manifest.repository) openLink(manifest.repository)
  }

  return (
    <Dialog onOpenChange={(open) => open && setHasOpened(open)}>
      <DialogTrigger asChild>
        <button
          title={manifest.repository}
          className="opacity-50 transition-opacity duration-100 hover:opacity-100"
        >
          <Link className="h-3.5 w-3.5" />
        </button>
      </DialogTrigger>
      {hasOpened && (
        <DialogContent className="gap-0 p-0">
          <DialogHeader className="px-4 py-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-3.5 w-3.5" />
              <DialogTitle className="text-sm font-semibold">
                Open this link?
              </DialogTitle>
              {(() => {
                console.log('YUP')
              })()}
            </div>
            <DialogDescription className="text-muted-foreground mt-1">
              Are you sure you want to open
            </DialogDescription>
            <div className="flex max-h-12 flex-col gap-0.5 rounded-sm border px-2 py-1">
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
              <Button variant={'secondary'}>cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button onClick={handleOpenSource}>open</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  )
}
PluginDialog.Id = function Id() {
  const { manifest } = usePluginItem()
  return (
    <div className="text-muted-foreground mr-12 ml-auto font-mono text-[10px]">
      ID: {manifest.id}
    </div>
  )
}

PluginDialog.Content = function Content({
  children,
  className,
  ...rest
}: ComponentProps<typeof DialogContent> & { children?: ReactNode }) {
  const { manifest, namespace } = usePluginItem()
  const [open, setOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const { isDirty, save, discard } = usePluginSettings(manifest.id, namespace)

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && isDirty) {
      setConfirmOpen(true)
      return
    }
    if (isDirty) return
    if (!nextOpen) discard()
    setOpen(nextOpen)
  }

  const handleDiscard = () => {
    discard()
    setConfirmOpen(false)
    setOpen(false)
  }

  const handleCancel = () => {
    setConfirmOpen(false)
  }

  const handleSave = () => {
    save()
    setConfirmOpen(false)
    setOpen(false)
  }

  return (
    <>
      <Dialog onOpenChange={handleOpenChange} open={open}>
        <VisuallyHidden.Root>
          <DialogTitle>{manifest.name} settings</DialogTitle>
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
        {open && (
          <DialogContent className={cn('gap-0 p-0', className)} {...rest}>
            {children}
          </DialogContent>
        )}
      </Dialog>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="gap-0 p-0">
          <DialogHeader className="px-4 py-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-3.5 w-3.5" />
              <DialogTitle className="text-sm font-semibold">
                Unsaved changes
              </DialogTitle>
            </div>
            <DialogDescription className="text-muted-foreground mt-1">
              You have unsaved changes. What do you want to do?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex items-center gap-1.5 px-3">
            <Button
              variant={'ghost'}
              onClick={handleCancel}
              className="text-muted-foreground/70 hover:text-muted-foreground px-3"
            >
              cancel
            </Button>
            <Button
              variant={'ghost'}
              onClick={handleDiscard}
              className="text-secondary-foreground/80 hover:text-secondary-foreground px-3"
            >
              discard
            </Button>
            <Button onClick={handleSave}>save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

PluginDialog.Permissions = function Permissions() {
  const { manifest } = usePluginItem()

  if (!manifest.permissions?.length) return null

  return (
    <div className="bg-card px-1 pb-1">
      <div className="text-muted-foreground mb-1 ml-1 font-mono text-[10px] tracking-widest uppercase">
        Permissions
      </div>
      <div className="flex flex-wrap gap-1">
        {manifest.permissions.sort().map((perm) => (
          <Permission key={perm}>{perm}</Permission>
        ))}
      </div>
    </div>
  )
}

function Permission({ className, children, ...rest }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'hover:bg-muted/50 bg-muted/40 flex max-w-full min-w-max cursor-default items-center gap-1 overflow-hidden rounded-sm p-1 whitespace-pre',
        className,
      )}
      {...rest}
    >
      <span className="font-mono text-xs">{children}</span>
    </div>
  )
}

PluginDialog.Footer = function Footer() {
  const { manifest, namespace } = usePluginItem()
  const { isDirty, save, discard } = usePluginSettings(manifest.id, namespace)

  return (
    <>
      <DialogFooter className="h-8 max-h-8 p-0">
        {manifest.minAppVersion && (
          <div className="text-muted-foreground/70 h-full p-2 font-mono text-[10px] tracking-widest uppercase">
            min. app version:{' '}
            <span className="lowercase">v{manifest.minAppVersion}</span>
          </div>
        )}

        <div className="ml-auto flex h-full items-center">
          {isDirty && (
            <>
              <button
                onClick={discard}
                className="text-muted-foreground hover:text-secondary-foreground mr-2 h-full text-xs"
              >
                reset
              </button>
              <Button variant={'link'} className="mr-1" onClick={save}>
                Save
              </Button>
            </>
          )}
        </div>
      </DialogFooter>
    </>
  )
}
