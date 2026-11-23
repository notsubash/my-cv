// In-page function: true characters-per-line of a paragraph, by grouping each
// character's client rect by line top. Returns the median of full lines (excludes last line).
export const CPL_FN = `(el) => {
  if (!el) return null
  const counts = {}
  const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
  const range = document.createRange()
  while (w.nextNode()) {
    const n = w.currentNode
    // KaTeX ships a visually-hidden MathML copy; its glyphs are not on the visible line.
    if (n.parentElement && n.parentElement.closest('.katex-mathml, .sr-only')) continue
    for (let i = 0; i < n.length; i++) {
      range.setStart(n, i); range.setEnd(n, i + 1)
      const r = range.getClientRects()[0]
      if (!r) continue
      const k = Math.round(r.top / 4)
      counts[k] = (counts[k] || 0) + 1
    }
  }
  const lines = Object.keys(counts).map(Number).sort((a, b) => a - b).map((k) => counts[k])
  if (lines.length < 2) return lines[0] ?? null
  const full = lines.slice(0, -1).sort((a, b) => a - b)
  return full[Math.floor(full.length / 2)]
}`
