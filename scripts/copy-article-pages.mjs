import { copyFileSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dist = resolve(__dirname, '..', 'dist')

const slugs = [
  'the-role-of-ai-in-modern-medical-marketing',
  'building-brands-in-the-pharmaceutical-industry',
  'motion-graphics-the-secret-weapon-for-engagement',
  'seo-for-healthcare-websites-a-complete-guide',
  'the-complete-guide-to-facebook-and-meta-ads-for-clinics',
  'how-to-build-a-high-converting-medical-website',
]

for (const slug of slugs) {
  const dir = resolve(dist, 'article', slug)
  mkdirSync(dir, { recursive: true })
  copyFileSync(resolve(dist, 'index.html'), resolve(dir, 'index.html'))
}
console.log(`[article-pages] Created ${slugs.length} article directories with index.html`)
