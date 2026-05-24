import { useState, useEffect, useRef } from 'react'
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

const cardAnim = { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } }
const stagger = { initial: {}, animate: { transition: { staggerChildren: 0.08 } } }

export default function Articles({ articles: editedArticles, initialArticleIdx, onArticleOpened }) {
  const articles = (editedArticles && editedArticles.length > 0) ? editedArticles : defaultArticles
  const { t } = useLang()
  const [articleIdx, setArticleIdx] = useState(initialArticleIdx != null ? initialArticleIdx : null)
  const [activeTag, setActiveTag] = useState('')
  const gridRef = useRef(null)

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

        <motion.div className="articles-grid" ref={gridRef} variants={stagger}
          initial="initial" whileInView="animate" viewport={{ once: true, margin: '-40px' }}>
          {filtered.map((a, i) => {
            const thumb = thumbnails[i % thumbnails.length]
            return (
              <motion.div key={i} className="article-card" variants={cardAnim}
                whileHover={{ y: -8 }}
                onClick={() => openArticle(i)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openArticle(i) } }}
                role="button" tabIndex={0} aria-label={`Read article: ${a.title}`}>
                <div className="article-card-thumb">
                  {a.image ? (
                    <>
                      <img src={a.image} alt={a.title} className="article-thumb-img" loading="lazy" />
                      <div className="article-thumb-overlay" />
                    </>
                  ) : (
                    <div className="article-thumb" style={{ background: thumb?.gradient || 'var(--accent)' }}>
                      <i className={`fas ${thumb?.icon || 'fa-file'}`} />
                    </div>
                  )}
                  <div className="article-card-badge">
                    {a.tags?.[0] || 'Article'}
                  </div>
                  <div className="article-card-meta-float">
                    <span><i className="far fa-clock" /> {a.readTime}</span>
                  </div>
                </div>
                <div className="article-card-body">
                  {a.tags && a.tags.length > 1 && (
                    <div className="article-tags">
                      {a.tags.slice(1, 3).map(tag => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </div>
                  )}
                  <h3 className="article-card-title">{a.title}</h3>
                  <p className="article-card-excerpt">{a.description}</p>
                  <div className="article-card-footer">
                    <div className="article-card-author">
                      {a.author?.avatar && <img src={a.author.avatar} alt="" className="article-avatar-sm" loading="lazy" />}
                      <div>
                        <span className="article-author-name">{a.author?.name || 'Author'}</span>
                        <span className="article-date">{a.date ? `${monthNames[new Date(a.date).getMonth()]} ${new Date(a.date).getDate()}, ${new Date(a.date).getFullYear()}` : ''}</span>
                      </div>
                    </div>
                    <span className="article-read-link">{t.articles.read} <i className="fas fa-arrow-right" /></span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {filtered.length === 0 && (
          <div className="empty-state">
            <i className="fas fa-newspaper" />
            <h3>No articles found</h3>
            <p>No articles match the selected tag.</p>
          </div>
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