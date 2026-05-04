import { PluginItem } from '@/app/plugins/components/PluginItem'
import { usePluginStore } from '@/app/plugins/stores/usePluginStore'

export default function PluginsPage() {
  const plugins = usePluginStore((s) => s.plugins)

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 flex-col items-center justify-center gap-2">
        <div className="grid gap-0.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {plugins &&
            plugins.map((plugin) => {
              return <PluginItem key={plugin.manifest.name} plugin={plugin} />
            })}
        </div>
      </div>
    </div>
  )
}
