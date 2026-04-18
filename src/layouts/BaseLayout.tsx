import { ReactNode } from 'react'
import DragWindowRegion from '@/components/DragWindowRegion'
import NavigationMenu from '@/components/template/NavigationMenu'
import { useQuery } from '@tanstack/react-query'
import { getAppName } from '@/actions/app'

export default function BaseLayout({ children }: { children: ReactNode }) {
  const { data: appName } = useQuery({
    queryKey: ['appName'],
    queryFn: getAppName,
    staleTime: Infinity,
  })

  return (
    <>
      <DragWindowRegion title={appName} />
      <NavigationMenu />
      <main className="h-screen p-2 pb-20">{children}</main>
    </>
  )
}
