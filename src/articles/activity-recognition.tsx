import { Link } from 'react-router-dom'
import CaseStudyLayout, {
  Section,
  InfoGrid,
  InfoCard,
  FindingsList,
  ResultTable,
  Reflection,
} from './CaseStudyLayout'
import CodeBlock from './CodeBlock'
import { ProtocolCompareDiagram, ServePathDiagram } from './har-wisdm-diagrams'

const meta = {
  title: 'Subject-independent HAR on WISDM',
  badge: 'ML / Sensors',
  tagline:
    'v1.0.0 is the June phone XGBoost notebook (0.8559 accuracy, leaky split). v2.0.0 is session-safe 20 Hz repair, GroupKFold, and a CPU API. Same 5 s phone flatten: 0.8925 leaky macro-F1 vs 0.2924 GroupKFold. Watch statistical XGBoost is 0.7031.',
  tech: ['Python', 'WISDM', 'XGBoost', 'scikit-learn', 'FastAPI', 'ONNX', 'MLflow'],
  links: [
    { label: 'GitHub', url: 'https://github.com/notsubash/Activity-Recognition', icon: 'github' as const },
    { label: 'Hugging Face', url: 'https://huggingface.co/axlesubash/wisdm-watch-stat-xgb', icon: 'external' as const },
    { label: 'v2.0.0', url: 'https://github.com/notsubash/Activity-Recognition/releases/tag/v2.0.0', icon: 'external' as const },
    { label: 'v1.0.0 notebooks', url: 'https://github.com/notsubash/Activity-Recognition/releases/tag/v1.0.0', icon: 'external' as const },
  ],
  metrics: [
    { value: '0.7031', label: 'Watch macro-F1, Protocol B' },
    { value: '0.89 → 0.29', label: 'Phone flatten, leaky vs GroupKFold' },
    { value: '18', label: 'Activity classes (A–S, no N)' },
    { value: '51', label: 'Subjects (UCI 507)' },
  ],
  seoTitle: 'WISDM HAR: Subject-Independent Case Study | Subash Pandey',
  seoDescription:
    'Subject-independent WISDM HAR with GroupKFold XGBoost. Same 5 s phone flatten: 0.8925 leaky macro-F1 vs 0.2924 grouped. Watch statistical model 0.7031. CPU FastAPI for one 5 s window.',
  seoKeywords:
    'wisdm subject independent har, groupkfold xgboost activity recognition, wearable imu classification, har evaluation leakage',
}

const ladderRows = [
  { label: 'Student notebook (leaky)', value: '0.8559 acc', note: 'macro-F1 not reported' },
  { label: 'A1 leaky 80-sample flatten', value: '0.8490', note: 'macro-F1 · 0.8475 acc' },
  { label: 'A2 leaky 5 s flatten', value: '0.8925', note: 'same 51 people both sides' },
  { label: 'B same flatten, GroupKFold', value: '0.2924', note: 'leakage pair with A2' },
  { label: 'B phone dummy', value: '0.0151', note: 'chance floor' },
  { label: 'B phone logreg', value: '0.2767', note: 'statistical 104-d' },
  { label: 'B phone random forest', value: '0.3131', note: 'statistical 104-d' },
  { label: 'B phone XGBoost', value: '0.3272', note: '200 trees · 5 s' },
  { label: 'B watch XGBoost', value: '0.7031', note: 'number to cite' },
  { label: 'B concat (stacked 6-ch rows)', value: '0.5236', note: 'not 12-channel fusion' },
  { label: 'C phone 46/5 × 3', value: '0.2985', note: 'tracks B, not A' },
]

const failRows = [
  { label: 'Phone locomotion group F1', value: '0.8873', note: 'Protocol B stat XGB' },
  { label: 'Phone eating group F1', value: '0.4945', note: 'pasta 0.0749' },
  { label: 'Phone sitting F1', value: '0.1943', note: 'worse than stairs' },
  { label: 'Watch eating group F1', value: '0.8450', note: 'sandwich 0.2816' },
  { label: 'Watch locomotion group F1', value: '0.9292', note: 'stairs 0.7028' },
]

const ablationRows = [
  { label: 'Control 5 s XYZ', value: '0.3272', note: 'eating group 0.4945' },
  { label: 'Window 10 s', value: '0.3422', note: 'only clear 18-way win' },
  { label: 'Window 2 s', value: '0.2951', note: 'worse' },
  { label: 'Trim 15 s', value: '0.3247', note: 'eating group drops' },
  { label: 'Reorient on', value: '0.3230', note: 'default stays off' },
  { label: 'Magnitude only', value: '0.3142', note: '32 features' },
  { label: 'Hierarchical', value: '0.3271', note: 'eating group 0.5855' },
]

export default function ActivityRecognition() {
  return (
    <CaseStudyLayout meta={meta}>

      <Section title="Overview">
        <p>
          Public{' '}
          <a
            href="https://archive.ics.uci.edu/dataset/507/wisdm+smartphone+and+smartwatch+activity+and+biometrics+dataset"
            className="text-primary hover:underline"
          >
            WISDM (UCI 507)
          </a>
          {' '}smartphone and smartwatch IMU data, 18 activities. v1 shuffled overlapping phone
          windows and reported 0.8559 accuracy. v2 is a package that refuses that split for any
          number I would cite. Primary metric is macro-F1. Accuracy is secondary. Every cell names
          a protocol. The rebuild story is in the{' '}
          <Link to="/blog/activity-recognition-pipeline" className="text-primary hover:underline">
            blog post
          </Link>
          . This page is the frozen table, the protocol contract, and the serving surface.
        </p>
      </Section>

      <Section title="Dataset">
        <p>
          51 subjects (1600–1650), phone in a pocket and watch on the dominant hand, accelerometer and
          gyroscope. This extract matches Weiss at 15,630,426 rows. The archived notebook concatenated
          15,649,253. Claimed 20 Hz; sessions also sit at 25, 50, and 100 Hz. 35 empty
          subject×activity×stream cells. No demographics, so no fairness slice. Codes A–S skipping N.
        </p>
      </Section>

      <Section title="Method">
        <InfoGrid>
          <InfoCard title="Repair">
            Interpolate each session onto a shared 20 Hz grid. Align accel and gyro by coverage
            intersection, not an exact-timestamp join. Reorient and 15 s trim exist as ablations and
            stay off by default.
          </InfoCard>
          <InfoCard title="Windows">
            5.0 s length, 1.0 s hop, inside one (subject, activity, device) session. Statistical
            features are 104-d. Flattened raw windows exist only to compare against v1.
          </InfoCard>
          <InfoCard title="Models">
            Stratified dummy, logistic regression, random forest, XGBoost. Trees beat the classical
            phone ladder, so no 1D CNN or TCN ships. Hierarchical group-then-expert is an ablation.
          </InfoCard>
          <InfoCard title="Protocols">
            A1/A2 leaky clones of the notebook split. B is 5-fold GroupKFold on subject_id. C is
            46/5 × 3 grouped holdout, not 51-fold LOSO. D (phone↔watch transfer) is not run.
          </InfoCard>
        </InfoGrid>
        <ProtocolCompareDiagram />
      </Section>

      <Section title="Frozen results">
        <p>
          Full 51-subject UCI 507, repaired to 20 Hz. Cite Protocol B watch 0.7031 from{' '}
          <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">docs/reports/protocol_b_watch_stat_xgb.json</code>
          , not from the served ONNX file. A2 vs B is the leakage pair on the same 5 s flatten. Do
          not treat A2 vs the notebook 0.8559 as leakage-only: A1/A2 already sit on repaired parquet.
        </p>
        <ResultTable rows={ladderRows} />
      </Section>

      <Section title="Failure cases">
        <p>
          Pocket phone can tell locomotion as a group and still cannot name eating or sitting. Watch
          on the wrist flips that. Sandwich is the hard served class.
        </p>
        <ResultTable rows={failRows} />
      </Section>

      <Section title="Ablations (phone statistical XGBoost, Protocol B)">
        <ResultTable rows={ablationRows} />
      </Section>

      <Section title="Serving">
        <p>
          CPU FastAPI for one 5 s, 20 Hz window (T=100, C=6). Default bundle is watch statistical
          XGBoost. Trees are ONNX; statistical features stay in Python. Wrong T, C, device, or Hz is
          422. Bodies over 1 MiB are 413. Abstain is <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">max(proba) &lt; threshold</code>
          ; default threshold 0.0 never abstains. p95 2.7 ms is FastAPI TestClient on this CPU, not
          Docker. The watch trees also live on Hugging Face as{' '}
          <a href="https://huggingface.co/axlesubash/wisdm-watch-stat-xgb" className="text-primary hover:underline">
            axlesubash/wisdm-watch-stat-xgb
          </a>
          . Cite Protocol B from <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">docs/reports/protocol_b_watch_stat_xgb.json</code>
          , not an export-fit score from the Hub file. Phone windows are a different bundle.
        </p>
        <ServePathDiagram />
        <CodeBlock
          lang="bash"
          code={`python -m har.models.export --config configs/protocol_b_watch_stat_xgb.yaml --out models/watch_stat_xgb.onnx
export HAR_MODEL_PATH=models/watch_stat_xgb.onnx
make serve`}
        />
      </Section>

      <Section title="Key findings">
        <FindingsList items={[
          'Same 5 s phone flatten: 0.8925 leaky macro-F1 vs 0.2924 GroupKFold. That drop is the leakage finding.',
          'Watch statistical XGBoost is 0.7031 under Protocol B. Phone statistical XGBoost is 0.3272. Concat stacked rows is 0.5236, not 12-channel fusion.',
          'Eighteen classes, not nineteen. Sitting is a weak phone class under GroupKFold (F1 0.1943), not a standout.',
          'Trees beat dummy, logreg, RF, and flatten on the phone B ladder, so no TCN shipped.',
          '10 s windows are the only ablation that clearly beats 5 s (0.3422). Reorient and a 15 s trim do not.',
        ]} />
      </Section>

      <Reflection title="What I no longer claim">
        <p>
          The June writeup said sitting and writing were easy, fusion would lift the rest, and a
          CNN-LSTM could pass 90%. Under subject-grouped splits, sitting is a weak phone class,
          concat without alignment sits between phone and watch, and I did not train a network
          because trees already beat flatten, logreg, and RF on this ladder. I would rather run
          aligned fusion and LOSO than chase the leaky 0.86.
        </p>
      </Reflection>

      <Section title="Limits">
        <FindingsList items={[
          'No demographics, so no fairness slice.',
          'Protocol C is 46/5 × 3, not 51-fold LOSO. Protocol D is not run.',
          'Served ONNX is a refit. Abstain is uncalibrated. Features still run in Python.',
          'v1.0.0 notebooks are archived and are not the training path.',
        ]} />
      </Section>

    </CaseStudyLayout>
  )
}
