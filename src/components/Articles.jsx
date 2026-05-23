import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { articles as defaultArticles } from '../data/portfolioData'
import ArticlePage from './ArticlePage'
import { useLang } from '../context/LangContext'

const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December']

const thumbnails = [
  { gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', icon: 'fa-brain' },
  { gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', icon: 'fa-capsules' },
  { gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', icon: 'fa-play-circle' },
  { gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', icon: 'fa-search' },
  { gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', icon: 'fa-ad' },
  { gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', icon: 'fa-laptop-code' },
]

const cardAnim = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-40px' }, transition: { duration: 0.5 } }

export default function Articles({ articles: editedArticles, initialArticleIdx, onArticleOpened }) {
  const articles = editedArticles || defaultArticles
  const { t } = useLang()
  const [articleIdx, setArticleIdx] = useState(initialArticleIdx != null ? initialArticleIdx : null)
  const [activeTag, setActiveTag] = useState('')

  useEffect(() => {
    if (initialArticleIdx != null) setArticleIdx(initialArticleIdx)
  }, [initialArticleIdx])

  const allTags = [...new Set(articles.flatMap(a => a.tags || []))].sort()
  const filtered = activeTag ? articles.filter(a => (a.tags || []).includes(activeTag)) : articles

  const openArticle = (i) => {
    const realIdx = articles.indexOf(filtered[i])
    setArticleIdx(realIdx)
    onArticleOpened?.(realIdx)
  }

  return (
    <section id="articles" className="section">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="section-title">
            <small>{t.articles.subtitle}</small>
            {t.articles.title}
          </h2>
        </motion.div>

        {allTags.length > 0 && (
          <div className="tab-filters" style={{ marginBottom: 28 }}>
            <button className={`tab-filter ${!activeTag ? 'active' : ''}`} onClick={() => setActiveTag('')}>All</button>
            {allTags.map(tag => (
              <button key={tag} className={`tab-filter ${activeTag === tag ? 'active' : ''}`} onClick={() => setActiveTag(tag)}>{tag}</button>
            ))}
          </div>
        )}

        <div className="articles-grid">
          {filtered.map((a, i) => (
            <motion.div key={i} className="article-card" {...cardAnim}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              onClick={() => openArticle(i)}
              style={{ cursor: 'pointer' }}>
              {a.image ? (
                <img src={a.image} alt={a.title} className="article-thumb-img" loading="lazy" />
              ) : (
                <div className="article-thumb" style={{ background: thumbnails[i % thumbnails.length]?.gradient || 'var(--accent)' }}>
                  <i className={`fas ${thumbnails[i % thumbnails.length]?.icon || 'fa-file'}`} />
                </div>
              )}
              <div className="article-card-body">
                {a.tags && a.tags.length > 0 && (
                  <div className="article-tags" style={{ marginBottom: 8, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {a.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="tag" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>{tag}</span>
                    ))}
                  </div>
                )}
                <h3>{a.title}</h3>
                <p>{a.description}</p>
                <div className="article-meta">
                  {a.author && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginRight: 8 }}>
                      {a.author.avatar && <img src={a.author.avatar} alt="" style={{ width: 16, height: 16, borderRadius: '50%', objectFit: 'cover' }} />}
                      <span>{a.author.name}</span>
                    </span>
                  )}
                  {a.date && `${monthNames[new Date(a.date).getMonth()]} ${new Date(a.date).getDate()}, ${new Date(a.date).getFullYear()} · `}
                  <i className="far fa-clock" style={{ marginRight: 3 }} /> {a.readTime}
                </div>
                <span className="article-read-link">{t.articles.read} <i className="fas fa-arrow-right" /></span>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>No articles match the selected tag.</p>
        )}

        {articleIdx != null && (
          <ArticlePage articleIdx={articleIdx} articles={articles}
            onClose={() => { setArticleIdx(null); onArticleOpened?.(-1) }}
            onNavigate={(idx) => { setArticleIdx(idx); onArticleOpened?.(idx) }} />
        )}
      </div>
    </section>
  )
}