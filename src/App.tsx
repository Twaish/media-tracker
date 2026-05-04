import { useEffect, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { syncThemeWithLocal } from './app/theme/actions'
import { useTranslation } from 'react-i18next'
import { router } from './routes/router'
import { RouterProvider } from '@tanstack/react-router'
import { updateAppLanguage } from './app/language/actions'

import { QueryClientProvider } from '@tanstack/react-query'
import { TooltipProvider } from './components/ui/tooltip'
import { ModalProvider } from './stores/modal/useModalStore'
import { hotkeyManager } from './app/hotkeys/hotkeyManager'
import { queryClient } from './core/queryClient'
import { usePluginStore } from './app/plugins/stores/usePluginStore'

export default function App() {
  const { i18n } = useTranslation()
  const initPluginStore = usePluginStore((s) => s.init)

  useEffect(() => {
    updateAppLanguage(i18n)
  }, [i18n])

  useEffect(() => {
    const destroy = hotkeyManager.init()
    syncThemeWithLocal()
    initPluginStore()
    return () => {
      destroy?.()
    }
  }, [])

  return <RouterProvider router={router} />
}

document.addEventListener('DOMContentLoaded', () => {
  const root = createRoot(document.getElementById('app')!)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ModalProvider />
        <TooltipProvider>
          <App />
        </TooltipProvider>
      </QueryClientProvider>
    </StrictMode>,
  )
})
