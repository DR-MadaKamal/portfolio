import { useMemo, useEffect, useState } from 'react'

const icons = [
  'fa-facebook-f', 'fa-twitter', 'fa-instagram', 'fa-linkedin-in', 'fa-youtube',
  'fa-stethoscope', 'fa-pills', 'fa-tablets', 'fa-heartbeat', 'fa-flask',
  'fa-chart-line', 'fa-bullhorn', 'fa-palette', 'fa-video', 'fa-ad',
  'fa-camera', 'fa-search', 'fa-rocket', 'fa-medal', 'fa-users',
]

const rand = (min, max) => Math.random() * (max - min) + min

export default function AnimatedBackground() {
  const [count, setCount] = useState(12)
  useEffect(() => { setCount(window.innerWidth < 768 ? 8 : 16) }, [])

  const items = useMemo(() =>
    Array.from({ length: count }, (_, i) => {
      const icon = icons[i % icons.length]
      const style = {
        '--x': `${rand(1, 95)}%`,
        '--y': `${rand(1, 93)}%`,
        '--s': `${rand(14, 30)}px`,
        '--d': `${rand(10, 22)}s`,
        '--delay': `${rand(0, 10)}s`,
        '--dx': `${rand(-60, 60)}px`,
        '--dy': `${rand(-40, 40)}px`,
        '--hue': rand(0, 360),
        '--dr': `${rand(0, 360)}deg`,
      }
      return { icon, style, key: i }
    }),
    [count],
  )

  return (
    <div className="bg-animated-icons">
      {items.map(({ icon, style, key }) => (
        <i
          key={key}
          className={`fas ${icon}`}
          style={{
            position: 'fixed', left: style['--x'], top: style['--y'],
            fontSize: style['--s'], color: `hsla(${style['--hue']}, 65%, 60%, 0.12)`,
            pointerEvents: 'none', zIndex: 0,
            animation: `bgFloat ${style['--d']} ease-in-out ${style['--delay']} infinite`,
            willChange: 'transform',
          }}
        />
      ))}
    </div>
  )
}
