import { useState, useEffect } from 'react'
import { quotes as defaultQuotes } from '../data/portfolioData'
import { useLang } from '../context/LangContext'

export default function QuoteRotator({ quotes: editedQuotes }) {
  const quotes = editedQuotes || defaultQuotes
  const { t } = useLang()
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000)
    setIdx(dayOfYear % quotes.length)
  }, [])

  const q = quotes[idx]
  if (!q) return null

  return (
    <section className="section quote-section">
      <div className="container" style={{ textAlign: 'center' }}>
        <p className="quote-title">{t.quote.title}</p>
        <blockquote className="quote-text">&ldquo;{q.text}&rdquo;</blockquote>
        <p className="quote-author">&mdash; {q.author}</p>
      </div>
    </section>
  )
}
