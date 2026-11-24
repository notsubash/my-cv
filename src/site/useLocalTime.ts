import { useEffect, useState } from 'react'
import type { LocalTime } from '../home/ProfileSheet'

/** Local time in a zone (Kathmandu), so a recruiter sees the working-hours overlap at a glance. Client only. */
export function useLocalTime(timeZone: string): LocalTime | null {
  const [time, setTime] = useState<LocalTime | null>(null)
  useEffect(() => {
    if (Reflect.get(window, '__PRERENDER__')) return
    const fmt = new Intl.DateTimeFormat('en-GB', { timeZone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
    const tick = () => {
      const label = fmt.format(new Date())
      const [h, m] = label.split(':').map(Number)
      setTime({ label, h, m })
    }
    tick()
    const id = window.setInterval(tick, 30_000)
    return () => window.clearInterval(id)
  }, [timeZone])
  return time
}
