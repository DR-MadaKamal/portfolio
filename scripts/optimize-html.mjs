import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dist = resolve(__dirname, '..', 'dist')
const htmlPath = resolve(dist, 'index.html')

let html = readFileSync(htmlPath, 'utf-8')

const replaced = html.replace(
  /<link rel="stylesheet" crossorigin href="([^"]+\.css)">/,
  '<link rel="preload" href="$1" as="style" onload="this.rel=\'stylesheet\'"><noscript><link rel="stylesheet" href="$1"></noscript>'
)

if (replaced !== html) {
  writeFileSync(htmlPath, replaced)
  console.log('[optimize-html] Made CSS non-blocking')
} else {
  console.log('[optimize-html] No CSS link found to optimize')
}
