import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useRef } from 'react'

export default function MagneticButton({ children, className, as: Comp = motion.button, strength = 0.3, ...props }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 300, damping: 25 })
  const sy = useSpring(y, { stiffness: 300, damping: 25 })
  const ref = useRef(null)

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    x.set((e.clientX - cx) * strength)
    y.set((e.clientY - cy) * strength)
  }
  const handleMouseLeave = () => { x.set(0); y.set(0) }

  return (
    <Comp
      ref={ref}
      className={className}
      style={{ x: sx, y: sy }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </Comp>
  )
}