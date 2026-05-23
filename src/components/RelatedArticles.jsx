import { useMemo } from 'react'
import { motion } from 'framer-motion'

export default function RelatedArticles({ current, articles, onOpenArticle }) {
  const related = useMemo(() => {
    if (!articles || articles.length < 2) return []
    const others = articles.filter(a => a.title !== current?.title)
    if (others.length === 0) return []

    const currentTags = current?.tags || []
    if (currentTags.length > 0) {
      const scored = others.map(a => {
        const tags = a.tags || []
        const common = tags.filter(t => currentTags.includes(t)).length
        return { article: a, score: common }
      })
      scored.sort((a, b) => b.score - a.score)
      const best = scored[0].score > 0 ? scored.filter(s => s.score > 0) : scored
      return best.slice(0, 2).map(s => s.article)
    }

    return others.slice(0, 2)
  }, [current, articles])

  if (related.length === 0) return null

  return (
    <div className="related-articles">
      <h3 className="related-title">Related Articles</h3>
      <div className="related-grid">
        {related.map((a, i) => (
          <motion.a key={i} href={`#article-${i}`} className="related-card article-card"
            onClick={(e) => { e.preventDefault(); onOpenArticle?.(a) }}
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            {a.image && <img src={a.image} alt={a.title} className="related-img" loading="lazy" />}
            <div className="article-card-body">
              {a.tags && a.tags.length > 0 && (
                <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
                  {a.tags.slice(0, 2).map(t => <span key={t} className="tag" style={{ fontSize: '0.6rem', padding: '1px 6px' }}>{t}</span>)}
                </div>
              )}
              <h3>{a.title}</h3>
              <p>{a.description}</p>
              <span className="article-meta">{a.readTime} · {a.date}</span>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  )
}