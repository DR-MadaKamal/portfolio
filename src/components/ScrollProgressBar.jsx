import { useState, useEffect, useRef } from 'react'

export default function ScrollProgressBar() {
  const [progress, setProgress] = useState(0)
  const rafRef = useRef(null)
  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) return
      rafRef.current = requestAnimationFrame(() => {
        const scrollTop = window.scrollY
        const docHeight = document.documentElement.scrollHeight - window.innerHeight
        setProgress(docHeight > 0 ? Math.min(scrollTop / docHeight * 100, 100) : 0)
        rafRef.current = null
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [])
  return <div className="scroll-progress-bar" style={{ width: `${progress}%` }} />
}
