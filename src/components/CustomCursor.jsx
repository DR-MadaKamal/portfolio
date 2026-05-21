import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'

const TRAIL_LENGTH = 6

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [hovering, setHovering] = useState(false)
  const trail = useRef(Array.from({ length: TRAIL_LENGTH }, () => ({ x: -100, y: -100 })))
  const [trailState, setTrailState] = useState(trail.current)

  const updateTrail = useCallback((x, y) => {
    trail.current = trail.current.map((_, i) =>
      i === 0 ? { x, y } : {
        x: trail.current[i - 1].x + (trail.current[i].x - trail.current[i - 1].x) * 0.45,
        y: trail.current[i - 1].y + (trail.current[i].y - trail.current[i - 1].y) * 0.45,
      }
    )
    setTrailState([...trail.current])
  }, [])

  useEffect(() => {
    const move = (e) => {
      setPos({ x: e.clientX, y: e.clientY })
      updateTrail(e.clientX, e.clientY)
    }
    const over = (e) => { if (e.target.closest('a, button, .btn, .project-card, .article-card, .skill-card')) setHovering(true) }
    const out = () => setHovering(false)

    document.addEventListener('mousemove', move)
    document.addEventListener('mouseover', over)
    document.addEventListener('mouseout', out)
    return () => {
      document.removeEventListener('mousemove', move)
      document.removeEventListener('mouseover', over)
      document.removeEventListener('mouseout', out)
    }
  }, [updateTrail])

  return (
    <>
      <div className="custom-cursor" style={{ left: pos.x, top: pos.y }}>
        <svg width="26" height="34" viewBox="0 0 26 34" className="cursor-svg">
          <path d="M3 2L3 23L8 17.5L14 28.5L16.5 27L10.5 16L23 16L3 2Z"
            fill="var(--accent)" opacity="0.8"
            stroke="var(--accent)" strokeWidth="1.2"
            strokeLinejoin="round" strokeLinecap="round" />
        </svg>
      </div>
      <div className={`custom-cursor-dot ${hovering ? 'hover' : ''}`} style={{ left: pos.x, top: pos.y }} />
      {trailState.map((t, i) => (
        <div key={i} className="cursor-trail-dot" style={{
          left: t.x, top: t.y,
          width: 5 - i * 0.5,
          height: 5 - i * 0.5,
          opacity: 0.3 - i * 0.04,
        }} />
      ))}
    </>
  )
}