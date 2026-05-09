import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import { Schema } from '@shared/types/features'
import { getSettingsSchema, getSettingValue } from '@/app/settings/actions'
import {
  SettingValue,
  usePluginSettingsStore,
} from '../stores/usePluginSettingsStore'
import { usePluginItem } from '../hooks/usePluginItem'

export function PluginSettings() {
  const { manifest, namespace } = usePluginItem()

  const { data: settings } = useQuery({
    queryKey: ['settings', manifest.id],
    queryFn: () => getSettingsSchema(namespace),
  })

  // TODO: Dynamically create fields for plugin settings from previous project
  if (!Object.keys(settings ?? {}).length) return null

  return (
    <div className="bg-card flex flex-col overflow-auto pb-1">
      <div className="text-muted-foreground mb-1 ml-2 font-mono text-[10px] tracking-widest uppercase">
        Settings
      </div>

      <div className="flex flex-col gap-1 overflow-auto font-mono text-xs">
        {settings &&
          Object.entries(settings as Schema).map(([key, setting]) => {
            return <PluginSetting key={key} id={key} setting={setting} />
          })}
      </div>
    </div>
  )
}

function PluginSetting({
  id,
  setting,
}: {
  id: string
  setting: Schema[keyof Schema]
}) {
  if (setting.visible === false) return null
  const [visible, setVisible] = useState(false)
  const { manifest, namespace } = usePluginItem()

  const { data: value, isLoading } = useQuery({
    queryKey: ['setting', manifest.id, id],
    queryFn: () => getSettingValue(namespace, id) as Promise<string | number>,
  })

  const setPending = usePluginSettingsStore((s) => s.setPending)
  const pendingValue = usePluginSettingsStore(
    (s) => s.pending[manifest.id]?.[id],
  )

  const valueType = typeof setting.default

  const displayValue = pendingValue !== undefined ? pendingValue : value

  const handleChange = (raw: string) => {
    const coerced: SettingValue = valueType === 'number' ? Number(raw) : raw

    setPending(manifest.id, id, coerced, value as SettingValue)
  }

  return (
    <div className="focus-within:bg-secondary/30 flex min-h-max justify-between overflow-hidden py-1 pr-2 pl-3">
      <div className="flex max-w-[50%] flex-col justify-center overflow-hidden">
        <div className="text-xs">
          {displayValue !== value && '~ '}
          {setting.name ?? id}
        </div>
        {setting.description && (
          <div className="text-muted-foreground text-[11px]">
            {setting.description}
          </div>
        )}
      </div>
      <div className="flex items-center">
        {isLoading ? (
          'loading...'
        ) : setting.readonly ? (
          <span className="mx-2">{displayValue}</span>
        ) : (
          <>
            <input
              type={setting.secret && !visible ? 'password' : valueType}
              className="flex-1 border px-2 py-1 outline-0"
              value={displayValue ?? ''}
              onChange={(e) => handleChange(e.target.value)}
              inputMode={
                setting.secret && valueType === 'number' ? 'numeric' : undefined
              }
            />
            {setting.secret && (
              <button
                className="border border-l-0 p-1"
                onClick={() => setVisible(!visible)}
              >
                {visible ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
