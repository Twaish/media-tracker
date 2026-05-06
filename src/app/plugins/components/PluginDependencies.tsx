import { usePluginItem } from '../stores/usePluginItem'
import { usePluginStore } from '../stores/usePluginStore'

export function PluginDependencies() {
  const { manifest } = usePluginItem()

  if (!manifest.dependencies?.length) return null

  return (
    <div className="bg-card px-1 pb-1">
      <div className="text-muted-foreground mb-1 ml-1 font-mono text-[10px] tracking-widest uppercase">
        Dependencies
      </div>

      <div className="flex flex-wrap gap-1">
        {manifest.dependencies.map((dep) => (
          <Dependency key={dep} pluginName={dep} />
        ))}
      </div>
    </div>
  )
}

function Dependency({ pluginName }: { pluginName: string }) {
  const plugin = usePluginStore((s) =>
    s.plugins.find((p) => p.manifest.id === pluginName),
  )
  if (!plugin) return null

  const manifest = plugin.manifest

  return (
    <div className="hover:bg-muted/50 bg-muted/40 flex max-w-full min-w-max cursor-default items-center gap-1 overflow-hidden rounded-sm p-1 whitespace-pre">
      {manifest.icon ? (
        <img className="h-4 w-4" src={`pluginicon://${manifest.id}`} />
      ) : (
        <div className="flex h-4 w-4 items-center justify-center text-xs">
          {':)'}
        </div>
      )}

      <span className="font-mono text-xs">{manifest.name}</span>
    </div>
  )
}
