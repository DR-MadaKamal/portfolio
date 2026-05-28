import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { articles as defaultArticles } from '../data/portfolioData'
import ArticleTOC from './ArticleTOC'
import RelatedArticles from './RelatedArticles'
import ReadingProgress from './ReadingProgress'
import ShareButtons from './ShareButtons'

const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December']

function calcReadTime(text) {
  const wpm = 200
  const words = text.trim().split(/\s+/).length
  const min = Math.max(1, Math.ceil(words / wpm))
  return `${min} min read`
}

function renderMarkdown(content) {
  if (!content) return ''
  const lines = content.split('\n')
  let html = ''
  let inCode = false
  let codeContent = ''
  let inTable = false
  let headingIdx = 0

  for (let raw of lines) {
    const line = raw.trimEnd()

    if (line.startsWith('```')) {
      if (inCode) {
        html += `<div class="code-block"><pre><code>${codeContent}</code></pre><button class="code-copy-btn" onclick="(function(btn){var t=btn.previousElementSibling.textContent;navigator.clipboard.writeText(t).then(function(){btn.textContent='Copied!';setTimeout(function(){btn.textContent='Copy'},2000)})})(this)" aria-label="Copy code">Copy</button></div>\n`
        codeContent = ''
        inCode = false
      } else {
        inCode = true
        codeContent = ''
      }
      continue
    }

    if (inCode) {
      codeContent += (codeContent ? '\n' : '') + line
      continue
    }

    if (line.startsWith('### ')) {
      html += `<h3 id="toc-${headingIdx++}">${line.slice(4)}</h3>\n`
      continue
    }
    if (line.startsWith('## ')) {
      html += `<h2 id="toc-${headingIdx++}">${line.slice(3)}</h2>\n`
      continue
    }
    if (line.startsWith('> ')) {
      html += `<blockquote class="article-pullquote">${inlineMarkdown(line.slice(2))}</blockquote>\n`
      continue
    }
    if (line.startsWith('- ')) {
      html += `<li>${inlineMarkdown(line.slice(2))}</li>\n`
      continue
    }
    if (line.match(/^\d+\.\s/)) {
      html += `<li>${inlineMarkdown(line.replace(/^\d+\.\s/, ''))}</li>\n`
      continue
    }
    if (line.startsWith('|') && line.endsWith('|')) {
      const cells = line.split('|').filter(c => c.trim())
      if (cells.length > 0) {
        const isSep = cells.every(c => /^-+\s*$/.test(c.trim()))
        if (isSep) { continue }
        if (!inTable) { html += '<table><tbody>\n'; inTable = true }
        html += '<tr>' + cells.map(c => `<td>${inlineMarkdown(c.trim())}</td>`).join('') + '</tr>\n'
      }
      continue
    }
    if (inTable) { html += '</tbody></table>\n'; inTable = false }
    if (line.trim() === '') {
      html += '<br/>\n'
      continue
    }
    if (line.startsWith('**') && line.endsWith('**')) {
      html += `<p class="article-emphasis"><strong>${inlineMarkdown(line.slice(2, -2))}</strong></p>\n`
      continue
    }
    html += `<p>${inlineMarkdown(line)}</p>\n`
  }
  if (inTable) html += '</tbody></table>\n'
  return html
}

function inlineMarkdown(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
}

const BASE = 'https://DR-MadaKamal.github.io/portfolio'

function updateMeta(a, idx) {
  if (!a) return
  const title = `${a.title} | Mohammed Kamal Shaat`
  document.title = title
  const set = (name, content) => {
    let el = document.querySelector(`meta[property="${name}"], meta[name="${name}"]`)
    if (!el) { el = document.createElement('meta'); if (name.startsWith('og:')) el.setAttribute('property', name); else el.setAttribute('name', name); document.head.appendChild(el) }
    el.setAttribute('content', content)
  }
  set('og:title', title)
  set('og:description', a.description)
  set('og:image', a.image || `${BASE}/photo.png`)
  set('og:url', a.slug ? `${BASE}/article/${a.slug}` : `${BASE}/#article-${idx}`)
  set('twitter:title', title)
  set('twitter:description', a.description)
  set('twitter:image', a.image || `${BASE}/photo.png`)
  set('description', a.description)
}

function restoreMeta() {
  const defaultTitle = 'Mohammed Kamal Shaat | Pharmacist & Full-Stack Digital Marketer'
  const defaultDesc = 'Portfolio of Mohammed Kamal Shaat — Pharmacist & Full-Stack Digital Marketer. Branding, motion graphics, medical marketing, and digital strategy.'
  document.title = defaultTitle
  const set = (name, content) => {
    let el = document.querySelector(`meta[property="${name}"], meta[name="${name}"]`)
    if (el) el.setAttribute('content', content)
  }
  set('og:title', defaultTitle)
  set('og:description', defaultDesc)
  set('og:image', `${BASE}/photo.png`)
  set('og:url', BASE)
  set('twitter:title', defaultTitle)
  set('twitter:description', defaultDesc)
  set('twitter:image', `${BASE}/photo.png`)
  set('description', defaultDesc)
}

export default function ArticlePage({ articleIdx, onClose, articles: editedArticles, onNavigate }) {
  const allArticles = editedArticles || defaultArticles
  const [idx, setIdx] = useState(articleIdx)
  const a = allArticles[idx]

  useEffect(() => { setIdx(articleIdx) }, [articleIdx])

  useEffect(() => {
    if (a) updateMeta(a, idx)
    return () => { restoreMeta() }
  }, [idx, a])

  useEffect(() => {
    if (!a) return
    const path = a.slug ? `/portfolio/article/${a.slug}/` : null
    if (path && window.location.pathname !== path) {
      window.history.pushState(null, '', path)
    }
  }, [idx])

  const handleClose = () => {
    if (window.location.pathname.match(/^\/portfolio\/article\//)) {
      window.history.pushState(null, '', '/portfolio/')
    }
    restoreMeta()
    onClose()
  }

  const navigate = (dir) => {
    const next = idx + dir
    if (next >= 0 && next < allArticles.length) {
      setIdx(next)
      onNavigate?.(next)
    }
  }

  if (!a) return null

  const readTime = a.readTime === 'auto' ? calcReadTime(a.content) : a.readTime
  const renderedContent = useMemo(() => renderMarkdown(a.content || a.description || ''), [a.content, a.description])
  const prevA = idx > 0 ? allArticles[idx - 1] : null
  const nextA = idx < allArticles.length - 1 ? allArticles[idx + 1] : null

  return (
    <AnimatePresence>
      <motion.div className="article-page-overlay"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={(e) => { if (e.target.className === 'article-page-overlay') handleClose() }}>
        <motion.div className="article-page"
          initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}>
          <ReadingProgress />
          <button className="article-page-close" onClick={handleClose}>&times;</button>

          {a.image && (
            <div className="article-page-hero">
              <img src={a.image} alt={a.title} loading="lazy" />
              <div className="article-page-hero-overlay" />
              <div className="article-page-hero-content">
                <div className="article-page-meta">
                  <span className="article-page-date">
                    {monthNames[new Date(a.date).getMonth()]} {new Date(a.date).getDate()}, {new Date(a.date).getFullYear()}
                  </span>
                  <span className="article-page-readtime"><i className="far fa-clock" /> {readTime}</span>
                </div>
                {a.tags && a.tags.length > 0 && (
                  <div className="article-page-tags">
                    {a.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                  </div>
                )}
                <h1 className="article-page-hero-title">{a.title}</h1>
              </div>
            </div>
          )}

          <div className="article-page-body">
            {!a.image && (
              <>
                <div className="article-page-meta">
                  <span>{monthNames[new Date(a.date).getMonth()]} {new Date(a.date).getDate()}, {new Date(a.date).getFullYear()}</span>
                  <span><i className="far fa-clock" /> {readTime}</span>
                </div>
                {a.tags && a.tags.length > 0 && (
                  <div className="article-page-tags">{a.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}</div>
                )}
                <h1>{a.title}</h1>
              </>
            )}

            <p className="article-page-desc">{a.description}</p>

            {a.author && (
              <div className="article-page-author">
                <img src={a.author.avatar} alt={a.author.name} loading="lazy" />
                <div>
                  <strong>{a.author.name}</strong>
                  <span>Author &bull; Published on {monthNames[new Date(a.date).getMonth()]} {new Date(a.date).getDate()}, {new Date(a.date).getFullYear()}</span>
                </div>
              </div>
            )}

            <ShareButtons title={a.title} />

            <div className="article-page-layout">
              <div className="article-page-main">
                <ArticleTOC content={a.content} />
                <div className="article-page-content" dangerouslySetInnerHTML={{ __html: renderedContent }} />
              </div>
            </div>

            <RelatedArticles current={a} articles={allArticles}
              onOpenArticle={(article) => { const found = allArticles.findIndex(x => x.title === article.title); if (found >= 0) { setIdx(found); onNavigate?.(found) } }} />

            <div className="article-page-nav">
              {prevA ? (
                <button className="article-nav-card" onClick={() => navigate(-1)}>
                  <span className="article-nav-label"><i className="fas fa-arrow-left" /> Previous</span>
                  <div className="article-nav-preview">
                    {prevA.image && <img src={prevA.image} alt="" loading="lazy" />}
                    <div>
                      <strong>{prevA.title}</strong>
                      <span>{prevA.readTime}</span>
                    </div>
                  </div>
                </button>
              ) : <div />}
              <span className="article-nav-count">{idx + 1} / {allArticles.length}</span>
              {nextA ? (
                <button className="article-nav-card" onClick={() => navigate(1)}>
                  <span className="article-nav-label">Next <i className="fas fa-arrow-right" /></span>
                  <div className="article-nav-preview">
                    {nextA.image && <img src={nextA.image} alt="" loading="lazy" />}
                    <div>
                      <strong>{nextA.title}</strong>
                      <span>{nextA.readTime}</span>
                    </div>
                  </div>
                </button>
              ) : <div />}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}