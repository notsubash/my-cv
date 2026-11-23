// Favicon set from the chosen "sp in pixels" mark (same glyphs as /lab/logos concept 15).
// Usage: node scripts/assets/render-favicon.mjs
// Writes public/favicon.svg, favicon.ico (16/32/48), favicon-16x16.png, favicon-32x32.png,
// apple-touch-icon.png (180), android-chrome-192x192.png, android-chrome-512x512.png.
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import puppeteer from 'puppeteer'

const ROOT = process.cwd()
const INK = '#16181b'
const PAPER = '#fbfbfa'
const ACCENT = '#cf3a0e'
// 16-cell grid, 1 cell = 4 units of a 64-unit box = exactly 1px at 16px.
const S_PX = ['.####', '#....', '.###.', '....#', '####.']
const P_PX = ['####.', '#...#', '#...#', '#...#', '####.', '#....', '#....']
const cells = (rows, col0, row0) =>
  rows.flatMap((row, y) => [...row].map((c, x) => (c === '#' ? `<rect x="${(col0 + x) * 4}" y="${(row0 + y) * 4}" width="4" height="4"/>` : ''))).join('')

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<rect width="64" height="64" rx="12" fill="${INK}"/>
<g fill="${PAPER}" shape-rendering="crispEdges">${cells(S_PX, 2, 4)}${cells(P_PX, 8, 4)}</g>
<rect x="56" y="32" width="4" height="4" fill="${ACCENT}" shape-rendering="crispEdges"/>
</svg>
`
writeFileSync(join(ROOT, 'public/favicon.svg'), svg)
console.log('✓ public/favicon.svg')

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })
const png = {}
try {
  const page = await browser.newPage()
  for (const size of [16, 32, 48, 180, 192, 512]) {
    await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 })
    await page.setContent(`<html><body style="margin:0;background:transparent">${svg.replace('<svg ', `<svg width="${size}" height="${size}" `)}</body></html>`)
    png[size] = await page.screenshot({ type: 'png', omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } })
  }
} finally {
  await browser.close()
}

const out = { 'favicon-16x16.png': 16, 'favicon-32x32.png': 32, 'apple-touch-icon.png': 180, 'android-chrome-192x192.png': 192, 'android-chrome-512x512.png': 512 }
for (const [name, size] of Object.entries(out)) {
  writeFileSync(join(ROOT, 'public', name), png[size])
  console.log('✓ public/' + name)
}

// ICO container holding PNG-compressed 16/32/48 entries.
const sizes = [16, 32, 48]
const header = Buffer.alloc(6)
header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(sizes.length, 4)
const dir = Buffer.alloc(16 * sizes.length)
let offset = 6 + dir.length
sizes.forEach((s, i) => {
  const b = png[s]
  dir.writeUInt8(s, i * 16); dir.writeUInt8(s, i * 16 + 1); dir.writeUInt8(0, i * 16 + 2); dir.writeUInt8(0, i * 16 + 3)
  dir.writeUInt16LE(1, i * 16 + 4); dir.writeUInt16LE(32, i * 16 + 6)
  dir.writeUInt32LE(b.length, i * 16 + 8); dir.writeUInt32LE(offset, i * 16 + 12)
  offset += b.length
})
writeFileSync(join(ROOT, 'public/favicon.ico'), Buffer.concat([header, dir, ...sizes.map((s) => png[s])]))
console.log('✓ public/favicon.ico (16, 32, 48)')
