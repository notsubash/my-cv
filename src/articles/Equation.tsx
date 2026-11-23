import { useMemo } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import './equation.css'

export default function Eq({
  math,
  block = false,
}: {
  math: string
  block?: boolean
}) {
  const html = useMemo(
    () =>
      katex.renderToString(math, {
        displayMode: block,
        throwOnError: true,
        strict: 'ignore',
        output: 'htmlAndMathml',
      }),
    [math, block],
  )

  if (block) {
    // The wrapper is the one scroll region for wide equations, so it takes keyboard focus.
    return (
      <div
        className="eq text-foreground"
        role="group"
        aria-label="Equation"
        tabIndex={0}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    )
  }

  return <span className="text-foreground" dangerouslySetInnerHTML={{ __html: html }} />
}
