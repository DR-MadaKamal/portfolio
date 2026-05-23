import { useMemo, useEffect, useRef } from 'react'

const icons = [
  { cls: 'fab fa-facebook-f' }, { cls: 'fab fa-twitter' }, { cls: 'fab fa-instagram' }, { cls: 'fab fa-linkedin-in' }, { cls: 'fab fa-youtube' },
  { cls: 'fas fa-stethoscope' }, { cls: 'fas fa-pills' }, { cls: 'fas fa-tablets' }, { cls: 'fas fa-heartbeat' }, { cls: 'fas fa-flask' },
  { cls: 'fas fa-chart-line' }, { cls: 'fas fa-bullhorn' }, { cls: 'fas fa-palette' }, { cls: 'fas fa-video' }, { cls: 'fas fa-ad' },
  { cls: 'fas fa-camera' }, { cls: 'fas fa-search' }, { cls: 'fas fa-rocket' }, { cls: 'fas fa-medal' }, { cls: 'fas fa-users' },
]

const rand = (min, max) => Math.random() * (max - min) + min

export default function AnimatedBackground() {
  const canvasRef = useRef(null)

  const count = typeof window !== 'undefined' && window.innerWidth < 768 ? 8 : 16

  const items = useMemo(() =>
    Array.from({ length: count }, (_, i) => {
      const item = icons[i % icons.length]
      return {
        cls: item.cls,
        style: {
          '--x': `${rand(1, 95)}%`,
          '--y': `${rand(1, 93)}%`,
          '--s': `${rand(14, 30)}px`,
          '--d': `${rand(10, 22)}s`,
          '--delay': `${rand(0, 10)}s`,
          '--dx': `${rand(-60, 60)}px`,
          '--dy': `${rand(-40, 40)}px`,
          '--hue': rand(0, 360),
          '--dr': `${rand(0, 360)}deg`,
        },
        key: i,
      }
    }),
    [count],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let mouse = { x: -1000, y: -1000 }
    const particles = Array.from({ length: 75 }, () => ({
      x: rand(0, window.innerWidth),
      y: rand(0, window.innerHeight),
      vx: rand(-0.4, 0.4),
      vy: rand(-0.4, 0.4),
      r: rand(2, 4),
      hue: rand(150, 210),
    }))

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)

    const onMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY }
    const onLeave = () => { mouse.x = -1000; mouse.y = -1000 }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseleave', onLeave)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of particles) {
        const dx = mouse.x - p.x
        const dy = mouse.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 280) {
          p.vx += (dx / dist) * 0.03
          p.vy += (dy / dist) * 0.03
          if (dist < 200) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(mouse.x, mouse.y)
            ctx.strokeStyle = `hsla(${p.hue}, 80%, 75%, ${(1 - dist / 200) * 0.3})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }
        p.vx *= 0.99
        p.vy *= 0.99
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, 70%, 65%, 0.45)`
        ctx.fill()
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r * 2, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, 70%, 65%, 0.08)`
        ctx.fill()
      }
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} className="bg-particles" />
      <div className="bg-animated-icons">
        {items.map(({ cls, style, key }) => (
          <i key={key} className={cls}
            style={{
              position: 'fixed', left: style['--x'], top: style['--y'],
              fontSize: style['--s'],
              color: `hsla(${style['--hue']}, 65%, 60%, 0.12)`,
              pointerEvents: 'none', zIndex: 0,
              animation: `bgFloat ${style['--d']} ease-in-out ${style['--delay']} infinite`,
              willChange: 'transform',
            }} />
        ))}
      </div>
    </>
  )
}