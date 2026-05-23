import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function MagneticButton({ children, className, as: Comp = motion.button, ...props }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 250, damping: 18 })
  const sy = useSpring(y, { stiffness: 250, damping: 18 })

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - rect.left - rect.width / 2) * 0.25)
    y.set((e.clientY - rect.top - rect.height / 2) * 0.25)
  }
  const handleMouseLeave = () => { x.set(0); y.set(0) }

  return (
    <Comp
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
