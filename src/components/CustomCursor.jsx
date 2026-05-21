import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'

const TRAIL_LENGTH = 8

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [hovering, setHovering] = useState(false)
  const trail = useRef(Array.from({ length: TRAIL_LENGTH }, () => ({ x: -100, y: -100 })))
  const [trailState, setTrailState] = useState(trail.current)

  const updateTrail = useCallback((x, y) => {
    trail.current = trail.current.map((_, i) =>
      i === 0 ? { x, y } : {
        x: trail.current[i - 1].x + (trail.current[i].x - trail.current[i - 1].x) * 0.5,
        y: trail.current[i - 1].y + (trail.current[i].y - trail.current[i - 1].y) * 0.5,
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
      <div className={`custom-cursor ${hovering ? 'hover' : ''}`} style={{ left: pos.x, top: pos.y }}>
        <svg width="40" height="40" viewBox="0 0 40 40" className="cursor-ring-svg">
          <circle cx="20" cy="20" r="17" fill="none" stroke="currentColor" strokeWidth="1.5"
            strokeDasharray={`${hovering ? 120 : 90} ${hovering ? 120 : 120}`}
            strokeLinecap="round" opacity="0.7" />
        </svg>
      </div>
      <div className={`custom-cursor-dot ${hovering ? 'hover' : ''}`} style={{ left: pos.x, top: pos.y }} />
      {trailState.map((t, i) => (
        <div key={i} className="cursor-trail-dot" style={{
          left: t.x, top: t.y,
          width: 6 - i * 0.6,
          height: 6 - i * 0.6,
          opacity: 0.35 - i * 0.04,
        }} />
      ))}
    </>
  )
}