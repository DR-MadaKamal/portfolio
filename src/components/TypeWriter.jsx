import { useState, useEffect, useCallback } from 'react'

const words = ['healthcare', 'marketing', 'brands', 'campaigns', 'motion graphics', 'pharmacy', 'strategy']

export default function TypeWriter() {
  const [text, setText] = useState('')
  const [wordIdx, setWordIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const word = words[wordIdx]
    let timeout

    if (!deleting && charIdx < word.length) {
      timeout = setTimeout(() => {
        setText(word.slice(0, charIdx + 1))
        setCharIdx(charIdx + 1)
      }, 80)
    } else if (!deleting && charIdx === word.length) {
      timeout = setTimeout(() => setDeleting(true), 2000)
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => {
        setText(word.slice(0, charIdx - 1))
        setCharIdx(charIdx - 1)
      }, 40)
    } else if (deleting && charIdx === 0) {
      setDeleting(false)
      setWordIdx((wordIdx + 1) % words.length)
    }

    return () => clearTimeout(timeout)
  }, [charIdx, deleting, wordIdx])

  return (
    <span className="typewriter">
      {text}<span className="typewriter-cursor">|</span>
    </span>
  )
}
