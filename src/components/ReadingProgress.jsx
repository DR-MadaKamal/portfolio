import { useState, useEffect, useRef } from 'react'

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0)
  const rafRef = useRef(null)
  useEffect(() => {
    const el = document.querySelector('.article-page-content')
    if (!el) return
    const onScroll = () => {
      if (rafRef.current) return
      rafRef.current = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect()
        const total = rect.height - window.innerHeight
        const current = -rect.top
        setProgress(total > 0 ? Math.min(Math.max(current / total * 100, 0), 100) : 100)
        rafRef.current = null
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [])
  return <div className="reading-progress" style={{ width: `${progress}%` }} />
}
