import { ReactNode, Suspense } from 'react'
import DragWindowRegion from '@/app/window/components/DragWindowRegion'
import { useQuery } from '@tanstack/react-query'
import { getAppName } from '@/app/instance/actions'
import { AppSidebar } from '@/components/template/AppSidebar'
import { BottomPanel } from '@/components/template/BottomPanel'
import { Download, Upload } from 'lucide-react'
import { LanguageSelector } from '@/app/language/components/LanguageSelector'
import { ThemeSelector } from '@/app/theme/components/ThemeSelector'
import { CommandPalette } from '@/app/commandpalette/components/CommandPalette'

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
            <CommandPalette />
            <LanguageSelector />
            <ThemeSelector />
          </div>
        </DragWindowRegion>
        <main className="h-full w-full overflow-auto">
          <Suspense>{children}</Suspense>
        </main>
        <BottomPanel />
      </div>
    </>
  )
}
