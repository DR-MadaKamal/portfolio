import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const icons = [
  { icon: 'fa-facebook-f', type: 'social' },
  { icon: 'fa-twitter', type: 'social' },
  { icon: 'fa-instagram', type: 'social' },
  { icon: 'fa-linkedin-in', type: 'social' },
  { icon: 'fa-youtube', type: 'social' },
  { icon: 'fa-stethoscope', type: 'medical' },
  { icon: 'fa-pills', type: 'medical' },
  { icon: 'fa-tablets', type: 'medical' },
  { icon: 'fa-heartbeat', type: 'medical' },
  { icon: 'fa-flask', type: 'medical' },
  { icon: 'fa-chart-line', type: 'mix' },
  { icon: 'fa-bullhorn', type: 'mix' },
  { icon: 'fa-palette', type: 'mix' },
  { icon: 'fa-video', type: 'mix' },
  { icon: 'fa-ad', type: 'mix' },
]

const colors = {
  social: '#1877f2',
  medical: '#64ffda',
  mix: '#7c5bfe',
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min
}

function FloatingIcon({ item, index }) {
  const x = randomBetween(2, 94)
  const y = randomBetween(2, 92)
  const size = randomBetween(14, 28)
  const duration = randomBetween(8, 18)
  const delay = randomBetween(0, 6)
  const driftX = randomBetween(-30, 30)
  const driftY = randomBetween(-20, 20)

  return (
    <motion.i
      className={`fas ${item.icon}`}
      style={{
        position: 'fixed',
        left: `${x}%`,
        top: `${y}%`,
        fontSize: size,
        color: colors[item.type],
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0,
      }}
      initial={{ opacity: 0, x: 0, y: 0 }}
      animate={{
        opacity: [0, 0.07, 0.12, 0.07, 0],
        x: [0, driftX / 2, driftX, driftX / 2, 0],
        y: [0, driftY / 2, driftY, driftY / 2, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: 'easeInOut',
        times: [0, 0.15, 0.5, 0.85, 1],
      }}
    />
  )
}

export default function AnimatedBackground() {
  const [items] = useState(() =>
    Array.from({ length: 18 }, (_, i) => ({
      ...icons[i % icons.length],
      id: i,
    }))
  )

  return (
    <div className="bg-animated-icons">
      {items.map((item) => (
        <FloatingIcon key={item.id} item={item} index={item.id} />
      ))}
    </div>
  )
}
