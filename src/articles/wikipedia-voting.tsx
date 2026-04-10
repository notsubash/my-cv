import CaseStudyLayout, {
  Section,
  InfoGrid,
  InfoCard,
  FindingsList,
  ResultTable,
  Reflection,
} from './CaseStudyLayout'

const meta = {
  title: 'Wikipedia Administrator Voting Network Analysis',
  badge: 'Network Analysis',
  tagline:
    'Mapping the social dynamics behind Wikipedia\'s admin elections through centrality measures, community detection, and clustering analysis on 100K+ voting edges.',
  tech: ['Python', 'NetworkX', 'Gephi', 'Louvain Algorithm', 'Girvan-Newman', 'Community Detection'],
  links: [
    { label: 'GitHub', url: 'https://github.com/notsubash/WikiVoteNetworkAnalysis', icon: 'github' as const },
    { label: 'Demo Video', url: 'https://www.youtube.com/watch?v=DywRZz8iRAo', icon: 'video' as const },
  ],
  metrics: [
    { value: '7,115', label: 'Participants (nodes)' },
    { value: '100,762', label: 'Votes (edges)' },
    { value: '3.2', label: 'Avg path length' },
    { value: '608K+', label: 'Unique triangles' },
  ],
  seoTitle: 'Wikipedia Voting Network: Case Study | Subash Pandey',
  seoDescription:
    'Network science analysis of the Wikipedia Administrator voting network. Centrality measures, Louvain community detection, and clustering effects on 7,115 users and 100,762 votes.',
}

const topologyStats = [
  { label: 'Total nodes (participants)', value: '7,115' },
  { label: 'Total edges (votes)', value: '100,762' },
  { label: 'Average degree', value: '~28', note: 'neighbours per node' },
  { label: 'Average shortest path', value: '3.2', note: 'edges traversed' },
  { label: 'Graph density', value: '0.00398', note: 'sparse network' },
  { label: 'GCC diameter', value: '7', note: 'max edges to any node' },
]

const spotlightNodes = [
  { label: 'Node 2565', value: '~15%', note: 'of all voters connected' },
  { label: 'Node 766', value: '~10%', note: 'of all voters connected' },
  { label: 'Node 457', value: '~10%', note: 'of all voters connected' },
  { label: 'Node 1549', value: '~10%', note: 'of all voters connected' },
  { label: 'Node 11', value: '~10%', note: 'of all voters connected' },
]

export default function WikipediaVoting() {
  return (
    <CaseStudyLayout meta={meta}>

      <Section title="Overview">
        <p>
          Wikipedia's Request for Adminship (RfA) is the process by which volunteer editors
          are elected to administrator roles, giving them tools to protect pages, block
          users, and delete content. Each election generates a structured vote record: who
          voted for whom.
        </p>
        <p>
          This study treats the entire Wikipedia voting history (foundation to January 2008)
          as a directed social network and applies network science tools to uncover the hidden
          structure: who wields disproportionate influence, how voter blocs form, and how
          decentralised or centralised the governance process actually is.
        </p>
      </Section>

      <Section title="Dataset">
        <InfoGrid>
          <InfoCard title="Source">
            Stanford Large Network Dataset Collection, Wikipedia Voting Network (Leskovec et al.).
            A directed edge i → j means user i voted for user j in an RfA election.
          </InfoCard>
          <InfoCard title="Coverage">
            All Wikipedia RfA votes from the site's founding through January 2008. No additional
            node features (age, edit count, topic area) were available in the dataset.
          </InfoCard>
          <InfoCard title="Scale">
            7,115 nodes and 100,762 directed edges. A large, sparse network typical of
            real-world online communities.
          </InfoCard>
          <InfoCard title="Challenge">
            The absence of node-level attributes limits analysis to structural patterns.
            Community membership can be detected but causal explanations of why blocs formed
            require supplementary data.
          </InfoCard>
        </InfoGrid>
      </Section>

      <Section title="Methodology">
        <FindingsList items={[
          'Network ingestion and construction using NetworkX from the raw edge list.',
          'Topological characterisation: node/edge counts, average degree, shortest paths, density, and diameter of the Giant Connected Component (GCC).',
          'Centrality measures: degree, betweenness, closeness, and eigenvector centrality to rank nodes by influence, bridge role, and information spread.',
          'Clustering analysis: assortativity coefficient, clustering coefficient distribution, and triangle counting to understand cohesion.',
          'Community detection: Girvan-Newman modularity decomposition and Louvain iterative community optimisation applied to the GCC.',
          'Network visualisation: Gephi with Fruchterman-Reingold force-directed layout; nodes coloured by community.',
        ]} />
      </Section>

      <Section title="Topological Attributes">
        <ResultTable rows={topologyStats} />
        <p className="mt-3">
          A density of 0.004 confirms the network is <strong className="text-foreground font-medium">sparse</strong>: each voter engaged with a small fraction of all nominees, as expected in a governance process.
          The GCC diameter of 7 implies the "six degrees of separation" principle holds here too;
          any two participants are reachable within seven hops.
        </p>
      </Section>

      <Section title="Spotlight Nodes by Centrality">
        <p className="mb-3">
          Five nodes dominate across all centrality measures: degree, betweenness, closeness, and
          eigenvector. These are the individuals most connected, most bridging, and most
          influential in the voting network.
        </p>
        <ResultTable rows={spotlightNodes} />
        <p className="mt-3">
          Node 2565 alone is connected to approximately 1,065 voters, roughly 15% of all
          participants. The other four spotlight nodes each link to 700+ votes. The majority
          of nodes have betweenness centrality below 0.01, confirming the network's
          <strong className="text-foreground font-medium"> sparse bridge structure</strong>.
        </p>
      </Section>

      <Section title="Clustering Effects">
        <FindingsList items={[
          'Assortativity coefficient of −0.083 indicates weak disassortative mixing: highly-connected voters tend to link to less-connected nominees rather than to each other.',
          'The average clustering coefficient is 0.14, low compared to typical social networks, consistent with a governance process rather than a friendship network.',
          'About 200 nodes have a clustering coefficient of 1.0 (small, tight cliques), but most nodes sit in sparse neighbourhoods.',
          '608,389 unique triangles exist across the network; the median triangles-per-node is just 1 against a mean of ~256. A handful of high-degree nodes drive that average upward.',
          'This heavy-tailed distribution is a hallmark of power-law social networks: a few hubs are deeply embedded in many overlapping cliques while most participants have minimal interconnection.',
        ]} />
      </Section>

      <Section title="Community Detection">
        <p>
          Both the <strong className="text-foreground font-medium">Girvan-Newman</strong> algorithm
          (modularity-based edge removal) and the <strong className="text-foreground font-medium">Louvain</strong> method
          (iterative modularity maximisation) were applied to the GCC. The two approaches converged
          on a consistent community partition, validating structural robustness of the clusters.
        </p>
        <p>
          Communities likely reflect shared editorial interests, topic areas, or interaction history,
          though without node-level data these hypotheses can't be confirmed directly.
          Importantly, communities that form large cohesive blocs can exert collective influence
          on adminship outcomes, raising questions about bias and representativeness in the RfA process.
        </p>
      </Section>

      <Section title="Key Findings">
        <FindingsList items={[
          'The network is sparse and decentralised overall, but five "superconnector" nodes concentrate disproportionate influence.',
          'Node 2565 is the single most influential participant, reaching ~15% of all voters through direct connections.',
          'Low average clustering (0.14) suggests voting decisions are made independently rather than in tightly-knit peer groups, which is a good sign for governance integrity.',
          'The triangle count skew reveals that influence hubs participate in dense local clusters while the majority of voters remain loosely integrated.',
          'Community structure exists and persists across two independent detection algorithms, indicating real sub-groups with shared voting behaviour.',
          '"Small world" properties hold: an average path length of 3.2 means information or campaigning can reach the whole network through just a few hops.',
        ]} />
      </Section>

      <Reflection>
        <p>
          The biggest gap in this project is that I identified communities but couldn't explain <em>why</em> they formed. The dataset only has vote edges; no edit history, no topic areas, no user tenure. I found real structure (both Girvan-Newman and Louvain agreed on the partition), but I couldn't go the next step and say "this cluster votes together because they all edit science articles" or "these users share a geographic region."
        </p>
        <p>
          If I did this again, I'd start by joining in Wikipedia's public edit dumps to enrich nodes with edit count, primary topic category, and account age. That would turn the community detection from a structural finding into an actionable insight about governance bias.
        </p>
        <p>
          I'd also add temporal slicing. The dataset covers the site's founding through 2008, but I treated it as one static graph. Splitting into yearly snapshots would show whether centralisation increased or decreased as Wikipedia matured, which is a far more interesting question than the static analysis I did.
        </p>
      </Reflection>

      <Section title="Implications & Future Work">
        <FindingsList items={[
          'Enriching nodes with edit history, topic specialisation, and tenure could reveal why communities form and whether voting blocs introduce systematic biases.',
          'Temporal analysis (year-by-year snapshots) would show whether network centrality became more or less concentrated as Wikipedia matured.',
          'Comparing English Wikipedia with other language editions could expose cultural differences in governance structure.',
          'Anomaly detection on voting patterns could flag coordinated bloc voting or sockpuppet activity for Wikipedia\'s trust and safety teams.',
          'These network analysis methods are directly transferable to other online governance networks (Reddit moderator elections, DAO voting, etc.).',
        ]} />
      </Section>

    </CaseStudyLayout>
  )
}
