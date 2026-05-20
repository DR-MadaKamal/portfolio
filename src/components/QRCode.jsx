import { useEffect, useState } from 'react'

export default function QRCode() {
  const [url, setUrl] = useState('')

  useEffect(() => {
    setUrl(window.location.href)
  }, [])

  if (!url) return null

  return (
    <div className="qr-wrapper">
      <img
        src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(url)}`}
        alt="QR Code"
        className="qr-img"
      />
    </div>
  )
}
