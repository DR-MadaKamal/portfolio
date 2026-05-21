import { useState, useRef } from 'react'
import { motion } from 'framer-motion'

export default function BeforeAfterSlider({ before, after, alt }) {
  const [pos, setPos] = useState(50)
  const container = useRef()

  const handleMove = (e) => {
    const rect = container.current?.getBoundingClientRect()
    if (!rect) return
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left
    setPos(Math.min(Math.max((x / rect.width) * 100, 5), 95))
  }

  return (
    <motion.div
      className="ba-slider"
      ref={container}
      onMouseMove={handleMove}
      onTouchMove={handleMove}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <img src={after} alt={`${alt} after`} className="ba-img" loading="lazy" />
      <div className="ba-overlay" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <img src={before} alt={`${alt} before`} className="ba-img" loading="lazy" />
      </div>
      <div className="ba-handle" style={{ left: `${pos}%` }}>
        <i className="fas fa-arrows-alt-h" />
      </div>
      <span className="ba-label ba-before">Before</span>
      <span className="ba-label ba-after">After</span>
    </motion.div>
  )
}
