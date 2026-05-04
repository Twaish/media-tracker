import { createMemoryHistory, createRouter } from '@tanstack/react-router'
import { rootTree } from './routes'

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const LAST_ROUTE_KEY = 'lastRoute'

function getInitialRoute() {
  try {
    const stored = localStorage.getItem(LAST_ROUTE_KEY)
    return stored ?? '/'
  } catch {
    return '/'
  }
}

const history = createMemoryHistory({
  initialEntries: [getInitialRoute()],
})
export const router = createRouter({ routeTree: rootTree, history: history })

router.subscribe('onResolved', (state) => {
  try {
    localStorage.setItem(LAST_ROUTE_KEY, state.toLocation.pathname)
  } catch (err) {
    console.error(err)
  }
})
