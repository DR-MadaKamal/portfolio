import { useState, useEffect, useRef, useCallback } from 'react'

const TRAIL_LENGTH = 8
const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [hovering, setHovering] = useState(false)
  const [visible, setVisible] = useState(false)
  const points = useRef(Array.from({ length: TRAIL_LENGTH }, () => ({ x: -100, y: -100 })))
  const mouseRef = useRef({ x: -100, y: -100 })
  const raf = useRef(null)
  const pathRef = useRef(null)
  const moved = useRef(false)

  const tick = useCallback(() => {
    if (!moved.current && raf.current) {
      cancelAnimationFrame(raf.current)
      raf.current = null
      return
    }
    const { x, y } = mouseRef.current
    const pts = points.current
    for (let i = pts.length - 1; i > 0; i--) {
      pts[i].x += (pts[i - 1].x - pts[i].x) * 0.15
      pts[i].y += (pts[i - 1].y - pts[i].y) * 0.15
    }
    pts[0].x = x; pts[0].y = y

    let d = `M${pts[0].x},${pts[0].y}`
    for (let i = 1; i < pts.length - 2; i++) {
      const mx = (pts[i].x + pts[i + 1].x) / 2
      const my = (pts[i].y + pts[i + 1].y) / 2
      d += `Q${pts[i].x},${pts[i].y} ${mx},${my}`
    }
    const last = pts[pts.length - 1]
    d += `L${last.x},${last.y}`

    if (pathRef.current) {
      pathRef.current.setAttribute('d', d)
      pathRef.current.style.opacity = hovering ? '0.12' : '0.3'
    }
    moved.current = false
    raf.current = requestAnimationFrame(tick)
  }, [hovering])

  useEffect(() => {
    if (isMobile) return
    let moveTimeout
    const onMove = () => {
      moved.current = true
      if (!raf.current) raf.current = requestAnimationFrame(tick)
      clearTimeout(moveTimeout)
      moveTimeout = setTimeout(() => {
        if (raf.current) { cancelAnimationFrame(raf.current); raf.current = null }
      }, 300)
    }
    const onMouse = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
      setPos({ x: e.clientX, y: e.clientY })
      if (!visible) setVisible(true)
      onMove()
    }
    const onHoverIn = (e) => {
      if (e.target.closest('a, button, .btn, .project-card, .article-card, .skills-cat, .section-title, h2, .gallery-card, .case-card, .timeline-item-inner, .testimonial-card')) setHovering(true)
    }
    const onHoverOut = () => setHovering(false)
    const onLeave = () => setVisible(false)

    document.addEventListener('mousemove', onMouse)
    document.addEventListener('mouseover', onHoverIn, true)
    document.addEventListener('mouseout', onHoverOut, true)
    document.addEventListener('mouseleave', onLeave)
    return () => {
      clearTimeout(moveTimeout)
      if (raf.current) cancelAnimationFrame(raf.current)
      document.removeEventListener('mousemove', onMouse)
      document.removeEventListener('mouseover', onHoverIn, true)
      document.removeEventListener('mouseout', onHoverOut, true)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [tick, visible])

  if (isMobile) return null

  return (
    <>
      <svg className="cursor-trail-svg" aria-hidden="true">
        <linearGradient id="trailGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0" />
          <stop offset="50%" stopColor="var(--accent)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.5" />
        </linearGradient>
        <path ref={pathRef} d="" fill="none" stroke="url(#trailGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'opacity 0.3s' }} />
      </svg>
      <div className={`custom-cursor${hovering ? ' hover' : ''}${!visible ? ' hidden' : ''}`}
        style={{ left: pos.x, top: pos.y }}>
        <svg width="18" height="24" viewBox="0 0 18 24" className="cursor-svg">
          <path d="M2 2L2 16L6 11.5L10 20L12 19L7.5 10L15 10L2 2Z"
            fill="var(--accent)" opacity="0.75"
            stroke="var(--accent)" strokeWidth="0.8"
            strokeLinejoin="round" strokeLinecap="round" />
        </svg>
      </div>
      <div className={`custom-cursor-ring${hovering ? ' hover' : ''}${!visible ? ' hidden' : ''}`}
        style={{ left: pos.x, top: pos.y }} />
    </>
  )
}