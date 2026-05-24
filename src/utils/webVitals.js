function sendToAnalytics(name, value) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', name, {
      event_category: 'Web Vitals',
      event_label: name,
      value: Math.round(name === 'CLS' ? value * 1000 : value),
      non_interaction: true,
    })
  }
  if (import.meta.env.DEV) {
    console.log(`[Web Vitals] ${name}:`, value)
  }
}

function observe(name, metric) {
  sendToAnalytics(name, metric.value)
}

export function reportWebVitals() {
  try {
    if ('PerformanceObserver' in window) {
      const handlers = {
        'largest-contentful-paint': (entry) => observe('LCP', entry),
        'first-input': (entry) => observe('FID', entry),
        'layout-shift': (entries) => {
          let cls = 0
          entries.forEach(entry => {
            if (!entry.hadRecentInput) cls += entry.value
          })
          if (cls > 0) sendToAnalytics('CLS', cls)
        },
      }

      Object.entries(handlers).forEach(([type, handler]) => {
        try {
          const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach(handler)
          })
          observer.observe({ type, buffered: true })
        } catch {}
      })
    }
  } catch {}
}