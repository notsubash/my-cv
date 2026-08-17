import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Calendar, Tag } from 'lucide-react'
import BlogNav from './BlogNav'
import BlogToc from './BlogToc'
import CodeBlock from './CodeBlock'
import { useBlogSeo, useReadingTime } from './useBlogSeo'

function DiagramBox({
  x, y, w, h, label, sublabel, accent, dashed,
}: {
  x: number; y: number; w: number; h: number
  label: string; sublabel?: string; accent?: boolean; dashed?: boolean
}) {
  return (
    <g>
      <rect
        x={x} y={y} width={w} height={h} rx={8}
        className={accent ? 'fill-[hsl(var(--accent)/0.15)] stroke-[hsl(var(--accent)/0.6)]' : 'fill-[hsl(var(--card))] stroke-[hsl(var(--border))]'}
        strokeWidth={1.5}
        strokeDasharray={dashed ? '5 4' : undefined}
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

function DiagramArrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.sqrt(dx * dx + dy * dy) || 1
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

function ArchFrame({
  children, viewBox, label, caption,
}: {
  children: ReactNode
  viewBox: string
  label: string
  caption: string
}) {
  return (
    <figure className="my-8">
      <div className="rounded-2xl border border-border/80 bg-gradient-to-b from-card via-card/90 to-muted/40 p-3 sm:p-5">
        <svg viewBox={viewBox} className="w-full" role="img" aria-label={label}>
          {children}
        </svg>
      </div>
      <figcaption className="text-center text-xs text-muted-foreground mt-2.5 px-2">{caption}</figcaption>
    </figure>
  )
}

function ApplicationArchitecture() {
  return (
    <ArchFrame
      viewBox="0 0 640 396"
      label="Application architecture: client to FastAPI, readiness checks to Postgres and Redis, summarize to stub or DeepSeek, metrics and logs to Grafana"
      caption="Solid boxes are running today. Dashed boxes are still on the plan."
    >
      <text x={16} y={16} className="fill-[hsl(var(--muted-foreground))] text-[9px] font-semibold uppercase tracking-[0.14em]">
        request
      </text>
      <DiagramBox x={16} y={24} w={150} h={50} label="Client" sublabel="port-forward" />
      <DiagramArrow x1={166} y1={49} x2={196} y2={49} />
      <DiagramBox x={196} y={24} w={248} h={50} label="FastAPI" sublabel="request_id · RED middleware" accent />

      <text x={16} y={96} className="fill-[hsl(var(--muted-foreground))] text-[9px] font-semibold uppercase tracking-[0.14em]">
        routes
      </text>
      <DiagramArrow x1={320} y1={74} x2={320} y2={100} />
      <DiagramBox x={16} y={106} w={108} h={48} label="/health" sublabel="liveness" />
      <DiagramBox x={136} y={106} w={108} h={48} label="/ready" sublabel="readiness" accent />
      <DiagramBox x={256} y={106} w={108} h={48} label="/metrics" sublabel="RED" />
      <DiagramBox x={376} y={106} w={136} h={48} label="/v1/summarize" sublabel="POST" accent />
      <DiagramBox x={524} y={106} w={100} h={48} label="/debug/boom" sublabel="lab 500" />

      <DiagramArrow x1={190} y1={154} x2={130} y2={176} />
      <DiagramArrow x1={190} y1={154} x2={250} y2={176} />
      <DiagramBox x={70} y={176} w={120} h={46} label="Postgres" sublabel="Bitnami" />
      <DiagramBox x={206} y={176} w={120} h={46} label="Redis" sublabel="Bitnami" />
      <DiagramArrow x1={444} y1={154} x2={500} y2={176} />
      <DiagramBox x={400} y={176} w={224} h={46} label="summarize()" sublabel="stub or DeepSeek" />

      <text x={16} y={246} className="fill-[hsl(var(--muted-foreground))] text-[9px] font-semibold uppercase tracking-[0.14em]">
        signals
      </text>
      <line x1={310} y1={154} x2={370} y2={154} className="stroke-[hsl(var(--primary)/0.5)]" strokeWidth={1.5} />
      <line x1={370} y1={154} x2={370} y2={240} className="stroke-[hsl(var(--primary)/0.5)]" strokeWidth={1.5} />
      <line x1={370} y1={240} x2={86} y2={240} className="stroke-[hsl(var(--primary)/0.5)]" strokeWidth={1.5} />
      <DiagramArrow x1={86} y1={240} x2={86} y2={256} />
      <DiagramBox x={16} y={256} w={140} h={46} label="Prometheus" sublabel="scrape /metrics" />
      <DiagramArrow x1={156} y1={279} x2={180} y2={279} />
      <DiagramBox x={180} y={256} w={140} h={46} label="Grafana" sublabel="RED + Explore" accent />
      <DiagramBox x={336} y={256} w={132} h={46} label="Loki" sublabel="Promtail logs" />
      <DiagramArrow x1={336} y1={279} x2={320} y2={279} />
      <DiagramBox x={484} y={256} w={140} h={46} label="Alertmanager" sublabel="5xx ratio" />
      <DiagramArrow x1={86} y1={302} x2={86} y2={310} />
      <line x1={86} y1={310} x2={554} y2={310} className="stroke-[hsl(var(--primary)/0.35)]" strokeWidth={1.2} />
      <DiagramArrow x1={554} y1={310} x2={554} y2={302} />

      <text x={16} y={330} className="fill-[hsl(var(--muted-foreground))] text-[9px] font-semibold uppercase tracking-[0.14em]">
        still on the plan
      </text>
      <DiagramBox x={16} y={338} w={112} h={44} label="Ingress" sublabel="TLS" dashed />
      <DiagramBox x={140} y={338} w={112} h={44} label="HPA / KEDA" sublabel="cap replicas" dashed />
      <DiagramBox x={264} y={338} w={112} h={44} label="Canary" sublabel="Rollouts" dashed />
      <DiagramBox x={388} y={338} w={112} h={44} label="pg_dump" sublabel="restore drill" dashed />
      <DiagramBox x={512} y={338} w={112} h={44} label="Worker" sublabel="queue later" dashed />
    </ArchFrame>
  )
}

function GitOpsDiagram() {
  return (
    <ArchFrame
      viewBox="0 0 640 175"
      label="GitOps path from GitHub through GHCR and Argo CD to the cluster"
      caption="CI publishes an immutable image. Argo deploys the chart Git describes."
    >
      <DiagramBox x={10} y={20} w={110} h={50} label="GitHub" sublabel="push to main" />
      <DiagramArrow x1={120} y1={45} x2={150} y2={45} />
      <DiagramBox x={150} y={20} w={120} h={50} label="Actions" sublabel="test · build · helm" />
      <DiagramArrow x1={270} y1={45} x2={300} y2={45} />
      <DiagramBox x={300} y={20} w={120} h={50} label="GHCR" sublabel="sha-<short>" accent />
      <DiagramArrow x1={360} y1={70} x2={360} y2={88} />
      <DiagramBox x={285} y={90} w={150} h={50} label="Argo CD" sublabel="Helm render + Sync" accent />
      <DiagramArrow x1={435} y1={115} x2={470} y2={115} />
      <DiagramBox x={470} y={90} w={155} h={50} label="k3s" sublabel="ai-platform" />
      <text x={320} y={162} textAnchor="middle" className="fill-[hsl(var(--muted-foreground))] text-[8px]">
        Application watches helm/api on the same repo
      </text>
    </ArchFrame>
  )
}

function Shot({
  src, alt, caption,
}: {
  src: string; alt: string; caption: string
}) {
  return (
    <figure className="my-6">
      <img
        src={src}
        alt={alt}
        className="w-full rounded-xl border border-border bg-card"
        loading="lazy"
      />
      <figcaption className="text-center text-xs text-muted-foreground mt-2">{caption}</figcaption>
    </figure>
  )
}

export default function BlogCloudNativeAiPlatform() {
  useBlogSeo({
    title: 'Building a Cloud Native AI Platform Under $15 a Month',
    description:
      'A $15/month hobby lab around a thin FastAPI summarizer: Terraform and k3s on Hetzner, Helm, GHCR, Argo CD, and Prometheus/Grafana/Loki. Autoscaling, secrets, TLS, canary, and disaster recovery are next.',
    keywords:
      'cloud native ai platform kubernetes, hobby k3s gitops argo cd, terraform hetzner kubernetes lab, fastapi kubernetes probes helm, github actions ghcr gitops, prometheus grafana loki hobby cluster, kubernetes readiness vs liveness, servicemonitor prometheus operator',
    ogImage: '/og-blog-cloud-native-ai-platform.webp',
    datePublished: '2026-08-17',
    slug: 'building-a-cloud-native-ai-platform',
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
            <span className="inline-flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> August 2026</span>
            <span className="text-border">·</span>
            <span ref={readingTimeRef}>14 min read</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4 leading-tight">
            Building a Cloud Native AI Platform Under $15 a Month
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed mb-5">
            I wanted Kubernetes, GitOps, and observability practice with a bill I could keep.
            The app is a thin FastAPI summarizer. The core loop is running on one Hetzner box.
            Autoscaling, secrets, TLS, canary, and disaster recovery are what I am finishing next.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {['Kubernetes', 'Helm', 'Terraform', 'Argo CD', 'FastAPI', 'Prometheus'].map(tag => (
              <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-muted text-muted-foreground">
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground mb-6">
          Source:{' '}
          <a href="https://github.com/notsubash/cloud-native-AI-platform" className="text-primary hover:underline">
            github.com/notsubash/cloud-native-AI-platform
          </a>
          . A $15/month learning lab, not a product.
        </div>

        <hr className="border-border mb-10" />

        <div className="prose-custom space-y-8 text-sm text-muted-foreground leading-relaxed">
          <section>
            <h2 id="why-small" className="font-display text-lg font-semibold text-foreground mb-3">Why the API is small</h2>
            <p>
              This is a platform-engineering lab, not a chatbot launch. I wanted Terraform,
              Kubernetes, GitOps, CI, and observability I could operate myself. The AI stays
              small on purpose so the infra stays the focus.
            </p>
            <p className="mt-3">
              Cap came first: $15 USD. I destroy the box when I am not using it. Managed Kubernetes
              and a GPU node are fine if someone else is paying. I wanted a lab I would still have
              in three months.
            </p>
            <p className="mt-3">
              What shipped is a FastAPI gateway with the probe and metrics hooks Kubernetes
              needs, plus <strong className="text-foreground">POST /v1/summarize</strong>.
              One function, <strong className="text-foreground">summarize()</strong>, sits behind that
              POST. Tests and CI use a stub that keeps the first sentence. Real calls go to DeepSeek
              over an OpenAI-compatible HTTP client when I flip the mode. Routes stay stable if the
              backend changes. A worker, a scheduler, and Qdrant can wait. They are not in the
              repo yet.
            </p>
            <p className="mt-3">
              Kubernetes does not care how clever the prompt is. It cares whether the process is up,
              and whether Postgres and Redis are reachable. Those are different questions.{' '}
              <strong className="text-foreground">/health</strong> stays cheap and returns 200 while
              the process is alive. <strong className="text-foreground">/ready</strong> dials both
              stores and returns 503 if either is missing. Liveness restarts a wedged process.
              Readiness keeps traffic off a pod that is running but useless.
            </p>
            <ApplicationArchitecture />
          </section>

          <section>
            <h2 id="local-first" className="font-display text-lg font-semibold text-foreground mb-3">Local first</h2>
            <p>
              The laptop version cost $0. Compose first: API on 8000, Postgres, Redis, a Makefile
              for up / test / down. Env-based config, no secrets in the image. Pytest stubs the
              LLM with FastAPI dependency overrides, so CI never needs a DeepSeek key. The image is
              multi-stage: builder venv, slim runtime, non-root uid 10001. Smaller pull, less to
              attack, same Python 3.12 as CI.
            </p>
            <p className="mt-3">
              Then I mapped Compose onto Kubernetes by hand under the ai-platform namespace.
              Services become Deployments plus Services. Env files become a ConfigMap and a Secret.
              depends_on becomes readiness probes. I wanted to see those objects before wrapping
              them in a chart I did not understand yet.
            </p>
            <p className="mt-3">
              In-cluster DNS is not localhost. The API pod's localhost is itself. Database and Redis
              URLs have to use the Service name. I knew that and still typed localhost once. Ready
              failed while the pods looked fine.
            </p>
            <p className="mt-3">
              Image pull is the other trap. Pull policy Never plus Docker Desktop's kind cluster
              means the image exists on your machine and not on the node. The standalone kind CLI
              was empty. I switched the local cluster to Docker Desktop kubeadm so a local build
              tagged cloud-native-ai-api:local is visible without an import step. The tag has to
              match the manifest exactly. Compose uses a different image name, so that build does
              not help the Deployment.
            </p>
            <p className="mt-3">
              Do not run Compose and the local cluster at the same time. I did. Port 8000 will lie
              to you. After code changes: rebuild the image, rollout restart the API deploy, then
              port-forward the Service.
            </p>
          </section>

          <section>
            <h2 id="helm" className="font-display text-lg font-semibold text-foreground mb-3">Helm, then stop owning Postgres</h2>
            <p>
              Raw manifests taught the objects. Helm is what I operate. I own the API chart and
              consume Bitnami for Postgres and Redis. Rewriting a Postgres chart teaches little
              and burns a week.
            </p>
            <p className="mt-3">
              Local values are the laptop knob file: never-pull, stub LLM, tiny resources, Bitnami
              Service DNS. Cloud overrides live in a separate hobby values file. Service names
              change when you switch charts. Bitnami release postgres becomes{' '}
              <strong className="text-foreground">postgres-postgresql</strong>. Redis standalone
              becomes <strong className="text-foreground">redis-master</strong>. Wrong host, same
              symptom as localhost: pods look healthy, ready is 503.
            </p>
            <p className="mt-3">
              I proved upgrade and rollback. Bumping the image tag moved the pod. Rollback
              restored the previous tag and wrote a new history revision. Rollback is a new
              revision, not a rewind of the list. Rendering the chart before install caught a path
              typo (help instead of helm). That is a better failure than a CrashLoop.
            </p>
            <p className="mt-3">
              Do not run the raw Kustomize manifests next to Helm in the same namespace. Two
              Deployments fight for the same mental model. Pick one path. Locally that path is
              Bitnami plus the API chart. On the VPS it is Argo plus hobby values. Postgres and
              Redis on the hobby cluster are still installed with Helm from the laptop. Only the
              API is GitOps'd. That gap is on the list.
            </p>
          </section>

          <section>
            <h2 id="ci" className="font-display text-lg font-semibold text-foreground mb-3">CI publishes images, GitOps deploys</h2>
            <p>
              The workflow splits on purpose. Tests fail cheap on compile and pytest before Buildx
              spends time. The image job waits on green tests, then builds with layer cache in
              GitHub Actions. Helm lint and template run in parallel as an offline chart check, no
              cluster. Pull requests still build the Dockerfile without pushing, so a broken image
              fails before merge. Unmerged code never becomes latest. The registry is a merge gate,
              not a PR artifact dump.
            </p>
            <GitOpsDiagram />
            <p>
              Every build gets an immutable sha tag. latest exists only on default-branch pushes.
              Cloud deploys pin the SHA. Same-account GHCR push is the default GitHub token plus
              packages:write on the build job. No PAT for publish. A PAT with read:packages is a
              different secret, used later so the cluster can pull.
            </p>
            <p className="mt-3">
              CI stops at the registry. Actions never run kubectl against the VPS. The hobby
              values file points at GHCR, IfNotPresent, and a docker-registry pull secret. Argo
              applies that.
            </p>
            <CodeBlock
              lang="yaml"
              code={`image:
  repository: ghcr.io/notsubash/cloud-native-ai-api
  tag: sha-701186a
  pullPolicy: IfNotPresent

imagePullSecrets:
  - name: ghcr-pull`}
            />
          </section>

          <section>
            <h2 id="hetzner" className="font-display text-lg font-semibold text-foreground mb-3">One Hetzner box</h2>
            <p>
              Terraform lives under infrastructure/terraform with reusable server, firewall, and
              DNS modules and a thin hobby environment root. I wrote the modules first and delayed
              apply until I needed the box. Scaffolding is free. Billing starts when the CX23 exists.
            </p>
            <p className="mt-3">
              Child modules need their own provider source. Root required_providers is not enough.
              Without it, Terraform looks for hashicorp/hcloud and init fails even after the right
              plugins are installed. HCL will also tell you "missing argument" when you typed a
              hyphen instead of an equals. The error is not a syntax tip.
            </p>
            <Shot
              src="/blog/cloud-native-ai-platform/server-running.webp"
              alt="Hetzner Cloud overview for the cnai-hobby CX23 VPS, showing 2 vCPU, 4 GB RAM, and $6.49 per month"
              caption="cnai-hobby: 2 vCPU, 4 GB, 40 GB disk, about $6.49/month in Nuremberg. Power-off still charges. terraform destroy is the off switch."
            />
            <p>
              Cloud-init installs k3s. The firewall allows SSH and kubectl only from my home IP.
              Cloudflare stayed out of the apply path. An empty Cloudflare provider still wants a
              token and can pull a breaking provider major. No public DNS yet, so no Cloudflare in
              the graph.
            </p>
            <p className="mt-3">
              Kubeconfig was a small comedy. Copy it from the laptop with scp, then replace
              127.0.0.1 with the public IP. Running scp while already SSH'd into the VPS targets
              the server itself and fails. I wrote a fetch script so I would stop repeating that.
              Café Wi-Fi looks like an SSH hang. It is the firewall. Update the admin CIDRs, apply,
              then debug k3s.
            </p>
          </section>

          <section>
            <h2 id="gitops" className="font-display text-lg font-semibold text-foreground mb-3">Argo CD watches Git</h2>
            <p>
              Desired state for the API is an Argo Application pointing at helm/api with hobby
              values, destination namespace ai-platform. I do not helm upgrade the cloud API from
              the laptop. k3s already ships Traefik. I am not using it yet. Everything still comes
              in through kubectl port-forward from the hobby kubeconfig.
            </p>
            <Shot
              src="/blog/cloud-native-ai-platform/argo.webp"
              alt="Argo CD Applications view for the api Application, showing Synced status and the Helm resource tree"
              caption="Argo CD after a sync: helm/api in ai-platform. Synced, with a rollout still progressing."
            />
            <p>
              Install Argo with server-side apply. Client-side apply blows the last-applied
              annotation size limit on large CRDs. GitOps only sees GitHub. A local branch and an
              uncommitted values file produce "unable to resolve revision" or a missing file.
              Commit, push, then Sync.
            </p>
            <p className="mt-3">
              I kept sync manual. Applying the Application CR registers desired state. Pods appear
              after Sync. Automate prune and selfHeal later, once the loop is boring.
            </p>
            <p className="mt-3">
              The pull secret's password has to be a GitHub PAT with read:packages. I once used an
              image tag as the password. Argo said Healthy. The pod sat in ImagePullBackOff. Those
              two statuses can both be true.
            </p>
          </section>

          <section>
            <h2 id="observability" className="font-display text-lg font-semibold text-foreground mb-3">Observability that fits on 4 GB</h2>
            <p>
              This is the ops feedback loop, and I spent the most time here. The stack is
              kube-prometheus-stack, Loki, Promtail. Single replicas, 3-day retention, 30-second
              scrape. Tempo can wait. If the node OOMs, monitoring loses, not the API.
            </p>
            <p className="mt-3">
              Install order matters. I pointed Argo at a ServiceMonitor before the Prometheus
              Operator CRDs existed. SyncFailed: could not find monitoring.coreos.com/ServiceMonitor.
              Consumer before provider. Helm install the monitoring stack, then Sync the API.
            </p>
            <Shot
              src="/blog/cloud-native-ai-platform/grafana.webp"
              alt="Grafana Explore with Prometheus queries for up, summarize_requests_total, http_requests_total, and p95 latency"
              caption="Grafana Explore against Prometheus: up in ai-platform, request counters, and p95 on /v1/summarize."
            />
            <Shot
              src="/blog/cloud-native-ai-platform/prometheus.webp"
              alt="Prometheus targets page showing scrape jobs including the API ServiceMonitor"
              caption="Prometheus targets. The API ServiceMonitor has to show UP before Grafana has anything real to plot."
            />
            <p>
              Middleware records RED for every request except /metrics itself: count, latency
              histogram, status. Every log line carries a <strong className="text-foreground">request_id</strong>,
              taken from the inbound header or generated. That id is the join key between Grafana
              and Loki. The useful walk is: force a 500, watch the error rate, grep the id in Loki.
            </p>
          </section>

          <section>
            <h2 id="drill" className="font-display text-lg font-semibold text-foreground mb-3">The drill: force a 500 and follow it</h2>
            <p>
              <strong className="text-foreground">/debug/boom</strong> returns 500 on purpose. I
              would not ship that. For a lab it is the fastest way to practice the path you walk
              when something is broken.
            </p>
            <CodeBlock
              lang="bash"
              code={`kubectl -n ai-platform port-forward svc/api 8000:8000

curl -si -H "X-Request-ID: boom-demo" \\
  http://127.0.0.1:8000/debug/boom`}
            />
            <p>
              Then Grafana for the error rate, Loki for that request id, and after a couple of
              minutes of sustained 5xx, ApiHighErrorRate goes pending, then fires. The PromQL
              window is a 5-minute rate. The alert waits until that ratio stays above 5% for two
              minutes. The annotation tells you to check Grafana and Loki for the id.
            </p>
            <Shot
              src="/blog/cloud-native-ai-platform/loki-logs.webp"
              alt="Grafana Loki Explore showing API logs filtered by request_id in the ai-platform namespace"
              caption={'Loki: {namespace="ai-platform"} |= "request_id=". Health checks and the drill share the same stream.'}
            />
            <Shot
              src="/blog/cloud-native-ai-platform/prometheus-alerts.webp"
              alt="Prometheus Alerts page showing ApiHighErrorRate pending at about 33 percent 5xx"
              caption="ApiHighErrorRate pending. The ratio here is about 33% 5xx after hammering /debug/boom. The 2-minute for window has not elapsed yet."
            />
            <Shot
              src="/blog/cloud-native-ai-platform/alertmanager.webp"
              alt="Alertmanager UI showing the ApiHighErrorRate alert after it started firing"
              caption="Alertmanager receiving the firing. The lab receiver is enough. The point is the path, not a PagerDuty integration."
            />
            <p>
              Git having the middleware is not enough. The running GHCR tag has to include that
              commit. Symptoms of an old image: boom is 404, and /metrics only shows
              summarize_requests_total with no http_requests_total. Pin a newer SHA, Sync, restart
              if needed.
            </p>
            <p className="mt-3">
              Loki with no Promtail stores nothing useful. A wrong Promtail client URL looks like
              "Grafana Explore is empty" until you check the monitoring Services and match the
              push endpoint.
            </p>
          </section>

          <section>
            <h2 id="cost" className="font-display text-lg font-semibold text-foreground mb-3">Power off is not the off switch</h2>
            <p>
              The VPS is the only recurring bill. GHCR, GitHub Actions free tier, Argo, and k3s are
              $0. Powering off overnight is convenient and still bills the reserved server. If I am
              pausing more than a few days, I destroy. Git and GHCR are source of truth. Nothing
              unique should live only on the box.
            </p>
            <p className="mt-3">
              After destroy, the Hetzner console has to show no cnai-hobby. I have left a server I
              thought I deleted. The console is the check, not terraform exiting 0 while you are in
              the wrong directory. Secrets stay out of git: the Hetzner token, tfvars, state, the
              GHCR PAT.
            </p>
          </section>

          <section>
            <h2 id="next" className="font-display text-lg font-semibold text-foreground mb-3">What I am finishing next</h2>
            <p>
              The thin API, Terraform, local Kubernetes, Helm, GHCR, the hobby VPS, Argo, and
              monitoring are in place. What is left is the unglamorous half: a public URL,
              encrypted secrets, a restore you have actually run.
            </p>
            <div className="rounded-xl border border-accent/30 bg-accent/5 p-5 space-y-3 mt-4">
              <p>
                <strong className="text-foreground">Secrets.</strong> Hobby values still have
                plaintext DB passwords. Fine for a lab I destroy. Next is SOPS or Sealed Secrets,
                then a rotate-and-sync runbook. Vault is too heavy on 4 GB.
              </p>
              <p>
                <strong className="text-foreground">Ingress and TLS.</strong> Everything is
                port-forward today. k3s already has Traefik. Next is a real URL: Cloudflare DNS,
                cert-manager, HTTPS, a simple NetworkPolicy. That is also when Cloudflare re-enters
                Terraform.
              </p>
              <p>
                <strong className="text-foreground">Autoscaling.</strong> Metrics Server, HPA on
                the API, and KEDA on a worker once a queue exists. Replica caps stay tiny so a bad
                scaler cannot melt the node. Single-node HPA teaches the mechanism, not spare
                capacity.
              </p>
              <p>
                <strong className="text-foreground">Canary.</strong> Argo Rollouts: ship a bad tag,
                abort, land back on stable. True blue/green wants double capacity I do not have.
                Canary with a low extra replica is the honest version on this box.
              </p>
              <p>
                <strong className="text-foreground">Backup and restore.</strong> Most tutorials
                skip this. pg_dump on a CronJob, off-box if I can keep it free, then delete the
                database on purpose and restore. A backup you have never restored is a file.
              </p>
              <p>
                <strong className="text-foreground">Two environments, one cluster.</strong>
                Namespaces and value files, not a second VPS. Promote an image tag on purpose.
                Feature branch to dev, main to whatever I treat as prod on this node.
              </p>
              <p>
                <strong className="text-foreground">Hardening and GitOps the rest.</strong> Probes,
                resource requests, and a non-root image already exist. Still missing: NetworkPolicies,
                Trivy in CI, PodDisruptionBudgets as a concept even on one node. Postgres, Redis, and
                monitoring should move off laptop Helm and into Argo. The worker gets built when
                there is something worth queuing.
              </p>
            </div>
          </section>

          <section>
            <h2 id="conclusion" className="font-display text-lg font-semibold text-foreground mb-3">Wrapping up</h2>
            <p>
              The summarizer is the excuse. What I wanted was a repo I can destroy and rebuild,
              with a bill I actually keep. That loop is real now.
            </p>
            <p className="mt-3">
              If you are trying to learn this stack, cap the bill first. Otherwise you will still
              be paying for a node you forgot you left running.
            </p>
          </section>
        </div>

        <BlogNav />
      </article>
    </main>
  )
}
