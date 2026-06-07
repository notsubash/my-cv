import { Link } from 'react-router-dom'
import { ArrowLeft, Calendar, Tag } from 'lucide-react'
import BlogNav from './BlogNav'
import BlogToc from './BlogToc'
import CodeBlock from './CodeBlock'
import { useBlogSeo, useReadingTime } from './useBlogSeo'

function StepBox({ x, y, w, h, label, sublabel, accent }: { x: number; y: number; w: number; h: number; label: string; sublabel?: string; accent?: boolean }) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={8}
        className={
          accent
            ? 'fill-[hsl(var(--accent)/0.15)] stroke-[hsl(var(--accent)/0.6)]'
            : 'fill-[hsl(var(--card))] stroke-[hsl(var(--border))]'
        }
        strokeWidth={1.5}
      />
      <text
        x={x + w / 2}
        y={y + (sublabel ? h / 2 - 6 : h / 2 + 1)}
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-[hsl(var(--foreground))] text-[11px] font-semibold"
      >
        {label}
      </text>
      {sublabel && (
        <text
          x={x + w / 2}
          y={y + h / 2 + 10}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-[hsl(var(--muted-foreground))] text-[9px]"
        >
          {sublabel}
        </text>
      )}
    </g>
  )
}

function StepArrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
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
    </g>
  )
}

function PipelineDiagram() {
  return (
    <figure className="my-6">
      <svg viewBox="0 0 640 185" className="w-full" role="img" aria-label="Activity recognition pipeline from raw data to model evaluation">
        <StepBox x={10} y={10} w={95} h={50} label="WISDM files" sublabel="phone + watch" />
        <StepArrow x1={105} y1={35} x2={130} y2={35} />
        <StepBox x={130} y={10} w={110} h={50} label="DataLoader" sublabel="raw.csv / arff.csv" accent />
        <StepArrow x1={240} y1={35} x2={265} y2={35} />
        <StepBox x={265} y={10} w={110} h={50} label="Preprocess" sublabel="clean + encode" />
        <StepArrow x1={375} y1={35} x2={400} y2={35} />
        <StepBox x={400} y={10} w={110} h={50} label="Sensor merge" sublabel="accel + gyro" accent />
        <StepArrow x1={510} y1={35} x2={535} y2={35} />
        <StepBox x={535} y={10} w={95} h={50} label="Windowing" sublabel="80 / 40 hop" />

        <StepArrow x1={582} y1={60} x2={582} y2={85} />
        <StepBox x={495} y={95} w={120} h={50} label="XGBoost train" sublabel="flattened windows" accent />
        <StepArrow x1={495} y1={120} x2={470} y2={120} />
        <StepBox x={350} y={95} w={120} h={50} label="Evaluation" sublabel="confusion + F1" />
        <StepArrow x1={350} y1={120} x2={325} y2={120} />
        <StepBox x={210} y={95} w={110} h={50} label="Iterate" sublabel="fix weak classes" accent />
      </svg>
      <figcaption className="text-center text-xs text-muted-foreground mt-2">
        End-to-end path from raw WISDM sensor logs to a trained activity classifier
      </figcaption>
    </figure>
  )
}

export default function BlogActivityRecognitionPipeline() {
  useBlogSeo({
    title: 'From Raw Sensor Logs to an Activity Classifier',
    description:
      'A practical build journey through my activity recognition project: loading WISDM sensor data, merging accel+gyro streams, windowing time series, training XGBoost, and learning from confusion matrix failures.',
    keywords:
      'human activity recognition xgboost, wisdm dataset activity classification, accelerometer gyroscope feature engineering, time series windowing for classification, sensor fusion phone accelerometer gyroscope, xgboost multiclass confusion matrix, machine learning activity detection python, wearable sensor data preprocessing, sliding window activity recognition, practical ml project walkthrough',
    ogImage: '/og-blog-rag-pipeline.webp',
    datePublished: '2026-06-07',
    slug: 'activity-recognition-pipeline',
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
            <span className="inline-flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> June 2026</span>
            <span className="text-border">·</span>
            <span ref={readingTimeRef}>12 min read</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4 leading-tight">
            From Raw Sensor Logs to an Activity Classifier
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed mb-5">
            I wanted to build an activity classifier that could tell what someone is doing from phone sensor data: walking, jogging,
            sitting, climbing stairs, and more. This project started as a straightforward modeling task and turned into a practical lesson
            in data cleaning, sensor alignment, and class-level error analysis.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {['Python', 'WISDM', 'XGBoost', 'Time Series', 'Feature Engineering'].map(tag => (
              <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-muted text-muted-foreground">
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground mb-6">
          This post is based on my public repository: <a href="https://github.com/notsubash/Activity-Recognition" className="text-primary hover:underline">Activity-Recognition</a>.
          The project is notebook-driven and still has a few hardcoded paths, so I also call out the rough edges I would fix first.
        </div>

        <hr className="border-border mb-10" />

        <div className="prose-custom space-y-8 text-sm text-muted-foreground leading-relaxed">
          <section>
            <h2 id="why-this-project" className="font-display text-lg font-semibold text-foreground mb-3">Why I built this</h2>
            <p>
              Activity recognition sits in a sweet spot for practical ML. The inputs are messy real-world signals, the labels are concrete,
              and the modeling decisions are easy to explain. You can start simple and still learn a lot about preprocessing discipline.
            </p>
            <p className="mt-3">
              I used the WISDM dataset, which includes accelerometer and gyroscope streams from phones and watches. The task is multi-class
              classification: predict an activity code from motion patterns.
            </p>
            <PipelineDiagram />
          </section>

          <section>
            <h2 id="data-loading" className="font-display text-lg font-semibold text-foreground mb-3">Stage 1: from raw files to usable tables</h2>
            <p>
              The first notebook, <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">DataLoader.ipynb</code>, does most of
              the heavy lifting for ingestion. It parses raw text files and ARFF feature files, tags rows by device and sensor type,
              and exports two main tables: <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">raw.csv</code> and
              <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground"> arff.csv</code>.
            </p>
            <p className="mt-3">
              This step looks boring on paper, but it decides everything that comes later. If naming, timestamps, or column types are even
              slightly inconsistent here, model quality drops and debugging gets painful.
            </p>
          </section>

          <section>
            <h2 id="preprocessing" className="font-display text-lg font-semibold text-foreground mb-3">Stage 2: preprocessing and sensor fusion</h2>
            <p>
              In <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">PhoneXGB2.ipynb</code>, I convert
              <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground"> x/y/z</code> to numeric values, parse timestamps,
              one-hot encode sensor metadata, and scale accelerometer and gyroscope channels separately.
            </p>
            <p className="mt-3">
              The key decision was to train a phone-only pipeline first and merge phone accelerometer and gyroscope streams on shared keys:
              timestamp, subject id, and activity code. Keeping that merge explicit made errors easier to catch.
            </p>
            <CodeBlock
              lang="python"
              code={`# Merge accel + gyro streams after cleaning
phone_accel = df[(df["Device"] == "phone") & (df["Sensor"] == "accel")]
phone_gyro = df[(df["Device"] == "phone") & (df["Sensor"] == "gyro")]

merged = phone_accel.merge(
    phone_gyro,
    on=["Timestamp", "Subject-id", "Activity Code"],
    suffixes=("_acc", "_gyro")
)

# Features per timestep: 6 channels (3 accel + 3 gyro)
X = merged[["x_acc", "y_acc", "z_acc", "x_gyro", "y_gyro", "z_gyro"]].values`}
            />
          </section>

          <section>
            <h2 id="windowing" className="font-display text-lg font-semibold text-foreground mb-3">Stage 3: windowing time series for XGBoost</h2>
            <p>
              Raw sensor rows are not ideal for classification directly, so I frame them into sliding windows. I used
              <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground"> frame_size=80</code> and
              <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground"> hop_size=40</code>, then flattened each
              <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground"> (80, 6)</code> window into a tabular feature vector.
            </p>
            <p className="mt-3">
              I ended up with 72,727 framed samples. At that point I had two choices: sequence models or tree models. I went with XGBoost first
              because I wanted a hard baseline I could iterate quickly and inspect class by class before reaching for deeper architectures.
            </p>
            <CodeBlock
              lang="python"
              code={`def create_windows(features, labels, frame_size=80, hop_size=40):
    X_windows, y_windows = [], []
    for i in range(0, len(features) - frame_size, hop_size):
        window = features[i:i + frame_size]
        segment_labels = labels[i:i + frame_size]
        label = np.bincount(segment_labels).argmax()  # majority label in the frame
        X_windows.append(window)
        y_windows.append(label)
    return np.array(X_windows), np.array(y_windows)

Xw, yw = create_windows(X, y)
Xw_flat = Xw.reshape(Xw.shape[0], -1)  # flatten for XGBoost`}
            />
          </section>

          <section>
            <h2 id="training" className="font-display text-lg font-semibold text-foreground mb-3">Stage 4: training and evaluation</h2>
            <p>
              This is where most of my effort went. XGBoost was not a side detail in this project. It was the center of the whole pipeline once
              framing and fusion were stable. I split the framed data 80/20 (
              <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">58,181</code> train and
              <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">14,546</code> test), flattened the windows, and trained
              with my best random-search parameter set.
            </p>
            <p className="mt-3">
              The best run reached
              <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">0.855905</code> accuracy. More important than that single
              number was the class-level behavior. Some classes were very strong and some were consistently noisy, and the confusion matrix made it obvious where.
            </p>
            <CodeBlock
              lang="python"
              code={`xgb_model = xgb.XGBClassifier(
    use_label_encoder=False,
    eval_metric="mlogloss",
    colsample_bytree=0.9396893641976711,
    gamma=0,
    learning_rate=0.10241823755571676,
    max_depth=6,
    n_estimators=982,
    subsample=0.8545330472743582,
    device="cuda",
    early_stopping_rounds=10
)

xgb_model.fit(X_train, y_train, eval_set=[(X_test, y_test)], verbose=False)
y_pred = xgb_model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)`}
            />
            <p className="mt-3">
              The standout classes were sitting, writing, and standing. The weaker ones were jogging, stairs, kicking, and dribbling. That lines up
              with intuition: classes with similar motion profiles overlap more in the feature space.
            </p>
            <figure className="my-6">
              <img
                src="/blog/activity-recognition/PhoneConfusionMatrix.webp"
                alt="Confusion matrix for activity recognition XGBoost model"
                className="w-full rounded-xl border border-border bg-card"
                loading="lazy"
              />
              <figcaption className="text-center text-xs text-muted-foreground mt-2">
                Confusion matrix from the best XGBoost run. Strong diagonal overall, with clear overlap in similar motion classes.
              </figcaption>
            </figure>
            <ul className="space-y-2 mt-3">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span>
                  <strong className="text-foreground">Strong classes:</strong> <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">D</code> (sitting),
                  <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground"> Q</code> (writing),
                  <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground"> E</code> (standing).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span>
                  <strong className="text-foreground">Weak classes:</strong> <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">B</code> (jogging),
                  <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground"> C</code> (stairs),
                  <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground"> M</code> (kicking),
                  <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground"> P</code> (dribbling).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span>
                  <strong className="text-foreground">Repeated confusions:</strong> <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">A↔B/C</code> and some
                  <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground"> G/H↔E</code> overlap.
                </span>
              </li>
            </ul>
            <p className="mt-3">
              I also hit a practical training warning: device mismatch (GPU booster but CPU input matrix), which still runs but adds overhead.
              So even when the metric looked good, there was still systems-level cleanup left to do.
            </p>
            <figure className="my-6">
              <img
                src="/blog/activity-recognition/PhoneEvals.webp"
                alt="Per-class precision, recall, and F1 evaluation chart for activity recognition model"
                className="w-full rounded-xl border border-border bg-card"
                loading="lazy"
              />
              <figcaption className="text-center text-xs text-muted-foreground mt-2">
                Per-class evaluation view. This is what helped me see which activities needed more work beyond headline accuracy.
              </figcaption>
            </figure>
          </section>

          <section>
            <h2 id="what-was-hard" className="font-display text-lg font-semibold text-foreground mb-3">What was harder than expected</h2>
            <ul className="space-y-3 mt-3">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span>
                  <strong className="text-foreground">Scale and memory pressure.</strong> The raw data is large enough that one careless
                  dataframe copy can slow the entire notebook loop.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span>
                  <strong className="text-foreground">Environment mismatch warnings.</strong> XGBoost showed CPU/GPU mismatch warnings in
                  some runs. It still worked, but with unnecessary overhead.
                </span>
              </li>
            </ul>
          </section>

          <section>
            <h2 id="what-i-learned" className="font-display text-lg font-semibold text-foreground mb-3">What I learned</h2>
            <p>
              The model choice mattered, but the biggest gains came from cleaning and alignment choices upstream. In sensor projects, strong
              preprocessing is not optional. It is most of the work.
            </p>
            <p className="mt-3">
              I also stopped trusting aggregate metrics alone. A confusion matrix tells you where the model is genuinely useful and where it is
              still guessing between similar activities.
            </p>
          </section>

          <section>
            <h2 id="next-iteration" className="font-display text-lg font-semibold text-foreground mb-3">What I would improve next</h2>
            <div className="rounded-xl border border-accent/30 bg-accent/5 p-5 space-y-3">
              <p>
                <strong className="text-foreground">Make the project reproducible end-to-end.</strong> Prepare a Dockerfile and a requirements.txt file to make the project reproducible.
              </p>
              <p>
                <strong className="text-foreground">Compare against sequence models.</strong> Keep XGBoost as a baseline, then test a compact
                1D-CNN or LSTM on the same windowed data.
              </p>
              <p>
                <strong className="text-foreground">Add stronger class-level balancing and diagnostics.</strong> Per-class weighting and more
                targeted error analysis should help the confusing activity pairs.
              </p>
              <p>
                <strong className="text-foreground">Bring watch signals back in deliberately.</strong> I scoped to phone-only first for speed,
                but a structured fusion strategy could improve hard classes.
              </p>
            </div>
          </section>

          <section>
            <h2 id="conclusion" className="font-display text-lg font-semibold text-foreground mb-3">Wrapping up</h2>
            <p>
              This project gave me exactly what I wanted: a practical pipeline that works, plus a list of concrete next moves. The classifier is
              useful already, and the failure modes are clear enough to improve without guesswork.
            </p>
            <p className="mt-3">
              If you are building from wearable or phone sensor data, start with your preprocessing story. Once that is solid, model iteration
              gets much faster.
            </p>
          </section>
        </div>

        <BlogNav />
      </article>
    </main>
  )
}
