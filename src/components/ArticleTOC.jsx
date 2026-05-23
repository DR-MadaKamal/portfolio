import { useState, useEffect, useMemo } from 'react'

export default function ArticleTOC({ content }) {
  const headings = useMemo(() => {
    if (!content) return []
    const results = []
    const lines = content.split('\n')
    for (const line of lines) {
      if (line.startsWith('### ')) results.push({ level: 3, text: line.replace(/^###\s+/, '') })
      else if (line.startsWith('## ')) results.push({ level: 2, text: line.replace(/^##\s+/, '') })
    }
    return results
  }, [content])

  if (headings.length < 2) return null

  return (
    <div className="article-toc">
      <strong className="article-toc-title">Table of Contents</strong>
      <ul>
        {headings.map((h, i) => (
          <li key={i} style={{ paddingLeft: h.level === 3 ? 16 : 0 }}>
            <a href={`#toc-${i}`} onClick={(e) => {
              e.preventDefault()
              const el = document.getElementById(`toc-${i}`)
              if (el) el.scrollIntoView({ behavior: 'smooth' })
            }}>{h.text}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}