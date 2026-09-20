import CaseStudyLayout, {
  Section,
} from './CaseStudyLayout'
import { useReducedMotion } from 'motion/react'

const CLIP_SRC = '/blog/the-underlying-curve/stencil-that-slides-720p.mp4'
const CLIP_POSTER = '/projects/the-underlying-curve.webp'

const meta = {
  title: 'The Underlying Curve',
  badge: 'Education / Visual',
  kind: 'Education series',
  tagline:
    'Mute visual explainers of data science, ML, and AI. One object per video.',
  tech: ['Manim', 'FFmpeg', 'Python'],
  links: [
    { label: 'Instagram', url: 'https://www.instagram.com/theunderlyingcurve/', icon: 'instagram' as const },
    { label: 'TikTok', url: 'https://www.tiktok.com/@theunderlyingcurve', icon: 'tiktok' as const },
    { label: 'YouTube', url: 'https://www.youtube.com/channel/UCexmjydtgJk1ye02E4QdtyQ', icon: 'youtube' as const },
    { label: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61594299692964', icon: 'facebook' as const },
  ],
  metrics: [] as { value: string; label: string }[],
  seoTitle: 'The Underlying Curve — Education Series | Subash Pandey',
  seoDescription:
    'The Underlying Curve is my independent education series: mute visual explainers of data science, ML, and AI. One object per video. I built the brand and the pipeline in Manim and FFmpeg.',
  seoKeywords:
    'the underlying curve, mute visual explainers, manim, ffmpeg, data science education, machine learning explainer',
}

export default function TheUnderlyingCurve() {
  const reduceMotion = useReducedMotion()

  return (
    <CaseStudyLayout meta={meta}>
      <Section title="Overview">
        <figure className="mb-6">
          <div className="aspect-video rounded-xl overflow-hidden border border-border bg-muted">
            <video
              className="h-full w-full object-cover"
              controls
              playsInline
              muted
              loop
              autoPlay={reduceMotion === false}
              preload="metadata"
              poster={CLIP_POSTER}
              aria-labelledby="tuc-clip-caption"
            >
              <source src={CLIP_SRC} type="video/mp4" />
            </video>
          </div>
          <figcaption id="tuc-clip-caption" className="text-center text-xs text-muted-foreground mt-2">
            Convolution: a stencil that slides
          </figcaption>
        </figure>
        <p>
          Each episode is mute. One idea from data science, ML, or AI, shown as
          the object itself. The clip above is convolution: a stencil that slides.
        </p>
        <p>
          I write the scenes in Manim. FFmpeg encodes them and crops 16:9 and 9:16
          for Instagram, TikTok, YouTube, and Facebook. Instagram is the main
          channel. I built the brand and this pipeline.
        </p>
      </Section>
    </CaseStudyLayout>
  )
}
