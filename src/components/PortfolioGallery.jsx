import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Lightbox from './Lightbox'
import { portfolioWorks as defaultWorks } from '../data/portfolioData'

const categories = ['All', 'Motion Graphics', 'Branding', 'Graphic Design']

export default function PortfolioGallery({ works: editedWorks }) {
  const items = (editedWorks && editedWorks.length > 0) ? editedWorks : defaultWorks
  const [activeCat, setActiveCat] = useState('All')
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [videoUrl, setVideoUrl] = useState(null)

  const filtered = activeCat === 'All'
    ? items
    : items.filter(w => w.category === activeCat)

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') { setLightboxIndex(null); setVideoUrl(null) }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  const openMedia = (work) => {
    if (work.media.type === 'video') {
      setVideoUrl(work.media.url)
    } else {
      const allImages = items.map(w => w.media.url)
      const idx = allImages.indexOf(work.media.url)
      setLightboxIndex(idx)
    }
  }

  return (
    <section className="section" id="portfolio">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="section-title">
            <small>Creative Work</small>
            Portfolio
          </h2>
        </motion.div>

        <div className="gallery-filters">
          {categories.map(cat => (
            <button key={cat}
              className={`gallery-filter-btn${activeCat === cat ? ' active' : ''}`}
              onClick={() => setActiveCat(cat)}
              aria-pressed={activeCat === cat}>
              {cat}
            </button>
          ))}
        </div>

        <div className="gallery-grid">
          <AnimatePresence mode="popLayout">
            {filtered.map(work => (
              <motion.div key={work.id} className="gallery-card"
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                onClick={() => openMedia(work)}
                role="button" tabIndex={0} aria-label={work.title}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') openMedia(work) }}>
                <div className="gallery-thumb-wrap">
                  <img src={work.thumbnail} alt={work.title} loading="lazy" />
                  {work.media.type === 'video' && (
                    <span className="gallery-play-icon"><i className="fas fa-play" /></span>
                  )}
                  <span className="gallery-cat-badge">{work.category}</span>
                </div>
                <div className="gallery-card-body">
                  <h3 className="gallery-card-title">{work.title}</h3>
                  <p className="gallery-card-desc">{work.description}</p>
                  <div className="gallery-tags">
                    {work.tags.map(t => <span key={t} className="gallery-tag">{t}</span>)}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <Lightbox
          images={items.map(w => w.media.url)}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />

        <AnimatePresence>
          {videoUrl && (
            <motion.div className="gallery-video-overlay"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setVideoUrl(null)}>
              <button className="gallery-video-close" onClick={() => setVideoUrl(null)}>
                <i className="fas fa-times" />
              </button>
              <div className="gallery-video-wrap" onClick={e => e.stopPropagation()}>
                <iframe src={videoUrl} title="Video player" frameBorder="0" loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}