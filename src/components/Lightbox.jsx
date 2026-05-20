export default function Lightbox({ images, index, onClose }) {
  if (index == null) return null
  const src = images[index]
  if (!src) return null

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="lightbox-content" onClick={e => e.stopPropagation()}>
        <button className="lightbox-close" onClick={onClose}>&times;</button>
        <img src={src} alt="" />
      </div>
    </div>
  )
}
