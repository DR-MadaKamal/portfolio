import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { articles } from '../data/portfolioData'
import { useLang } from '../context/LangContext'

const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December']

export default function ArticlePage({ articleIdx, onClose }) {
  const { t } = useLang()
  const [idx, setIdx] = useState(articleIdx)
  const a = articles[idx]
  if (!a) return null

  const navigate = (dir) => {
    const next = idx + dir
    if (next >= 0 && next < articles.length) setIdx(next)
  }

  return (
    <AnimatePresence>
      <motion.div
        className="article-page-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => { if (e.target.className === 'article-page-overlay') onClose() }}
      >
        <motion.div
          className="article-page"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
        >
          <button className="article-page-close" onClick={onClose}>&times;</button>

          {a.image && <img src={a.image} alt={a.title} className="article-page-img" />}

          <div className="article-page-body">
            <div className="article-page-meta">
              <span>{monthNames[new Date(a.date).getMonth()]} {new Date(a.date).getDate()}, {new Date(a.date).getFullYear()}</span>
              <span><i className="far fa-clock" /> {a.readTime}</span>
            </div>

            <h1>{a.title}</h1>
            <p className="article-page-desc">{a.description}</p>

            <div className="article-page-content" dangerouslySetInnerHTML={{
              __html: (a.content || a.description || '')
                .split('\n')
                .map(line => {
                  if (line.startsWith('## ')) return `<h2>${line.slice(3)}</h2>`
                  if (line.startsWith('- ')) return `<li>${line.slice(2)}</li>`
                  if (line.trim() === '') return '<br/>'
                  if (line.startsWith('**') && line.endsWith('**')) return `<strong>${line.slice(2, -2)}</strong>`
                  if (line.match(/^\d+\.\s/)) return `<li>${line.replace(/^\d+\.\s/, '')}</li>`
                  return `<p>${line}</p>`
                }).join('\n')
            }} />

            <div className="article-page-nav">
              <button disabled={idx === 0} onClick={() => navigate(-1)}>
                <i className="fas fa-arrow-left" /> Previous
              </button>
              <span>{idx + 1} / {articles.length}</span>
              <button disabled={idx === articles.length - 1} onClick={() => navigate(1)}>
                Next <i className="fas fa-arrow-right" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
