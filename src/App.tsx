import { useEffect, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { syncThemeWithLocal } from './actions/theme'
import { useTranslation } from 'react-i18next'
import './localization/i18n'
import './ipc'
import { router } from './routes/router'
import { RouterProvider } from '@tanstack/react-router'
import { updateAppLanguage } from './actions/language'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function App() {
  const { i18n } = useTranslation()

  useEffect(() => {
    syncThemeWithLocal()
    updateAppLanguage(i18n)
  }, [i18n])

  return <RouterProvider router={router} />
}

document.addEventListener('DOMContentLoaded', () => {
  const root = createRoot(document.getElementById('app')!)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </StrictMode>,
  )
})
