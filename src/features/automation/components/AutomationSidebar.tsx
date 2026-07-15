import { ComponentProps } from 'react'
import { Plus } from 'lucide-react'

import { cn } from '@/utils/tailwind'
import { Switch } from '@/components/ui/switch'

import { useAutomationStore } from '../stores/automationStore'
import { useAutomationEditorStore } from '../stores/automationEditorStore'
import { AutomationActionButton } from './AutomationActionButton'

import { updateRule, addTemplate, syncEngine, addRule } from '../actions'

import { PersistedRule } from '@shared/types'

const DEFAULT_TEMPLATE = `TEMPLATE NewTemplate
PARAMETERS {

}
DO {

}`

const DEFAULT_RULE = `RULE NewRule
FOR media:updated
ON media
DO {

}`

export function AutomationSidebar() {
  const rules = useAutomationStore((s) => s.rules)
  const templates = useAutomationStore((s) => s.templates)
  const selected = useAutomationStore((s) => s.selected)
  const setSelected = useAutomationStore((s) => s.setSelected)
  const loadSelected = useAutomationEditorStore((s) => s.loadSelected)
  const load = useAutomationStore((s) => s.load)

  async function createTemplate() {
    await addTemplate(DEFAULT_TEMPLATE)
    await load()
  }

  async function createRule() {
    await addRule({ source: DEFAULT_RULE })
    await load()
  }

  async function toggleRule(rule: PersistedRule, enabled: boolean) {
    await updateRule({
      id: rule.id,
      enabled,
    })

    if (selected?.type === 'rule' && selected.item.id === rule.id) {
      setSelected({
        type: 'rule',
        item: {
          ...rule,
          enabled,
        },
      })
    }

    await load()
  }

  return (
    <div className="flex w-72 flex-col border-r">
      <div className="flex h-8 items-center border-b text-xs">
        <AutomationActionButton onClick={syncEngine}>
          Sync Engine
        </AutomationActionButton>
        <AutomationActionButton onClick={load}>Refresh</AutomationActionButton>
      </div>

      <div className="flex-1 overflow-auto">
        <div>
          <div className="flex h-8 items-center justify-between px-2">
            <div className="text-muted-foreground text-xs">Rules</div>

            <button onClick={createRule}>
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {rules
            .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))
            .map((rule) => (
              <SidebarItem
                key={rule.id}
                onClick={() => {
                  const item = {
                    type: 'rule',
                    item: rule,
                  } as const
                  setSelected(item)
                  loadSelected(item)
                }}
                className={
                  selected?.type === 'rule' && selected.item.id === rule.id
                    ? 'bg-secondary/50'
                    : ''
                }
              >
                <span>{rule.name}</span>

                <Switch
                  checked={rule.enabled}
                  onClick={(e) => e.stopPropagation()}
                  onCheckedChange={(enabled) => toggleRule(rule, enabled)}
                />
              </SidebarItem>
            ))}
        </div>

        <div>
          <div className="flex h-8 items-center justify-between px-2">
            <div className="text-muted-foreground text-xs">Templates</div>

            <button onClick={createTemplate}>
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {templates.map((template) => (
            <SidebarItem
              key={template.id}
              onClick={() => {
                const item = {
                  type: 'template',
                  item: template,
                } as const
                setSelected(item)
                loadSelected(item)
              }}
              className={`w-full px-2 py-1 text-left ${
                selected?.type === 'template' &&
                selected.item.id === template.id
                  ? 'bg-secondary/50'
                  : ''
              }`}
            >
              {template.name}
            </SidebarItem>
          ))}
        </div>
      </div>
    </div>
  )
}

function SidebarItem({ className, children, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        `flex h-8 cursor-pointer items-center justify-between px-2 py-1 text-sm`,
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
