import { Link } from 'react-router-dom'
import { translations } from './i18n'
import { usePageSeo } from './hooks/usePageSeo'
import posthog from './posthog'
import { BLOG_ENABLED } from './config'
import { CvDownload, SiteFooter } from './site/SiteChrome'
import './site/cv.css'

// Source of truth: CV_November_2026 (public/) and src/i18n.ts. Nothing here is new information.
const ROLES = [
  {
    role: 'AI/ML Engineer (remote)', org: 'Scopic Software', period: 'Oct 2024 – now',
    points: [
      'Benchmarked a replacement routing classifier against GPT-4o-mini on the team’s golden set: 88% vs 80% handler accuracy, 86% vs 77% intent accuracy, about 6× cheaper, p95 under 0.6 s against 2–3 s.',
      'Lead development and deployment of a GenAI sales chatbot integrated with Zoho CRM: LangGraph, RAG and Qdrant for lead qualification, intent detection, user-info extraction, lead scoring and SEO tracking. It processes 5+ warm leads a month.',
      'Build evaluation pipelines for chatbot and RAG performance; continuous grounding improvements raised response accuracy by 20% while lowering latency and cost.',
      'Develop and maintain an AI receptionist platform across multiple deployments, including its voice-agent layer, and resolve production issues to keep conversations reliable.',
      'Maintain and expand the AI service layer of an interviewer platform: question generation, grading logic, prompt engineering and end-to-end GenAI integration.',
      'R&D on audio feature extraction (pitch, pause, pace) with Parselmouth, Librosa and Praat; scope AI projects into phases with man-hour estimates for internal and client work.',
      'Full-stack work on a keyword-research SEO SaaS: backend services, schemas and migrations, subscription billing, authentication and AI keyword analysis.',
    ],
    stack: 'Python, LangGraph, LangFuse, TypeScript, Node.js, FastAPI, Docker, AWS (Lambda, Fargate, OpenSearch), GCP Cloud Run, Serverless, Redis, MySQL, CI/CD',
  },
  {
    role: 'AI/ML Engineer', org: 'Peace Nepal Dot Com', period: 'Jul – Nov 2024',
    points: [
      'Designed and built chatbots for banking, travel and customer support, using RAG and a multi-agent framework for grounded, relevant answers.',
      'Fine-tuned LLMs for domain accuracy across 5 use cases; integrated databases and external knowledge sources.',
      'Ran chatbot projects end to end, from requirements through testing, optimisation and production deployment.',
    ],
  },
  {
    role: 'AI/ML Engineer', org: 'Icebrkr AI Solutions', period: 'Mar – Jun 2024',
    points: [
      'Built and deployed scalable ML models for data analysis and automation in cloud environments, with HuggingFace, PyTorch and AWS.',
    ],
  },
  {
    role: 'Data Analyst', org: 'Contentio Lab', period: 'Aug 2021 – Apr 2022',
    points: [
      'Python data pipelines that cut processing time by 20%; dashboards, customer segmentation and churn analysis for marketing and sales.',
    ],
  },
  {
    role: 'Frontend Intern', org: 'iMark', period: 'Oct 2020 – Jan 2021',
    points: ['A React to-do application with a CRUD backend and authentication.'],
  },
]

const EDUCATION = [
  { title: 'MSc Data Science, Merit', org: 'University of Exeter', period: '2022 – 2023', note: 'Machine learning, statistical modelling, social network analysis. Thesis: machine learning the Steam video game database.' },
  { title: 'BSc (Hons) Computing, 2:1', org: 'London Metropolitan University', period: '2019 – 2021', note: 'Software engineering, databases, networking, cloud computing.' },
]

const SKILLS = [
  { group: 'LLM and AI', items: 'LangGraph, LangChain, RAG, vector databases, LLM fine-tuning, prompt engineering, GenAI evaluation, LLMOps, Ollama' },
  { group: 'Machine learning', items: 'PyTorch, scikit-learn, XGBoost, pandas, NumPy, MLflow, ONNX, graph networks' },
  { group: 'Engineering', items: 'Python, TypeScript, FastAPI, Node.js, Hono, Git, Stripe' },
  { group: 'Cloud and ops', items: 'AWS, GCP, Docker, Kubernetes, Helm, Argo CD, Terraform, Prometheus, Grafana, Loki, Serverless' },
  { group: 'Data', items: 'SQL, PostgreSQL, MySQL, Redis, SQLite, Qdrant, OpenSearch' },
]

export default function CvPage() {
  const t = translations.en

  usePageSeo({
    title: 'Experience & CV | Subash Pandey, AI/ML Engineer',
    description: 'Full record: AI/ML engineering roles, production GenAI results, talks, education, certifications and stack.',
    path: '/cv',
  })

  return (
    <main id="main-content" className="site cv">
      <div className="site-col">
        <header className="site-intro">
          <h1>Experience &amp; CV</h1>
          <p>AI/ML engineer shipping LLM systems since 2024. Everything behind the homepage, in one place.</p>
          <p className="cv-actions"><CvDownload placement="cv" className="btn btn--primary">Download CV (PDF)</CvDownload></p>
        </header>

        <section aria-labelledby="cv-exp" className="cv-section">
          <div className="site-head"><h2 id="cv-exp">Experience</h2></div>
          <ol className="cv-list">
            {ROLES.map((r) => (
              <li key={r.org} className="cv-item">
                <p className="cv-period">{r.period}</p>
                <div>
                  <h3>{r.role}<span className="cv-org">{r.org}</span></h3>
                  <ul className="cv-points">{r.points.map((p) => <li key={p}>{p}</li>)}</ul>
                  {r.stack && <p className="cv-stack">{r.stack}</p>}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="cv-talks" className="cv-section">
          <div className="site-head">
            <h2 id="cv-talks">Talks, posts and publications</h2>
            {BLOG_ENABLED && <Link to="/blog" className="link" onClick={() => posthog.capture('blog_catalog_clicked', { placement: 'cv' })}>All posts</Link>}
          </div>
          <ul className="cv-list">
            {t.linkedinPosts.embeds.map((post) => (
              <li key={post.url} className="cv-item">
                <p className="cv-period">{post.origin}</p>
                <div>
                  <p className="cv-quote">{post.hook}</p>
                  <a
                    className="link cv-small"
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => posthog.capture('outbound_link_clicked', { destination: 'linkedin', placement: 'linkedin_post', url: post.url, origin: post.origin })}
                  >
                    Read on LinkedIn · {post.reactions} reactions
                  </a>
                </div>
              </li>
            ))}
            {t.publications.items.map((pub) => (
              <li key={pub.title} className="cv-item">
                <p className="cv-period">{pub.year}</p>
                <div>
                  <h3>{pub.title}<span className="cv-org">{pub.org}</span></h3>
                  <p className="cv-note">{pub.desc}</p>
                  <p className="cv-links">
                    {pub.links.map((l) => (
                      <a key={l.url} className="link cv-small" href={l.url} target="_blank" rel="noopener noreferrer"
                        onClick={() => posthog.capture('publication_link_clicked', { link_type: l.icon, label: l.label })}>{l.label}</a>
                    ))}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="cv-edu" className="cv-section">
          <div className="site-head"><h2 id="cv-edu">Education</h2></div>
          <ol className="cv-list">
            {EDUCATION.map((e) => (
              <li key={e.title} className="cv-item">
                <p className="cv-period">{e.period}</p>
                <div>
                  <h3>{e.title}<span className="cv-org">{e.org}</span></h3>
                  <p className="cv-note">{e.note}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="cv-certs" className="cv-section">
          <div className="site-head"><h2 id="cv-certs">Courses and certificates</h2></div>
          <ul className="cv-list">
            {t.certifications.items.map((c) => (
              <li key={c.title} className="cv-item">
                <p className="cv-period">{c.year}</p>
                <div>
                  <h3>
                    <a className="link" href={c.url} target="_blank" rel="noopener noreferrer">{c.title}</a>
                    <span className="cv-org">{c.org} course</span>
                  </h3>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="cv-skills" className="cv-section">
          <div className="site-head"><h2 id="cv-skills">Skills</h2></div>
          <dl className="cv-skills">
            {SKILLS.map((s) => (
              <div key={s.group}>
                <dt>{s.group}</dt>
                <dd>{s.items}</dd>
              </div>
            ))}
            <div>
              <dt>Languages</dt>
              <dd>English (C1), Nepali (native), Hindi</dd>
            </div>
          </dl>
        </section>

      </div>
      <SiteFooter placement="cv" />
    </main>
  )
}
