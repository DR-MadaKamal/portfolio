import { useState, useEffect, useRef, useCallback } from 'react'

const TRAIL_LENGTH = 16

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [hovering, setHovering] = useState(false)
  const points = useRef(Array.from({ length: TRAIL_LENGTH }, () => ({ x: -100, y: -100 })))
  const mouseRef = useRef({ x: -100, y: -100 })
  const raf = useRef(null)
  const [path, setPath] = useState('')

  const tick = useCallback(() => {
    const { x, y } = mouseRef.current
    const pts = points.current
    for (let i = pts.length - 1; i > 0; i--) {
      pts[i].x += (pts[i - 1].x - pts[i].x) * 0.18
      pts[i].y += (pts[i - 1].y - pts[i].y) * 0.18
    }
    pts[0].x = x; pts[0].y = y

    let d = `M${pts[0].x},${pts[0].y}`
    for (let i = 1; i < pts.length - 1; i++) {
      const mx = (pts[i].x + pts[i + 1].x) / 2
      const my = (pts[i].y + pts[i + 1].y) / 2
      d += `Q${pts[i].x},${pts[i].y} ${mx},${my}`
    }
    const last = pts[pts.length - 1]
    d += `L${last.x},${last.y}`
    setPath(d)
    raf.current = requestAnimationFrame(tick)
  }, [])

  useEffect(() => {
    raf.current = requestAnimationFrame(tick)
    return () => { if (raf.current) cancelAnimationFrame(raf.current) }
  }, [tick])

  useEffect(() => {
    const move = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
      setPos({ x: e.clientX, y: e.clientY })
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
  }, [])

  return (
    <>
      <svg className="cursor-trail-svg" aria-hidden="true">
        <linearGradient id="trailGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0" />
          <stop offset="60%" stopColor="var(--accent)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.5" />
        </linearGradient>
        <path d={path} fill="none" stroke="url(#trailGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="custom-cursor" style={{ left: pos.x, top: pos.y }}>
        <svg width="26" height="34" viewBox="0 0 26 34" className="cursor-svg">
          <path d="M3 2L3 23L8 17.5L14 28.5L16.5 27L10.5 16L23 16L3 2Z"
            fill="var(--accent)" opacity="0.85"
            stroke="var(--accent)" strokeWidth="1.2"
            strokeLinejoin="round" strokeLinecap="round" />
        </svg>
      </div>
      <div className={`custom-cursor-dot ${hovering ? 'hover' : ''}`} style={{ left: pos.x, top: pos.y }} />
    </>
  )
}