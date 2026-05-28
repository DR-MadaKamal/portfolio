import sharp from 'sharp'
import { resolve, dirname, parse } from 'path'
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dist = resolve(__dirname, '..', 'dist')

const images = [
  { src: 'photo.png', quality: 80 },
  { src: 'logo.png', quality: 80 },
]

for (const img of images) {
  const inputPath = resolve(dist, img.src)
  const parsed = parse(img.src)
  const outputPath = resolve(dist, `${parsed.name}.webp`)

  try {
    const buffer = readFileSync(inputPath)
    const webp = await sharp(buffer).webp({ quality: img.quality }).toBuffer()
    writeFileSync(outputPath, webp)

    const inKB = (buffer.length / 1024).toFixed(0)
    const outKB = (webp.length / 1024).toFixed(0)
    const saved = ((1 - webp.length / buffer.length) * 100).toFixed(0)
    console.log(`[optimize] ${img.src} ${inKB}KB → ${outKB}KB (${saved}% saved)`)
  } catch (err) {
    console.log(`[optimize] Skipped ${img.src}: ${err.message}`)
  }
}
