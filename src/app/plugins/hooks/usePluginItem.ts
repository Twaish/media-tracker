import { createContext, useContext } from 'react'

import { PluginManifest } from '@shared/types/features'
import { Plugin } from '../stores/usePluginStore'

type PluginItemContextType = {
  plugin: Plugin
  manifest: PluginManifest
  namespace: string
}

export const PluginItemContext = createContext<PluginItemContextType | null>(
  null,
)

export function usePluginItem() {
  const ctx = useContext(PluginItemContext)
  if (!ctx) {
    throw new Error(
      'PluginItem compound components must be used inside PluginItem',
    )
  }
  return ctx
}
