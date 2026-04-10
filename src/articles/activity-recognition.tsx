import CaseStudyLayout, {
  Section,
  InfoGrid,
  InfoCard,
  FindingsList,
  ResultTable,
  Reflection,
} from './CaseStudyLayout'

const meta = {
  title: 'Activity Recognition with XGBoost',
  badge: 'ML / Sensors',
  tagline:
    '19 human physical activities classified from smartphone and smartwatch sensor data. Final accuracy reached 85.6% after tuning an XGBoost model with randomised search.',
  tech: ['XGBoost', 'Python', 'scikit-learn', 'Feature Engineering', 'Random Search'],
  links: [
    { label: 'GitHub', url: 'https://github.com/notsubash/Activity-Recognition', icon: 'github' as const },
  ],
  metrics: [
    { value: '85.6%', label: 'Overall accuracy' },
    { value: '19', label: 'Activity classes' },
    { value: '2', label: 'Sensor placements' },
    { value: '≥96%', label: 'F1 on Sitting / Writing' },
  ],
  seoTitle: 'Activity Recognition: Case Study | Subash Pandey',
  seoDescription:
    'XGBoost-based human activity recognition from wearable sensor data. 19 activity classes, 85.6% accuracy, hyperparameter tuning via random search.',
  seoKeywords: 'human activity recognition xgboost, wearable sensor classification python, accelerometer gyroscope machine learning, sklearn activity recognition tutorial, hyperparameter tuning random search xgboost, smartphone activity detection ml',
}

const phonePerClass = [
  { label: 'Sitting (D)', value: '~96%', note: 'F1-score' },
  { label: 'Writing (Q)', value: '~96%', note: 'F1-score' },
  { label: 'Soup (H)', value: '~89%', note: 'F1-score' },
  { label: 'Drinking (K)', value: '~88%', note: 'F1-score' },
  { label: 'Typing (F)', value: '~86%', note: 'F1-score' },
  { label: 'Kicking (M)', value: '~52%', note: 'F1-score' },
  { label: 'Stairs (C)', value: '~49%', note: 'F1-score' },
  { label: 'Dribbling (P)', value: '~49%', note: 'F1-score' },
]

const hyperparams = [
  { label: 'n_estimators', value: '982' },
  { label: 'max_depth', value: '6' },
  { label: 'learning_rate', value: '0.102' },
  { label: 'colsample_bytree', value: '0.94' },
  { label: 'subsample', value: '0.85' },
  { label: 'gamma', value: '0' },
]

export default function ActivityRecognition() {
  return (
    <CaseStudyLayout meta={meta}>

      <Section title="Overview">
        <p>
          Human activity recognition (HAR) matters for health monitoring,
          fitness tracking, elderly care, and sports analytics. This project built a multi-class
          classifier to distinguish 19 daily physical activities using raw inertial measurement
          unit (IMU) data captured simultaneously from a smartphone and a smartwatch.
        </p>
        <p>
          XGBoost was selected for its strong handling of tabular sensor
          features, robustness to outliers, and efficiency on medium-scale datasets. Hyperparameter
          tuning via randomised search pushed accuracy past the 85% threshold.
        </p>
      </Section>

      <Section title="Dataset & Activities">
        <p>
          Sensor readings (three-axis accelerometer and three-axis gyroscope) were collected
          from two placements: a <strong className="text-foreground font-medium">smartphone</strong> and
          a <strong className="text-foreground font-medium">smartwatch</strong>. The dataset
          covers 19 labelled activity classes:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
          {[
            'Walking (A)', 'Jogging (B)', 'Stairs (C)',
            'Sitting (D)', 'Standing (E)', 'Typing (F)',
            'Brushing Teeth (G)', 'Eating Soup (H)', 'Eating Chips (I)',
            'Eating Pasta (J)', 'Drinking (K)', 'Eating Sandwich (L)',
            'Kicking (M)', 'Catch (O)', 'Dribbling (P)',
            'Writing (Q)', 'Clapping (R)', 'Folding (S)',
          ].map(a => (
            <span key={a} className="px-2.5 py-1.5 bg-muted rounded-lg text-xs text-foreground text-center">
              {a}
            </span>
          ))}
        </div>
      </Section>

      <Section title="Methodology">
        <InfoGrid>
          <InfoCard title="Feature Engineering">
            Statistical and frequency-domain features were extracted from raw 6-axis IMU windows
            (mean, variance, energy, correlation between axes) for both sensor placements.
          </InfoCard>
          <InfoCard title="Model">
            XGBoost gradient-boosted trees were trained on the engineered feature vectors.
            Separate models were evaluated for phone and watch placements.
          </InfoCard>
          <InfoCard title="Hyperparameter Tuning">
            Randomised search over key XGBoost parameters (n_estimators, max_depth,
            learning_rate, subsample, colsample_bytree, gamma) to maximise validation accuracy.
          </InfoCard>
          <InfoCard title="Evaluation">
            Per-class precision, recall, and F1-score reported alongside the confusion matrix.
            Overall accuracy computed on a held-out test set.
          </InfoCard>
        </InfoGrid>
      </Section>

      <Section title="Best Hyperparameters">
        <ResultTable rows={hyperparams} />
      </Section>

      <Section title="Per-class Performance (Phone)">
        <p className="mb-3">
          Stationary activities (sitting, writing) were classified near-perfectly.
          High-motion activities with similar kinematics (stairs vs. walking, kicking vs. dribbling)
          remained the hardest to separate.
        </p>
        <ResultTable rows={phonePerClass} />
      </Section>

      <Section title="Key Findings">
        <FindingsList items={[
          'Overall accuracy reached 85.59% after hyperparameter tuning, up noticeably from baseline defaults.',
          'Sitting (D) and Writing (Q) achieved ~96% F1, confirming that highly distinctive postures are easy to identify.',
          'Jogging (B) was frequently confused with Walking (A); the two share similar limb kinematics and are hard to separate without gait-specific features.',
          'Stairs (C) showed lower performance due to its overlap with walking in stride pattern and acceleration profile.',
          'Smartwatch and smartphone placements yielded different confusion profiles, suggesting sensor fusion could push accuracy further.',
          'On the watch, "Teeth (G)" and "Soup (H)" were often confused with Standing (E). Wrist movements alone are too ambiguous for fine-grained eating activities.',
        ]} />
      </Section>

      <Reflection>
        <p>
          If I were to redo this project, I'd fuse the phone and watch features into a single model from the start instead of evaluating them separately. The confusion patterns were clearly complementary: watch data struggled with eating activities while phone data handled them better, and vice versa for some motion classes. I left that on the table.
        </p>
        <p>
          I'd also skip the manual feature engineering and go straight to a CNN-LSTM on raw windowed signals. XGBoost was a solid baseline, but the temporal structure in IMU data is exactly what sequence models are built for. The 85.6% accuracy is respectable, but I think a well-tuned deep model could push past 90% without much more data.
        </p>
        <p>
          Finally, I didn't think enough about deployment. An activity recognition model that can't run on a phone in real time is an academic exercise. I'd benchmark inference latency on actual mobile hardware next time.
        </p>
      </Reflection>

      <Section title="Limitations & Future Work">
        <FindingsList items={[
          'A single sensor modality per model limits robustness; fusing phone + watch features simultaneously is a natural next step.',
          'Larger, more diverse participant pools would improve generalisability across body types and movement styles.',
          'Deep learning approaches (LSTM, CNN-LSTM) could automatically learn temporal patterns without manual feature engineering.',
          'Real-time inference on-device was not evaluated. Latency and memory constraints of XGBoost on embedded hardware still need investigation.',
        ]} />
      </Section>

    </CaseStudyLayout>
  )
}
