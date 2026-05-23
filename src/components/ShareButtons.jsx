import { showToast } from '../utils/toast'

export default function ShareButtons({ url, title }) {
  const u = encodeURIComponent(url || window.location.href)
  const t = encodeURIComponent(title || document.title)

  const copyLink = () => {
    navigator.clipboard?.writeText(decodeURIComponent(u))
    showToast('Link copied to clipboard!', 'success')
  }

  return (
    <div className="share-buttons">
      <span className="share-label">Share</span>
      <a href={`https://wa.me/?text=${t}%20${u}`} target="_blank" rel="noopener" className="share-btn whatsapp" aria-label="Share on WhatsApp"><i className="fab fa-whatsapp" /></a>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${u}`} target="_blank" rel="noopener" className="share-btn facebook" aria-label="Share on Facebook"><i className="fab fa-facebook-f" /></a>
      <a href={`https://twitter.com/intent/tweet?text=${t}&url=${u}`} target="_blank" rel="noopener" className="share-btn twitter" aria-label="Share on Twitter"><i className="fab fa-twitter" /></a>
      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${u}`} target="_blank" rel="noopener" className="share-btn linkedin" aria-label="Share on LinkedIn"><i className="fab fa-linkedin-in" /></a>
      <button onClick={copyLink} className="share-btn copy" aria-label="Copy link"><i className="fas fa-link" /></button>
    </div>
  )
}