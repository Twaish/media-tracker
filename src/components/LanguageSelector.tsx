import langs from '@/localization/langs'
import { useTranslation } from 'react-i18next'
import { setAppLanguage } from '@/actions/language'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'

export default function LanguageSelector() {
  const { i18n } = useTranslation()
  const currentLang = i18n.language

  function onValueChange(value: string) {
    setAppLanguage(value, i18n)
  }

  return (
    <Select defaultValue={currentLang} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {langs.map((lang) => (
          <SelectItem key={lang.key} value={lang.key}>
            {`${lang.prefix} ${lang.nativeName}`}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
