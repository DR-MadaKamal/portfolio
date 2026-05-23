import { useMemo } from 'react'

const icons = [
  { cls: 'fab fa-facebook-f' }, { cls: 'fab fa-twitter' }, { cls: 'fab fa-instagram' }, { cls: 'fab fa-linkedin-in' }, { cls: 'fab fa-youtube' },
  { cls: 'fas fa-stethoscope' }, { cls: 'fas fa-pills' }, { cls: 'fas fa-tablets' }, { cls: 'fas fa-heartbeat' }, { cls: 'fas fa-flask' },
  { cls: 'fas fa-chart-line' }, { cls: 'fas fa-bullhorn' }, { cls: 'fas fa-palette' }, { cls: 'fas fa-video' }, { cls: 'fas fa-ad' },
  { cls: 'fas fa-camera' }, { cls: 'fas fa-search' }, { cls: 'fas fa-rocket' }, { cls: 'fas fa-medal' }, { cls: 'fas fa-users' },
]

const rand = (min, max) => Math.random() * (max - min) + min

export default function AnimatedBackground() {
  const count = typeof window !== 'undefined' && window.innerWidth < 768 ? 8 : 16

  const items = useMemo(() =>
    Array.from({ length: count }, (_, i) => {
      const item = icons[i % icons.length]
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
      return { cls: item.cls, style, key: i }
    }),
    [count],
  )

  return (
    <div className="bg-animated-icons">
      {items.map(({ cls, style, key }) => (
        <i
          key={key}
          className={cls}
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
