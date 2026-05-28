import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DIST = resolve(__dirname, '..', 'public')

const BASE = 'https://DR-MadaKamal.github.io/portfolio'

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[''']/g, '')
    .replace(/[&]/g, 'and')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const articles = [
  {
    title: 'The Role of AI in Modern Medical Marketing',
    description: 'How artificial intelligence is transforming healthcare marketing — from patient targeting to personalized content creation and predictive analytics.',
    date: '2026-02-15',
    tags: ['AI', 'Medical Marketing', 'Healthcare', 'Technology'],
  },
  {
    title: 'Building Brands in the Pharmaceutical Industry',
    description: 'A deep dive into brand strategy for pharma: regulatory considerations, HCP engagement, and omnichannel approaches that drive results.',
    date: '2026-01-20',
    tags: ['Pharma', 'Brand Strategy', 'HCP', 'Regulatory'],
  },
  {
    title: 'Motion Graphics: The Secret Weapon for Engagement',
    description: 'Why high-end motion graphics outperform static content in digital campaigns and how to leverage them effectively.',
    date: '2025-12-10',
    tags: ['Motion Graphics', 'Video', 'Digital Campaigns', 'Creative'],
  },
  {
    title: 'SEO for Healthcare Websites: A Complete Guide',
    description: 'Master healthcare SEO with strategies for medical websites, local search optimization, and compliance-aware content marketing.',
    date: '2025-10-05',
    tags: ['SEO', 'Healthcare', 'Content Marketing', 'Digital Strategy'],
  },
  {
    title: 'The Complete Guide to Facebook & Meta Ads for Clinics',
    description: 'Step-by-step strategies for running compliant, high-ROI Meta advertising campaigns for healthcare clinics and medical practices.',
    date: '2025-08-20',
    tags: ['Social Media Ads', 'Meta Ads', 'Clinics', 'PPC'],
  },
  {
    title: 'How to Build a High-Converting Medical Website',
    description: 'From UX design to patient journey mapping — everything you need to create a medical website that attracts, converts, and retains patients.',
    date: '2025-06-15',
    tags: ['Web Design', 'UX', 'Medical Websites', 'Conversion'],
  },
]

const pages = [
  { loc: `${BASE}/`, priority: 1.0, changefreq: 'monthly' },
  { loc: `${BASE}/#about`, priority: 0.8, changefreq: 'monthly' },
  { loc: `${BASE}/#projects`, priority: 0.8, changefreq: 'monthly' },
  { loc: `${BASE}/#portfolio-gallery`, priority: 0.7, changefreq: 'monthly' },
  { loc: `${BASE}/#case-studies`, priority: 0.8, changefreq: 'monthly' },
  { loc: `${BASE}/#testimonials`, priority: 0.6, changefreq: 'monthly' },
  { loc: `${BASE}/#achievements`, priority: 0.6, changefreq: 'monthly' },
  { loc: `${BASE}/#process`, priority: 0.7, changefreq: 'monthly' },
  { loc: `${BASE}/#tools`, priority: 0.6, changefreq: 'monthly' },
  { loc: `${BASE}/#faq`, priority: 0.6, changefreq: 'monthly' },
  { loc: `${BASE}/#articles`, priority: 0.8, changefreq: 'weekly' },
  { loc: `${BASE}/#contact`, priority: 0.7, changefreq: 'monthly' },
]

articles.forEach((a) => {
  const slug = slugify(a.title)
  pages.push({
    loc: `${BASE}/article/${slug}`,
    priority: 0.8,
    changefreq: 'monthly',
    lastmod: a.date,
  })
})

function escapeXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}

function buildSitemapXml() {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<!-- generated: ' + new Date().toISOString() + ' -->\n'
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  for (const p of pages) {
    xml += '  <url>\n'
    xml += `    <loc>${escapeXml(p.loc)}</loc>\n`
    if (p.lastmod) xml += `    <lastmod>${p.lastmod}</lastmod>\n`
    xml += `    <changefreq>${p.changefreq}</changefreq>\n`
    xml += `    <priority>${p.priority.toFixed(1)}</priority>\n`
    xml += '  </url>\n'
  }
  xml += '</urlset>\n'
  return xml
}

writeFileSync(resolve(DIST, 'sitemap.xml'), buildSitemapXml(), 'utf-8')
writeFileSync(resolve(DIST, 'robots.txt'), [
  'User-agent: *',
  'Allow: /',
  '',
  `Sitemap: ${BASE}/sitemap.xml`,
].join('\n') + '\n', 'utf-8')

console.log(`[sitemap] Generated sitemap.xml with ${pages.length} URLs`)
console.log(`[sitemap] Updated robots.txt`)
