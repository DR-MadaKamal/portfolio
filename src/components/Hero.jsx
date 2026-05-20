export default function Hero() {
  return (
    <section id="hero" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 20% 50%, rgba(100,255,218,0.06) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(255,107,107,0.04) 0%, transparent 50%)',
        pointerEvents: 'none',
      }} />
    </section>
  )
}
