import { useTranslation } from 'react-i18next'
import LanguageSelector from '@/app/language/components/LanguageSelector'
import Footer from '@/components/template/Footer'
import { getAppName } from '@/app/instance/actions'
import { useQuery } from '@tanstack/react-query'

export default function HomePage() {
  const { t } = useTranslation()
  const { data: appName } = useQuery({
    queryKey: ['appName'],
    queryFn: getAppName,
    staleTime: Infinity,
  })

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 flex-col items-center justify-center gap-2">
        <span>
          <h1 className="font-mono text-4xl font-bold">{appName}</h1>
          <p
            className="text-muted-foreground text-end text-sm uppercase"
            data-testid="pageTitle"
          >
            {t('titleHomePage')}
          </p>
        </span>
        <img
          height={150}
          width={100}
          alt="Minecraft Temple"
          src="images://9799f8effb60f0cf1d15eab94b356535a33e87de7037130f6b243d0e41782a32.png"
        />
        <img
          width={150}
          height={100}
          alt="Macaw Closeup"
          src="images://?url=https://img.freepik.com/free-photo/closeup-scarlet-macaw-from-side-view-scarlet-macaw-closeup-head_488145-3540.jpg"
        />
        <LanguageSelector />
      </div>
      <Footer />
    </div>
  )
}
