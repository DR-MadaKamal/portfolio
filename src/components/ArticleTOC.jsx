import { useState, useEffect } from 'react'

export default function ArticleTOC({ content }) {
  const [headings, setHeadings] = useState([])

  useEffect(() => {
    if (!content) return
    const h2s = content.match(/^##\s+(.+)$/gm)
    if (h2s) setHeadings(h2s.map(h => h.replace(/^##\s+/, '')))
  }, [content])

  if (headings.length < 2) return null

  return (
    <div className="article-toc">
      <strong className="article-toc-title">Table of Contents</strong>
      <ul>
        {headings.map((h, i) => (
          <li key={i}>
            <a href={`#toc-${i}`} onClick={(e) => {
              e.preventDefault()
              const el = document.getElementById(`toc-${i}`)
              if (el) el.scrollIntoView({ behavior: 'smooth' })
            }}>{h}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}
