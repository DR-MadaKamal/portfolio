export default function LoadingSkeleton({ type = 'card', count = 1 }) {
  if (type === 'card') {
    return (
      <div className="skeleton-grid">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="skeleton-card">
            <div className="skeleton skeleton-img" />
            <div className="skeleton-body">
              <div className="skeleton skeleton-tag" />
              <div className="skeleton skeleton-title" />
              <div className="skeleton skeleton-text" />
              <div className="skeleton skeleton-text short" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (type === 'article') {
    return (
      <div className="skeleton-article">
        <div className="skeleton skeleton-hero" />
        <div className="skeleton-body">
          <div className="skeleton skeleton-title wide" />
          <div className="skeleton skeleton-text" />
          <div className="skeleton skeleton-text" />
          <div className="skeleton skeleton-text short" />
        </div>
      </div>
    )
  }

  if (type === 'list') {
    return (
      <div className="skeleton-list">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="skeleton skeleton-row" />
        ))}
      </div>
    )
  }

  return null
}