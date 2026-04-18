import Footer from '@/components/template/Footer'
import { useTranslation } from 'react-i18next'
import Counter from '@/components/Counter'

export default function CounterPage() {
  const { t } = useTranslation()

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 flex-col items-center justify-center gap-2">
        <h1 className="text-4xl font-bold">{t('titleCounterPage')}</h1>
        <Counter />
      </div>
      <Footer />
    </div>
  )
}
