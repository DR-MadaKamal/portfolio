import { useMemo } from 'react'
import { motion } from 'framer-motion'

const icons = [
  'fa-facebook-f', 'fa-twitter', 'fa-instagram', 'fa-linkedin-in', 'fa-youtube',
  'fa-stethoscope', 'fa-pills', 'fa-tablets', 'fa-heartbeat', 'fa-flask',
  'fa-chart-line', 'fa-bullhorn', 'fa-palette', 'fa-video', 'fa-ad',
  'fa-camera', 'fa-search', 'fa-rocket', 'fa-medal', 'fa-users',
]

const rand = (min, max) => Math.random() * (max - min) + min

function FloatingIcon({ item }) {
  const p = useMemo(() => ({
    x: rand(1, 95),
    y: rand(1, 93),
    s: rand(14, 30),
    d: rand(8, 20),
    delay: rand(0, 8),
    dx: rand(-40, 40),
    dy: rand(-30, 30),
    color: `hsla(${rand(0, 360)}, 65%, 60%, 1)`,
    dr: rand(0, 360),
    sx: rand(0.8, 1.2),
  }), [])

  return (
    <motion.i
      className={`fas ${item}`}
      style={{
        position: 'fixed', left: `${p.x}%`, top: `${p.y}%`,
        fontSize: p.s, color: p.color, pointerEvents: 'none', zIndex: 0, opacity: 0,
      }}
      initial={{ opacity: 0, x: 0, y: 0, rotate: 0, scale: 1 }}
      animate={{
        opacity: [0, 0.08, 0.15, 0.08, 0],
        x: [0, p.dx * 0.4, p.dx, p.dx * 0.4, 0],
        y: [0, p.dy * 0.4, p.dy, p.dy * 0.4, 0],
        rotate: [0, p.dr * 0.3, p.dr, p.dr * 0.3, 0],
        scale: [1, p.sx, p.sx * 1.1, p.sx, 1],
      }}
      transition={{
        duration: p.d, repeat: Infinity, delay: p.delay,
        ease: 'easeInOut', times: [0, 0.15, 0.5, 0.85, 1],
      }}
    />
  )
}

export default function AnimatedBackground() {
  const items = useMemo(() =>
    Array.from({ length: 24 }, (_, i) => icons[i % icons.length]),
  [])

  return (
    <div className="bg-animated-icons">
      {items.map((icon, i) => <FloatingIcon key={i} item={icon} />)}
    </div>
  )
}
