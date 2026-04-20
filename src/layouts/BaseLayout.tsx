import { ReactNode, Suspense } from 'react'
import DragWindowRegion from '@/app/window/components/DragWindowRegion'
import { useQuery } from '@tanstack/react-query'
import { getAppName } from '@/app/instance/actions'
import { AppSidebar } from '@/components/template/AppSidebar'
import { BottomPanel } from '@/components/template/BottomPanel'

export default function BaseLayout({ children }: { children: ReactNode }) {
  const { data: appName } = useQuery({
    queryKey: ['appName'],
    queryFn: getAppName,
    staleTime: Infinity,
  })

  return (
    <>
      <AppSidebar />
      <div className="relative flex flex-[1_1_auto] flex-col">
        <DragWindowRegion title={appName} />
        <main className="h-full w-full overflow-auto p-2">
          <Suspense>{children}</Suspense>
        </main>
        <BottomPanel />
      </div>
    </>
  )
}
