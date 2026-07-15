import { useEffect } from 'react'
import { AutomationEditor } from '@/features/automation/components/AutomationEditor'
import { useAutomationStore } from '@/features/automation/stores/automationStore'
import { AutomationSidebar } from '@/features/automation/components/AutomationSidebar'
import { AutomationToolbar } from '@/features/automation/components/AutomationToolbar'

export default function AutomationPage() {
  const load = useAutomationStore((s) => s.load)

  useEffect(() => {
    load()
  }, [load])

  return (
    <div className="flex h-full w-full">
      <AutomationSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AutomationToolbar />
        <AutomationContent />
      </div>
    </div>
  )
}

function AutomationContent() {
  const hasSelected = useAutomationStore((s) => !!s.selected)
  const loading = useAutomationStore((s) => s.loading)

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">Loading...</div>
    )
  }

  if (hasSelected) {
    return <AutomationEditor />
  }

  return (
    <div className="text-muted-foreground flex flex-1 items-center justify-center text-sm">
      Select a rule or template.
    </div>
  )
}
