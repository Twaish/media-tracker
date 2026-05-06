import { setSettingValue } from '@/app/settings/actions'
import { usePluginSettingsStore } from '../stores/usePluginSettingsStore'
import { queryClient } from '@/core/queryClient'

export function usePluginSettings(manifestId: string, namespace: string) {
  const pending = usePluginSettingsStore((s) => s.pending[manifestId])
  const original = usePluginSettingsStore((s) => s.original[manifestId])
  const isDirty = usePluginSettingsStore((s) => s.isDirty(manifestId))
  const reset = usePluginSettingsStore((s) => s.reset)
  const commit = usePluginSettingsStore((s) => s.commit)

  const save = () => {
    if (!pending) return
    Object.entries(pending).forEach(([fieldId, value]) => {
      if (original?.[fieldId] !== value) {
        setSettingValue(namespace, fieldId, value)
        queryClient.invalidateQueries({
          queryKey: ['setting', manifestId, fieldId],
        })
      }
    })
    commit(manifestId)
  }

  const discard = () => reset(manifestId)

  return { pending, original, isDirty, save, discard }
}
