import { ReactNode, Suspense } from 'react'
import DragWindowRegion from '@/app/window/components/DragWindowRegion'
import { useQuery } from '@tanstack/react-query'
import { getAppName } from '@/app/instance/actions'
import { AppSidebar } from '@/components/template/AppSidebar'
import { BottomPanel } from '@/components/template/BottomPanel'
import { Command, Download, Upload } from 'lucide-react'
import { DSLSearch } from '@/components/DSLSearch'
import { LanguageSelector } from '@/app/language/components/LanguageSelector'
import { ThemeSelector } from '@/app/theme/components/ThemeSelector'

export default function BaseLayout({ children }: { children: ReactNode }) {
  const { data: appName } = useQuery({
    queryKey: ['appName'],
    queryFn: getAppName,
    staleTime: Infinity,
  })

  return (
    <>
      <AppSidebar />
      <div className="relative flex flex-[1_1_auto] flex-col overflow-hidden">
        <DragWindowRegion title={appName}>
          <span className="w-8"></span>
          <DSLSearch />
          <span className="w-8"></span>

          <div className="flex h-full items-center">
            <button className="no-drag text-muted-foreground hover:text-foreground hover:bg-secondary ml-1 flex h-full items-center gap-1.5 px-2 text-xs transition-colors">
              <Upload className="h-3 w-3" />
              <span className="hidden sm:inline">Import</span>
            </button>
            <button className="no-drag text-muted-foreground hover:text-foreground hover:bg-secondary flex h-full items-center gap-1.5 px-2 text-xs transition-colors">
              <Download className="h-3 w-3" />
              <span className="hidden sm:inline">Export</span>
            </button>

            <div className="bg-border mx-1 h-4 w-px" />
            <button className="no-drag text-muted-foreground hover:text-foreground flex h-full min-w-6 items-center justify-center transition-colors duration-200">
              <Command className="h-3 w-3" />
            </button>
            <LanguageSelector />
            <ThemeSelector />
          </div>
        </DragWindowRegion>
        <main className="h-full w-full overflow-auto p-2">
          <Suspense>{children}</Suspense>
        </main>
        <BottomPanel />
      </div>
    </>
  )
}
