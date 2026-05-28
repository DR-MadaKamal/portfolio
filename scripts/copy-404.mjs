import { copyFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dist = resolve(__dirname, '..', 'dist')

copyFileSync(resolve(dist, 'index.html'), resolve(dist, '404.html'))
console.log('[copy-404] Copied index.html -> 404.html')
