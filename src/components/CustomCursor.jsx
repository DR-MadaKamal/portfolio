import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    const move = (e) => setPos({ x: e.clientX, y: e.clientY })
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
      <div className={`custom-cursor ${hovering ? 'hover' : ''}`} style={{ left: pos.x, top: pos.y }} />
      <div className={`custom-cursor-dot ${hovering ? 'hover' : ''}`} style={{ left: pos.x, top: pos.y }} />
    </>
  )
}
