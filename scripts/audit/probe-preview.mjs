// Capture the homepage margin preview while hovering a work row (desktop).
// Usage: node scripts/audit/probe-preview.mjs <rowIndex> <outFile>
import { serve, launch, openPage } from './lib.mjs'

const index = Number(process.argv[2] ?? 0)
const out = process.argv[3] ?? 'docs/redesign/screenshots/preview.png'
const { server, base } = await serve(4213)
const b = await launch()
try {
  const p = await openPage(b, { width: 1440 })
  await p.goto(base + '/', { waitUntil: 'networkidle0' })
  const rows = await p.$$('.hm-row')
  const row = rows[index]
  await row.scrollIntoView()
  const box = await row.boundingBox()
  await p.mouse.move(box.x + 100, box.y + 40)
  await new Promise((r) => setTimeout(r, 1600))
  const pv = await p.$('.hm-preview')
  const pb = await pv.boundingBox()
  console.log(JSON.stringify({ previewWidth: Math.round(pb.width), previewHeight: Math.round(pb.height) }))
  await pv.screenshot({ path: out })
} finally {
  await b.close()
  server.close()
}
