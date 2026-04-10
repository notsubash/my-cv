import { Link } from 'react-router-dom'
import { usePageSeo } from './hooks/usePageSeo'

export default function PrivacyPolicy() {
  usePageSeo({
    title: 'Privacy Policy | Subash Pandey',
    description: 'Privacy policy for subash-pandey.com. Learn about what data is collected and how it is used.',
    path: '/privacy',
  })

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: April 2026</p>

      <div className="prose prose-sm max-w-none text-muted-foreground space-y-6">
        <section>
          <h2 className="font-display text-xl font-semibold text-foreground mb-3">What data is collected</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Anonymous analytics data (pages visited, duration, device) via Vercel Analytics to improve the site.</li>
            <li>No personal information is collected or stored.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground mb-3">Third parties</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Vercel Analytics: anonymous, privacy-friendly web analytics.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground mb-3">Your rights</h2>
          <p>This site does not collect personal data. If you have questions, contact <a href="mailto:axlesubash111@gmail.com" className="text-primary hover:underline">axlesubash111@gmail.com</a>.</p>
        </section>
      </div>

      <div className="mt-12">
        <Link to="/" className="text-primary hover:underline text-sm">← Back to home</Link>
      </div>
    </div>
  )
}
