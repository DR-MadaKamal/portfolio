import { useState, useEffect, useRef, useCallback } from 'react'

const TRAIL_LENGTH = 16
const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [hovering, setHovering] = useState(false)
  const points = useRef(Array.from({ length: TRAIL_LENGTH }, () => ({ x: -100, y: -100 })))
  const mouseRef = useRef({ x: -100, y: -100 })
  const raf = useRef(null)
  const pathRef = useRef(null)
  const idleTimer = useRef(null)

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

    if (pathRef.current) pathRef.current.setAttribute('d', d)
    raf.current = requestAnimationFrame(tick)
  }, [])

  const startLoop = useCallback(() => {
    if (raf.current) return
    raf.current = requestAnimationFrame(tick)
  }, [tick])

  const stopLoop = useCallback(() => {
    if (raf.current) { cancelAnimationFrame(raf.current); raf.current = null }
  }, [])

  useEffect(() => {
    if (isMobile) return
    const move = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
      setPos({ x: e.clientX, y: e.clientY })
      if (!raf.current) startLoop()
      clearTimeout(idleTimer.current)
      idleTimer.current = setTimeout(stopLoop, 2000)
    }
    const enter = (e) => { if (e.target.closest('a, button, .btn, .project-card, .article-card, .skills-cat, .section-title, h2')) setHovering(true) }
    const leave = () => { setHovering(false); stopLoop(); idleTimer.current && clearTimeout(idleTimer.current) }

    startLoop()
    document.addEventListener('mousemove', move)
    document.addEventListener('mouseenter', enter, true)
    document.addEventListener('mouseleave', leave, true)
    document.addEventListener('mouseleave', leave)
    return () => {
      stopLoop()
      document.removeEventListener('mousemove', move)
      document.removeEventListener('mouseenter', enter, true)
      document.removeEventListener('mouseleave', leave, true)
      document.removeEventListener('mouseleave', leave)
      idleTimer.current && clearTimeout(idleTimer.current)
    }
  }, [startLoop, stopLoop])

  if (isMobile) return null

  return (
    <>
      <svg className="cursor-trail-svg" aria-hidden="true">
        <linearGradient id="trailGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0" />
          <stop offset="60%" stopColor="var(--accent)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.5" />
        </linearGradient>
        <path ref={pathRef} d="" fill="none" stroke="url(#trailGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
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
