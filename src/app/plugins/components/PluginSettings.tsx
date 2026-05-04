import { immer } from 'zustand/middleware/immer'
import { create } from 'zustand'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import { Schema } from '@shared/types/features'
import { getSettingsSchema, getSettingValue } from '@/app/settings/actions'
import { usePluginItem } from './PluginItem'

type SettingValue = string | number

interface PluginSettingsStore {
  pending: Record<string, Record<string, SettingValue>>
  original: Record<string, Record<string, SettingValue>>

  setPending: (
    pluginId: string,
    fieldId: string,
    value: SettingValue,
    originalValue: SettingValue,
  ) => void
  reset: (pluginId: string) => void
  commit: (pluginId: string) => void
  isDirty: (pluginId: string) => boolean
}

export const usePluginSettingsStore = create<PluginSettingsStore>()(
  immer((set, get) => ({
    pending: {},
    original: {},

    setPending(pluginId, fieldId, value, originalValue) {
      set((s) => {
        if (!s.pending[pluginId]) s.pending[pluginId] = {}
        if (!s.original[pluginId]) s.original[pluginId] = {}

        if (!(fieldId in s.original[pluginId])) {
          s.original[pluginId][fieldId] = originalValue
        }

        s.pending[pluginId][fieldId] = value
      })
    },

    reset(pluginId) {
      set((s) => {
        delete s.pending[pluginId]
        delete s.original[pluginId]
      })
    },

    commit(pluginId) {
      set((s) => {
        delete s.pending[pluginId]
        delete s.original[pluginId]
      })
    },

    isDirty(pluginId) {
      const pending = get().pending[pluginId]
      const original = get().original[pluginId]
      if (!pending || !original) return false
      return Object.keys(pending).some((k) => pending[k] !== original[k])
    },
  })),
)

export function PluginSettings() {
  const { manifest, namespace } = usePluginItem()

  const { data: settings } = useQuery({
    queryKey: ['settings', manifest.id],
    queryFn: () => getSettingsSchema(namespace),
  })

  // TODO: Dynamically create fields for plugin settings from previous project
  if (!Object.keys(settings ?? {}).length) return null

  return (
    <div className="flex flex-col gap-1 overflow-auto p-1 font-mono text-xs">
      <>
        {settings &&
          Object.entries(settings as Schema).map(([key, setting]) => {
            return <PluginSetting key={key} id={key} setting={setting} />
          })}
      </>
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
    <div className="bg-secondary/30 flex min-h-max justify-between overflow-hidden border p-2">
      <div className="flex max-w-[50%] flex-col overflow-hidden">
        <div className="text-xs">{setting.name}</div>
        <div className="text-muted-foreground text-[11px]">
          {setting.description}
        </div>
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
              value={displayValue}
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
