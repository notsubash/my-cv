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
      <svg viewBox="0 0 640 170" className="w-full" role="img" aria-label="Genre network analysis pipeline">
        <DiagramBox x={10} y={10} w={90} h={50} label="Steam CSV" sublabel="27k games" />
        <DiagramArrow x1={100} y1={35} x2={130} y2={35} />
        <DiagramBox x={130} y={10} w={100} h={50} label="Explode" sublabel="Game × Genre" />
        <DiagramArrow x1={230} y1={35} x2={260} y2={35} />
        <DiagramBox x={260} y={10} w={110} h={50} label="Bipartite Graph" sublabel="Games ↔ Genres" accent />
        <DiagramArrow x1={370} y1={35} x2={400} y2={35} />
        <DiagramBox x={400} y={10} w={110} h={50} label="Project" sublabel="Genre × Genre" accent />
        <DiagramArrow x1={510} y1={35} x2={540} y2={35} />
        <DiagramBox x={540} y={10} w={90} h={50} label="Gephi" sublabel="Visualize" />

        <DiagramArrow x1={455} y1={60} x2={455} y2={80} />

        <DiagramBox x={260} y={100} w={110} h={50} label="Centrality" sublabel="Degree · Between." accent />
        <DiagramBox x={400} y={100} w={110} h={50} label="Communities" sublabel="Louvain" accent />
        <DiagramBox x={540} y={100} w={90} h={50} label="Regression" sublabel="Ridge · RF" />

        <DiagramArrow x1={400} y1={125} x2={370} y2={125} />
        <DiagramArrow x1={510} y1={125} x2={540} y2={125} />
      </svg>
      <figcaption className="text-center text-xs text-muted-foreground mt-2">Pipeline: raw CSV to bipartite graph to projected genre network, then three parallel analysis tracks</figcaption>
    </figure>
  )
}

function BipartiteProjectionDiagram() {
  return (
    <figure className="my-6">
      <svg viewBox="0 0 560 200" className="w-full" role="img" aria-label="Bipartite to unipartite projection">
        <text x={120} y={18} textAnchor="middle" className="fill-[hsl(var(--muted-foreground))] text-[10px] font-semibold uppercase tracking-wider">Bipartite</text>
        <text x={430} y={18} textAnchor="middle" className="fill-[hsl(var(--muted-foreground))] text-[10px] font-semibold uppercase tracking-wider">Projected</text>

        <line x1={255} y1={25} x2={255} y2={190} className="stroke-[hsl(var(--border))]" strokeWidth={1} strokeDasharray="4 4" />

        {/* Bipartite side - games (left) */}
        <rect x={20} y={40} width={70} height={28} rx={6} className="fill-[hsl(var(--card))] stroke-[hsl(var(--border))]" strokeWidth={1.5} />
        <text x={55} y={57} textAnchor="middle" className="fill-[hsl(var(--foreground))] text-[9px]">Skyrim</text>

        <rect x={20} y={80} width={70} height={28} rx={6} className="fill-[hsl(var(--card))] stroke-[hsl(var(--border))]" strokeWidth={1.5} />
        <text x={55} y={97} textAnchor="middle" className="fill-[hsl(var(--foreground))] text-[9px]">Stardew</text>

        <rect x={20} y={120} width={70} height={28} rx={6} className="fill-[hsl(var(--card))] stroke-[hsl(var(--border))]" strokeWidth={1.5} />
        <text x={55} y={137} textAnchor="middle" className="fill-[hsl(var(--foreground))] text-[9px]">DOTA 2</text>

        <rect x={20} y={160} width={70} height={28} rx={6} className="fill-[hsl(var(--card))] stroke-[hsl(var(--border))]" strokeWidth={1.5} />
        <text x={55} y={177} textAnchor="middle" className="fill-[hsl(var(--foreground))] text-[9px]">Limbo</text>

        {/* Bipartite side - genres (right of bipartite) */}
        <rect x={150} y={35} width={80} height={28} rx={6} className="fill-[hsl(var(--accent)/0.15)] stroke-[hsl(var(--accent)/0.6)]" strokeWidth={1.5} />
        <text x={190} y={52} textAnchor="middle" className="fill-[hsl(var(--foreground))] text-[9px]">Action</text>

        <rect x={150} y={75} width={80} height={28} rx={6} className="fill-[hsl(var(--accent)/0.15)] stroke-[hsl(var(--accent)/0.6)]" strokeWidth={1.5} />
        <text x={190} y={92} textAnchor="middle" className="fill-[hsl(var(--foreground))] text-[9px]">RPG</text>

        <rect x={150} y={115} width={80} height={28} rx={6} className="fill-[hsl(var(--accent)/0.15)] stroke-[hsl(var(--accent)/0.6)]" strokeWidth={1.5} />
        <text x={190} y={132} textAnchor="middle" className="fill-[hsl(var(--foreground))] text-[9px]">Indie</text>

        <rect x={150} y={155} width={80} height={28} rx={6} className="fill-[hsl(var(--accent)/0.15)] stroke-[hsl(var(--accent)/0.6)]" strokeWidth={1.5} />
        <text x={190} y={172} textAnchor="middle" className="fill-[hsl(var(--foreground))] text-[9px]">Free to Play</text>

        {/* Bipartite edges */}
        <line x1={90} y1={54} x2={150} y2={49} className="stroke-[hsl(var(--primary)/0.25)]" strokeWidth={1} />
        <line x1={90} y1={54} x2={150} y2={89} className="stroke-[hsl(var(--primary)/0.25)]" strokeWidth={1} />
        <line x1={90} y1={94} x2={150} y2={89} className="stroke-[hsl(var(--primary)/0.25)]" strokeWidth={1} />
        <line x1={90} y1={94} x2={150} y2={132} className="stroke-[hsl(var(--primary)/0.25)]" strokeWidth={1} />
        <line x1={90} y1={134} x2={150} y2={49} className="stroke-[hsl(var(--primary)/0.25)]" strokeWidth={1} />
        <line x1={90} y1={134} x2={150} y2={172} className="stroke-[hsl(var(--primary)/0.25)]" strokeWidth={1} />
        <line x1={90} y1={174} x2={150} y2={49} className="stroke-[hsl(var(--primary)/0.25)]" strokeWidth={1} />
        <line x1={90} y1={174} x2={150} y2={132} className="stroke-[hsl(var(--primary)/0.25)]" strokeWidth={1} />

        {/* Projected side - genre nodes */}
        <circle cx={350} cy={65} r={22} className="fill-[hsl(var(--accent)/0.15)] stroke-[hsl(var(--accent)/0.6)]" strokeWidth={1.5} />
        <text x={350} y={68} textAnchor="middle" className="fill-[hsl(var(--foreground))] text-[9px]">Action</text>

        <circle cx={510} cy={65} r={22} className="fill-[hsl(var(--accent)/0.15)] stroke-[hsl(var(--accent)/0.6)]" strokeWidth={1.5} />
        <text x={510} y={68} textAnchor="middle" className="fill-[hsl(var(--foreground))] text-[9px]">RPG</text>

        <circle cx={350} cy={155} r={22} className="fill-[hsl(var(--accent)/0.15)] stroke-[hsl(var(--accent)/0.6)]" strokeWidth={1.5} />
        <text x={350} y={158} textAnchor="middle" className="fill-[hsl(var(--foreground))] text-[9px]">Indie</text>

        <circle cx={510} cy={155} r={22} className="fill-[hsl(var(--accent)/0.15)] stroke-[hsl(var(--accent)/0.6)]" strokeWidth={1.5} />
        <text x={510} y={152} textAnchor="middle" className="fill-[hsl(var(--foreground))] text-[8px]">Free to</text>
        <text x={510} y={163} textAnchor="middle" className="fill-[hsl(var(--foreground))] text-[8px]">Play</text>

        {/* Projected edges with weights */}
        <line x1={372} y1={65} x2={488} y2={65} className="stroke-[hsl(var(--primary)/0.4)]" strokeWidth={2.5} />
        <line x1={350} y1={87} x2={350} y2={133} className="stroke-[hsl(var(--primary)/0.4)]" strokeWidth={3} />
        <line x1={372} y1={75} x2={488} y2={145} className="stroke-[hsl(var(--primary)/0.4)]" strokeWidth={1.5} />
        <line x1={510} y1={87} x2={510} y2={133} className="stroke-[hsl(var(--primary)/0.4)]" strokeWidth={1} />
        <line x1={372} y1={155} x2={488} y2={155} className="stroke-[hsl(var(--primary)/0.4)]" strokeWidth={2} />
        <line x1={372} y1={145} x2={488} y2={75} className="stroke-[hsl(var(--primary)/0.4)]" strokeWidth={2} />

        <text x={430} y={55} textAnchor="middle" className="fill-[hsl(var(--muted-foreground))] text-[8px]">w=1847</text>
        <text x={332} y={115} textAnchor="middle" className="fill-[hsl(var(--muted-foreground))] text-[8px]">w=3201</text>
      </svg>
      <figcaption className="text-center text-xs text-muted-foreground mt-2">Games sharing genres create weighted edges between those genres in the projected graph</figcaption>
    </figure>
  )
}

function GenreNetworkViz() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const clusters = [
    { label: 'Indie', x: 200, y: 100, r: 18, cluster: 0 },
    { label: 'Action', x: 170, y: 130, r: 16, cluster: 0 },
    { label: 'Casual', x: 340, y: 140, r: 16, cluster: 1 },
    { label: 'Adventure', x: 370, y: 115, r: 14, cluster: 1 },
    { label: 'Strategy', x: 120, y: 180, r: 14, cluster: 2 },
    { label: 'Simulation', x: 80, y: 155, r: 12, cluster: 2 },
    { label: 'RPG', x: 260, y: 60, r: 13, cluster: 3 },
    { label: 'Early Access', x: 300, y: 45, r: 11, cluster: 3 },
    { label: 'Free to Play', x: 440, y: 80, r: 12, cluster: 4 },
    { label: 'MMO', x: 470, y: 110, r: 10, cluster: 4 },
    { label: 'Sports', x: 450, y: 175, r: 10, cluster: 5 },
    { label: 'Racing', x: 490, y: 155, r: 9, cluster: 5 },
  ]

  const colors = [
    'hsl(var(--primary))',
    'hsl(var(--accent))',
    'hsl(210, 60%, 55%)',
    'hsl(150, 50%, 45%)',
    'hsl(30, 70%, 55%)',
    'hsl(340, 55%, 55%)',
  ]

  const edges: [number, number, number][] = [
    [0, 1, 3], [0, 2, 2.5], [0, 3, 2], [0, 4, 1.5], [0, 6, 1.5], [0, 7, 1],
    [1, 3, 1.5], [1, 6, 1.5], [1, 4, 1], [1, 8, 0.8],
    [2, 3, 2], [2, 5, 1], [2, 8, 1],
    [4, 5, 2], [6, 7, 1.5],
    [8, 9, 2], [10, 11, 1.5],
    [0, 8, 0.8], [1, 9, 0.5], [2, 10, 0.5],
  ]

  return (
    <figure className="my-6">
      <svg viewBox="0 0 560 220" className="w-full" role="img" aria-label="Genre network with community clusters">
        {edges.map(([a, b, w], i) => (
          <line key={i} x1={clusters[a].x} y1={clusters[a].y} x2={clusters[b].x} y2={clusters[b].y}
            className="stroke-[hsl(var(--primary)/0.15)]"
            strokeWidth={w}
            style={mounted ? { opacity: 1, transition: `opacity ${0.5 + i * 0.05}s ease-out` } : { opacity: 0 }}
          />
        ))}
        {clusters.map((node, i) => (
          <g key={i} style={mounted ? { opacity: 1, transition: `opacity ${0.3 + i * 0.08}s ease-out` } : { opacity: 0 }}>
            <circle cx={node.x} cy={node.y} r={node.r}
              fill={colors[node.cluster]}
              fillOpacity={0.2}
              stroke={colors[node.cluster]}
              strokeOpacity={0.6}
              strokeWidth={1.5}
            />
            <text x={node.x} y={node.y + node.r + 12} textAnchor="middle"
              className="fill-[hsl(var(--muted-foreground))] text-[8px]"
            >{node.label}</text>
          </g>
        ))}
      </svg>
      <figcaption className="text-center text-xs text-muted-foreground mt-2">Simplified view of the genre network with Louvain communities (node size ~ degree, edge width ~ co-occurrence weight)</figcaption>
    </figure>
  )
}

function TemporalDiagram() {
  const eras = [
    { label: '1995–2005', y: 15, genres: ['Action', 'Indie', 'Racing'] },
    { label: '2005–2010', y: 65, genres: ['Strategy', 'RPG', 'Casual', 'Adventure'] },
    { label: '2010–2015', y: 115, genres: ['Free to Play', 'MMO', 'Early Access'] },
    { label: '2015–2020', y: 165, genres: ['Nudity', 'VR', 'Utilities', 'Education'] },
  ]

  return (
    <figure className="my-6">
      <svg viewBox="0 0 560 210" className="w-full" role="img" aria-label="Genre emergence timeline across eras">
        <line x1={110} y1={10} x2={110} y2={200} className="stroke-[hsl(var(--border))]" strokeWidth={1.5} />

        {eras.map((era, i) => (
          <g key={i}>
            <circle cx={110} cy={era.y + 15} r={4} className="fill-[hsl(var(--primary))]" />
            <text x={95} y={era.y + 18} textAnchor="end" className="fill-[hsl(var(--foreground))] text-[9px] font-semibold">{era.label}</text>
            {era.genres.map((g, j) => (
              <g key={j}>
                <line x1={114} y1={era.y + 15} x2={140 + j * 110} y2={era.y + 15} className="stroke-[hsl(var(--primary)/0.2)]" strokeWidth={1} />
                <rect x={140 + j * 110} y={era.y + 2} width={90} height={26} rx={6}
                  className="fill-[hsl(var(--accent)/0.1)] stroke-[hsl(var(--accent)/0.4)]" strokeWidth={1}
                />
                <text x={185 + j * 110} y={era.y + 19} textAnchor="middle" className="fill-[hsl(var(--foreground))] text-[9px]">{g}</text>
              </g>
            ))}
          </g>
        ))}
      </svg>
      <figcaption className="text-center text-xs text-muted-foreground mt-2">Genre emergence across four eras, each with its own bipartite network snapshot</figcaption>
    </figure>
  )
}

export default function BlogSteamGenreNetworks() {
  useBlogSeo({
    title: 'What 27,000 Steam Games Reveal About Genre Evolution',
    description: 'How I built a bipartite genre network from 27,000 Steam games, projected it into a weighted genre-to-genre graph, ran Louvain community detection and centrality analysis with NetworkX and Gephi, and discovered why static game properties explain less than 2% of playtime variance.',
    keywords: 'steam game genre network analysis python, bipartite network projection networkx tutorial, how to build genre co-occurrence graph, louvain community detection video games, gephi network visualization game data, ridge regression predict playtime steam, genre centrality degree betweenness closeness, temporal network evolution game genres 1995 2020, why regression fails on playtime prediction, weighted graph projection from bipartite network, steam dataset kaggle machine learning, genre clustering modularity louvain algorithm, eigenvector centrality genre network python, game analytics network science approach',
    ogImage: '/og-blog-steam-genre-networks.webp',
    datePublished: '2023-12-01',
    slug: 'steam-genre-networks',
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
            <span ref={readingTimeRef}>14 min read</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4 leading-tight">
            What 27,000 Steam Games Reveal About Genre Evolution
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed mb-5">
            Steam has over 27,000 games, each tagged with one or more genres. I wanted to know which genres tend to appear together, and whether that structure changes over time. So I built a bipartite network connecting games to their genres, projected it into a weighted genre-to-genre graph, and ran centrality and community detection on it. I also tried predicting playtime with regression. The network stuff worked. The regression was a near-total failure, and honestly that ended up being the more useful result.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {['Python', 'NetworkX', 'Gephi', 'Ridge Regression', 'Louvain', 'Pandas'].map(tag => (
              <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-muted text-muted-foreground">
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground mb-6">
          This post is based on a thesis project using a publicly available Kaggle dataset. The full code is on <a href="https://github.com/notsubash/Game-Genre-Network-Analysis" className="text-primary hover:underline">GitHub</a>. For a condensed overview with key metrics and results, see the <Link to="/projects/steam-ml" className="text-primary hover:underline">project case study</Link>.
        </div>

        <hr className="border-border mb-10" />

        <div className="prose-custom space-y-8 text-sm text-muted-foreground leading-relaxed">

          <section>
            <h2 id="motivation" className="font-display text-lg font-semibold text-foreground mb-3">Why model genres as a network?</h2>
            <p>
              Most analyses of the Steam catalog treat genres as flat labels. A game is "Action" or "RPG" or both, you count them up, make a bar chart. Fine for a quick overview, but it throws away the relationships between genres. Which ones tend to appear together? Which ones bridge otherwise separate clusters?
            </p>
            <p className="mt-3">
              A <strong className="text-foreground">bipartite graph</strong> (two node types: games and genres, with edges between them) lets you project into a genre-only graph where edge weights equal the number of shared games. From there, centrality tells you which genres are most connected, community detection finds natural clusters, and temporal slicing shows how the whole structure shifted over 25 years.
            </p>
            <PipelineDiagram />
          </section>

          <section>
            <h2 id="dataset" className="font-display text-lg font-semibold text-foreground mb-3">The dataset</h2>
            <p>
              The data comes from <strong className="text-foreground">Nik Davis's Steam Store Games dataset</strong> on Kaggle (CC BY 4.0), covering games through February 2019. 27,075 unique entries with 18 columns: app ID, name, release date, developer, publisher, platforms, genres, categories, tags, achievements, positive/negative ratings, average and median playtime, owner ranges, and price.
            </p>
            <p className="mt-3">
              The part that matters for network analysis: genres are semicolon-separated strings. A single game might be tagged <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">Action;RPG;Indie</code>. That multi-label structure is what makes the bipartite approach work. One game with three genres creates three edges.
            </p>
            <p className="mt-3">
              No nulls, no duplicates. Surprisingly clean for a Kaggle dataset. The only preprocessing was exploding the multi-genre column so each game-genre pair got its own row.
            </p>
            <CodeBlock lang="python" code={`import pandas as pd

steam = pd.read_csv('steam.csv')
steam['release_date'] = pd.to_datetime(steam['release_date'])

# Explode semicolon-separated genres into one row per game-genre pair
genres = steam.assign(genres=steam['genres'].str.split(';')).explode('genres')
genres.to_csv('genres.csv', index=False)`} />
          </section>

          <section>
            <h2 id="bipartite" className="font-display text-lg font-semibold text-foreground mb-3">Building the bipartite network</h2>
            <p>
              Each game becomes a node, each genre becomes a node, and edges connect games to their genres. In NetworkX you just tell it which nodes are "Games" and which are "Genres."
            </p>
            <CodeBlock lang="python" code={`import networkx as nx

B = nx.Graph()
B.add_nodes_from(genres['name'].unique(), bipartite='Games')
B.add_nodes_from(genres['genres'].unique(), bipartite='Genres')

edges = [(row['genres'], row['name']) for _, row in genres.iterrows()]
B.add_edges_from(edges)

nx.write_gexf(B, "steam_bipartite.gexf")`} />
            <p className="mt-3">
              This gives you ~27,000 game nodes and 29 genre nodes. The game nodes have wildly different degrees (one genre = degree 1, five genres = degree 5), while genre nodes have massive degrees because thousands of games connect to each one.
            </p>
            <p className="mt-3">
              You can visualize the bipartite graph in Gephi, but it's hard to analyze directly because the two node types sit at such different scales. The projection is where it gets useful.
            </p>
          </section>

          <section>
            <h2 id="projection" className="font-display text-lg font-semibold text-foreground mb-3">Projecting to a genre-only graph</h2>
            <p>
              The projection collapses the bipartite graph down to just genres. Two genres get an edge if at least one game belongs to both, and the weight is how many games they share. Mathematically it's the bipartite adjacency matrix multiplied by its transpose.
            </p>
            <BipartiteProjectionDiagram />
            <p className="mt-3">
              In practice, I prepared the projected edgelist as a CSV with Source, Target, and Weight columns, then loaded it into NetworkX:
            </p>
            <CodeBlock lang="python" code={`df_genres = pd.read_csv('genres-fixed.csv')
G = nx.from_pandas_edgelist(
    df_genres, source='Source', target='Target', edge_attr='Weight'
)

print(f"Nodes: {G.number_of_nodes()}")   # 29
print(f"Edges: {G.number_of_edges()}")   # 277
print(f"Density: {nx.density(G):.3f}")   # 0.682`} />
            <p className="mt-3">
              29 nodes, 277 edges, density 0.682. Two-thirds of all possible genre pairs co-occur in at least one game. Dense, but not surprising when you consider how liberally Steam games get tagged, and that some genres (Indie, Action) appear on almost everything.
            </p>
          </section>

          <section>
            <h2 id="centrality" className="font-display text-lg font-semibold text-foreground mb-3">Centrality: which genres hold the network together</h2>
            <p>
              I computed four centrality measures: <strong className="text-foreground">degree</strong> (how connected), <strong className="text-foreground">betweenness</strong> (how much shortest-path traffic flows through a node), <strong className="text-foreground">closeness</strong> (average distance to everyone else), and <strong className="text-foreground">eigenvector</strong> (connected to other well-connected nodes).
            </p>
            <CodeBlock lang="python" code={`degree = nx.degree_centrality(G)
betweenness = nx.betweenness_centrality(G)
closeness = nx.closeness_centrality(G)
eigenvector = nx.eigenvector_centrality(G, max_iter=1000)

# Sort by degree
for genre, score in sorted(degree.items(), key=lambda x: -x[1])[:5]:
    print(f"{genre}: {score:.3f}")`} />
            <p className="mt-3">
              <strong className="text-foreground">Indie and Casual</strong> both came back with degree centrality of 1.0. They're connected to every other genre in the network. There is no genre on Steam that doesn't share at least one game with Indie or Casual. Free to Play, Strategy, and RPG are close behind at 0.93.
            </p>
            <div className="rounded-xl border border-border bg-card overflow-hidden mt-4">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left px-3 py-2 text-foreground font-semibold">Genre</th>
                    <th className="text-right px-3 py-2 text-foreground font-semibold">Degree</th>
                    <th className="text-right px-3 py-2 text-foreground font-semibold">Betweenness</th>
                    <th className="text-right px-3 py-2 text-foreground font-semibold">Closeness</th>
                    <th className="text-right px-3 py-2 text-foreground font-semibold">Eigenvector</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Indie', '1.000', '0.021', '1.000', '0.218'],
                    ['Casual', '1.000', '0.021', '1.000', '0.207'],
                    ['Free to Play', '0.929', '0.009', '0.933', '0.199'],
                    ['Strategy', '0.929', '0.009', '0.933', '0.204'],
                    ['RPG', '0.929', '0.009', '0.933', '0.203'],
                    ['Action', '0.893', '0.005', '0.903', '0.210'],
                    ['Simulation', '0.893', '0.005', '0.903', '0.199'],
                  ].map(([genre, deg, btw, cls, eig], i) => (
                    <tr key={i} className={i % 2 === 0 ? '' : 'bg-muted/30'}>
                      <td className="px-3 py-2 text-foreground font-medium">{genre}</td>
                      <td className="px-3 py-2 text-right text-muted-foreground">{deg}</td>
                      <td className="px-3 py-2 text-right text-muted-foreground">{btw}</td>
                      <td className="px-3 py-2 text-right text-muted-foreground">{cls}</td>
                      <td className="px-3 py-2 text-right text-muted-foreground">{eig}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-center text-xs text-muted-foreground mt-2">Top genres by centrality measures across the projected network</p>
            <p className="mt-4">
              Betweenness is low everywhere, which is a side effect of the density. When most nodes already connect directly to each other, shortest paths don't need to route through intermediaries. In a sparser network, betweenness would be more informative.
            </p>
          </section>

          <section>
            <h2 id="communities" className="font-display text-lg font-semibold text-foreground mb-3">Community detection with Louvain</h2>
            <p>
              The <strong className="text-foreground">Louvain algorithm</strong> optimizes modularity to find groups of nodes that are more densely connected to each other than to the rest of the network. Running it in Gephi at resolution 0.5 with edge weights on produced <strong className="text-foreground">8 communities</strong> with a modularity score of 0.273.
            </p>
            <p className="mt-3">
              Moderate modularity, expected given the density. But the clusters themselves are sensible:
            </p>
            <GenreNetworkViz />
            <div className="grid sm:grid-cols-2 gap-3 mt-4">
              {[
                { id: '1', label: 'Creative Tools', genres: 'Game Dev, Utilities, Education, Audio/Photo/Video Production, Animation, Design & Illustration' },
                { id: '2', label: 'Mature Content', genres: 'Nudity, Violent, Gore, Sexual Content' },
                { id: '3', label: 'Competitive Physical', genres: 'Sports, Racing' },
                { id: '4', label: 'Core Gaming', genres: 'Action, Indie' },
                { id: '5', label: 'Systems & Sandbox', genres: 'Strategy, Simulation' },
                { id: '6', label: 'Live Service', genres: 'Massively Multiplayer, Free to Play' },
                { id: '7', label: 'Emerging & Deep', genres: 'Early Access, RPG' },
                { id: '8', label: 'Accessible', genres: 'Adventure, Casual' },
              ].map(c => (
                <div key={c.id} className="bg-card border border-border rounded-xl p-3">
                  <p className="text-xs font-semibold text-primary mb-1">{c.label}</p>
                  <p className="text-xs text-muted-foreground">{c.genres}</p>
                </div>
              ))}
            </div>
            <p className="mt-4">
              The clustering coefficient came out to about 0.82. If genre A co-occurs with B and C, then B and C almost certainly co-occur too. The genre space on Steam is tightly interconnected, a "small world" in network terms.
            </p>
            <p className="mt-3">
              "Massively Multiplayer" and "Free to Play" landing in the same community was expected but still worth noting. At this point they're basically the same genre wearing different labels. Same player interaction model, same monetization, and the network structure confirms it.
            </p>
          </section>

          <section>
            <h2 id="temporal" className="font-display text-lg font-semibold text-foreground mb-3">How the network evolved over 25 years</h2>
            <p>
              To track genre evolution, I sliced the dataset into four temporal windows and built a separate bipartite network for each. The slices: 1995-2005, 2005-2010, 2010-2015, and 2015-2020.
            </p>
            <CodeBlock lang="python" code={`# Temporal slicing example
df_95_05 = steam[
    (steam['release_date'] >= '1995-1-1') &
    (steam['release_date'] < '2005-1-1')
]

# Build bipartite graph for this era
B = nx.Graph()
B.add_nodes_from(df_95_05['name'].unique(), bipartite='Games')
B.add_nodes_from(df_95_05['genres'].unique(), bipartite='Genres')
edges = [(row['genres'], row['name']) for _, row in df_95_05.iterrows()]
B.add_edges_from(edges)

nx.write_gexf(B, "95_05_steam.gexf")`} />
            <TemporalDiagram />
            <p className="mt-3">
              In the earliest window, Action and Indie are the only real hubs. Through the 2000s, Strategy, RPG, Casual, and Adventure grow out of those two. Free to Play shows up in the 2010s, initially attached to Indie games, and quickly fuses with Massively Multiplayer into its own cluster. The overall pattern is branching followed by re-convergence.
            </p>
            <ul className="space-y-2 mt-3">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span><strong className="text-foreground">Racing was an independent branch.</strong> Unlike most genres that trace back to Action/Indie, Racing evolved separately and gave rise to Sports as a sub-genre.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span><strong className="text-foreground">Non-gaming genres got absorbed.</strong> Education and Utilities started as independent categories but were pulled into mainstream gaming clusters over time.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span><strong className="text-foreground">Early Access appeared post-2010</strong> as developers started using community feedback loops as a development model. It clustered with RPG, likely because RPGs are the genre most associated with long development cycles and community involvement.</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 id="engagement" className="font-display text-lg font-semibold text-foreground mb-3">What genres drive engagement?</h2>
            <p>
              To tie the network analysis back to player behavior, I attached two node attributes to the genre graph: <strong className="text-foreground">net ratings</strong> (positive minus negative) and <strong className="text-foreground">median playtime</strong>, both aggregated per genre.
            </p>
            <CodeBlock lang="python" code={`steam['net_ratings'] = steam['positive_ratings'] - steam['negative_ratings']

ratings_by_genre = steam.groupby('genres')['net_ratings'].sum()
playtime_by_genre = steam.groupby('genres')['median_playtime'].sum()

nx.set_node_attributes(G, ratings_by_genre.to_dict(), 'Net Ratings')
nx.set_node_attributes(G, playtime_by_genre.to_dict(), 'Median Play Time')

nx.write_gexf(G, "genre_attributes.gexf")`} />
            <p className="mt-3">
              Action games had the highest net ratings. Indie came second. But for median playtime, the ranking flipped: Indie led, probably because Indie games tend toward experimental gameplay that keeps people playing longer. Action gets the most positive attention; Indie gets the most time.
            </p>
            <p className="mt-3">
              I didn't expect this, but lower-priced and free-to-play games showed higher engagement on average. Zero barrier to entry probably helps, and cheap Indie games tend to attract audiences who actually care about the game rather than impulse-buying during a sale.
            </p>
          </section>

          <section>
            <h2 id="regression" className="font-display text-lg font-semibold text-foreground mb-3">The regression: when your model teaches you the question was wrong</h2>
            <p>
              I also tried predicting <strong className="text-foreground">average playtime</strong> from static game properties. One-hot encoded platforms, genres, categories, and owner tiers, plus numeric stuff: price, achievement count, release year, and a computed <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">ratings_ratio</code>.
            </p>
            <CodeBlock lang="python" code={`from sklearn.linear_model import Ridge
from sklearn.ensemble import RandomForestRegressor
from sklearn.tree import DecisionTreeRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split, cross_val_score

X = steam.drop(columns=['average_playtime', 'appid', 'name',
                         'developer', 'publisher', 'median_playtime'])
y = steam['average_playtime']

# One-hot encode categorical columns
X = pd.get_dummies(X, columns=['platforms', 'genres', 'categories', 'owners'])

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.2, random_state=42
)`} />
            <p className="mt-3">
              Three models: Ridge Regression (alpha=100), Random Forest, and Decision Tree. I dropped <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">median_playtime</code> because it leaks information about the target, and identifiers because they carry no predictive signal.
            </p>
            <div className="rounded-xl border border-border bg-card overflow-hidden mt-4">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left px-3 py-2 text-foreground font-semibold">Model</th>
                    <th className="text-right px-3 py-2 text-foreground font-semibold">R²</th>
                    <th className="text-right px-3 py-2 text-foreground font-semibold">RMSE</th>
                    <th className="text-right px-3 py-2 text-foreground font-semibold">10-fold CV RMSE</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Ridge Regression', '0.019', '3,198', '1,405'],
                    ['Random Forest', '0.003', '3,224', '1,610'],
                    ['Decision Tree', '-0.35', '3,753', '2,160'],
                  ].map(([model, r2, rmse, cv], i) => (
                    <tr key={i} className={i % 2 === 0 ? '' : 'bg-muted/30'}>
                      <td className="px-3 py-2 text-foreground font-medium">{model}</td>
                      <td className={`px-3 py-2 text-right font-medium ${i === 2 ? 'text-red-500' : 'text-muted-foreground'}`}>{r2}</td>
                      <td className="px-3 py-2 text-right text-muted-foreground">{rmse}</td>
                      <td className="px-3 py-2 text-right text-muted-foreground">{cv}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-center text-xs text-muted-foreground mt-2">Ridge wins, but all models explain almost none of the variance</p>
            <p className="mt-4">
              An R² of 0.019 means these features explain less than 2% of the variance in average playtime. The Decision Tree actually performed worse than predicting the mean for every game (negative R²). Ridge Regression was the "best" model, but only because regularization prevented it from fitting noise as aggressively as the tree models.
            </p>
            <p className="mt-3">
              The top feature by importance was <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">ratings_ratio</code> (0.20), followed by release year, achievement count, and price. But even the most important feature barely moved the needle.
            </p>
            <p className="mt-3">
              At first this felt like a failure. I expected genre, price, and achievements to explain at least something about why people keep playing. But the more I thought about it, the more it made sense. What drives playtime is streamer hype, patch cadence, seasonal sales, multiplayer network effects. None of that lives in a static CSV. The dataset is a snapshot of fixed properties. Engagement is a moving target.
            </p>
            <p className="mt-3">
              There's also a <strong className="text-foreground">class imbalance</strong> problem. A handful of blockbusters have average playtimes in the thousands of minutes. Most games sit near zero. The distribution is so skewed that the models just learn to predict a low number and give up. The outliers blow up RMSE, but the features don't distinguish a future hit from the ten thousand games with similar metadata.
            </p>
          </section>

          <section>
            <h2 id="retrospective" className="font-display text-lg font-semibold text-foreground mb-3">Worth trying next</h2>
            <div className="rounded-xl border border-accent/30 bg-accent/5 p-5 space-y-3">
              <p>
                <strong className="text-foreground">Time-series playtime data instead of a single snapshot.</strong> If I could get weekly or monthly player counts per game, along with patch dates, discount events, and Twitch viewer numbers, those dynamic signals are much more likely to predict engagement than a fixed metadata table. The static feature approach was the wrong tool for the question I was asking.
              </p>
              <p>
                <strong className="text-foreground">Graph neural networks on the genre network.</strong> Computing centrality gives you rankings, but GNNs could learn richer interaction patterns between genres and possibly produce embeddings that feed into the engagement prediction. The 29-node genre graph is small enough that even a simple GCN could work without serious compute.
              </p>
              <p>
                <strong className="text-foreground">Incorporate game tags alongside genres.</strong> Steam tags are user-generated and much more granular than the 29 official genres. Tags like "roguelike", "souls-like", or "walking simulator" capture sub-genre dynamics that the coarse genre labels miss entirely. The bipartite network with tags instead of genres would have a much richer projected graph.
              </p>
              <p>
                <strong className="text-foreground">Updated data beyond 2019.</strong> The dataset cuts off before the pandemic-era gaming boom and the rise of live-service games. The genre landscape looks different now, and a fresh dataset would show whether the community structure shifted too.
              </p>
            </div>
          </section>

          <section>
            <h2 id="conclusion" className="font-display text-lg font-semibold text-foreground mb-3">Wrapping up</h2>
            <p>
              The network side of this project still looks right to me. The bipartite projection, centrality measures, and Louvain clusters all produce results that match how people actually think about game genres. Indie and Casual really are everywhere. The temporal slicing tells a clear story about 25 years of genre branching.
            </p>
            <p className="mt-3">
              The regression taught me something different. Static metadata tells you what a game is. It doesn't tell you why someone plays it for hundreds of hours. That gap between what the data contains and what the question requires is worth knowing about early, before you spend weeks tuning hyperparameters on features that were never going to work.
            </p>
            <p className="mt-3">
              If you're working on game analytics or network-based approaches to recommendation systems, feel free to reach out.
            </p>
          </section>

        </div>

        <BlogNav />

      </article>
    </main>
  )
}
