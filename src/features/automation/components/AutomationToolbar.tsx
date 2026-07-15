import { useAutomationStore } from '../stores/automationStore'
import { Save, Trash2, Undo2 } from 'lucide-react'
import { useAutomationEditorStore } from '../stores/automationEditorStore'
import { useConfirmationDialog } from '@/components/confirmation-dialog/useConfirmationDialog'
import { useHotkey } from '@/app/hotkeys/hooks/useHotkey'
import { AutomationActionButton } from './AutomationActionButton'

export function AutomationToolbar() {
  const name = useAutomationStore((s) => s.selected?.item.name)
  const hasSelected = useAutomationStore((s) => !!s.selected)

  const dirty = useAutomationEditorStore((s) => s.dirty)

  if (!name) return null

  return (
    <div className="flex h-8 items-center justify-between border-b">
      <div className="flex h-full items-center gap-2">
        {hasSelected && <AutomationToolbar.TypeIndicator />}
        <div className="font-mono text-xs">{name}</div>
        {dirty && <div className="text-xs opacity-50">Unsaved changes</div>}
      </div>

      {hasSelected && (
        <div className="flex h-full">
          {dirty && <AutomationToolbar.SaveButton />}
          {dirty && <AutomationToolbar.ResetButton />}

          <AutomationToolbar.DeleteButton />
        </div>
      )}
    </div>
  )
}
AutomationToolbar.TypeIndicator = function TypeIndicator() {
  const type = useAutomationStore((s) => s.selected!.type)

  return (
    <div className="bg-secondary/30 text-muted-foreground flex h-full items-center border-r px-3 font-mono text-xs uppercase select-none">
      {type}
    </div>
  )
}
AutomationToolbar.SaveButton = function SaveButton() {
  const save = useAutomationEditorStore((s) => s.save)

  useHotkey({
    keys: 'ctrl+s',
    handler: save,
  })

  return (
    <AutomationActionButton onClick={save}>
      <Save className="mr-1 h-3.5 w-3.5" />
      Save
    </AutomationActionButton>
  )
}
AutomationToolbar.ResetButton = function ResetButton() {
  const reset = useAutomationEditorStore((s) => s.reset)
  const loadSelected = useAutomationEditorStore((s) => s.loadSelected)
  const selected = useAutomationStore((s) => s.selected)

  function resetChanges() {
    if (!selected) return
    reset()
    loadSelected(selected)
  }

  return (
    <AutomationActionButton onClick={resetChanges}>
      <Undo2 className="mr-1 h-3.5 w-3.5" />
      Reset changes
    </AutomationActionButton>
  )
}
AutomationToolbar.DeleteButton = function DeleteButton() {
  const selected = useAutomationStore((s) => s.selected!)
  const remove = useAutomationEditorStore((s) => s.remove)
  const { confirm } = useConfirmationDialog({
    onConfirm: remove,
    title: `Delete ${selected.type} "${selected.item.name}"?`,
  })

  return (
    <AutomationActionButton onClick={confirm}>
      <Trash2 className="mr-1 h-3.5 w-3.5" />
      Delete
    </AutomationActionButton>
  )
}
