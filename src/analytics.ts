type KV = {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
}

export const READ_DEPTHS = [25, 50, 75, 100] as const

export function captureOnce(storage: KV, key: string, capture: () => void): boolean {
  try {
    if (storage.getItem(key)) return false
  } catch {
    // ponytail: private-mode/quota throws; treat as unseen. De-dupe may fail until storage works.
  }
  capture()
  try {
    storage.setItem(key, '1')
  } catch {
    // Event already queued; next call may duplicate if getItem also fails.
  }
  return true
}

export function newReadDepths(percent: number, alreadyFired: Iterable<number>): number[] {
  const seen = new Set(alreadyFired)
  return READ_DEPTHS.filter((depth) => percent >= depth && !seen.has(depth))
}

export function articleScrollPercent(
  articleTop: number,
  articleHeight: number,
  scrollY: number,
  viewportHeight: number,
): number {
  if (articleHeight <= 0) return 0
  const visible = scrollY + viewportHeight - articleTop
  return Math.min(100, Math.max(0, (visible / articleHeight) * 100))
}
