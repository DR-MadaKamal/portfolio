import { motion } from 'framer-motion'

const container = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.04 } },
}
const child = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function TextReveal({ text, as: Tag = 'h2', className, style, viewport }) {
  const words = text.split(' ')
  const MotionTag = motion[Tag] || motion.h2
  return (
    <MotionTag
      className={className}
      style={style}
      variants={container}
      initial="initial"
      whileInView="whileInView"
      viewport={viewport || { once: true, margin: '-40px' }}
    >
      {words.map((w, i) => (
        <motion.span
          key={i}
          variants={child}
          style={{ display: 'inline-block', whiteSpace: 'nowrap', marginRight: '0.2em' }}
        >
          {w}
        </motion.span>
      ))}
    </MotionTag>
  )
}
