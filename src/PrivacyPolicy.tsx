import { Link } from 'react-router-dom'
import { usePageSeo } from './hooks/usePageSeo'

export default function PrivacyPolicy() {
  usePageSeo({
    title: 'Privacy Policy | Subash Pandey',
    description: 'Privacy policy for subash-pandey.com. Learn about what data is collected and how it is used.',
    path: '/privacy',
  })

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-14 md:py-24">
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: September 2026</p>

      <div className="prose prose-sm max-w-none text-muted-foreground space-y-6">
        <section>
          <h2 className="font-display text-xl font-semibold text-foreground mb-3">What data is collected</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Anonymous analytics data (pages visited, time on page, device, clicks, and how far you scroll on articles) via Vercel Analytics and PostHog to improve the site.</li>
            <li>PostHog stores a browser identifier in a cookie and local storage so return visits from the same browser can be counted together. Names, emails, and form fields are not sent unless you contact me yourself.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground mb-3">Third parties</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Vercel Analytics: anonymous, privacy-friendly web analytics.</li>
            <li>PostHog: product analytics for page views, interactions, and error reporting. See <a href="https://posthog.com/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">PostHog's privacy policy</a>.</li>
            <li>Cal.com: if you book a call, Cal.com collects the name and email you enter on their form. See <a href="https://cal.com/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Cal.com's privacy policy</a>.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground mb-3">Your rights</h2>
          <p>If you have questions about this data, contact <a href="mailto:axlesubash111@gmail.com" className="text-primary hover:underline">axlesubash111@gmail.com</a>.</p>
        </section>
      </div>

      <div className="mt-12">
        <Link to="/" className="inline-flex min-h-11 items-center text-primary hover:underline text-sm">← Back to home</Link>
      </div>
    </div>
  )
}
