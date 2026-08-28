import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Calendar, Tag } from 'lucide-react'
import BlogNav from './BlogNav'
import BlogToc from './BlogToc'
import CodeBlock from './CodeBlock'
import Eq from './Equation'
import { useBlogSeo, useReadingTime } from './useBlogSeo'

const TITLE = 'Teaching a Car to Park by Imagining the Future, and Learning When Not to Trust It'
const DESCRIPTION =
  'True-dynamics CEM reaches the parking-v0 success diagnostic, then a scripted brake finishes the tape. Learned latent MPC parks 0 of 6 measured seeds. Residual, disagreement, and imagined spread sit at chance on crash-soon detection.'
const SLUG = 'when-a-self-parking-car-cannot-trust-its-imagination'
const GH = 'https://github.com/notsubash/latent-parking/blob/main'
const IMG = '/blog/latent-parking'

const TRANSITION = String.raw`(o_t,\ a_t,\ o_{t+1})`
const IDENTITY = String.raw`\hat{o}_{t+1}=o_t`
const WORLD_FN = String.raw`f(o_t,a_t)=\hat{o}_{t+1}.`
const WORLD_LOSS = String.raw`\mathcal{L}_{\text{world}}
=\frac{1}{BD}\sum_{b=1}^{B}\sum_{d=1}^{D}
\left(\hat{o}_{b,t+1,d}-o_{b,t+1,d}\right)^2.`
const JEPA_FORWARD = String.raw`z_t=E(o_t),
\qquad
z^*_{t+1}=E_{\text{target}}(o_{t+1}),
\qquad
\hat z_{t+1}=P(z_t,a_t).`
const JEPA_LOSS = String.raw`\mathcal{L}_{\text{JEPA}}
=\frac{1}{B D_z}\sum_{b=1}^{B}\sum_{d=1}^{D_z}
\left(\hat z_{b,t+1,d}-z^*_{b,t+1,d}\right)^2.`
const EMA_UPDATE = String.raw`\theta_{\text{target}}
\leftarrow
\tau\theta_{\text{target}}
+(1-\tau)\theta_{\text{online}}.`
const Z_GOAL = String.raw`z_{\text{goal}}=E_{\text{target}}(g).`
const LATENT_ROLLOUT = String.raw`\hat z_{t+1}=P(z_t,a_t),
\qquad
\hat z_{t+h}=P(\hat z_{t+h-1},a_{t+h-1})
\quad\text{for }h=2,\ldots,H.`
const PLANNING_ENERGY = String.raw`\mathcal{E}(a_{t:t+H-1})
=\sum_{h=1}^{H}
\left\|\hat z_{t+h}-z_{\text{goal}}\right\|_2.`
const RESIDUAL = String.raw`r_t=
\left\|
P(E(o_t),a_t)-E_{\text{target}}(o_{t+1})
\right\|_2.`
const DISAGREEMENT = String.raw`d_t=
\left\|
\operatorname{Std}_{\text{pop}}
\left(
\left\{P_i(E(o_t),a_t)\right\}_{i=1}^{3}
\right)
\right\|_2.`
const PRECISION = String.raw`\text{precision}
=
\frac{\text{true crash-soon alarms}}
{\text{all alarms}}.`
const RECALL = String.raw`\text{recall}
=
\frac{\text{true crash-soon alarms}}
{\text{all crash-soon positions}}.`
const PREVALENCE = String.raw`\frac{10}{2815}=0.003552\ldots\approx 0.004.`

function K({ children }: { children: ReactNode }) {
  return <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">{children}</code>
}

function A({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="text-primary hover:underline">
      {children}
    </a>
  )
}

function Repo({ path, children }: { path: string; children: ReactNode }) {
  return <A href={`${GH}/${path}`}>{children}</A>
}

function Shot({
  src,
  alt,
  caption,
  width,
  height,
  eager,
}: {
  src: string
  alt: string
  caption: ReactNode
  width: number
  height: number
  eager?: boolean
}) {
  return (
    <figure className="my-6">
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-auto rounded-xl border border-border bg-card"
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
      />
      <figcaption className="text-center text-xs text-muted-foreground mt-2">{caption}</figcaption>
    </figure>
  )
}

export default function BlogLatentParking() {
  useBlogSeo({
    title: TITLE,
    description: DESCRIPTION,
    keywords:
      'latent mpc parking-v0, cem model predictive control, jepa latent planning, highway-env parking, model-based control distrust',
    ogImage: '/og-blog-latent-parking.webp',
    datePublished: '2026-08-28',
    slug: SLUG,
  })
  const { articleRef, readingTimeRef } = useReadingTime()

  return (
    <main id="main-content" className="min-h-screen bg-background">
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
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <time dateTime="2026-08-28">August 2026</time>
            </span>
            <span className="text-border">·</span>
            <span ref={readingTimeRef}>24 min read</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4 leading-tight">
            {TITLE}
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed mb-5">
            True-dynamics CEM reaches the environment outcome when its model is the real bicycle.
            Learned latent MPC parks 0 of 6 measured seeds. The tested distrust signals sit at chance
            on crash-soon detection.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {['PyTorch', 'JEPA', 'CEM', 'MPC', 'highway-env', 'Gymnasium'].map(tag => (
              <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-muted text-muted-foreground">
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground mb-6">
          Source:{' '}
          <A href="https://github.com/notsubash/latent-parking">github.com/notsubash/latent-parking</A>
          . Kinematic <K>parking-v0</K> only. Pixels were never trained.
        </div>

        <hr className="border-border mb-10" />

        <div className="prose-custom space-y-8 text-sm text-muted-foreground leading-relaxed">
          <section>
            <Shot
              src={`${IMG}/parking_cem.webp`}
              alt="True-dynamics CEM parking in the empty lot"
              caption={<>True-dynamics CEM controls the first 40 actions, including the success-triggering action. A scripted full brake <K>[-1, 0]</K> supplies the final five, so the stopped pose is not entirely CEM output. This is not the learned-model result.</>}
              width={600}
              height={300}
              eager
            />
            <p>
              A planner can look intelligent because every future it considers is perfectly simulated. With the real vehicle physics, it can test action sequences, rewind, and choose a move toward the stall. The search is real, but the imagination is an oracle.
            </p>
            <p className="mt-3">
              Replace that oracle with a learned model and every candidate future becomes a prediction. One-step errors can feed the next prediction until the planner optimizes a future the real car never visits. The model can be confidently wrong: low training loss, goalward predicted latents, and a quiet uncertainty heuristic while the car misses.
            </p>
            <p className="mt-3">
              This project builds that entire chain in a deliberately small setting: the kinematic <K>parking-v0</K> environment, a cross-entropy method optimizer, observation-space dynamics models, a joint-embedding predictive architecture, latent-space planning, and three practical distrust signals. The most useful result is not a parking demo. It is the separation between three questions that are easy to blur:
            </p>
            <ol className="list-decimal pl-5 space-y-2 mt-3">
              <li>Can the optimizer reach the environment outcome when its model is correct?</li>
              <li>Can a learned representation predict held-out transitions better than a trivial baseline?</li>
              <li>Can the controller park, and can its alarm detect when it is about to fail?</li>
            </ol>
            <p className="mt-3">The answers were yes, yes, and no.</p>
          </section>

          <section>
            <h2 id="tldr" className="font-display text-lg font-semibold text-foreground mb-3">TL;DR</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span>
                  <strong className="text-foreground">True-dynamics CEM reaches the environment's success diagnostic, then a scripted brake finishes the tape.</strong>{' '}
                  CEM controls the first 40 actions through the success-triggering action. That loose flag fires about <K>3.9 m</K> from the goal at about <K>4.5 m/s</K>; the reward weights lateral/y error cheaply and ignores speed. Five scripted full-brake actions <K>[-1, 0]</K> then cross the recorder's separate stop condition and finish about <K>1.8 m</K> away at <K>0.5 m/s</K>. The stopped pose is not entirely CEM output.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span>
                  <strong className="text-foreground">Learned latent MPC, meaning MPC that scores imagined futures from a learned latent predictor, parks 0 of 6 measured seeds.</strong>{' '}
                  In the recorded six-seed run, one episode crashed and five reached the duration cutoff. For seed 0, receding latent MPC reached a best xy distance of <K>20.0 m</K> before crashing at step 315. Open-loop latent control reached <K>9.4 m</K> before crashing at step 415. Neither set <K>{'info["is_success"]'}</K>.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span>
                  <strong className="text-foreground">The tested distrust signals perform at chance on crash-soon detection.</strong>{' '}
                  The positive class contains only 10 of 2,815 finite disagreement rows, so chance precision is approximately <K>0.004</K>. Residual, one-step ensemble disagreement, and imagined horizon spread do not rise usefully above that line. A p90 disagreement cutoff of approximately <K>0.027</K> has precision 0 and recall 0 on the completed diagnostic tapes.
                </span>
              </li>
            </ul>
            <p className="mt-3">
              The true-dynamics numbers are recalculated from saved arrays. Several latent-control and gate numbers come from lab notes and plot titles because raw per-step arrays were not retained.
            </p>
          </section>

          <section>
            <h2 id="the-experiment" className="font-display text-lg font-semibold text-foreground mb-3">The experiment</h2>
            <p>
              The environment is Farama's <A href="https://highway-env.farama.org/environments/parking/"><K>parking-v0</K></A>, used through the <A href="https://gymnasium.farama.org/api/env/">Gymnasium environment API</A>. It is a compact bicycle-style simulator, not a camera pipeline and not a 3D driving stack. Pixels were never trained. That keeps the experiment focused on planning and model error rather than perception.
            </p>
            <Shot
              src={`${IMG}/sanity_last_frame.webp`}
              alt="The parking-v0 simulator"
              caption="A sanity-check frame from the simulator. The learning code uses kinematic vectors, not the rendered pixels."
              width={600}
              height={300}
            />
            <p>
              At reset, the installed environment returns a dictionary with three keys:
            </p>
            <CodeBlock
              lang="text"
              code={`observation
achieved_goal
desired_goal`}
            />
            <p>Each value has six features in this order:</p>
            <CodeBlock lang="text" code={`[x, y, vx, vy, cos_h, sin_h]`} />
            <p>
              The first two numbers are position, the next two are velocity, and the final pair is heading represented by cosine and sine. The continuous action is exactly <K>[acceleration, steering]</K>, with both components in <K>[-1, 1]</K>. The <A href="https://highway-env.farama.org/actions/">highway-env action documentation</A> calls the first component throttle; the local data names it acceleration.
            </p>
            <p className="mt-3">
              The stored coordinates are scaled. The configured scale vector is <K>[100, 100, 5, 5, 1, 1]</K>, and the installed implementation divides all three dictionary vectors, <K>observation</K>, <K>achieved_goal</K>, and <K>desired_goal</K>, by it. Stored <K>x</K> and <K>y</K> are physical metres divided by 100. Stored <K>vx</K> and <K>vy</K> are physical metres per second divided by 5. Heading is unchanged. This still occurs even though the configuration says <K>normalize=False</K>, so treating stored <K>x</K> as metres would make every model metric misleading.
            </p>
            <p className="mt-3">
              The simulator advances physics at 15 Hz and accepts policy actions at 5 Hz. Each action therefore covers 0.2 seconds and contains three physics frames. A planning horizon of ten actions covers two seconds.
            </p>
            <p className="mt-3">
              Four outcome fields need careful names. In the normal environment, <K>terminated</K> means that the task ended because of a crash or because every controlled agent met the environment's success test. <K>truncated</K> means the configured 100-second duration was reached. <K>{'info["crashed"]'}</K> identifies collision, while <K>{'info["is_success"]'}</K> separately identifies whether the goal criterion is met. Visual closeness is not a substitute for that success diagnostic.
            </p>
            <p className="mt-3">
              For more detail on these fields, see <Repo path="lessons/0001-gym-loop.html">lesson 0001</Repo>, the <Repo path="reference/parking-v0.html">parking-v0 reference</Repo>, and the project <Repo path="GLOSSARY.md">glossary</Repo>.
            </p>
          </section>

          <section>
            <h2 id="prove-the-planner" className="font-display text-lg font-semibold text-foreground mb-3">First, prove the planner can work</h2>
            <p>
              Before learning a model, the project tests the optimizer in two increasingly relevant settings.
            </p>
            <p className="mt-3">
              The first is Gymnasium's <K>Pendulum-v1</K>. CEM proposes action sequences, the true Pendulum simulator evaluates them, and the controller repeatedly executes one action and replans. In the saved check, CEM return is <K>-125.7</K>, compared with <K>-1071.9</K> for random control.
            </p>
            <Shot
              src={`${IMG}/pendulum_cem.webp`}
              alt="CEM sanity check on Pendulum-v1"
              caption="x-axis: policy step. Top y-axis: angle in radians; bottom y-axis: torque. This checks Pendulum optimization, not parking."
              width={1008}
              height={728}
            />
            <p>
              That boundary is important. Pendulum has different dynamics, observations, rewards, constraints, and geometry. It can reveal a broken optimizer, but it cannot validate parking behavior.
            </p>
            <p className="mt-3">
              The second check uses <K>parking-v0</K> itself and lets <Repo path="scripts/plan_parking.py"><K>scripts/plan_parking.py</K></Repo> imagine with the true simulator. For every candidate action sequence, the planner copies the simulator, calls its real <K>step</K> function through the horizon, accumulates cost, and restores the copied state in a <K>finally</K> block. Source inspection shows that the snapshot covers ego pose, speed, action and collision fields, environment counters, the action type's last action, road-object collision fields, and all vehicle states. A rewind self-check confirms that imagined evaluation does not move the real ego or neighboring vehicles and restores timing and collision state.
            </p>
            <Shot
              src={`${IMG}/parking_cem_path.webp`}
              alt="True-dynamics CEM path"
              caption={<>Axes: lot x and y in metres. CEM reaches <K>is_success</K> on action 40; the final five points are scripted braking, not learned-model control.</>}
              width={1120}
              height={644}
            />
            <p>
              The tape contains 45 real transitions. CEM supplies actions 1 through 40, including the success-triggering action on zero-based row 39. At that point the car is about <K>3.9 m</K> from the goal and moving about <K>4.5 m/s</K>. The loose diagnostic fires because the reward weights lateral/y error at <K>0.3</K> versus x at <K>1</K> and ignores speed, which motivates continuing the recording.
            </p>
            <p className="mt-3">
              Recording mode replaces normal success termination with crash-only termination, then sends scripted full brake <K>[-1, 0]</K> for the final five actions. The six true success rows are repeated flags in one trajectory, and saved <K>terminated</K> stays false. The recorder stops when its separate condition, under <K>1.8 m</K> and <K>0.6 m/s</K>, is crossed: the saved final pose is about <K>1.8 m</K> and <K>0.5 m/s</K>, with tape return about <K>-13.0</K>. That stop condition is not an independent parking-quality threshold, and the final pose is not entirely CEM output. Report both necessary checks: environment outcome and physical finishing pose.
            </p>
            <p className="mt-3">
              The same true-dynamics planner was then stressed by placing parked cars in neighboring stalls. Those obstacles remain hidden from the default six-feature observation. CEM reacts to them only because candidate rollouts can physically collide in the copied simulator.
            </p>
            <Shot
              src={`${IMG}/parking_cem_neighbors.webp`}
              alt="True-dynamics CEM with neighboring stalls occupied"
              caption="Axes show lot x and y in metres; limits include each path, goal, and occupied cars. The saved runs finish about 0.41 m and 0.79 m from the desired xy position."
              width={1120}
              height={644}
            />
            <Shot
              src={`${IMG}/parking_cem_neighbors_seed0.webp`}
              alt="True-dynamics CEM with one neighboring car"
              caption="True-dynamics stress test, seed 0: one neighboring car and about 0.41 m final xy distance."
              width={600}
              height={300}
            />
            <Shot
              src={`${IMG}/parking_cem_neighbors_seed1.webp`}
              alt="True-dynamics CEM squeezing between two neighboring cars"
              caption="True-dynamics stress test, seed 1: two neighboring cars and about 0.79 m final xy distance."
              width={600}
              height={300}
            />
            <p>
              The runs take 48 and 39 real steps respectively. They show that the optimizer and simulator-rewind machinery can find collision-aware action sequences in these two constructed cases. They do not show that the learned model represents neighboring cars, because those cars are not present in its default observation.
            </p>
          </section>

          <section>
            <h2 id="cem-guess-keep-refit" className="font-display text-lg font-semibold text-foreground mb-3">CEM: guess, keep, refit</h2>
            <p>
              The <A href="https://arxiv.org/abs/2008.06389">cross-entropy method</A>, as applied to real-time planning by Pinneri et al., optimizes complete action sequences. Let the horizon be <Eq math="H" />, the action dimension be <Eq math="A=2" />, and a candidate sequence be <Eq math={String.raw`u_{1:H}\in\mathbb{R}^{H\times A}`} />. CEM maintains a diagonal Gaussian with a mean and standard deviation for every time and action coordinate.
            </p>
            <p className="mt-3">The repository's core loop is short:</p>
            <CodeBlock
              lang="python"
              code={`samples = np.clip(mean + std * noise, low, high)
elite_idx = np.argpartition(costs, n_elites - 1)[:n_elites]
elites = samples[elite_idx]
mean = elites.mean(axis=0)
std = np.maximum(elites.std(axis=0), 1e-6)`}
            />
            <p>
              First, sample many tapes from the current Gaussian and clip every action to the legal range. Next, evaluate a cost for each tape. Keep the <Eq math="K" /> lowest-cost tapes, called elites, then refit the Gaussian to their population mean and population standard deviation. Repeat that refinement several times.
            </p>
            <p className="mt-3">
              The implementation also retains the best actually scored elite seen across all iterations. It executes the first action of that best scored sequence, not the fitted Gaussian mean. On the next real step, a warm start drops the committed action, shifts the rest left, and repeats the final action.
            </p>
            <p className="mt-3">
              That makes this a small CEM-MPC variant with clipped Gaussian sampling, lowest-cost elite refitting, best-scored-action execution, and a warm start. It differs from Pinneri et al.'s vanilla pseudocode, which does not combine clipping with best-sequence execution. The precise local loop is more informative than a broad variant label.
            </p>
            <p className="mt-3">
              For true-dynamics parking, <Repo path="scripts/plan_parking.py"><K>scripts/plan_parking.py</K></Repo> uses horizon 10, 24 samples, 6 elites, and 3 refinement iterations by default. Cost is negative accumulated reward plus a remainder penalty after an imagined crash, preventing an early collision from becoming cheap merely because it ends evaluation.
            </p>
          </section>

          <section>
            <h2 id="receding-horizon" className="font-display text-lg font-semibold text-foreground mb-3">Receding horizon: imagine ten, execute one</h2>
            <p>
              CEM answers, "Which action tape is cheapest under this model?" Model-predictive control, or MPC, answers, "How do I repeatedly use that optimizer while the real system changes?"
            </p>
            <p className="mt-3">At real time <Eq math="t" />, the receding-horizon loop is:</p>
            <ol className="list-decimal pl-5 space-y-2 mt-3">
              <li>Read the current real observation <Eq math="o_t" />.</li>
              <li>Optimize <Eq math="H=10" /> imagined actions.</li>
              <li>Execute only the first action of the best scored tape.</li>
              <li>Receive the real next observation <Eq math="o_{t+1}" />.</li>
              <li>Shift the previous tape as a warm start and optimize again.</li>
            </ol>
            <p className="mt-3">
              The controller imagines ten actions but commits one. This distinction limits how long it runs blind. A bad prediction at the end of a two-second horizon does not directly force ten real actions. After 0.2 seconds, the controller sees reality again.
            </p>
            <p className="mt-3">
              Replanning does not erase model error, however. The optimizer can still exploit the learned model inside each horizon. If the model consistently assigns low cost or low planning energy to physically bad tapes, replanning produces a fresh bad tape from every new observation. MPC contains open-loop error; it does not make an inaccurate model accurate.
            </p>
            <p className="mt-3">
              The true-dynamics run separates two checks: CEM reaches the environment outcome with the real bicycle, and scripted braking reaches the recorder's finishing pose. The next experiment replaces that imagination.
            </p>
            <p className="mt-3">
              See <Repo path="lessons/0002-cem-true-dynamics.html">lesson 0002</Repo>, the <Repo path="reference/cem-mpc.html">CEM-MPC reference</Repo>, and <Repo path="scripts/cem.py"><K>scripts/cem.py</K></Repo> for the executable details.
            </p>
          </section>

          <section>
            <h2 id="transitions" className="font-display text-lg font-semibold text-foreground mb-3">Turn driving into transitions</h2>
            <p>A learned dynamics model needs examples of what one action does. Each example is a transition:</p>
            <Eq block math={TRANSITION} />
            <p>
              Here <Eq math="o_t" /> is the current six-feature observation, <Eq math="a_t" /> is <K>[acceleration, steering]</K>, and <Eq math="o_{t+1}" /> is the real next observation returned by the environment. The saved row also includes reward, achieved and desired goals, episode ID, and outcome flags.
            </p>
            <p className="mt-3">
              <Repo path="scripts/collect_random.py"><K>scripts/collect_random.py</K></Repo> gathered exactly 8,000 random-policy transitions. They span 92 represented episode IDs because collection stopped partway through the last episode. Among 91 completed episodes, zero completed successfully, all 91 crashed, and none reached the duration cutoff. There are zero success flags anywhere in that file.
            </p>
            <p className="mt-3">
              The training mix in <Repo path="scripts/train_dynamics.py"><K>scripts/train_dynamics.py</K></Repo> adds one 45-transition true-dynamics CEM trajectory. It is the only successful parking trajectory in the training mix and is forced into the training side rather than validation. The remaining episodes are split 80/20 by episode ID.
            </p>
            <p className="mt-3">
              Splitting by episode matters. Adjacent rows from one trajectory are strongly related: the next observation in row <Eq math="t" /> is the current observation in row <Eq math="t+1" />. A random row split would place near-duplicates on both sides and make validation look more independent than it is. An episode-level split keeps each random trajectory entirely in training or validation.
            </p>
            <p className="mt-3">
              The dataset is therefore not balanced experience from a competent driver. It is almost entirely random wandering and crashes, plus one successful tape. That fact is an observation about the file. Whether more successful or corrective data would fix latent planning is a hypothesis, not something this experiment isolates.
            </p>
          </section>

          <section>
            <h2 id="identity-baseline" className="font-display text-lg font-semibold text-foreground mb-3">Beat the prediction that nothing changes</h2>
            <p>Before judging a learned model, define a baseline that can win whenever adjacent observations barely move. The identity predictor ignores the action and says:</p>
            <Eq block math={IDENTITY} />
            <p>
              <Repo path="scripts/identity_baseline.py"><K>scripts/identity_baseline.py</K></Repo> implements this equation by subtracting <Eq math="o_t" /> from <Eq math="o_{t+1}" />, squaring elementwise, and taking the mean.
            </p>
            <p className="mt-3">
              Its overall one-step mean squared error on the random dataset, in stored coordinates, is approximately <K>0.0033</K>. This number is small partly because one policy step is only 0.2 seconds and partly because position is divided by 100. The feature-level errors make the scale visible.
            </p>
            <Shot
              src={`${IMG}/identity_baseline.webp`}
              alt="Identity baseline by observation feature"
              caption="x-axis: observation feature; y-axis: one-step identity MSE in stored coordinates. The bars are not physical-unit error or parking performance."
              width={1008}
              height={504}
            />
            <p>
              The recalculated feature MSEs, rounded for reporting, are <K>0.0000193</K> for <K>x</K>, <K>0.0000129</K> for <K>y</K>, <K>0.00881</K> for <K>vx</K>, <K>0.00801</K> for <K>vy</K>, <K>0.00122</K> for <K>cos_h</K>, and <K>0.00190</K> for <K>sin_h</K>. These are stored-coordinate errors, not metres or metres per second.
            </p>
            <p className="mt-3">
              Let <Eq math="f" /> be the observation-space world model. It receives the current observation and action and predicts the next selected observation features:
            </p>
            <Eq block math={WORLD_FN} />
            <p>
              If a batch has <Eq math="B" /> transitions and the output has <Eq math="D" /> features, training uses elementwise mean squared error:
            </p>
            <Eq block math={WORLD_LOSS} />
            <p>
              <Repo path="scripts/train_dynamics.py"><K>scripts/train_dynamics.py</K></Repo> implements the direct prediction in <K>DynamicsMLP.forward</K> and the elementwise mean in <K>train_model</K> with default-mean <K>F.mse_loss</K>.
            </p>
            <p className="mt-3">
              The model predicts the next observation directly, not a delta. Its one-step validation loss needs to beat identity before its horizon curve is interesting. Calling this metric accuracy would be wrong because it is a continuous regression error.
            </p>
          </section>

          <section>
            <h2 id="pose-is-not-state" className="font-display text-lg font-semibold text-foreground mb-3">Pose is not the full state</h2>
            <p>The full model predicts all six features. Two reduced alternatives ask whether position and heading alone are enough:</p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li>A pose-only model uses <Eq math={String.raw`x,y,\cos h,\sin h`} />.</li>
              <li>A stacked-pose model concatenates the two latest poses, using their difference as an indirect clue about motion.</li>
            </ul>
            <p className="mt-3">
              To compare these models fairly, the evaluation reports pose MSE for all of them. Comparing the full model's six-output MSE against a four-output model's overall MSE would mix model quality with a change in denominator and would remove the relatively large velocity terms. Pose MSE evaluates the shared coordinates only.
            </p>
            <p className="mt-3">
              The conceptual issue is the Markov property. A state is Markov when the next state depends on the latest state and action, not on unobserved history. Two cars can have the same pose while moving at different velocities. Give both the same acceleration and steering, and their next positions differ. Pose alone is therefore a partially observed view of the bicycle dynamics.
            </p>
            <p className="mt-3">
              The two-pose stack tries to infer velocity from recent change. In these stored units, however, position differences over 0.2 seconds are tiny because metres are divided by 100. A shallow MLP must extract that weak signal while also learning the dynamics. In this run, stacking does not solve the long-horizon problem.
            </p>
            <Shot
              src={`${IMG}/pose_vs_full_horizon.webp`}
              alt="Open-loop pose error by horizon"
              caption="x-axis: open-loop horizon in steps; y-axis: pose MSE in stored coordinates. This compares prediction, not physical distance or parking success."
              width={1008}
              height={560}
            />
            <p>
              At horizon one, every model receives a real validation observation. At horizon two, its first prediction becomes its next input. This continues through horizons 5, 10, and 20. The plot therefore measures repeated self-feeding, not twenty independent one-step predictions.
            </p>
            <p className="mt-3">
              The full model's better curve supports a narrow conclusion: exposing velocity improves open-loop pose prediction on these held-out starts. It does not prove that six features are a complete state for every parking configuration. In the neighboring-car stress test, for example, the observation omits the obstacles.
            </p>
            <p className="mt-3">
              See <Repo path="lessons/0004-pose-is-not-state.html">lesson 0004</Repo> and the <Repo path="reference/partial-obs.html">partial-observation reference</Repo> for a visual treatment.
            </p>
          </section>

          <section>
            <h2 id="compounding-error" className="font-display text-lg font-semibold text-foreground mb-3">One good step can become a bad future</h2>
            <p>
              One-step MSE averages local predictions near data the model has seen. Planning asks a harsher question. The model must consume its own outputs, often under action sequences selected precisely because they look attractive to that model.
            </p>
            <p className="mt-3">
              The next figure replays the saved tape through three observation-space models without revealing the real trajectory again: imagined full uses all six features, imagined pose uses pose only, and imagined stack uses two poses.
            </p>
            <Shot
              src={`${IMG}/cem_openloop_overlay.webp`}
              alt="A real CEM park versus learned open-loop predictions"
              caption="Axes: lot x and y in metres. Imagined full drifts toward x about 115 m; imagined pose and imagined stack remain near the start. These are open-loop predictions, not closed-loop parking."
              width={1176}
              height={644}
            />
            <p>
              This is <strong className="text-foreground">compounding error</strong>: a one-step prediction lands off the real data manifold, then becomes the next synthetic input, so drift can accelerate. Nagabandi et al.'s <A href="https://arxiv.org/abs/1708.02596">model-based control work</A> makes the same distinction between one-step fit and multi-step rollout.
            </p>
            <p className="mt-3">
              MPC reduces exposure by replanning from the current real observation after each committed action. Still, every CEM candidate is ranked using an open-loop rollout inside the horizon. If that rollout is untrustworthy, the optimizer is choosing actions with a distorted ruler.
            </p>
            <p className="mt-3">
              This gives a stronger baseline for the latent model: do not ask only whether its next-step loss is low. Ask whether its open-loop error remains below a meaningful identity baseline across the planning horizon, then separately ask whether the resulting controller parks.
            </p>
          </section>

          <section>
            <h2 id="predict-a-latent" className="font-display text-lg font-semibold text-foreground mb-3">Predict a latent, not the snapshot</h2>
            <p>
              Unweighted MSE applies equal loss weight to each stored coordinate, even though those coordinates differ in physical scale and task importance. A joint-embedding predictive architecture, or JEPA, instead learns a latent space in which prediction is trained.
            </p>
            <p className="mt-3">Define the symbols before the equations:</p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li><Eq math="o_t" /> is the current real observation.</li>
              <li><Eq math="a_t" /> is the current action.</li>
              <li><Eq math="E" /> is the online encoder with parameters <Eq math={String.raw`\theta_{\text{online}}`} />.</li>
              <li><Eq math="E_{\text{target}}" /> is a slowly updated target encoder with parameters <Eq math={String.raw`\theta_{\text{target}}`} />.</li>
              <li><Eq math="z_t" /> is the online latent for the current observation.</li>
              <li><Eq math={String.raw`z^*_{t+1}`} /> is the target latent for the real next observation.</li>
              <li><Eq math="P" /> is the latent predictor.</li>
              <li><Eq math={String.raw`\hat z_{t+1}`} /> is its predicted next latent.</li>
            </ul>
            <p className="mt-3">The forward equations are:</p>
            <Eq block math={JEPA_FORWARD} />
            <p>For batch size <Eq math="B" /> and latent dimension <Eq math="D_z" />, the repository trains with mean squared latent error:</p>
            <Eq block math={JEPA_LOSS} />
            <p>
              The local architecture uses small MLPs on six-dimensional kinematics and an eight-dimensional latent. It is not an image JEPA, video model, transformer, autoencoder, or pixel generator. There is no decoder. The closest conceptual connection to <A href="https://arxiv.org/abs/2301.08243">I-JEPA</A> is the online encoder, predictor, slow target encoder, and prediction in representation space. The exact local objective is established by <Repo path="scripts/train_jepa.py"><K>scripts/train_jepa.py</K></Repo>.
            </p>
          </section>

          <section>
            <h2 id="stop-gradient-ema" className="font-display text-lg font-semibold text-foreground mb-3">Keep the target from chasing the guess</h2>
            <p>
              If both sides of the loss learn freely from the same gradient, they can make the task easy in an unhelpful way. The target could move toward whatever the predictor already outputs. This implementation prevents that in two ways.
            </p>
            <p className="mt-3">
              First, target encoding runs under <K>torch.no_grad()</K>, target parameters have <K>requires_grad=False</K>, and they are excluded from the optimizer. That is the stop-gradient boundary. Calling <K>.eval()</K> would not be sufficient: evaluation mode changes dropout and batch-normalization behavior, but it does not detach tensors or disable autograd.
            </p>
            <p className="mt-3">
              Second, the target parameters follow the online encoder using an exponential moving average. Let <Eq math={String.raw`\tau=0.99`} /> be the target retention coefficient. After an online update:
            </p>
            <Eq block math={EMA_UPDATE} />
            <p>
              The <K>Jepa.ema_</K> method in <Repo path="scripts/train_jepa.py"><K>scripts/train_jepa.py</K></Repo> performs this update under <K>torch.no_grad()</K>.
            </p>
            <p className="mt-3">
              The target moves slowly, giving the predictor a stable answer key without freezing that answer key forever. A focused version of the training loop is:
            </p>
            <CodeBlock
              lang="python"
              code={`z_hat = model.predict(model.encode(o), a)
z_tgt = model.encode(o2, target=True)
loss = F.mse_loss(z_hat, z_tgt)
loss.backward()
optimizer.step()
model.ema_(tau=0.99)`}
            />
            <p>
              In the actual class, target encoding supplies the no-gradient context. The excerpt shows the data flow, not every safety line.
            </p>
          </section>

          <section>
            <h2 id="check-for-collapse" className="font-display text-lg font-semibold text-foreground mb-3">Check for collapse</h2>
            <p>
              A decoder-free latent objective has a dangerous trivial solution: map every observation to the same vector. Then predicting the next latent is easy because every answer is identical. Low loss alone cannot rule this out.
            </p>
            <p className="mt-3">
              Before writing the horizon plot, the training script checks target latents from strided validation observations using two simple statistics:
            </p>
            <ol className="list-decimal pl-5 space-y-2 mt-3">
              <li>Mean of the per-dimension latent sample standard deviations.</li>
              <li>Mean off-diagonal pairwise Euclidean distance for up to 128 target latents.</li>
            </ol>
            <p className="mt-3">
              <Repo path="scripts/train_jepa.py"><K>scripts/train_jepa.py</K></Repo> exits if either statistic is below <K>0.001</K>. For the saved checkpoint, recalculation on 1,670 validation rows gives mean per-dimension standard deviation <K>1.0237</K> and mean pairwise distance <K>3.4962</K>. Both pass the implemented threshold.
            </p>
            <p className="mt-3">
              These checks rule out a near-constant target representation under two basic tests; they do not prove control usefulness.
            </p>
            <Shot
              src={`${IMG}/jepa_latent_horizon.webp`}
              alt="JEPA latent error over an open-loop horizon"
              caption="x-axis: open-loop horizon from 1 to 20 steps; y-axis: latent MSE in representation units squared. JEPA remains below latent identity; this is prediction, not parking."
              width={1008}
              height={560}
            />
            <p>
              Latent identity keeps the current target encoding fixed while the real target latents genuinely move across each window. JEPA beating that baseline is therefore informative about temporal prediction, but it does not validate latent distance as a control objective.
            </p>
            <p className="mt-3">
              See <Repo path="lessons/0005-predict-z-not-the-snapshot.html">lesson 0005</Repo> and the <Repo path="reference/jepa.html">JEPA reference</Repo>.
            </p>
          </section>

          <section>
            <h2 id="latent-cem" className="font-display text-lg font-semibold text-foreground mb-3">Put CEM inside the learned imagination</h2>
            <p>
              The latent controller preserves the optimizer and receding-horizon shape from the true-dynamics experiment. It changes two things: candidate futures are rolled through <Eq math="P" />, and cost is distance to a goal latent.
            </p>
            <p className="mt-3">
              Define <Eq math="g" /> as the desired-goal vector from the observation dictionary. The target encoder produces the goal embedding:
            </p>
            <Eq block math={Z_GOAL} />
            <p>
              At real step <Eq math="t" />, planning starts from <Eq math={String.raw`z_t=E(o_t)`} />. For candidate actions <Eq math={String.raw`a_{t:t+H-1}`} />, recursively define each imagined latent:
            </p>
            <Eq block math={LATENT_ROLLOUT} />
            <p>The default planning energy is the sum of Euclidean distances to the goal latent across all predicted future steps:</p>
            <Eq block math={PLANNING_ENERGY} />
            <p>
              <Repo path="scripts/plan_latent.py"><K>scripts/plan_latent.py</K></Repo> minimizes this energy with CEM using 64 samples, 8 elites, and 5 refinement iterations by default. The receding controller executes <K>best[0]</K>, receives the next real observation, and repeats. A focused version of the planning loop is:
            </p>
            <CodeBlock
              lang="python"
              code={`for h in range(horizon):
    z = model.predict(z, actions[:, h])
    energy += torch.linalg.vector_norm(z - z_goal, dim=-1)`}
            />
            <p>
              Planning energy is latent distance, not the JEPA training loss, physical metres, or environment reward. In the <Repo path="NOTES.md">recorded seed-0 run</Repo>, it is near <K>3.5</K> while the car remains about <K>20 m</K> from the stall.
            </p>
            <p className="mt-3">
              <A href="https://arxiv.org/abs/2506.09985">V-JEPA 2</A> is related because it uses goal representations, CEM, and receding replanning. Its video representations, terminal L1 energy, and fitted-mean action differ from this project's summed per-step L2 and best-scored tape. Local <Repo path="scripts/plan_latent.py"><K>--terminal</K></Repo> remains final-step L2.
            </p>
            <p className="mt-3">
              <A href="https://arxiv.org/abs/2310.16828">TD-MPC2</A> is another decoder-free latent planning reference, but it also learns reward, terminal value, and a policy prior and uses a different planner. The shared idea is local planning in learned latent dynamics, not architecture or performance equivalence.
            </p>
            <p className="mt-3">The recorded comparison is sobering:</p>
            <Shot
              src={`${IMG}/latent_mpc.webp`}
              alt="Random, open-loop, and receding latent control all miss"
              caption={<>Axes: lot x and y in metres for recorded seed 0. Best xy distance is not <K>is_success</K>; all three controllers miss.</>}
              width={1120}
              height={644}
            />
            <p>
              Recorded seed 0: random control crashes at step 53 after best xy <K>29.5 m</K>; receding latent MPC reaches <K>20.0 m</K> and crashes at step 315; open-loop reaches <K>9.4 m</K> and crashes at step 415. Here open-loop commits one <Eq math="H" />-action tape before replanning, not one tape for the whole episode.
            </p>
            <p className="mt-3">
              None parks because none sets <K>{'info["is_success"]'}</K>; closeness is secondary.
            </p>
            <p className="mt-3">
              The recorded six-seed receding run has zero successes, one crash, and five duration cutoffs, so it parks 0 of 6 measured seeds. These values come from lab notes and plots, not saved raw arrays.
            </p>
            <p className="mt-3">
              See <Repo path="lessons/0006-steer-toward-the-stall-in-z.html">lesson 0006</Repo> and the <Repo path="reference/latent-mpc.html">latent MPC reference</Repo>.
            </p>
          </section>

          <section>
            <h2 id="distrust-signals" className="font-display text-lg font-semibold text-foreground mb-3">Can the model notice when its future is unreliable?</h2>
            <p>A failed learned planner is easier to deploy safely if it can abstain before a dangerous action. The project tests three heuristics:</p>
            <div className="grid sm:grid-cols-3 gap-3 mt-4">
              <div className="bg-card border border-border rounded-xl p-3">
                <p className="text-xs font-semibold text-foreground mb-1">Residual</p>
                <p className="text-xs text-muted-foreground">Compare the one-step prediction with the real next latent after acting.</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-3">
                <p className="text-xs font-semibold text-foreground mb-1">Disagreement</p>
                <p className="text-xs text-muted-foreground">Compare three predictors' next-latent guesses before acting.</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-3">
                <p className="text-xs font-semibold text-foreground mb-1">Imagined spread</p>
                <p className="text-xs text-muted-foreground">Roll those predictors through the candidate horizon and compare their final guesses before acting.</p>
              </div>
            </div>
            <p className="mt-3">
              They answer different questions at different times. Residual grades the step that just happened. Disagreement and imagined spread estimate uncertainty about a proposed action or tape before it is sent.
            </p>
            <p className="mt-3">
              The ensemble consists of three deterministic predictors sharing frozen online and target encoders. Each predictor is trained on a different bootstrap resample of the training transitions. This is not the probabilistic ensemble and trajectory-sampling architecture in <A href="https://arxiv.org/abs/1805.12114">PETS</A>. PETS is useful background for model ensembles; it is not an equivalence claim.
            </p>
          </section>

          <section>
            <h2 id="residual" className="font-display text-lg font-semibold text-foreground mb-3">Residual: grade the step after taking it</h2>
            <p>
              Let the one-step prediction be <Eq math={String.raw`P(E(o_t),a_t)`} />, and let the answer key after the real transition be <Eq math={String.raw`E_{\text{target}}(o_{t+1})`} />. The residual is one Euclidean norm:
            </p>
            <Eq block math={RESIDUAL} />
            <p>
              <Repo path="scripts/plan_latent.py"><K>scripts/plan_latent.py</K></Repo> implements this equation in <K>one_step_residual</K>, using one L2 norm after the real step and no gradient tracking.
            </p>
            <p className="mt-3">
              It is not a mean squared error and not an average over an episode. Because <Eq math="o_{t+1}" /> does not exist until <K>env.step(a_t)</K> returns, <Eq math="r_t" /> arrives after action <Eq math="a_t" />. A residual gate can prevent action <Eq math="a_{t+1}" />, but it cannot undo action <Eq math="a_t" />.
            </p>
            <Shot
              src={`${IMG}/one_step_residual.webp`}
              alt="A quiet one-step residual during a parking miss"
              caption="Top axes: lot x and y in metres. Bottom: post-action step versus latent L2 residual; the dashed identity residual is target-latent movement when predicting no change. Seed 1 reaches a duration cutoff, not success."
              width={1120}
              height={1036}
            />
            <p>
              This seed-1 trace rejects a tempting inference: a quiet one-step residual does not imply a successful plan. The model can track ordinary local motion while its goal geometry or long rollouts remain unsuitable for control.
            </p>
            <p className="mt-3">
              Residual also mixes two effects. It can rise because the action reaches unfamiliar physical behavior, or because the encoder makes nearby observations far apart in latent space. Without calibration against outcomes, magnitude alone is not a warning threshold.
            </p>
          </section>

          <section>
            <h2 id="disagreement" className="font-display text-lg font-semibold text-foreground mb-3">Disagreement: ask several predictors before acting</h2>
            <p>
              For three predictors <Eq math="P_i" />, compute each next-latent guess from the same current latent and proposed action. Let <Eq math={String.raw`\operatorname{Std}_{\text{pop}}`} /> mean population standard deviation across ensemble members, computed separately for each latent dimension. One-step disagreement is:
            </p>
            <Eq block math={DISAGREEMENT} />
            <p>
              <Repo path="scripts/plan_latent.py"><K>scripts/plan_latent.py</K></Repo> implements this equation in <K>ensemble_disagreement</K> with <K>unbiased=False</K>, followed by one L2 norm, all before <K>env.step</K>.
            </p>
            <p className="mt-3">
              The inner operation produces one standard deviation per latent coordinate. The outer L2 norm reduces that vector to one scalar. The implementation uses <K>unbiased=False</K>, so this is population rather than sample standard deviation.
            </p>
            <p className="mt-3">
              Imagined spread uses the same reduction after every predictor rolls its own latent through the planned horizon. It is available before acting because it needs only the current latent, candidate tape, and predictors. In principle it can expose futures where model errors branch even if one-step guesses agree.
            </p>
            <Shot
              src={`${IMG}/distrust.webp`}
              alt="Residual and disagreement around the seed-0 crash"
              caption="Top: x and y in metres. Middle: post-action latent L2 residual; dashed identity residual is target-latent movement when predicting no change. Bottom: solid one-step disagreement and dashed imagined horizon spread, both pre-action L2 quantities. These are not metres or crash probabilities."
              width={1120}
              height={1344}
            />
            <p>
              For this recorded seed-0 run, residual is about <K>0.107</K> early and <K>0.092</K> over the last ten steps, often below identity.
            </p>
            <p className="mt-3">
              Agreement is not truth. Bootstrap predictors trained on the same narrow data and sharing the same encoder can inherit the same blind spot. If all three extrapolate similarly, disagreement stays low while all are wrong. Conversely, a spread spike can occur in an unfamiliar but harmless region. An uncertainty score becomes a detector only after its relationship to the event of interest is measured.
            </p>
          </section>

          <section>
            <h2 id="precision-and-recall" className="font-display text-lg font-semibold text-foreground mb-3">Precision and recall: did the alarm fire in time?</h2>
            <p>
              The event of interest is "a crash will occur within one planning horizon." With horizon <Eq math="H=10" />, action index <Eq math="t" /> receives a positive label when the actual crash action lies in indices <Eq math="t" /> through <Eq math="t+9" />. For one 315-step crashed tape, exactly its final ten pre-action positions are positive. Non-crashed tapes contain no positive crash-soon positions.
            </p>
            <p className="mt-3">
              For a threshold <Eq math={String.raw`\gamma`} />, the alarm fires when a score is at least <Eq math={String.raw`\gamma`} />. Precision asks:
            </p>
            <Eq block math={PRECISION} />
            <p>Recall asks:</p>
            <Eq block math={RECALL} />
            <p>
              These ratios apply when denominators are nonzero. In <Repo path="scripts/residual.py"><K>scripts/residual.py</K></Repo>, <K>crash_soon_labels</K> creates labels and <K>lagged_residual_scores</K> aligns each previous-step residual to the next proposed action. <K>pr_curve</K> uses <K>max(denominator, 1)</K> defensively for empty cases; that safeguard does not affect this dataset.
            </p>
            <p className="mt-3">
              In the recorded six-run diagnostic set, there are only 10 positive disagreement rows among 2,815 finite pre-action disagreement rows. The positive prevalence is:
            </p>
            <Eq block math={PREVALENCE} />
            <p>
              That prevalence is chance precision for random alarms. The class imbalance is extreme because five runs do not crash and the one crash contributes only ten positive positions. A method can achieve high numerical accuracy by predicting "no crash soon" everywhere, which is why accuracy is not used here. Precision-recall curves focus on the rare positive event.
            </p>
            <p className="mt-3">
              Lagged residual has one unavailable score at the start of each of six episodes, so its finite denominator is <K>2,809</K>. The <K>10 / 2815</K> denominator specifically describes finite disagreement samples pooled over the same completed, non-aborted tapes.
            </p>
            <Shot
              src={`${IMG}/distrust_pr.webp`}
              alt="Distrust precision-recall curves against chance"
              caption="x-axis: recall; y-axis: precision, both unitless. Curves at the approximately 0.004 chance line do not establish useful crash-soon detection."
              width={896}
              height={728}
            />
            <p>
              At the p90 disagreement threshold, approximately <K>0.027</K>, observed precision and recall are both 0 on the completed diagnostic tapes.
            </p>
            <p className="mt-3">The code can still wire that threshold into an abort:</p>
            <Shot
              src={`${IMG}/distrust_abort.webp`}
              alt="The p90 disagreement gate aborting at step 5"
              caption="Top axes: lot x and y in metres. Signal panels span steps 0 to 5; middle is post-action latent L2. Bottom shows solid one-step disagreement and dashed imagined horizon spread, both pre-action L2 quantities. The p90 gate sees about 0.028 and stops before action index 5, still 29.5 m away."
              width={1120}
              height={1344}
            />
            <p>
              This is not a caught crash: the completed seed-0 tape crashes at step 315. The abort proves pre-action stopping, not useful detection.
            </p>
            <p className="mt-3">
              See <Repo path="lessons/0007-check-the-guess-after-you-act.html">lesson 0007</Repo>, the <Repo path="reference/residual.html">distrust reference</Repo>, and <Repo path="scripts/residual.py"><K>scripts/residual.py</K></Repo>.
            </p>
          </section>

          <section>
            <h2 id="why-it-failed" className="font-display text-lg font-semibold text-foreground mb-3">Why did the learned planner fail?</h2>
            <p>The experiment supports several observations:</p>
            <ol className="list-decimal pl-5 space-y-2 mt-3">
              <li>The random file has exactly 8,000 transitions and zero successful completed episodes among 91 completed episodes.</li>
              <li>One true-dynamics 45-step parking trajectory is mixed into training and forced onto the training side.</li>
              <li>The full observation model beats pose-reduced alternatives and identity on the reported prediction comparison, yet its replay of the successful CEM tape eventually diverges badly.</li>
              <li>JEPA beats latent identity through horizon 20 on shared validation starts and passes the implemented non-collapse checks.</li>
              <li>Learned latent MPC records zero successes in six measured seeds.</li>
              <li>Planning energy can be low while physical distance remains large, because planning energy is latent distance, not metres or environment success.</li>
              <li>The three tested distrust scores remain at chance for the recorded crash-soon labels.</li>
            </ol>
            <p className="mt-3">Those observations do not isolate one causal failure. Several explanations are plausible.</p>
            <div className="rounded-xl border border-accent/30 bg-accent/5 p-5 space-y-3 mt-4">
              <p>
                <strong className="text-foreground">Data coverage is a leading hypothesis.</strong> Almost all training transitions come from random control, and one successful tape cannot cover the approaches, corrections, braking patterns, and recovery states that planning may query. CEM also seeks unusual actions that exploit the model's learned surface. Broader successful and corrective behavior data may improve planning.
              </p>
              <p>
                <strong className="text-foreground">One-step training may be mismatched to rollout use.</strong> Both the observation model and JEPA train on one real transition at a time, but CEM rolls predictions recursively for ten steps. A multi-step objective may teach the predictor to remain useful under its own outputs.
              </p>
              <p>
                <strong className="text-foreground">The latent metric may not align with control.</strong> JEPA is trained to predict the target encoder's next representation. Nothing directly requires Euclidean distance to the desired-goal encoding to correlate with controllable progress, collision risk, or the environment reward. Reward-aware, value-aware, or contrastive goal structure could change that geometry.
              </p>
              <p>
                <strong className="text-foreground">The uncertainty heuristic may share the model's blind spots.</strong> Three deterministic predictors trained from bootstrap versions of the same narrow dataset and using the same frozen encoders can agree outside reliable support. Calibrated probabilistic dynamics or more diverse model classes may produce a more meaningful uncertainty signal.
              </p>
            </div>
            <p className="mt-3">
              Each paragraph above says "may" because the project did not vary one factor at a time. It would be an overclaim to say sparse successful data caused the failure, or that multi-step training would fix it. The current evidence narrows the debugging space without identifying a single cause.
            </p>
          </section>

          <section>
            <h2 id="what-it-established" className="font-display text-lg font-semibold text-foreground mb-3">What this project actually established</h2>
            <p>The project establishes an end-to-end experimental scaffold for model-based control:</p>
            <ul className="space-y-2 mt-3">
              {[
                'True-dynamics CEM reaches the environment outcome; scripted braking supplies the empty-lot recorder\'s final pose.',
                'Simulator snapshot and rewind separate imagined candidate steps from real committed steps.',
                'Saved transitions preserve action order, coordinate scales, goals, episode identity, and outcome flags.',
                'Episode-level splitting avoids placing adjacent rows from one random episode on both sides of train and validation.',
                'Identity is a necessary baseline because short, scaled transitions can produce deceptively small errors.',
                'Velocity matters for this bicycle\'s open-loop pose prediction.',
                'A decoder-free JEPA can pass simple non-collapse checks and beat latent identity without producing successful latent control.',
                'Residual timing differs fundamentally from disagreement timing: residual is post-action; disagreement and imagined spread are pre-action.',
                'A working abort mechanism is not a working detector. Detection must be scored against time-aligned outcomes under class imbalance.',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3">
              It does not establish robust parking, safe autonomy, visual control, calibrated uncertainty, a V-JEPA 2 reproduction, a TD-MPC2 reproduction, or parity with probabilistic ensemble methods. It tests tiny MLPs on kinematic observations in one simulator.
            </p>
            <p className="mt-3">
              The broad lesson is that prediction, planning, and distrust need separate acceptance tests. A horizon curve is not a park. A low planning energy is not a metre measurement. A threshold crossing is not a caught crash. Keeping those interfaces explicit makes a negative control result useful rather than ambiguous.
            </p>
            <p className="mt-3">
              For a diagram connecting every component and figure, open <Repo path="lessons/0008-one-machine-many-plots.html">lesson 0008</Repo> and the <Repo path="reference/plots.html">plot catalog</Repo>.
            </p>
          </section>

          <section>
            <h2 id="what-next" className="font-display text-lg font-semibold text-foreground mb-3">What I would try next</h2>
            <p>The next experiments should isolate hypotheses instead of adding architecture at random.</p>
            <div className="rounded-xl border border-accent/30 bg-accent/5 p-5 space-y-3 mt-4">
              <p>
                <strong className="text-foreground">Collect broader competent behavior.</strong> Record multiple successful true-dynamics CEM trajectories across seeds, starts, and occupied-stall layouts. Add controlled recovery trajectories from deliberately perturbed poses. Keep a separate held-out set of episodes and parking layouts.
              </p>
              <p>
                <strong className="text-foreground">Measure support before planning.</strong> Add a nearest-neighbor or density diagnostic in observation-action space. Compare where CEM proposes actions with where training transitions exist. This can test whether planning systematically leaves data support.
              </p>
              <p>
                <strong className="text-foreground">Train for the horizon used by control.</strong> Add multi-step losses at horizons 2, 5, and 10, with explicit reporting against identity on held-out episodes. Compare scheduled self-feeding with rollouts initialized only from real observations.
              </p>
              <p>
                <strong className="text-foreground">Align the latent with the task.</strong> Test whether latent distance ranks real goal progress. Sample pairs of observations, compare latent distance to physical goal error and reachable progress, and reject the planning metric if the ranking is poor.
              </p>
              <p>
                <strong className="text-foreground">Model rewards or values explicitly.</strong> A learned reward and terminal value could make the objective closer to the task than raw goal-latent distance. This moves toward ideas used by methods such as TD-MPC2 without claiming to reproduce them.
              </p>
              <p>
                <strong className="text-foreground">Use calibrated probabilistic dynamics.</strong> Compare the current three deterministic bootstrap predictors with a model that represents predictive distributions. Evaluate calibration on held-out transitions before using uncertainty as a gate.
              </p>
              <p>
                <strong className="text-foreground">Define safety labels before tuning thresholds.</strong> Crash within ten steps is one event. Distance-increasing, wall proximity, or leaving data support may be earlier and denser targets. Thresholds should be chosen on one set and evaluated on untouched episodes.
              </p>
              <p>
                <strong className="text-foreground">Save every diagnostic tape.</strong> The next run should retain per-step observations, actions, predictions, energies, residuals, disagreements, horizon spreads, thresholds, and outcomes. That would make every plot independently recalculable.
              </p>
            </div>
            <p className="mt-3">
              The key comparison remains unchanged: first prove the optimizer with true dynamics, then replace only the imagination, then measure both task success and alarm quality.
            </p>
          </section>

          <section>
            <h2 id="reproduce" className="font-display text-lg font-semibold text-foreground mb-3">Reproduce the experiment</h2>
            <p>
              Use Python 3.11 or newer. On Windows Git Bash, use <K>.venv/Scripts/python</K> if activation is inconvenient. From the repository root:
            </p>
            <CodeBlock
              lang="bash"
              code={`python -m venv .venv
source .venv/Scripts/activate
pip install -r requirements.txt
python scripts/sanity_check.py`}
            />
            <p>Then reproduce in the documented dependency order:</p>
            <CodeBlock
              lang="bash"
              code={`python scripts/collect_random.py
python scripts/identity_baseline.py
python scripts/plan_pendulum.py
python scripts/plan_parking.py --record
python scripts/train_dynamics.py
python scripts/train_jepa.py
python scripts/plan_latent.py --compare --episodes 6
python scripts/train_ensemble.py
python scripts/residual.py --seed 1 --skip-check
python scripts/residual.py --gate --episodes 6 --skip-check`}
            />
            <p>
              The ordering is functional. Random data precedes baseline and training. True-dynamics parking adds the successful tape before dynamics and JEPA training. JEPA precedes latent planning. The ensemble depends on the trained JEPA, and the gate depends on both.
            </p>
            <p className="mt-3">
              The exact scripts are <Repo path="scripts/sanity_check.py"><K>sanity_check.py</K></Repo>, <Repo path="scripts/collect_random.py"><K>collect_random.py</K></Repo>, <Repo path="scripts/identity_baseline.py"><K>identity_baseline.py</K></Repo>, <Repo path="scripts/plan_pendulum.py"><K>plan_pendulum.py</K></Repo>, <Repo path="scripts/plan_parking.py"><K>plan_parking.py</K></Repo>, <Repo path="scripts/train_dynamics.py"><K>train_dynamics.py</K></Repo>, <Repo path="scripts/train_jepa.py"><K>train_jepa.py</K></Repo>, <Repo path="scripts/plan_latent.py"><K>plan_latent.py</K></Repo>, <Repo path="scripts/train_ensemble.py"><K>train_ensemble.py</K></Repo>, and <Repo path="scripts/residual.py"><K>residual.py</K></Repo>.
            </p>
            <p className="mt-3">
              Data and checkpoints are gitignored. Reproducing the stochastic learned-planner figures may require the recorded seeds and the same software environment. The saved true-dynamics and neighboring-stall arrays support independent recalculation of their reported steps, outcome flags, distances, speed, and return. The older latent-planner and gate measurements should be treated as recorded-run evidence until rerun and saved as raw arrays.
            </p>
          </section>

          <section>
            <h2 id="references" className="font-display text-lg font-semibold text-foreground mb-3">References</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Farama Foundation, <A href="https://highway-env.farama.org/environments/parking/">highway-env parking documentation</A>, <A href="https://highway-env.farama.org/actions/">actions</A>, and <A href="https://highway-env.farama.org/observations/">observations</A>.
              </li>
              <li>
                Farama Foundation, <A href="https://gymnasium.farama.org/api/env/">Gymnasium environment API</A>, for <K>reset</K>, <K>step</K>, <K>terminated</K>, and <K>truncated</K>.
              </li>
              <li>
                Pinneri et al., 2020, <A href="https://arxiv.org/abs/2008.06389">Sample-efficient Cross-Entropy Method for Real-time Planning</A>.
              </li>
              <li>
                Nagabandi et al., 2018, <A href="https://arxiv.org/abs/1708.02596">Neural Network Dynamics for Model-Based Deep RL with Model-Free Fine-Tuning</A>.
              </li>
              <li>
                Chua et al., 2018, <A href="https://arxiv.org/abs/1805.12114">Deep Reinforcement Learning in a Handful of Trials using Probabilistic Dynamics Models</A>.
              </li>
              <li>
                Assran et al., 2023, <A href="https://arxiv.org/abs/2301.08243">Self-Supervised Learning from Images with a Joint-Embedding Predictive Architecture</A>.
              </li>
              <li>
                Assran et al., 2025, <A href="https://arxiv.org/abs/2506.09985">V-JEPA 2: Self-Supervised Video Models Enable Understanding, Prediction and Planning</A>.
              </li>
              <li>
                Hansen et al., 2023, <A href="https://arxiv.org/abs/2310.16828">TD-MPC2: Scalable, Robust World Models for Continuous Control</A>.
              </li>
              <li>
                Local supporting material: <Repo path="GLOSSARY.md">GLOSSARY.md</Repo>, <Repo path="reference/learned-dynamics.html">learned-dynamics reference</Repo>, <Repo path="reference/jepa.html">JEPA reference</Repo>, <Repo path="reference/latent-mpc.html">latent-MPC reference</Repo>, and <Repo path="reference/residual.html">distrust reference</Repo>.
              </li>
            </ul>
          </section>
        </div>

        <BlogNav />
      </article>
    </main>
  )
}
