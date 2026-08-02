import { useEffect, useState, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { getCalApi } from '@calcom/embed-react'
import posthog from './posthog'

const CAL_NAMESPACE = 'intro'
const CAL_LINK = 'subash-pandey/intro'

type CalTheme = 'dark' | 'light'

function getSiteTheme(): CalTheme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

async function applyCalTheme(theme: CalTheme) {
  const cal = await getCalApi({ namespace: CAL_NAMESPACE })
  cal('ui', {
    theme,
    colorScheme: theme,
    hideEventTypeDetails: false,
    layout: 'month_view',
  })
}

type CalBookButtonProps = {
  children: ReactNode
  className?: string
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'>

export function CalBookButton({ children, className, onClick, ...props }: CalBookButtonProps) {
  const [theme, setTheme] = useState<CalTheme>(() =>
    typeof document !== 'undefined' ? getSiteTheme() : 'dark',
  )

  useEffect(() => {
    const sync = () => {
      const next = getSiteTheme()
      setTheme(next)
      void applyCalTheme(next)
    }

    sync()

    const observer = new MutationObserver(sync)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
    return () => observer.disconnect()
  }, [])

  const calConfig = JSON.stringify({
    layout: 'month_view',
    theme,
    useSlotsViewOnSmallScreen: true,
  })

  return (
    <button
      type="button"
      data-cal-namespace={CAL_NAMESPACE}
      data-cal-link={CAL_LINK}
      data-cal-config={calConfig}
      className={className}
      onClick={(event) => {
        posthog.capture('consultation_booking_opened')
        onClick?.(event)
      }}
      {...props}
    >
      {children}
    </button>
  )
}
