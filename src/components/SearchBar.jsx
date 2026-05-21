import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SearchBar({ articles, projects }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  const items = [
    ...(articles || []).map(a => ({ title: a.title, type: 'Article', url: '#article-' + a.title?.toLowerCase().replace(/\s+/g, '-') })),
    ...(projects || []).map(p => ({ title: p.title, type: 'Project', url: p.url || '#' })),
  ]

  const results = query.trim()
    ? items.filter(i => i.title?.toLowerCase().includes(query.toLowerCase())).slice(0, 6)
    : []

  return (
    <>
      <button className="search-trigger" onClick={() => setOpen(true)} aria-label="Search">
        <i className="fas fa-search" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div className="search-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={(e) => { if (e.target.className === 'search-overlay') setOpen(false) }}>
            <motion.div className="search-modal"
              initial={{ scale: 0.9, y: -20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: -20 }}>
              <input type="text" value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search articles, projects..." autoFocus
                onKeyDown={e => e.key === 'Escape' && setOpen(false)} />
              <button className="search-close" onClick={() => setOpen(false)}>&times;</button>
              {results.length > 0 && (
                <div className="search-results">
                  {results.map((r, i) => (
                    <a key={i} href={r.url} className="search-result-item" onClick={() => setOpen(false)}>
                      <span className="search-result-type">{r.type}</span>
                      <span>{r.title}</span>
                    </a>
                  ))}
                </div>
              )}
              {query.trim() && results.length === 0 && (
                <p className="search-no-results">No results found for "{query}"</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
