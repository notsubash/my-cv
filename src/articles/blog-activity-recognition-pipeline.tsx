import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Calendar, Tag } from 'lucide-react'
import BlogNav from './BlogNav'
import BlogToc from './BlogToc'
import CodeBlock from './CodeBlock'
import { LeakageSplitDiagram, RepairPipelineDiagram } from './har-wisdm-diagrams'
import { useBlogSeo, useReadingTime } from './useBlogSeo'

const TITLE = 'Rebuilding WISDM HAR after a leaky 0.89'
const DESCRIPTION =
  'I froze the June WISDM notebook at git tag v1.0.0, then rebuilt subject-independent HAR. Same 5 s phone flatten: 0.8925 leaky macro-F1 vs 0.2924 GroupKFold. Watch statistical XGBoost is 0.7031.'

function K({ children }: { children: ReactNode }) {
  return <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">{children}</code>
}

function Shot({
  src, alt, caption, width, height,
}: {
  src: string; alt: string; caption: string; width: number; height: number
}) {
  return (
    <figure className="my-6">
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-auto rounded-xl border border-border bg-card"
        loading="lazy"
      />
      <figcaption className="text-center text-xs text-muted-foreground mt-2">{caption}</figcaption>
    </figure>
  )
}

function MetricTable({
  caption, headers, rows,
}: {
  caption: string
  headers: string[]
  rows: string[][]
}) {
  return (
    <figure className="my-6">
      <div className="rounded-xl border border-border bg-card overflow-x-auto">
        <table className="w-full text-xs">
          <caption className="caption-bottom text-center text-xs text-muted-foreground px-3 py-2 border-t border-border">
            {caption}
          </caption>
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {headers.map((h) => (
                <th key={h} scope="col" className="text-left px-3 py-2 text-foreground font-semibold whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? undefined : 'bg-muted/30'}>
                {row.map((cell, j) =>
                  j === 0 ? (
                    <th key={j} scope="row" className="px-3 py-2 text-left font-medium text-foreground whitespace-nowrap">
                      {cell}
                    </th>
                  ) : (
                    <td key={j} className="px-3 py-2 text-muted-foreground whitespace-nowrap">{cell}</td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  )
}

export default function BlogActivityRecognitionPipeline() {
  useBlogSeo({
    title: TITLE,
    description: DESCRIPTION,
    keywords:
      'wisdm subject independent har, groupkfold activity recognition, xgboost wearable imu, sensor leakage sliding windows',
    ogImage: '/og-blog-activity-recognition.webp',
    datePublished: '2026-08-23',
    dateModified: '2026-08-23',
    slug: 'activity-recognition-pipeline',
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
              <time dateTime="2026-08-23">August 2026</time>
            </span>
            <span className="text-border">·</span>
            <span ref={readingTimeRef}>14 min read</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4 leading-tight">
            {TITLE}
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed mb-5">
            The June notebook printed 0.8559 phone accuracy. I froze that tree at git tag v1.0.0 and
            rebuilt the pipeline. Same 5 s phone flatten on repaired 20 Hz data: 0.8925 leaky
            macro-F1 versus 0.2924 under GroupKFold. The 18-class number I would serve is watch
            statistical XGBoost at 0.7031.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {['Python', 'WISDM', 'XGBoost','ONNX','MlFlow','GroupKFold', 'FastAPI'].map(tag => (
              <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-muted text-muted-foreground">
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground mb-6">
          Source:{' '}
          <a href="https://github.com/notsubash/Activity-Recognition" className="text-primary hover:underline">
            github.com/notsubash/Activity-Recognition
          </a>
          {' '}at{' '}
          <a href="https://github.com/notsubash/Activity-Recognition/releases/tag/v2.0.0" className="text-primary hover:underline">
            v2.0.0
          </a>
          . June notebooks:{' '}
          <a href="https://github.com/notsubash/Activity-Recognition/releases/tag/v1.0.0" className="text-primary hover:underline">
            v1.0.0
          </a>
          . Frozen tables live in the{' '}
          <Link to="/projects/activity-recognition" className="text-primary hover:underline">
            case study
          </Link>
          .
        </div>

        <hr className="border-border mb-10" />

        <div className="prose-custom space-y-8 text-sm text-muted-foreground leading-relaxed">
          <section>
            <h2 id="leaky-split" className="font-display text-lg font-semibold text-foreground mb-3">The 0.86 I published was a leaky split</h2>
            <p>
              In June I treated a phone-only XGBoost notebook as the project result. It printed{' '}
              <K>Accuracy: 0.855905403547367</K>. That walkthrough lived on this URL. The code from
              that week is still on GitHub as{' '}
              <a href="https://github.com/notsubash/Activity-Recognition/releases/tag/v1.0.0" className="text-primary hover:underline">v1.0.0</a>.
              I did not delete it. I tagged it, archived the notebooks, and asked a different question
              on the same dump.
            </p>
            <p className="mt-3">
              Human activity recognition (HAR) here means: take a few seconds of accelerometer and
              gyroscope, and name one of 18 daily activities. Those two sensors, three axes each, are
              an inertial measurement unit (IMU).{' '}
              <a
                href="https://archive.ics.uci.edu/dataset/507/wisdm+smartphone+and+smartwatch+activity+and+biometrics+dataset"
                className="text-primary hover:underline"
              >
                WISDM (UCI 507)
              </a>{' '}
              records them from a phone in a pocket and a watch on the dominant hand, 51 people,
              codes A–S skipping N. There is no activity N. Eighteen classes, not nineteen. The June
              case study got that wrong.
            </p>
            <p className="mt-3">
              On repaired 20 Hz data, the same flattened 5 s phone windows still look strong if I
              shuffle them the way the notebook did: <strong className="text-foreground">0.8925 macro-F1</strong>{' '}
              (<K>configs/protocol_a2_phone_raw_flat_xgb.yaml</K>). Macro-F1 is the unweighted mean of
              per-class F1. I use it as the primary metric because accuracy can hide that pasta and
              sitting are noise. GroupKFold on <K>subject_id</K> drops that flatten to{' '}
              <strong className="text-foreground">0.2924</strong>{' '}
              (<K>configs/protocol_b_phone_raw_flat_xgb.yaml</K>).
            </p>
            <LeakageSplitDiagram />
            <p>
              That drop is the finding. The 18-class number I would actually serve is watch
              statistical XGBoost at <strong className="text-foreground">0.7031</strong> GroupKFold
              (<K>configs/protocol_b_watch_stat_xgb.yaml</K>). Pocket phone on the same feature family
              is <strong className="text-foreground">0.3272</strong>. Concatenating phone and watch
              windows as extra rows lands in between, at <strong className="text-foreground">0.5236</strong>.
              That concat is still six channels per window, not time-aligned 12-channel fusion. The
              June reflection said I would fuse next and jump past 90% with a CNN-LSTM. I have no
              evidence for that jump. I have evidence that stacking both devices without alignment does
              not beat the watch.
            </p>
          </section>

          <section>
            <h2 id="v1-notebook" className="font-display text-lg font-semibold text-foreground mb-3">v1.0.0 did what student HAR notebooks usually do</h2>
            <p>
              The tagged tree is <K>DataLoader.ipynb</K>, <K>analysis.ipynb</K>, and{' '}
              <K>PhoneXGB2.ipynb</K>: no package, no tests, no subject-grouped split. TensorFlow sat
              unused in <K>requirements.txt</K>. Watch files were on disk and unused. Evaluation lived
              in a generic writeup, not a model card. The notebook concatenated{' '}
              <strong className="text-foreground">15,649,253</strong> rows, inner-joined phone accel
              and gyro on exact timestamps, cut 80-sample windows with hop 40, flattened them to 480
              numbers, dropped subject id, and called <K>train_test_split</K>. Early stopping
              watched the test set. A scaler saw every row before the split. Random search landed on
              982 trees, <K>max_depth</K> 6. I still have that run: accuracy{' '}
              <strong className="text-foreground">0.8559</strong>. Macro-F1 was not reported.
            </p>
            <p className="mt-3">
              Those steps leak. Once <K>Subject-id</K> is gone, the same gait and the same pocket sit
              on both sides of the split, so a tree can memorize people. Hop 40 on length 80 puts
              overlapping windows from one bout in train and test.{' '}
              <K>get_frames</K> slid over the concatenated table, so a window at a file boundary can mix
              two activities or two people. Sample deltas are about <K>5.03e7</K>; as nanoseconds
              that is ~50 ms, about 20 Hz, but <K>pd.to_datetime(..., unit="us")</K> turns the same
              integers into ~50 s gaps and decorative 2019 datetimes. Deltas are usable. Absolute epoch
              is not.{' '}
              <a href="https://arxiv.org/abs/2305.10222" className="text-primary hover:underline">
                Heydarian and Doyle (rWISDM)
              </a>{' '}
              already warned that the published Unix times do not match 2017. IMU clocks almost never
              share sample instants, so an inner join on the raw timestamp drops and distorts rows. I
              knew clocks drift and still merged on <K>Timestamp</K> in v1 because that is the join
              you write when you want a 6-column matrix today. The official line format is{' '}
              <K>subject-id, activity-code, timestamp, x, y, z;</K> with a trailing semicolon on{' '}
              <K>z</K>; student <K>read_csv</K> kept that semicolon as part of the string.
            </p>
            <p className="mt-3">
              I am not going to relitigate v1 class by class from the leaky confusion matrix. Walking vs
              jogging vs stairs, and the eating cluster, already showed up there. Under a
              subject-independent split those confusions survive. The 0.89 score does not.
            </p>
          </section>

          <section>
            <h2 id="dump-not-20hz" className="font-display text-lg font-semibold text-foreground mb-3">The dump is not a clean 20 Hz grid</h2>
            <p>
              UCI 507 claims 51 subjects (1600–1650), 18 activities for three minutes each, 20 Hz,
              phone in the pocket, watch on the dominant hand. The description PDF is{' '}
              <a
                href="http://archive.ics.uci.edu/ml/machine-learning-databases/00507/WISDM-dataset-description.pdf"
                className="text-primary hover:underline"
              >
                WISDM-dataset-description.pdf
              </a>
              . Instance count on the UCI page is 15,630,426. My extract matches Weiss stream totals
              exactly: phone accel 4,804,403, phone gyro 3,608,635, watch accel 3,777,046, watch gyro
              3,440,342. Total <strong className="text-foreground">15,630,426</strong>. The extra 18,827
              rows in the student concat are a loader artifact, not extra physics.
            </p>
            <Shot
              src="/blog/activity-recognition/sampling_rate_modes.webp"
              alt="Histogram of implied sampling-rate modes in raw WISDM sessions, clustered at 20, 25, 50, and 100 Hz"
              caption="Implied Hz from timestamp deltas. Official claim is 20 Hz. A 200-row ARFF window is 10 s at 20 Hz and about 4 s at 50 Hz."
              width={1162}
              height={652}
            />
            <p>
              Implied Hz from timestamp deltas in this dump clusters at{' '}
              <strong className="text-foreground">20</strong> (2,838 sessions),{' '}
              <strong className="text-foreground">25</strong> (543),{' '}
              <strong className="text-foreground">50</strong> (322), and{' '}
              <strong className="text-foreground">100</strong> (14). A 200-row official ARFF window
              is 10 s at 20 Hz and about 4 s at 50 Hz, so windowing by row count mixes time scales. ARFF
              is Weka's attribute-relation format; WISDM ships precomputed 10 s feature files that
              assume 20 Hz. I did not train on those files as ground truth.{' '}
              <strong className="text-foreground">35</strong> subject × activity × stream cells are
              empty. Phone accel alone is missing 1607 J, 1609 B, 1616 B and F, 1618 O, 1642 C and F,
              1643 I. rWISDM had already listed a subset of those phone-accel holes; the 18-class grid
              has more, including watch and gyro. There are no demographics, so there is no fairness
              slice. Zero NaNs. Zero non-monotonic timestamps. The defects are coverage, sampling rate,
              and orientation, not garbage floats.
            </p>
          </section>

          <section>
            <h2 id="repair" className="font-display text-lg font-semibold text-foreground mb-3">Repair so a window is 5 seconds of real time</h2>
            <p>
              <K>python -m har.data.repair</K> interpolates each{' '}
              <K>(subject, activity, device)</K> session onto a shared 20 Hz grid. Accel and gyro are
              aligned by the intersection of their coverage, not by an exact-timestamp join.
              Phone-accel reorient is implemented and <strong className="text-foreground">off</strong> by
              default. Start-of-trial trim is implemented and <strong className="text-foreground">0 s</strong> by
              default.
            </p>
            <RepairPipelineDiagram />
            <p>
              Windows are <strong className="text-foreground">5.0 s</strong> with a{' '}
              <strong className="text-foreground">1.0 s</strong> hop, built inside one session. They
              never slide across subject or activity boundaries. At 20 Hz that is T=100, C=6. A
              session shorter than 5 s yields no windows. Coverage below 0.95 (any non-finite channel)
              drops the window. Default features are 104-dimensional statistical summaries: per-axis
              moments, a 10-bin histogram, magnitude, pairwise correlations. That family is what the
              official ARFF was pointing at, minus MFCC. Flattened raw windows exist so I can compare
              the student representation on the same repaired sessions. Six-channel flatten is 600
              numbers on a 5 s window; the 80-sample A1 clone is 480. I skipped peak-interval and MFCC
              on purpose. Phone eating is still a mess after statistical features. Adding cosine-mel bins
              does not get you out of a pocket IMU that cannot see a fork. Parser, audit, repair,
              windowing, and splits have fixture tests. CI never downloads WISDM.
            </p>
          </section>

          <section>
            <h2 id="protocols" className="font-display text-lg font-semibold text-foreground mb-3">Three protocols, because one number is a trap</h2>
            <p>
              Protocol A copies the notebook and early-stops on the test set. A1 is the closest clone
              of <K>PhoneXGB2.ipynb</K> (leaky <K>train_test_split</K> on 80-sample / hop-40 flatten).
              A2 is the leaky side of the same-representation pair (5 s / 1 s flatten). Protocol B is
              5-fold GroupKFold on <K>subject_id</K> and is the main table. Protocol C is a 46/5
              grouped holdout, 3 repeats from one seed: a phone holdout check, not 51-fold leave-one-subject-out
              (LOSO). Protocol D, train phone / test watch and reverse, is specified and not run.
              Everything except A fits scalers, encoders, and early stopping on training subjects
              only. Nested XGBoost validation on B/C is one held-out <strong className="text-foreground">train</strong> subject,
              not a separate validation cohort.
            </p>
            <p className="mt-3">
              A1 and A2 train on the <strong className="text-foreground">repaired</strong> parquet. They
              clone the student split and window geometry, not the unrepaired concat table. Do not
              treat A2 0.8925 vs the notebook 0.8559 as a leakage-only delta. Parse, timestamps, and
              the accel/gyro join already changed the matrix. A1 came out{' '}
              <strong className="text-foreground">0.8490</strong> macro-F1 /{' '}
              <strong className="text-foreground">0.8475</strong> accuracy
              (<K>configs/protocol_a1_phone_raw_flat_xgb.yaml</K>), in the same ballpark as 0.8559, on
              80-sample windows. Different geometry from A2. The leakage experiment is A2 vs B on 5 s
              flatten, same 982-tree family the notebook used. Honest B/C XGBoost is a smaller family:
              200 trees, <K>max_depth</K> 6. Config YAML may say <K>device: cuda</K>; export and
              machines without a GPU fall back to CPU. I am not treating those runs as a 982-tree
              reproduction.
            </p>
          </section>

          <section>
            <h2 id="same-flatten" className="font-display text-lg font-semibold text-foreground mb-3">Same flatten, leaky vs grouped</h2>
            <MetricTable
              caption="Phone flattened windows. A2 vs B is the leakage pair. A1 is a different window geometry."
              headers={['Protocol', 'Config', 'Model', 'macro-F1', 'Accuracy']}
              rows={[
                ['Student notebook', 'notebooks/archive/student_evaluation.txt', 'xgboost', 'not reported', '0.8559'],
                ['A1 leaky', 'protocol_a1_phone_raw_flat_xgb', 'xgboost (982 trees)', '0.8490', '0.8475'],
                ['A2 leaky', 'protocol_a2_phone_raw_flat_xgb', 'xgboost (982 trees)', '0.8925', '0.8913'],
                ['B GroupKFold', 'protocol_b_phone_raw_flat_xgb', 'xgboost (982 trees)', '0.2924', '0.3047'],
              ]}
            />
            <Shot
              src="/blog/activity-recognition/leakage_macro_f1.webp"
              alt="Bar chart comparing leaky Protocol A2 macro-F1 of 0.8925 against GroupKFold Protocol B at 0.2924 on the same flattened 5 second phone windows"
              caption="Same flattened 5 s phone windows under a leaky split versus GroupKFold. Frozen JSON under docs/reports/."
              width={1406}
              height={583}
            />
            <p>
              A2 train and test subject lists are the same 51 ids. That is the leak, written down.
              GroupKFold folds do not share people. If you only remember one pair from this post,
              remember 0.8925 vs 0.2924.
            </p>
          </section>

          <section>
            <h2 id="what-classifies" className="font-display text-lg font-semibold text-foreground mb-3">What actually classifies 18 activities</h2>
            <p>
              Protocol B, statistical features, GroupKFold 5, repaired 20 Hz, 5 s windows, full
              51-subject UCI 507.
            </p>
            <MetricTable
              caption="Protocol B statistical ladder on repaired 20 Hz windows."
              headers={['Device', 'Config', 'Model', 'macro-F1', 'Accuracy']}
              rows={[
                ['phone', 'protocol_b_phone_stat_dummy', 'stratified dummy', '0.0151', '0.0551'],
                ['phone', 'protocol_b_phone_stat_logreg', 'logreg', '0.2767', '0.2799'],
                ['phone', 'protocol_b_phone_stat_rf', 'random forest', '0.3131', '0.3252'],
                ['phone', 'protocol_b_phone_stat_xgb', 'xgboost (200 trees)', '0.3272', '0.3382'],
                ['phone', 'protocol_b_phone_raw_flat_xgb', 'xgboost (982 trees), flatten', '0.2924', '0.3047'],
                ['watch', 'protocol_b_watch_stat_xgb', 'xgboost (200 trees)', '0.7031', '0.7013'],
                ['both (stacked rows)', 'protocol_b_concat_stat_xgb', 'xgboost (200 trees)', '0.5236', '0.5267'],
              ]}
            />
            <Shot
              src="/blog/activity-recognition/protocol_b_ladder.webp"
              alt="Bar chart of Protocol B macro-F1 for dummy, logistic regression, random forest, phone XGBoost, watch XGBoost, and stacked concat"
              caption="Protocol B model and device ladder on statistical features. Watch is the device that classifies 18 activities."
              width={1531}
              height={922}
            />
            <p>
              Statistical phone XGBoost beats flattened raw under the same protocol. Gradient boosting
              beat dummy, logistic regression, and random forest on that phone table, so I did not add
              a 1D CNN or temporal convolutional network (TCN). "Trees won" means they won this
              classical ladder on these windows. It does not mean a network cannot win later. A later
              TCN is only a claim if it uses the same GroupKFold splits and the same windows, with a
              row next to <K>protocol_b_phone_stat_xgb</K>. Watch fold macro-F1 ran from 0.637 to 0.770
              (<K>std_fold_macro_f1</K> 0.0506). Phone was tighter (std 0.015). The 0.7031 headline is
              a pooled number with real person-to-person spread. Protocol C phone statistical XGBoost
              is <strong className="text-foreground">0.2985</strong> macro-F1, unweighted mean of three
              46/5 repeats (<K>configs/protocol_c_phone_stat_xgb.yaml</K>). It tracks Protocol B phone
              (0.3272), not Protocol A. Full 51-subject XGBoost is an overnight local run. 51-fold LOSO
              would be that overnight, fifty-one times.
            </p>
          </section>

          <section>
            <h2 id="phone-vs-watch" className="font-display text-lg font-semibold text-foreground mb-3">Pocket phone finds locomotion. It cannot name dinner.</h2>
            <p>
              Phone statistical XGBoost under Protocol B
              (<K>protocol_b_phone_stat_xgb.json</K>): locomotion as a group is F1{' '}
              <strong className="text-foreground">0.8873</strong>. Eating as a group is{' '}
              <strong className="text-foreground">0.4945</strong>. Per-class F1: pasta 0.0749, soup
              0.0807, chips 0.0964, drinking 0.1050, sandwich 0.1064, sitting 0.1943. Stairs (0.6588)
              and kicking (0.6470) are the weakest locomotion classes. They are not the worst overall.
              Sitting is worse than stairs. The June post called sitting a standout class. That was the
              leaky phone story, where the model had already seen that person's still pocket.
            </p>
            <p className="mt-3">
              Watch on the dominant hand flips the picture: locomotion 0.9292, hand 0.8788, eating
              0.8450, posture 0.6606. Stairs 0.7028, kicking 0.7831. The hard watch class is sandwich
              (L) at <strong className="text-foreground">0.2816</strong>. Typing, brushing teeth,
              catch, dribbling, writing, clapping, folding are all much easier once the IMU is on the
              wrist.
            </p>
            <Shot
              src="/blog/activity-recognition/per_class_f1_phone_watch.webp"
              alt="Per-class F1 bars for 18 WISDM activities comparing phone and watch statistical XGBoost under Protocol B"
              caption="Per-class F1, Protocol B. Phone eating stays near 0.07–0.11. Watch sandwich is the weak served class at 0.2816."
              width={1551}
              height={1276}
            />
            <Shot
              src="/blog/activity-recognition/per_group_f1_phone_watch.webp"
              alt="Activity-group F1 for locomotion, posture, hand, and eating on phone versus watch"
              caption="Activity-group F1. Pocket phone can tell locomotion as a group. Watch is the 18-way device."
              width={1259}
              height={683}
            />
            <p>
              Do not send a phone window to a watch bundle. The API returns 422 on <K>device</K>{' '}
              mismatch. Placement is part of the model. The June case study said watch soup and teeth
              confused with standing, and that phone handled eating better. Under GroupKFold the phone
              cannot name eating at all. I was reading a leaky matrix.
            </p>
          </section>

          <section>
            <h2 id="ablations" className="font-display text-lg font-semibold text-foreground mb-3">Ablations that did not rescue the phone</h2>
            <p>
              Same GroupKFold, same 200-tree family as the phone statistical control (5 s, XYZ, trim
              0, reorient off, flat 18-way, macro-F1 <strong className="text-foreground">0.3272</strong>,
              eating group F1 <strong className="text-foreground">0.4945</strong>).
            </p>
            <MetricTable
              caption="Protocol B phone statistical XGBoost ablations. Control stays 5 s, unreoriented, untrimmed, flat 18-way."
              headers={['Setting', 'Config', 'macro-F1', 'Eating group F1']}
              rows={[
                ['Control 5 s XYZ', 'protocol_b_phone_stat_xgb', '0.3272', '0.4945'],
                ['Window 10 s', 'ablations/window_10s', '0.3422', '0.5151'],
                ['Window 2 s', 'ablations/window_2s', '0.2951', '0.4610'],
                ['Trim first 15 s', 'ablations/trim_15s', '0.3247', '0.4712'],
                ['Phone-accel reorient', 'ablations/reorient_on', '0.3230', '0.4830'],
                ['Magnitude only', 'ablations/magnitude', '0.3142', '0.4516'],
                ['Hierarchical', 'ablations/hierarchical', '0.3271', '0.5855'],
              ]}
            />
            <Shot
              src="/blog/activity-recognition/ablations_macro_f1.webp"
              alt="Bar chart of Protocol B phone statistical XGBoost ablations showing 10 second windows slightly ahead of the 5 second control"
              caption="10 s windows are the only knob that clearly beats 5 s. Reorient and a 15 s start trim do not."
              width={1424}
              height={1007}
            />
            <p>
              rWISDM-style gravity repair on phone accel does not raise 18-class phone GroupKFold.
              Dropping the first 15 s does not either, and it hurts eating. Magnitude-only (two
              Euclidean channels, then the same extractor, 32 features) is worse than XYZ. Axis stats
              matter. 10 s windows are the only row that clearly beats 5 s, by about 1.5 macro-F1
              points. That is a latency and context trade, not a free lunch. Defaults stay 5 s,{' '}
              <K>reorient: false</K>, <K>trim_start_s: 0.0</K>.
            </p>
            <p className="mt-3">
              The two-stage head trains a group classifier (locomotion / posture / hand / eating) plus
              four experts on the true group, then routes at inference by the{' '}
              <strong className="text-foreground">predicted</strong> group. It does not beat flat
              18-way on macro-F1 (0.3271 vs 0.3272). Eating group F1 rises from 0.4945 to 0.5855.
              Hand rises; posture drops. If the product is "is this person eating," the two-stage head
              is interesting. If the product is 18-way labels, it is not the shipped model. The first
              full-WISDM hierarchical run died on fold 1. Locomotion includes kicking (M), which is
              label index 12. XGBoost's sklearn wrapper rejected <K>[0, 1, 2, 12]</K>. Experts now
              remap local <K>0..K-1</K>. A one-class-per-group unit test never hit that. The fixture had
              to split by class so every expert actually ran. No XGBoost grid search on the
              subject-independent table. The 982-tree student params stay on Protocol A and the B flatten
              pair.
            </p>
          </section>

          <section>
            <h2 id="what-shipped" className="font-display text-lg font-semibold text-foreground mb-3">What I shipped instead of another notebook</h2>
            <p>
              v2 is an installable <K>har</K> package. Config YAML pins every experiment. MLflow logs
              protocol, subject lists, fold macro-F1, per-group F1. Frozen JSON lives under{' '}
              <K>docs/reports/</K>. README figures are regenerated from those reports, so the charts and
              the tables cannot drift by hand.
            </p>
            <CodeBlock
              lang="bash"
              code={`make install
python -m har.data.download   # skips if the extract sentinel exists; not used in CI
make audit                    # docs/data_card.md
make prepare                  # 20 Hz parquet, gitignored
make train CONFIG=configs/protocol_b_watch_stat_xgb.yaml
make eval
make figures
make test                     # fixtures only`}
            />
            <p>
              GitHub Actions: Python 3.13, ruff, pytest on committed tiny WISDM-shaped files. No zip in
              CI. Full training is local and overnight. The product surface is a CPU FastAPI that scores
              one 5 s, 20 Hz window (T=100, C=6). Default bundle is watch statistical XGBoost, trees
              exported with <K>onnxmltools</K> to ONNX (Open Neural Network Exchange). Statistical
              features still run in Python. joblib is a fallback for stubs. The serving contract and
              the 422 cases are in the{' '}
              <Link to="/projects/activity-recognition" className="text-primary hover:underline">
                case study
              </Link>
              . The same watch bundle is on Hugging Face as{' '}
              <a
                href="https://huggingface.co/axlesubash/wisdm-watch-stat-xgb"
                className="text-primary hover:underline"
              >
                axlesubash/wisdm-watch-stat-xgb
              </a>
              . Trees are the <K>.onnx</K> file. The 104-d stats still run in Python from the GitHub
              package. Watch windows only. A phone window is out of contract.
            </p>
            <CodeBlock
              lang="python"
              code={`from pathlib import Path
import numpy as np
from huggingface_hub import snapshot_download
from har.models.export import load_bundle, predict_window

local = snapshot_download("axlesubash/wisdm-watch-stat-xgb")
bundle = load_bundle(Path(local) / "watch_stat_xgb.onnx")
window = np.zeros((100, 6), dtype=np.float32)  # ax, ay, az, gx, gy, gz
print(predict_window(bundle, window))`}
            />
            <p className="mt-3">
              Export refits on all windows from that config, with one train subject used only for early
              stopping. That served fit is not a GroupKFold fold. Cite 0.7031 from{' '}
              <K>docs/reports/protocol_b_watch_stat_xgb.json</K>, not from the ONNX file. p95 CPU
              latency was <strong className="text-foreground">2.7 ms</strong> over 100{' '}
              <K>POST /predict</K> calls through FastAPI TestClient, 200-tree XGBoost, statistical
              100×6 window, this CPU. That is not Docker, not uvicorn, and not a claim about a phone in
              a pocket. Pytest only checks that a stub path stays under 500 ms. The serve image is
              inference-only (<K>python:3.13-slim</K>). It does not install MLflow, XGBoost, or
              pyarrow. Mount <K>$PWD/models</K>. Training env is <K>pip install -e ".[dev]"</K>.{' '}
              <K>pyarrow</K> is pinned to 19.0.1 because MLflow 2.22.5 wants <K>&lt;20</K>.{' '}
              <K>onnx</K> 1.17 had no wheel and tried a source build; 1.22 has a wheel. Those two pins
              ate more time than the FastAPI handlers.
            </p>
          </section>

          <section>
            <h2 id="limits" className="font-display text-lg font-semibold text-foreground mb-3">Limits I am not going to talk past</h2>
            <p>
              No subject demographics, so no slice by sex, handedness, height, or phone model. Concat
              is extra 6-channel rows. Phone+watch fusion that shares a clock is a new pipeline.
              Protocol C is 46/5 × 3, not LOSO. Protocol D (hardware transfer) is not run. rWISDM argued
              repair matters most when you train on one device and test on the other. I did not
              measure that. Served ONNX is a refit. Abstain is uncalibrated. Features are still Python.
              Mixed raw sampling rates are repaired to 20 Hz. Residual in-session orientation flips are
              not fully modeled. The reorient ablation did not help 18-class phone GroupKFold, so the
              default stays off. 10 s windows beat 5 s on phone GroupKFold. I kept 5 s because that is
              the served window. Changing it is a product choice. I am not claiming state of the art
              against papers that shuffled windows and did not say so. v1.0.0 remains the notebook you
              can open if you want to see how the 0.8559 run was produced. It is not the training path.
              Archived notebooks still expect <K>data/processed/raw.csv</K> from the old loader.
            </p>
          </section>

          <section>
            <h2 id="next" className="font-display text-lg font-semibold text-foreground mb-3">What I would run next</h2>
            <p>
              The June post ended by saying the classifier was already useful. A pocket phone that
              cannot tell sitting from eating pasta is not useful as an 18-way product. A watch at
              0.70 macro-F1 with sandwich at 0.28 might be, if you name the failure. That is the version
              I tagged as v2.0.0.
            </p>
            <div className="rounded-xl border border-accent/30 bg-accent/5 p-5 space-y-3 mt-4">
              <p>
                <strong className="text-foreground">Aligned fusion.</strong> Time-aligned 12-channel
                phone+watch windows on the same GroupKFold splits. Stacked 6-channel rows are not that
                experiment.
              </p>
              <p>
                <strong className="text-foreground">LOSO, or more grouped repeats.</strong> Watch fold
                macro-F1 already spans 0.637–0.770. Protocol C is 46/5 × 3, not 51-fold.
              </p>
              <p>
                <strong className="text-foreground">Calibration.</strong> Temperature scaling and a
                non-zero abstain threshold, especially for sandwich and the phone eating cluster.
                Default threshold 0.0 never abstains.
              </p>
              <p>
                <strong className="text-foreground">A TCN only as a side-by-side row</strong> next to{' '}
                <K>protocol_b_phone_stat_xgb</K> and <K>protocol_b_watch_stat_xgb</K>. I will not add
                PyTorch "just in case."
              </p>
              <p>
                <strong className="text-foreground">Few-shot personalization</strong> (30–60 s of a
                held-out user) is in the plan as stretch. Not done.
              </p>
            </div>
          </section>
        </div>

        <BlogNav />
      </article>
    </main>
  )
}
