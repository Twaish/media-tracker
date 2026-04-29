import { VisuallyHidden } from 'radix-ui'
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { CommandPaletteFooter } from './CommandPaletteFooter'
import { CommandPaletteInput } from './CommandPaletteInput'
import { CommandPaletteBreadcrumbs } from './CommandPaletteBreadcrumbs'
import { CommandPaletteScopes } from './CommandPaletteScopes'
import { CommandPaletteList } from './CommandPaletteList'

export function PaletteDialog() {
  return (
    <DialogContent
      showCloseButton={false}
      className="z-99 flex max-h-[70vh] flex-col gap-0 overflow-hidden rounded-none p-0"
    >
      <VisuallyHidden.Root asChild>
        <DialogTitle>Command Palette</DialogTitle>
      </VisuallyHidden.Root>
      <VisuallyHidden.Root asChild>
        <DialogDescription>Search or run a command</DialogDescription>
      </VisuallyHidden.Root>
      <CommandPaletteBreadcrumbs />
      <CommandPaletteInput />
      <CommandPaletteScopes />
      <CommandPaletteList />
      <CommandPaletteFooter />
    </DialogContent>
  )
}
