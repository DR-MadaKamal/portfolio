import { useEffect } from 'react'

export default function LiveChatWidget({ chatCode }) {
  useEffect(() => {
    if (!chatCode) return
    const div = document.createElement('div')
    div.innerHTML = chatCode
    document.body.appendChild(div)
    return () => { if (div.parentNode) div.parentNode.removeChild(div) }
  }, [chatCode])

  return null
}
