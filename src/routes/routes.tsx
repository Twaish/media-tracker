import { createRoute as createReactRoute } from '@tanstack/react-router'
import { RootRoute } from './__root'
import HomePage from '@/pages/HomePage'
import CounterPage from '@/pages/CounterPage'
import LibraryPage from '@/pages/LibraryPage'
import AutomationPage from '@/pages/AutomationPage'

const routes: ReturnType<typeof createReactRoute>[] = []
function createRoute(...options: Parameters<typeof createReactRoute>) {
  const route = createReactRoute(...options)
  routes.push(route)
}

createRoute({
  getParentRoute: () => RootRoute,
  path: '/',
  component: HomePage,
})

createRoute({
  getParentRoute: () => RootRoute,
  path: '/counter-page',
  component: CounterPage,
})

createRoute({
  getParentRoute: () => RootRoute,
  path: '/library',
  component: LibraryPage,
})

createRoute({
  getParentRoute: () => RootRoute,
  path: '/automation',
  component: AutomationPage,
})

export const rootTree = RootRoute.addChildren(routes)
