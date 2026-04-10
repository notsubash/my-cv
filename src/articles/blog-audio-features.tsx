import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Calendar, Tag } from 'lucide-react'
import BlogNav from './BlogNav'
import BlogToc from './BlogToc'
import CodeBlock from './CodeBlock'
import { useBlogSeo, useReadingTime } from './useBlogSeo'

function DiagramBox({ x, y, w, h, label, sublabel, accent }: { x: number; y: number; w: number; h: number; label: string; sublabel?: string; accent?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8}
        className={accent ? 'fill-[hsl(var(--accent)/0.15)] stroke-[hsl(var(--accent)/0.6)]' : 'fill-[hsl(var(--card))] stroke-[hsl(var(--border))]'}
        strokeWidth={1.5}
      />
      <text x={x + w / 2} y={y + (sublabel ? h / 2 - 6 : h / 2 + 1)} textAnchor="middle" dominantBaseline="middle"
        className="fill-[hsl(var(--foreground))] text-[11px] font-semibold"
      >{label}</text>
      {sublabel && (
        <text x={x + w / 2} y={y + h / 2 + 10} textAnchor="middle" dominantBaseline="middle"
          className="fill-[hsl(var(--muted-foreground))] text-[9px]"
        >{sublabel}</text>
      )}
    </g>
  )
}

function DiagramArrow({ x1, y1, x2, y2, label }: { x1: number; y1: number; x2: number; y2: number; label?: string }) {
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.sqrt(dx * dx + dy * dy)
  const ux = dx / len
  const uy = dy / len
  const ax = x2 - ux * 6
  const ay = y2 - uy * 6
  return (
    <g>
      <line x1={x1} y1={y1} x2={ax} y2={ay} className="stroke-[hsl(var(--primary)/0.5)]" strokeWidth={1.5} />
      <polygon
        points={`${x2},${y2} ${ax - uy * 4},${ay + ux * 4} ${ax + uy * 4},${ay - ux * 4}`}
        className="fill-[hsl(var(--primary)/0.5)]"
      />
      {label && (
        <text x={(x1 + x2) / 2 + (Math.abs(uy) > 0.5 ? 8 : 0)} y={(y1 + y2) / 2 - 6} textAnchor="middle"
          className="fill-[hsl(var(--muted-foreground))] text-[8px]"
        >{label}</text>
      )}
    </g>
  )
}

function PipelineDiagram() {
  return (
    <figure className="my-6">
      <svg viewBox="0 0 640 180" className="w-full" role="img" aria-label="Audio feature extraction pipeline diagram">
        <DiagramBox x={10} y={10} w={90} h={50} label="WAV Upload" sublabel="via FastAPI" />
        <DiagramArrow x1={100} y1={35} x2={130} y2={35} />
        <DiagramBox x={130} y={10} w={100} h={50} label="Load Audio" sublabel="librosa + soundfile" />
        <DiagramArrow x1={230} y1={35} x2={260} y2={35} />

        <DiagramBox x={260} y={10} w={100} h={50} label="Loudness" sublabel="RMS · LUFS" accent />
        <DiagramBox x={370} y={10} w={100} h={50} label="Frequency" sublabel="F0 tracking" accent />
        <DiagramBox x={260} y={70} w={100} h={50} label="Quality" sublabel="Spectral balance" accent />
        <DiagramBox x={370} y={70} w={100} h={50} label="Timing" sublabel="Silence detect" accent />

        <DiagramArrow x1={230} y1={45} x2={260} y2={95} />
        <DiagramArrow x1={360} y1={35} x2={370} y2={35} />
        <DiagramArrow x1={360} y1={95} x2={370} y2={95} />

        <DiagramArrow x1={470} y1={35} x2={500} y2={65} />
        <DiagramArrow x1={470} y1={95} x2={500} y2={75} />

        <DiagramBox x={500} y={50} w={120} h={50} label="JSON Response" sublabel="Metrics + timeseries" />
      </svg>
      <figcaption className="text-center text-xs text-muted-foreground mt-2">One possible pipeline: audio in, structured metrics out</figcaption>
    </figure>
  )
}

function PitchComparisonDiagram() {
  return (
    <figure className="my-6">
      <svg viewBox="0 0 520 170" className="w-full" role="img" aria-label="Pitch extraction comparison: librosa vs Parselmouth">
        <DiagramBox x={10} y={55} w={100} h={50} label="Audio Signal" sublabel="WAV loaded" />

        <DiagramArrow x1={110} y1={70} x2={150} y2={35} />
        <DiagramArrow x1={110} y1={90} x2={150} y2={115} />

        <DiagramBox x={150} y={10} w={130} h={50} label="librosa.pyin" sublabel="Probabilistic YIN" />
        <DiagramBox x={150} y={90} w={130} h={50} label="Parselmouth" sublabel="Praat autocorrelation" />

        <DiagramArrow x1={280} y1={35} x2={320} y2={35} />
        <DiagramArrow x1={280} y1={115} x2={320} y2={115} />

        <DiagramBox x={320} y={10} w={100} h={50} label="F0 series" sublabel="NaN-filtered" accent />
        <DiagramBox x={320} y={90} w={100} h={50} label="F0 series" sublabel="0 Hz = unvoiced" accent />

        <DiagramArrow x1={420} y1={35} x2={450} y2={70} />
        <DiagramArrow x1={420} y1={115} x2={450} y2={85} />

        <DiagramBox x={450} y={55} w={60} h={50} label="Compare" />
      </svg>
      <figcaption className="text-center text-xs text-muted-foreground mt-2">Two pitch pipelines, same audio, different assumptions</figcaption>
    </figure>
  )
}

function PlacementDiagram() {
  return (
    <figure className="my-6">
      <svg viewBox="0 0 560 200" className="w-full" role="img" aria-label="Placement metrics extraction flow">
        <DiagramBox x={10} y={70} w={90} h={50} label="Audio" sublabel="signal y, sr" />

        <DiagramArrow x1={100} y1={80} x2={140} y2={30} />
        <DiagramArrow x1={100} y1={95} x2={140} y2={95} />
        <DiagramArrow x1={100} y1={110} x2={140} y2={160} />

        <DiagramBox x={140} y={5} w={120} h={50} label="STFT → HPSS" sublabel="Harmonic / Percussive" accent />
        <DiagramBox x={140} y={70} w={120} h={50} label="Bandpass Filter" sublabel="Semitone filterbank" accent />
        <DiagramBox x={140} y={135} w={120} h={50} label="Welch PSD" sublabel="Spectral energy" accent />

        <DiagramArrow x1={260} y1={30} x2={310} y2={30} />
        <DiagramArrow x1={260} y1={85} x2={310} y2={85} />
        <DiagramArrow x1={260} y1={95} x2={310} y2={105} />
        <DiagramArrow x1={260} y1={160} x2={310} y2={160} />

        <DiagramBox x={310} y={5} w={100} h={50} label="HNR" sublabel="10·log₁₀(H/P)" />
        <DiagramBox x={310} y={68} w={100} h={24} label="Nasal band" sublabel="" />
        <DiagramBox x={310} y={98} w={100} h={24} label="Oral band" sublabel="" />
        <DiagramBox x={310} y={135} w={100} h={50} label="VLHR" sublabel="low/high energy" />

        <DiagramArrow x1={410} y1={30} x2={450} y2={65} />
        <DiagramArrow x1={410} y1={80} x2={450} y2={85} />
        <DiagramArrow x1={410} y1={110} x2={450} y2={95} />
        <DiagramArrow x1={410} y1={160} x2={450} y2={110} />

        <DiagramBox x={450} y={55} w={100} h={70} label="Voice Quality" sublabel="combined output" accent />
      </svg>
      <figcaption className="text-center text-xs text-muted-foreground mt-2">Voice quality is the most complex dimension: three different signal decomposition methods</figcaption>
    </figure>
  )
}

function WaveformViz() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const points: [number, number][] = []
  for (let i = 0; i < 200; i++) {
    const t = i / 200
    const amp = 0.3 + 0.5 * Math.sin(t * Math.PI)
    const noise = (Math.sin(i * 7.3) * 0.3 + Math.sin(i * 13.1) * 0.2 + Math.sin(i * 23.7) * 0.15)
    points.push([i * 3, 60 + noise * amp * 50])
  }
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ')

  const silenceRanges = [[60, 120], [320, 400], [500, 540]]

  return (
    <figure className="my-6">
      <svg viewBox="0 0 600 120" className="w-full" role="img" aria-label="Stylized waveform with detected pauses">
        {silenceRanges.map(([x1, x2], i) => (
          <rect key={i} x={x1} y={0} width={x2 - x1} height={120} rx={4}
            className="fill-[hsl(var(--accent)/0.08)]"
          />
        ))}
        <path d={pathD} fill="none" className="stroke-[hsl(var(--primary)/0.6)]" strokeWidth={1.5}
          style={mounted ? { strokeDasharray: 1200, strokeDashoffset: 0, transition: 'stroke-dashoffset 1.5s ease-out' } : { strokeDasharray: 1200, strokeDashoffset: 1200 }}
        />
        {silenceRanges.map(([x1, x2], i) => (
          <text key={`l${i}`} x={(x1 + x2) / 2} y={115} textAnchor="middle"
            className="fill-[hsl(var(--accent)/0.6)] text-[8px]"
          >pause</text>
        ))}
        <line x1={0} y1={60} x2={600} y2={60} className="stroke-[hsl(var(--border))]" strokeWidth={0.5} strokeDasharray="4 4" />
      </svg>
      <figcaption className="text-center text-xs text-muted-foreground mt-2">Stylized waveform with detected silent segments highlighted</figcaption>
    </figure>
  )
}

function MetricsGrid() {
  const categories = [
    {
      name: 'Loudness',
      color: 'hsl(var(--primary))',
      metrics: [
        { name: 'RMS Energy', desc: 'Frame-level amplitude' },
        { name: 'LUFS', desc: 'Perceived loudness (ITU-R BS.1770)' },
      ]
    },
    {
      name: 'Frequency',
      color: 'hsl(var(--accent))',
      metrics: [
        { name: 'F0 (pyin)', desc: 'Probabilistic fundamental freq' },
        { name: 'F0 (Praat)', desc: 'Autocorrelation-based' },
        { name: 'Variability', desc: 'Std deviation of F0' },
        { name: 'Range', desc: 'Max F0 minus min F0' },
      ]
    },
    {
      name: 'Voice Quality',
      color: 'hsl(var(--primary))',
      metrics: [
        { name: 'HNR', desc: 'Harmonic-to-noise via HPSS' },
        { name: 'Nasalance', desc: 'Band energy ratios' },
        { name: 'VLHR', desc: 'Low-to-high frequency ratio' },
      ]
    },
    {
      name: 'Timing',
      color: 'hsl(var(--accent))',
      metrics: [
        { name: 'Count', desc: 'Silences > threshold' },
        { name: 'Rate', desc: 'Pauses per minute' },
        { name: 'Avg Duration', desc: 'Mean pause length (ms)' },
        { name: 'Variability', desc: 'Coefficient of variation' },
      ]
    },
  ]

  return (
    <figure className="my-6">
      <div className="grid grid-cols-2 gap-3">
        {categories.map((cat) => (
          <div key={cat.name} className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">{cat.name}</p>
            <ul className="space-y-1.5">
              {cat.metrics.map((m) => (
                <li key={m.name} className="flex items-start gap-2 text-xs">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span><span className="text-foreground font-medium">{m.name}</span> <span className="text-muted-foreground">{m.desc}</span></span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <figcaption className="text-center text-xs text-muted-foreground mt-2">Example metrics across four categories — the specific set depends on your use case</figcaption>
    </figure>
  )
}

export default function BlogAudioFeatures() {
  useBlogSeo({
    title: 'Audio Feature Extraction: Designing an Audio Metrics Pipeline',
    description: 'Techniques for extracting quantitative metrics from human voice recordings using Parselmouth, librosa, and Python. Covers pitch tracking, loudness measurement, spectral analysis, and silence detection.',
    keywords: 'audio feature extraction python, parselmouth praat python tutorial, librosa audio analysis, speech analysis api fastapi, pitch extraction pyin, harmonic to noise ratio hpss, voice quality metrics python, pyloudnorm lufs measurement, voice low to high ratio vlhr, pause detection pydub, audio signal processing python, fundamental frequency f0 extraction, nasalance measurement python, semitone filterbank librosa',
    ogImage: '/og-blog-audio-features.webp',
    datePublished: '2026-04-10',
    slug: 'audio-feature-extraction',
  })
  const { articleRef, readingTimeRef } = useReadingTime()

  return (
    <main className="min-h-screen bg-background">
      <BlogToc articleRef={articleRef} />
      <article ref={articleRef} className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to blog
        </Link>

        <header className="mb-10">
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
            <span className="inline-flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> April 2026</span>
            <span className="text-border">·</span>
            <span ref={readingTimeRef}>12 min read</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4 leading-tight">
            Audio Feature Extraction: Designing an Audio Metrics Pipeline
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed mb-5">
            This post explores techniques for extracting quantitative metrics from human voice recordings. Not subjective ratings, but actual numbers: pitch variability, loudness, harmonic quality, pause patterns. The approach below shows how to pull a range of speech metrics out of WAV files using Parselmouth, librosa, and a handful of scipy calls.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {['Parselmouth', 'librosa', 'FastAPI', 'Python', 'scipy', 'Audio ML'].map(tag => (
              <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-muted text-muted-foreground">
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground mb-6">
          This implementation is a personal reconstruction based on general audio processing techniques and publicly available libraries. It does not represent any proprietary system or production architecture.
        </div>

        <hr className="border-border mb-10" />

        <div className="prose-custom space-y-8 text-sm text-muted-foreground leading-relaxed">

          <section>
            <h2 id="overview" className="font-display text-lg font-semibold text-foreground mb-3">The problem</h2>
            <p>
              Analyzing the human voice is one of those areas where you can get surprisingly far with classical signal processing. No deep learning needed. Upload a voice recording, run some FFTs and autocorrelations, and you get metrics that are actually interpretable.
            </p>
            <p className="mt-3">
              When analyzing the human voice, the metrics tend to cluster around a few dimensions: <strong className="text-foreground">loudness</strong> (how loud), <strong className="text-foreground">frequency</strong> (pitch height and variation), <strong className="text-foreground">voice quality</strong> (resonance and spectral balance), and <strong className="text-foreground">timing</strong> (silence patterns and rhythm). Each breaks down further.
            </p>
            <PipelineDiagram />
            <MetricsGrid />
          </section>

          <section>
            <h2 id="loudness" className="font-display text-lg font-semibold text-foreground mb-3">Loudness: RMS and LUFS</h2>
            <p>
              Loudness is the simplest dimension. Two metrics: frame-level <strong className="text-foreground">RMS energy</strong> for a timeseries view, and <strong className="text-foreground">integrated LUFS</strong> for a single-number loudness score.
            </p>
            <p className="mt-3">
              RMS comes from <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">librosa.feature.rms</code> with a 512-sample frame length and 256-sample hop. That gives a smooth amplitude envelope you can plot over time. The hop length matters: too large and you lose transient detail, too small and the curve gets noisy without adding information.
            </p>
            <CodeBlock lang="python" code={`y, sr = librosa.load(path)
rms = librosa.feature.rms(y=y, frame_length=512, hop_length=256, center=True)

# LUFS needs the original sample rate — load separately
data, rate = sf.read(path)
meter = pyln.Meter(rate)
loudness = meter.integrated_loudness(data)`} />
            <p className="mt-3">
              For perceived loudness, raw RMS isn't enough. LUFS (Loudness Units Full Scale) follows the ITU-R BS.1770 standard, which applies K-weighting to match human hearing perception. <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">pyloudnorm</code> handles this well. You feed it the audio signal loaded via <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">soundfile</code> (not librosa, because pyloudnorm expects the original sample rate) and get back a single integrated loudness number. A recording at -14 LUFS is conversational; -6 LUFS is someone yelling into the mic.
            </p>
            <p className="mt-3">
              One gotcha: <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">librosa.load</code> resamples everything to 22050 Hz by default. That is fine for feature extraction, but LUFS needs the original sample rate. This means loading the audio twice: once with librosa (resampled) for most processing, once with soundfile (native rate) for LUFS and Parselmouth.
            </p>
          </section>

          <section>
            <h2 id="frequency" className="font-display text-lg font-semibold text-foreground mb-3">Frequency: two pitch extractors, and why both matter</h2>
            <p>
              Pitch extraction is the most studied problem in audio signal processing and there is still no single algorithm that works for everyone. Running two pitch trackers on every file and returning both results gives the most flexibility.
            </p>

            <h3 id="librosa-pyin" className="font-display text-base font-semibold text-foreground mt-6 mb-2">librosa pyin</h3>
            <p>
              <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">librosa.pyin</code> implements probabilistic YIN, which estimates fundamental frequency by autocorrelation with a probabilistic threshold. Setting <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">fmin=C2</code> (~65 Hz) and <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">fmax=C5</code> (~523 Hz) covers the normal speaking range. The output includes NaN values for unvoiced frames (breaths, silence, consonants), which I filter out before computing statistics.
            </p>
            <p className="mt-3">
              From the cleaned F0 series, three derived metrics: <strong className="text-foreground">mean F0</strong> (average speaking pitch), <strong className="text-foreground">pitch variability</strong> (standard deviation of F0, higher means more expressive), and <strong className="text-foreground">pitch range</strong> (max minus min, captures the full span of the voice).
            </p>
            <CodeBlock lang="python" code={`f0, voiced_flag, voiced_probs = librosa.pyin(
    y, fmin=librosa.note_to_hz('C2'), fmax=librosa.note_to_hz('C5')
)
f0_clean = f0[~np.isnan(f0)]
pitch_variability = np.std(f0_clean)
pitch_range = np.max(f0_clean) - np.min(f0_clean)`} />

            <h3 id="parselmouth" className="font-display text-base font-semibold text-foreground mt-6 mb-2">Parselmouth (Praat)</h3>
            <p>
              <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">parselmouth</code> is a Python wrapper around Praat, which has been the gold standard for phonetic analysis for decades. Praat's pitch algorithm uses autocorrelation with a different set of heuristics than pyin: it handles octave jumps better, handles noise differently, and uses 0 Hz instead of NaN for unvoiced frames.
            </p>
            <CodeBlock lang="python" code={`sound = parselmouth.Sound(data, rate)
pitch = sound.to_pitch()
pm_f0 = pitch.selected_array['frequency']
pm_f0_voiced = pm_f0[pm_f0 > 0]  # drop unvoiced (0 Hz) frames
pm_variability = np.std(pm_f0_voiced)
pm_range = np.max(pm_f0_voiced) - np.min(pm_f0_voiced)`} />
            <p className="mt-3">
              The results are noticeably different from librosa's. On the same recording, Parselmouth tends to give a smoother F0 contour with fewer spurious jumps, but it can also miss quieter voiced segments that pyin catches. Neither is "correct" in all cases. Returning both gives you more data to work with, and whichever contour looks more useful for a particular recording can be used downstream.
            </p>
            <PitchComparisonDiagram />
          </section>

          <section>
            <h2 id="voice-quality" className="font-display text-lg font-semibold text-foreground mb-3">Voice quality: where it got tricky</h2>
            <p>
              The human voice carries a lot of information in its spectral characteristics beyond just pitch. A "chest voice" has more low frequency energy, a "head voice" has more high frequency energy, and nasal resonance sits in a specific mid-range band. Quantifying these qualities from a raw audio signal took some creative signal processing.
            </p>

            <h3 id="hnr-hpss" className="font-display text-base font-semibold text-foreground mt-6 mb-2">HNR via HPSS</h3>
            <p>
              Classical Harmonic-to-Noise Ratio measures how much of a voice signal is periodic (harmonic) versus aperiodic (noise). The standard approach uses autocorrelation, but an alternative is <strong className="text-foreground">harmonic/percussive source separation</strong> (HPSS) on the STFT, then computing the energy ratio.
            </p>
            <p className="mt-3">
              <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">librosa.decompose.hpss</code> splits the spectrogram into harmonic (sustained tones) and percussive (transient) components using median filtering. The HNR is then <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">10 * log10(E_harmonic / E_percussive)</code>. Higher values mean a cleaner, more resonant voice. This isn't exactly the same as Praat's HNR (which uses autocorrelation on the time domain), but it captures a similar quality dimension and works well in practice.
            </p>
            <CodeBlock lang="python" code={`D = librosa.stft(y)
D_harmonic, D_percussive = librosa.decompose.hpss(D)
E_harmonic = np.sum(np.abs(D_harmonic) ** 2)
E_percussive = np.sum(np.abs(D_percussive) ** 2)
hnr = 10 * np.log10(E_harmonic / E_percussive)`} />

            <h3 id="nasalance" className="font-display text-base font-semibold text-foreground mt-6 mb-2">Nasalance via band energy</h3>
            <p>
              Nasalance is usually measured with a physical device (a nasometer) that separates nasal and oral airflow. It can be approximated using frequency band energy ratios instead.
            </p>
            <p className="mt-3">
              The nasal and oral resonance bands (commonly cited in the literature as roughly the low-to-mid hundreds through low thousands of Hz for nasal, and wider for oral) get isolated using a <strong className="text-foreground">semitone filterbank</strong>. librosa provides <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">semitone_filterbank</code> to generate a set of second-order-section (SOS) filters between two frequencies, spaced by semitones. Each filter is applied with <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">scipy.signal.sosfiltfilt</code> (zero-phase filtering) and the results are summed. The nasalance percentage is the filtered band energy divided by total signal energy, times 100.
            </p>
            <p className="mt-3">
              This is an approximation. A physical nasometer would give different numbers. But the relative values across recordings are consistent and useful for comparison, which is what most voice analysis applications need.
            </p>

            <h3 id="vlhr" className="font-display text-base font-semibold text-foreground mt-6 mb-2">VLHR</h3>
            <p>
              Voice Low-to-High Ratio measures the balance between low-frequency and high-frequency energy in the voice. You compute the power spectral density using <strong className="text-foreground">Welch's method</strong> with a windowed FFT, then split the spectrum at a cutoff frequency.
            </p>
            <p className="mt-3">
              The cutoff is adaptive: if the fundamental frequency F0 is available, the cutoff is set to a multiple of mean F0 (typically in the 4-5x range, based on voice science literature). If F0 isn't available, a fixed fallback around 600 Hz works as a reasonable default. The idea is to roughly separate the fundamental and lower harmonics from the upper harmonics and formant frequencies. Low band runs from around 65 Hz up to the cutoff, high band from the cutoff up to around 8000 Hz.
            </p>
            <CodeBlock lang="python" code={`def calculate_vlhr(audio, sr, f0=None, cutoff=600, f0_mult=4.5):
    if f0 is not None:
        cutoff = f0_mult * np.mean(f0[f0 > 0])
    freqs, power = welch(audio, fs=sr, nperseg=1024)
    low = np.sum(power[(freqs >= 65) & (freqs < cutoff)])
    high = np.sum(power[(freqs >= cutoff) & (freqs <= 8000)])
    return low / high if high > 0 else float('inf')`} />
            <p className="mt-3">
              A high VLHR indicates a voice with more chest resonance. A low VLHR indicates more brightness or head resonance. The adaptive cutoff matters because a fixed cutoff is wrong for speakers at both extremes of the pitch range — it'll capture too many or too few harmonics depending on the speaker's fundamental frequency.
            </p>
            <PlacementDiagram />
          </section>

          <section>
            <h2 id="timing" className="font-display text-lg font-semibold text-foreground mb-3">Timing and silence detection</h2>
            <p>
              Pausing patterns say a lot about how someone speaks. Fast talkers with no pauses sound anxious. Too many long pauses sound unprepared. The right rhythm depends on context, but you need the data first.
            </p>
            <p className="mt-3">
              <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">pydub</code>'s <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">detect_silence</code> function works well for this. You configure a dBFS threshold (something in the -20 to -30 range depending on recording quality) and a minimum silence duration (300-500ms is typical for catching real pauses without flagging natural inter-word gaps). Both parameters need tuning for your audio quality — noisier recordings need a lower threshold.
            </p>
            <p className="mt-3">
              From the raw silence segments, four metrics: <strong className="text-foreground">pause count</strong>, <strong className="text-foreground">pauses per minute</strong> (normalized by recording length), <strong className="text-foreground">average pause duration</strong> in milliseconds, and <strong className="text-foreground">pause variability</strong> as the coefficient of variation (standard deviation divided by mean, times 100). The CV is more useful than raw standard deviation here because a 200ms standard deviation means very different things if your average pause is 500ms versus 3000ms.
            </p>
            <WaveformViz />
          </section>

          <section>
            <h2 id="api" className="font-display text-lg font-semibold text-foreground mb-3">The double-load problem</h2>
            <p>
              If you're wrapping this in a <strong className="text-foreground">FastAPI</strong> endpoint, there's an annoying practical issue. librosa's <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">load</code> resamples to 22050 Hz and returns mono float32. Fine for RMS, pitch, and spectral analysis. But <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">pyloudnorm</code> needs the native sample rate, and <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">parselmouth.Sound</code> works best with original rate too.
            </p>
            <p className="mt-3">
              The workaround: read the full file into a <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">BytesIO</code> buffer and rewind it for each library that needs a fresh read. Not pretty, but for typical speech recordings the memory overhead is nothing compared to the FFT computations.
            </p>
            <p className="mt-3">
              Also worth noting: pitch extraction (Parselmouth specifically) tends to be the performance bottleneck, not spectral decomposition. Adding per-stage timing early on is worth the effort.
            </p>
          </section>

          <section>
            <h2 id="dashboard" className="font-display text-lg font-semibold text-foreground mb-3">Making the numbers useful</h2>
            <p>
              Raw metrics by themselves aren't that helpful. The thing that makes them useful is comparison against a reference. If you have a "good" recording and a recording to evaluate, percent deviation per metric tells you exactly what's different. Pitch variability 40% lower than reference? Pause rate 25% higher? Those are concrete, actionable numbers.
            </p>
            <p className="mt-3">
              A simple comparison table with <strong className="text-foreground">percent deviation</strong> color-coded green (better) or red (worse) turns out to be more useful than overlaid charts. Someone can glance at the table and immediately know what to focus on.
            </p>
            <div className="rounded-xl border border-border bg-card overflow-hidden mt-4">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left px-3 py-2 text-foreground font-semibold">Metric</th>
                    <th className="text-right px-3 py-2 text-foreground font-semibold">Reference</th>
                    <th className="text-right px-3 py-2 text-foreground font-semibold">Sample</th>
                    <th className="text-right px-3 py-2 text-foreground font-semibold">Deviation</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['LUFS', '-18.0', '-15.5', '+13.9%', true],
                    ['Pitch variability', '45.0 Hz', '30.0 Hz', '-33.3%', false],
                    ['Pitch range', '200.0 Hz', '120.0 Hz', '-40.0%', false],
                    ['HNR', '15.0 dB', '17.0 dB', '+13.3%', true],
                    ['Nasal nasalance', '30.0%', '34.0%', '+13.3%', null],
                    ['VLHR', '3.00', '3.50', '+16.7%', null],
                    ['Pauses/min', '5.0', '8.0', '+60.0%', false],
                    ['Avg pause (ms)', '700', '1200', '+71.4%', false],
                    ['Pause variability', '25.0%', '50.0%', '+100.0%', false],
                  ].map(([metric, bench, practice, dev, good], i) => (
                    <tr key={i} className={i % 2 === 0 ? '' : 'bg-muted/30'}>
                      <td className="px-3 py-2 text-foreground font-medium">{metric}</td>
                      <td className="px-3 py-2 text-right text-muted-foreground">{bench}</td>
                      <td className="px-3 py-2 text-right text-muted-foreground">{practice}</td>
                      <td className={`px-3 py-2 text-right font-medium ${good === true ? 'text-green-500' : good === false ? 'text-red-500' : 'text-muted-foreground'}`}>{dev}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-center text-xs text-muted-foreground mt-2">Hypothetical comparison: reference vs sample recording (illustrative values)</p>
          </section>

          <section>
            <h2 id="gotchas" className="font-display text-lg font-semibold text-foreground mb-3">Common gotchas</h2>
            <ul className="space-y-3 mt-3">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span>
                  <strong className="text-foreground">pydub expects file paths, not BytesIO.</strong> The <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">AudioSegment.from_wav</code> function accepts file-like objects in theory, but behavior is inconsistent across versions. Writing the buffer to a temp file for pause detection is clunky but reliable.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span>
                  <strong className="text-foreground">Parselmouth isn't in most requirements.txt files.</strong> It needs to be installed separately and depends on compiled C++ binaries. On some deployment targets (serverless, minimal Docker images), getting it to install requires extra system libraries. Worth it for the pitch quality, but budget time for the deployment.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span>
                  <strong className="text-foreground">Watch how you apply windowing with Welch's method.</strong> Welch internally breaks the signal into segments and windows each one. If you accidentally apply a window to the full signal before passing it to Welch, you get garbage results on anything longer than a few seconds.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span>
                  <strong className="text-foreground">F0 = 0 and F0 = NaN mean different things.</strong> Parselmouth uses 0 Hz for unvoiced frames. librosa uses NaN. If you forget to handle this and mix the two, your mean pitch calculation drops to nonsense values. Always filter before computing statistics.
                </span>
              </li>
            </ul>
          </section>

          <section>
            <h2 id="retrospective" className="font-display text-lg font-semibold text-foreground mb-3">Worth trying next</h2>
            <div className="rounded-xl border border-accent/30 bg-accent/5 p-5 space-y-3">
              <p>
                <strong className="text-foreground">Run pitch extraction on native sample rate for both libraries.</strong> librosa's resample to 22050 Hz loses some pitch resolution for very low-pitched voices. Parselmouth already uses native rate, so the comparison is slightly unfair. In a future version I'd pass <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">sr=None</code> to librosa.load for the pitch stage specifically.
              </p>
              <p>
                <strong className="text-foreground">Add formant extraction.</strong> Formant frequencies (F1, F2, F3) carry vowel quality information that's useful for speech analysis. Praat can compute these via LPC analysis, and Parselmouth exposes the API. They're the obvious next feature for any voice analysis pipeline.
              </p>
              <p>
                <strong className="text-foreground">Use Crepe or FCPE for pitch.</strong> Neural pitch trackers like Crepe and FCPE outperform both pyin and Praat's autocorrelation on noisy recordings. They're heavier (Crepe loads a small CNN), but for a server-side API processing one file at a time, the latency is acceptable.
              </p>
              <p>
                <strong className="text-foreground">Stream the results.</strong> Each metric category is independent, so you could return partial results as they complete (power first since it's fast, Parselmouth pitch last since it's slow). WebSocket or SSE would make the experience much more responsive instead of waiting for everything to finish.
              </p>
            </div>
          </section>

          <section>
            <h2 id="conclusion" className="font-display text-lg font-semibold text-foreground mb-3">Wrapping up</h2>
            <p>
              You don't need a deep learning model to do useful audio feature extraction. Classical signal processing (FFTs, autocorrelation, bandpass filters) gives you metrics people can actually work with. "Pitch variability is 30% below the reference" is actionable. "Latent embedding is 0.3 cosine distance from the reference" is not.
            </p>
            <p className="mt-3">
              librosa handles most general audio work well. Parselmouth fills the gap for speech-specific analysis where Praat's decades of phonetics research matter. scipy for spectral analysis and pydub for silence detection round it out. Not the most sophisticated stack, but it ships and it's debuggable.
            </p>
            <p className="mt-3">
              If you're working through similar problems, feel free to reach out.
            </p>
          </section>

        </div>

        <BlogNav />

      </article>
    </main>
  )
}
