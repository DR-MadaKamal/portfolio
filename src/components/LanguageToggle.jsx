import { useState, useEffect } from 'react'
import { useLang } from '../context/LangContext'

export default function LanguageToggle() {
  const { lang, setLang } = useLang()
  return (
    <button className="lang-toggle" onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} title="Toggle language">
      {lang === 'en' ? 'AR' : 'EN'}
    </button>
  )
}
