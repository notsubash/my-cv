import { useEffect, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { getCalApi } from '@calcom/embed-react'
import posthog from './posthog'

const CAL_NAMESPACE = 'intro'
const CAL_LINK = 'subash-pandey/intro'

type CalTheme = 'dark' | 'light'
export type BookingPlacement = 'hero' | 'about' | 'footer'

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

let bookingSuccessBound = false
let lastBookingPlacement: BookingPlacement | undefined

function bindBookingSuccessOnce() {
  if (bookingSuccessBound) return
  bookingSuccessBound = true
  void getCalApi({ namespace: CAL_NAMESPACE }).then((cal) => {
    cal('on', {
      action: 'bookingSuccessfulV2',
      callback: () => posthog.capture(
        'consultation_booking_completed',
        lastBookingPlacement ? { placement: lastBookingPlacement } : {},
      ),
    })
  })
}

type CalBookButtonProps = {
  children: ReactNode
  className?: string
  placement: BookingPlacement
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'>

export function CalBookButton({ children, className, onClick, placement, ...props }: CalBookButtonProps) {
  useEffect(() => {
    bindBookingSuccessOnce()

    const sync = () => {
      void applyCalTheme(getSiteTheme())
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
        lastBookingPlacement = placement
        posthog.capture('consultation_booking_opened', { placement })
        onClick?.(event)
      }}
      {...props}
    >
      {children}
    </button>
  )
}
