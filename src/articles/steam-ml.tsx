import CaseStudyLayout, {
  Section,
  InfoGrid,
  InfoCard,
  FindingsList,
  ResultTable,
  Reflection,
} from './CaseStudyLayout'

const meta = {
  title: 'Machine Learning the Steam Video Games Database',
  badge: 'Network Analysis · ML',
  tagline:
    'How do video game genres evolve on Steam? This thesis combines bipartite network analysis, community detection, and regression to understand genre influence and predict player engagement.',
  tech: ['Python', 'NetworkX', 'Gephi', 'Ridge Regression', 'Random Forest', 'Louvain Algorithm'],
  links: [
    { label: 'GitHub', url: 'https://github.com/notsubash/Game-Genre-Network-Analysis', icon: 'github' as const },
    { label: 'Full Paper', url: 'https://zenodo.org/records/17621070', icon: 'fileText' as const },
    { label: 'Demo Video', url: 'https://www.youtube.com/watch?v=IjWUKT-kXw4', icon: 'video' as const },
  ],
  metrics: [
    { value: '27,075', label: 'Games analysed' },
    { value: '29', label: 'Genre nodes' },
    { value: '277', label: 'Genre-genre edges' },
    { value: '8', label: 'Communities detected' },
  ],
  seoTitle: 'Steam Video Games ML: Case Study | Subash Pandey',
  seoDescription:
    'Network analysis + machine learning on the Steam Video Game Database. Bipartite genre networks, community detection, and regression to predict average playtime.',
  seoKeywords: 'steam game genre network analysis, video game machine learning python, bipartite network community detection, networkx gephi game data, predict player engagement ml, louvain algorithm genre clustering',
}

const regressionResults = [
  { label: 'Ridge Regression', value: 'R² 0.019', note: 'RMSE 3198 · MAE 275' },
  { label: 'Random Forest', value: 'R² 0.003', note: 'RMSE 3224 · MAE 259' },
  { label: 'Decision Tree', value: 'R² -0.35', note: 'RMSE 3753 · MAE 303' },
]

const crossValRmse = [
  { label: 'Ridge Regression (10-fold CV)', value: '1405', note: 'mean RMSE' },
  { label: 'Random Forest (10-fold CV)', value: '1610', note: 'mean RMSE' },
  { label: 'Decision Tree (10-fold CV)', value: '2160', note: 'mean RMSE' },
]

const centralityNodes = [
  { label: 'Indie', value: 'Degree 1.0', note: 'Connected to every genre' },
  { label: 'Casual', value: 'Degree 1.0', note: 'Connected to every genre' },
  { label: 'Free to Play', value: 'Degree 0.93', note: 'Closeness 0.93' },
  { label: 'Strategy', value: 'Degree 0.93', note: 'Closeness 0.93' },
  { label: 'RPG', value: 'Degree 0.93', note: 'Closeness 0.93' },
]

export default function SteamML() {
  return (
    <CaseStudyLayout meta={meta}>

      <Section title="Overview">
        <p>
          The Steam platform hosts over 27,000 games spanning dozens of genres. This thesis
          explores how those genres co-evolve, which are most influential, and what game
          properties best explain player engagement, using a mix of network science
          and machine learning.
        </p>
        <p>
          The core contribution is a <strong className="text-foreground font-medium">bipartite
          genre network</strong> connecting games to their genres, projected into
          a weighted, unipartite genre-to-genre graph. That graph is then analysed with centrality
          measures, Louvain community detection, and temporal slicing across five eras (1995–2020).
          A regression pipeline on game properties attempts to predict average playtime.
        </p>
      </Section>

      <Section title="Dataset">
        <InfoGrid>
          <InfoCard title="Source">
            Steam Store Games dataset by Nik Davis on Kaggle (CC BY 4.0). Temporal coverage
            through February 2019. 27,075 unique game entries with 18 columns.
          </InfoCard>
          <InfoCard title="Key Features">
            Game ID, name, release date, English availability, developer/publisher, platforms,
            genres, categories, tags, achievements, positive/negative ratings, median and average
            playtime, owner range, and price.
          </InfoCard>
          <InfoCard title="Pre-processing">
            No duplicate or null values. Multi-genre entries (semicolon-separated) were exploded
            into one row per game-genre pair. Correlation analysis removed leaky variables
            (median playtime) before regression.
          </InfoCard>
          <InfoCard title="Network Size">
            29 genre nodes and 277 edges in the projected genre network. Graph density of 0.682,
            meaning most genres co-occur with most others.
          </InfoCard>
        </InfoGrid>
      </Section>

      <Section title="Methodology">
        <p>The pipeline had four sequential stages:</p>
        <FindingsList items={[
          'EDA & Pre-processing: correlation matrix, distribution checks, genre explosion into separate rows.',
          'Bipartite Network: games and genres as two node types; edges represent game-genre membership. Projected to a unipartite genre network via matrix multiplication in Gephi\'s Multimode plugin.',
          'Network Analysis: centrality measures (degree, betweenness, closeness, eigenvector), temporal genre evolution across 5-year windows, Louvain community detection, node attributes (net ratings, median playtime).',
          'Regression: Ridge, Decision Tree, and Random Forest models trained to predict Average_Playtime. Features include dummy-encoded platforms, genres, categories, owners, price, achievements, and a computed ratings_ratio. 10-fold cross-validation for model selection.',
        ]} />
      </Section>

      <Section title="Centrality Results: Spotlight Genres">
        <p className="mb-3">
          Indie and Casual genres are connected to every other genre in the network (degree
          centrality = 1.0), meaning no genre on Steam exists in isolation from them.
        </p>
        <ResultTable rows={centralityNodes} />
      </Section>

      <Section title="Community Detection">
        <p className="mb-3">
          Louvain modularity clustering at resolution 0.5 identified <strong className="text-foreground font-medium">8 communities</strong>:
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { id: 'Cluster 1', genres: 'Game Development, Utilities, Education, Audio/Photo/Video Production, Animation, Web Publishing, Accounting, Software Training, Design & Illustration' },
            { id: 'Cluster 2', genres: 'Nudity, Violent, Gore, Sexual Content' },
            { id: 'Cluster 3', genres: 'Sports, Racing' },
            { id: 'Cluster 4', genres: 'Action, Indie' },
            { id: 'Cluster 5', genres: 'Strategy, Simulation' },
            { id: 'Cluster 6', genres: 'Massively Multiplayer, Free to Play' },
            { id: 'Cluster 7', genres: 'Early Access, RPG' },
            { id: 'Cluster 8', genres: 'Adventure, Casual' },
          ].map(c => (
            <div key={c.id} className="bg-card border border-border rounded-xl p-3">
              <p className="text-xs font-semibold text-primary mb-1">{c.id}</p>
              <p className="text-xs text-muted-foreground">{c.genres}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Genre Evolution (1995–2020)">
        <FindingsList items={[
          '"Action" and "Indie" are the dominant parent genres; most emerging sub-genres trace back to one of them.',
          'Violent, Casual, Adventure, RPG, and Strategy all emerged from Action/Indie in the 2000s.',
          '"Free to Play" was first incorporated by Indie games, spawning the Massively Multiplayer cluster.',
          'Non-gaming genres (Education, Utilities, etc.) emerged independently but were later absorbed into mainstream gaming genres.',
          '"Early Access" appeared from 2010 onward as developers sought community feedback loops.',
          'Racing gave birth to the Sports sub-genre, a separate evolutionary branch from the Action/Indie lineage.',
        ]} />
      </Section>

      <Section title="What Players Engage With">
        <FindingsList items={[
          'Action games received the highest net ratings on the platform; Indie games came second.',
          'Indie games had the highest median playtime, likely due to their deep storylines and experimental gameplay that reward extended investment.',
          'The combination of high ratings and high playtime makes Indie + Action the twin pillars of Steam engagement.',
        ]} />
      </Section>

      <Section title="Regression Results">
        <p className="mb-3">
          Predicting <em>Average_Playtime</em> from game properties proved difficult. Most
          variability in engagement is explained by factors outside the available feature set.
          Ridge Regression was the best model by cross-validated RMSE.
        </p>
        <ResultTable rows={regressionResults} />
        <p className="mt-4 mb-3">10-fold cross-validation confirmed Ridge as the strongest generaliser:</p>
        <ResultTable rows={crossValRmse} />
        <p className="mt-3">
          The top feature for predicting average playtime was <strong className="text-foreground font-medium">ratings_ratio</strong> (importance 0.20),
          followed by release year, achievements count, and price.
        </p>
        <p className="mt-3">
          Honestly, the R² of ~2% surprised me at first. I expected static game properties to explain a decent chunk of playtime. But once I thought about it, it made sense: what actually drives engagement (streamer hype, patch updates, social trends, seasonal sales) is dynamic and community-driven. The dataset only captured snapshots of fixed properties. This was the biggest lesson from the project: sometimes the most valuable finding is learning that your features don't capture what matters, because it points you toward what does.
        </p>
      </Section>

      <Section title="Key Findings">
        <FindingsList items={[
          'Indie and Casual are the most structurally central genres; every other genre co-occurs with them.',
          '"Massively Multiplayer" and "Free to Play" have become synonymous, sharing player interaction models and monetisation strategies.',
          'Ratings are the strongest predictor of playtime; lower-priced or free-to-play games show higher engagement on average.',
          'Incorporating achievements actively boosts playtime by improving in-game motivation.',
          'Regression R² values stayed below 2%, suggesting community-driven factors (streamers, social trends, patches) dominate over static game properties.',
          'Class imbalance (few blockbusters vs. many niche titles) is the primary barrier to regression accuracy.',
        ]} />
      </Section>

      <Reflection>
        <p>
          The network analysis side of this project holds up well. If I redid it, I'd keep the bipartite projection and Louvain clustering largely as-is. The part I'd rethink completely is the regression.
        </p>
        <p>
          I went in assuming that genre, price, and achievements would explain engagement. They don't, at least not from a static snapshot. If I did this again, I'd scrape time-series data: player counts over weeks, patch dates, discount events, Twitch viewer numbers. Those dynamic signals are what actually move playtime. The static feature approach was the wrong tool for the question I was asking.
        </p>
        <p>
          I'd also try graph neural networks on the genre network instead of just computing centrality scores. Centrality gives you rankings, but GNNs could learn richer interaction patterns between genres and possibly feed those into the engagement prediction as embeddings.
        </p>
      </Reflection>

      <Section title="Limitations & Future Work">
        <FindingsList items={[
          'The dataset cuts off at 2019, so the post-pandemic gaming boom and live-service genre growth are not captured.',
          'Adding game tag data alongside genre data could reveal finer sub-genre dynamics.',
          'Temporal regression (time-series of playtime per game) could outperform static predictors.',
          'Graph neural networks on the genre graph could learn richer genre interaction embeddings than centrality scores alone.',
        ]} />
      </Section>

    </CaseStudyLayout>
  )
}
