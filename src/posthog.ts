import posthog from 'posthog-js'
import type { BeforeSendFn } from 'posthog-js'

const projectToken = import.meta.env.VITE_POSTHOG_PROJECT_TOKEN
const host = import.meta.env.VITE_POSTHOG_HOST

/** CefSharp / Outlook Safe Links scanner rejection. Not our app. See #10. */
const CEFSHARP_REJECTION = /Object Not Found Matching Id:\d+, MethodName:\w+, ParamCount:\d+/

const keepPosthogEvent: BeforeSendFn = (event) => {
  if (!event || event.event !== '$exception') return event
  return CEFSHARP_REJECTION.test(JSON.stringify(event.properties ?? {})) ? null : event
}

if (!projectToken) {
  if (import.meta.env.DEV) {
    throw new Error('VITE_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_POSTHOG_PROJECT_TOKEN is configured')
  }
} else if (!host) {
  if (import.meta.env.DEV) {
    throw new Error('VITE_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_POSTHOG_HOST is configured')
  }
} else {
  posthog.init(projectToken, {
    api_host: host,
    ui_host: 'https://us.posthog.com',
    defaults: '2026-08-30',
    person_profiles: 'identified_only',
    capture_pageview: 'history_change',
    capture_pageleave: true,
    secure_cookie: true,
    before_send: keepPosthogEvent,
  })
  // Skip exception autocapture in local/dev: Vite HMR chunk misses are not production bugs (#6).
  if (!import.meta.env.DEV) {
    posthog.startExceptionAutocapture({
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
      capture_console_errors: false,
    })
  }
}

export default posthog
