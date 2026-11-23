import { useEffect, useRef, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import posthog from '../posthog'

export default function CodeBlock({ code, lang = 'python' }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      posthog.capture('code_block_copied', { language: lang })
      setCopied(true)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setCopied(false), 1600)
    })
  }

  return (
    <figure className="codeblock">
      <figcaption className="codeblock-bar">
        <span>{lang}</span>
        <button type="button" onClick={handleCopy} aria-label={copied ? 'Copied' : `Copy ${lang} code`}>
          {copied ? <Check className="w-3.5 h-3.5" aria-hidden="true" /> : <Copy className="w-3.5 h-3.5" aria-hidden="true" />}
          <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </figcaption>
      {/* tabIndex: horizontal scroll must be reachable by keyboard */}
      <pre tabIndex={0} aria-label={`${lang} code`}><code>{code}</code></pre>
    </figure>
  )
}
