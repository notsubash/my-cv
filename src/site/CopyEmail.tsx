import { useCallback, useEffect, useRef, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import posthog from '../posthog'
import { person } from '../home/home-content'

/** Copies the address with a check-mark confirmation; falls back to mailto when the clipboard is blocked. */
export function CopyEmail({ placement, className = 'hm-elsewhere-link', label = 'Copy email' }: { placement: 'hero' | 'footer' | 'contact'; className?: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])
  const copy = useCallback(() => {
    posthog.capture('contact_email_clicked', { placement, action: 'copy' })
    navigator.clipboard.writeText(person.email).then(
      () => {
        setCopied(true)
        window.clearTimeout(timer.current)
        timer.current = window.setTimeout(() => setCopied(false), 1800)
      },
      () => { window.location.href = `mailto:${person.email}` },
    )
  }, [placement])
  return (
    <button type="button" className={`${className} hm-copy`} data-copied={copied || undefined} onClick={copy}>
      <span className="hm-copy-icon" aria-hidden="true">
        <Copy size={16} className="hm-copy-a" />
        <Check size={16} className="hm-copy-b" />
      </span>
      <span aria-live="polite">{copied ? 'Email copied' : label}</span>
    </button>
  )
}
