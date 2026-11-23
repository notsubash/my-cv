import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Check, Copy } from 'lucide-react'
import Eq from '../articles/Equation'
import { LabFrame } from './LabFrame'
import './lab.css'
import './lab-article.css'

// Real excerpt from /blog/when-a-self-parking-car-cannot-trust-its-imagination, re-set in the proposed template.
const JEPA_FORWARD = String.raw`z_t=E(o_t),\qquad z^*_{t+1}=E_{\text{target}}(o_{t+1}),\qquad \hat z_{t+1}=P(z_t,a_t).`
const JEPA_LOSS = String.raw`\mathcal{L}_{\text{JEPA}}=\frac{1}{B D_z}\sum_{b=1}^{B}\sum_{d=1}^{D_z}\left(\hat z_{b,t+1,d}-z^*_{b,t+1,d}\right)^2.`
const EMA_UPDATE = String.raw`\theta_{\text{target}}\leftarrow\tau\theta_{\text{target}}+(1-\tau)\theta_{\text{online}}.`

const TOC = [
  { id: 'tldr', label: 'TL;DR' },
  { id: 'cem', label: 'CEM: guess, keep, refit' },
  { id: 'latent', label: 'Predict a latent, not the snapshot' },
  { id: 'ema', label: 'Keep the target from chasing the guess' },
]

const C = ({ children }: { children: ReactNode }) => <code className="ic">{children}</code>
const A = ({ href, children }: { href: string; children: ReactNode }) => <a className="link" href={href}>{children}</a>

function Code({ lang, code, label }: { lang: string; code: string; label: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <figure className="wide codeblock">
      <figcaption className="codebar">
        <span>{label}</span>
        <button
          type="button"
          onClick={() => navigator.clipboard.writeText(code).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1600) })}
          aria-label={copied ? 'Copied' : `Copy ${lang} code`}
        >
          {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
          <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </figcaption>
      {/* tabIndex makes the horizontal scroll region keyboard-reachable (axe scrollable-region-focusable) */}
      <pre tabIndex={0} aria-label={`${label}, ${lang} code`}><code>{code}</code></pre>
    </figure>
  )
}

function Display({ math, label }: { math: string; label: string }) {
  return (
    <div className="wide eq" role="group" aria-label={label} tabIndex={0}>
      <Eq block math={math} />
    </div>
  )
}

export default function LabArticle() {
  const [active, setActive] = useState('tldr')
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-20% 0px -70% 0px' })
    TOC.forEach((t) => { const el = document.getElementById(t.id); if (el) io.observe(el) })
    return () => io.disconnect()
  }, [])

  return (
    <LabFrame title="Article template">
      <div className="lab art">
        <nav className="art-crumb meta" aria-label="Breadcrumb">
          <Link to="/lab/a" className="link">Subash Pandey</Link> <span aria-hidden="true">/</span> <Link to="/blog" className="link">Writing</Link>
        </nav>

        <main id="main-content">
          <article className="art-grid">
            <header className="art-head">
              <p className="meta art-kicker">Write-up · World models / control · <time dateTime="2026-08-28">28 Aug 2026</time> · 24 min</p>
              <h1>Teaching a Car to Park by Imagining the Future, and Learning When Not to Trust It</h1>
              <p className="art-dek">
                True-dynamics CEM reaches the environment outcome when its model is the real bicycle. Learned latent MPC
                parks 0 of 6 measured seeds. The tested distrust signals sit at chance on crash-soon detection.
              </p>
              <p className="meta">Source: <A href="https://github.com/notsubash/latent-parking">github.com/notsubash/latent-parking</A> · Kinematic <C>parking-v0</C> only</p>
            </header>

            <details className="art-toc-inline">
              <summary>On this page</summary>
              <ol>{TOC.map((t) => <li key={t.id}><a href={`#${t.id}`} className="link">{t.label}</a></li>)}</ol>
            </details>

            <aside className="art-toc" aria-label="On this page">
              <p className="meta">On this page</p>
              <ol>
                {TOC.map((t) => (
                  <li key={t.id}><a href={`#${t.id}`} aria-current={active === t.id ? 'true' : undefined}>{t.label}</a></li>
                ))}
              </ol>
            </aside>

            <section id="tldr" className="art-summary" aria-labelledby="tldr-h">
              <h2 id="tldr-h">TL;DR</h2>
              <ol>
                <li><strong>The optimizer works when its model is correct.</strong> True-dynamics CEM reaches the success diagnostic; a scripted brake finishes the last five actions.</li>
                <li><strong>The learned planner does not.</strong> Latent MPC parks <span className="num">0 of 6</span> measured seeds: one crash, five timeouts.</li>
                <li><strong>The alarms are at chance.</strong> With 10 positives in 2,815 rows, chance precision is about <span className="num">0.004</span>; residual, disagreement and imagined spread do not beat it.</li>
              </ol>
            </section>

            <h2 id="cem">CEM: guess, keep, refit<a href="#cem" className="anchor" aria-label="Link to this section">#</a></h2>
            <p>
              The <A href="https://arxiv.org/abs/2008.06389">cross-entropy method</A>, as applied to real-time planning by Pinneri et al.,
              optimizes complete action sequences. Let the horizon be <Eq math="H" />, the action dimension be <Eq math="A=2" />, and
              a candidate sequence be <Eq math={String.raw`u_{1:H}\in\mathbb{R}^{H\times A}`} />. CEM maintains a diagonal Gaussian with
              a mean and standard deviation for every time and action coordinate. The repository’s core loop is short:
            </p>
            <Code
              lang="python"
              label="planner/cem.py · refit step"
              code={`samples = np.clip(mean + std * noise, low, high)
elite_idx = np.argpartition(costs, n_elites - 1)[:n_elites]
elites = samples[elite_idx]
mean = elites.mean(axis=0)
std = np.maximum(elites.std(axis=0), 1e-6)`}
            />
            <p>
              First, sample many tapes from the current Gaussian and clip every action to the legal range. Next, evaluate a cost for
              each tape. Keep the <Eq math="K" /> lowest-cost tapes, called elites, then refit the Gaussian to their population mean and
              population standard deviation. Repeat that refinement several times.
            </p>
            <figure className="wide fig">
              <img src="/blog/latent-parking/parking_cem.webp" alt="Top-down parking lot: the green car, steered by true-dynamics CEM, approaches the blue goal stall" width={600} height={300} loading="lazy" decoding="async" />
              <figcaption><span className="fig-n">Figure 1.</span> True-dynamics CEM controls the first 40 actions, including the success-triggering action. A scripted full brake <C>[-1, 0]</C> supplies the final five, so the stopped pose is not entirely CEM output.</figcaption>
            </figure>

            <h2 id="latent">Predict a latent, not the snapshot<a href="#latent" className="anchor" aria-label="Link to this section">#</a></h2>
            <p>
              Unweighted MSE applies equal loss weight to each stored coordinate, even though those coordinates differ in physical
              scale and task importance. A joint-embedding predictive architecture, or JEPA, instead learns a latent space in which
              prediction is trained. With online encoder <Eq math="E" />, slow target encoder <Eq math={String.raw`E_{\text{target}}`} /> and
              predictor <Eq math="P" />, the forward equations are:
            </p>
            <Display label="JEPA forward equations" math={JEPA_FORWARD} />
            <p>For batch size <Eq math="B" /> and latent dimension <Eq math="D_z" />, the repository trains with mean squared latent error:</p>
            <Display label="JEPA loss" math={JEPA_LOSS} />
            <aside className="note" aria-label="Note">
              <p><strong>Not an image JEPA.</strong> Small MLPs on six-dimensional kinematics and an eight-dimensional latent. No decoder, no pixels.</p>
            </aside>

            <h2 id="ema">Keep the target from chasing the guess<a href="#ema" className="anchor" aria-label="Link to this section">#</a></h2>
            <p>
              If both sides of the loss learn freely from the same gradient, the target could move toward whatever the predictor
              already outputs. Target encoding therefore runs under <C>torch.no_grad()</C>, and the target parameters follow the online
              encoder by an exponential moving average with retention <Eq math={String.raw`\tau=0.99`} />:
            </p>
            <Display label="EMA update" math={EMA_UPDATE} />
            <p>The target moves slowly, giving the predictor a stable answer key without freezing it forever. A focused version of the training loop:</p>
            <Code
              lang="python"
              label="scripts/train_jepa.py · one step"
              code={`z_hat = model.predict(model.encode(o), a)
z_tgt = model.encode(o2, target=True)
loss = F.mse_loss(z_hat, z_tgt)`}
            />

            <section className="art-end" aria-labelledby="end-h">
              <h2 id="end-h">Hiring for ML/AI engineering?</h2>
              <p>I write up experiments like this one, including the ones that fail. If your team needs that rigor in production, let’s talk.</p>
              <div className="art-end-cta">
                <button type="button" className="btn btn-primary"><Calendar size={18} aria-hidden="true" />Book a 30-min intro</button>
                <Link to="/projects/gavel" className="link">Next: Gavel case study →</Link>
              </div>
            </section>
          </article>
        </main>
      </div>
    </LabFrame>
  )
}
