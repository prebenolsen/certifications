import type { Lesson } from '@/types/content'

/**
 * Lesson: the Databricks GenAI stack (Mosaic AI).
 * The map lesson — it *places* components, it does not re-teach the concepts
 * from the three preceding lessons. Product facts verified against the docs on
 * 2026-09-08; see src_material/.../research/foundations.md.
 */
export const mosaicAiStackLesson: Lesson = {
  id: 'mosaic-ai-stack',
  title: 'The Databricks GenAI stack (Mosaic AI)',
  summary:
    'How Vector Search, Model Serving, Foundation Model APIs, MLflow and Unity Catalog fit together — and which one does which job.',
  estimatedMinutes: 12,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'You know what to build. Where does it live?',
      body: 'You have decided on RAG over your policy documents. Now: something must store the vectors, something must run the embedding model, something must serve the chat model, something must package the whole chain, and something must control who can touch any of it.\n\nOn Databricks those are five named products — and a large share of exam questions are simply **“which component does this job?”**\n\nThis lesson is a map, not a tutorial. Later modules build with each piece.',
      atWork:
        'Knowing which component owns which responsibility is what lets you sketch an architecture in a meeting without opening the docs.',
    },
    {
      id: 'diagram-layers',
      type: 'diagram',
      title: 'The stack, from governance down',
      spec: {
        kind: 'layers',
        layers: [
          { label: 'Unity Catalog', sublabel: 'governs every asset below', tone: 'brand' },
          { label: 'Data & indexes', sublabel: 'Delta tables, Vector Search', tone: 'accent' },
          { label: 'Models & endpoints', sublabel: 'Model Serving, FM APIs', tone: 'good' },
          { label: 'The chain / application', sublabel: 'packaged with MLflow', tone: 'warn' },
        ],
      },
      caption:
        'Unity Catalog is the outer layer for a reason — tables, indexes, models and functions are **all** governed by it.',
    },
    {
      id: 'concept-vector-search',
      type: 'concept',
      title: 'Mosaic AI Vector Search — the retrieval engine',
      body: 'The vector database built into the platform. It stores embeddings and answers nearest-neighbour queries, using **HNSW with L2 distance**.\n\n*(Current documentation calls this **Databricks AI Search**. The exam guide says **Mosaic AI Vector Search** — expect the older name on the exam, the newer one in the console.)*\n\nWhat makes it different from a bolt-on vector database is that it is **governed by Unity Catalog** and can stay **automatically in sync** with a Delta table. Your index is not a copy you babysit; it is a view of your data that keeps up.',
      takeaways: [
        'Purpose: store vectors, return the nearest ones.',
        'Auto-syncs with a source **Delta table**.',
        'Governed by Unity Catalog like any other asset.',
      ],
    },
    {
      id: 'concept-index-types',
      type: 'concept',
      title: 'Four index types — who computes the embeddings?',
      body: 'The choice comes down to two questions: *does it sync automatically*, and *who embeds the text*.\n\n• **Delta Sync, Databricks-computed** — you provide text; Databricks embeds it with a model you name and keeps the index synced. The default choice.\n• **Delta Sync, self-managed** — you provide the vectors yourself in the Delta table; it still syncs automatically.\n• **Direct Vector Access** — no sync at all; you write vectors via the REST API. For full manual control.\n• **Full-Text Search** — keyword **BM25** scoring, no embeddings.',
      takeaways: [
        '“Delta Sync” ⇒ the index **follows the table**.',
        '“Direct Vector Access” ⇒ **you** keep it up to date.',
        'Hybrid search blends vectors with BM25 using **Reciprocal Rank Fusion**.',
      ],
    },
    {
      id: 'mistake-sync',
      type: 'mistake',
      title: 'The index is a copy you have to refresh',
      myth:
        'A vector index is a snapshot, so after loading new documents into the table we need a job that rebuilds or re-syncs the index.',
      reality:
        'With a **Delta Sync index**, that job is the platform’s responsibility. Write new rows to the source Delta table and the index picks them up — no rebuild pipeline to own.\n\nThe manual model exists, but it is opt-in: **Direct Vector Access** is the index type that expects REST API writes.\n\nThe exam leans on this distinction. Read the question for whether the source is a **Delta table** (sync) or arbitrary application code pushing vectors (direct access).',
    },
    {
      id: 'concept-model-serving',
      type: 'concept',
      title: 'Model Serving — how a model becomes an endpoint',
      body: '**Model Serving** takes a registered model and puts it behind a scalable REST endpoint, with autoscaling (including scale-to-zero) handled for you.\n\nIt serves more than chat models: your **embedding** model, a classical ML model, or an entire packaged RAG **chain** all deploy the same way. That uniformity is the point — once something is a registered model, serving it is one mechanism.\n\nAn endpoint is also the governance and monitoring boundary: it is where permissions apply and where **inference tables** log requests and responses.',
      takeaways: [
        'Turns a registered model into a **REST endpoint**.',
        'Serves chat models, embedding models, and full chains alike.',
        'The point where **permissions and inference logging** attach.',
      ],
    },
    {
      id: 'concept-fm-apis',
      type: 'concept',
      title: 'Foundation Model APIs — models you did not deploy',
      body: 'Rather than deploying a foundation model yourself, you call one Databricks already hosts. Three modes:\n\n• **Pay-per-token** — no setup, billed per token. Ideal for development and spiky traffic. A *priority* variant targets latency-sensitive work.\n• **Provisioned throughput** — reserved capacity for production, with predictable performance; available on-demand or reserved for a fixed term.\n• **AI Functions optimized models** — tuned for **batch inference** over a table.\n\nSeparately, **external models** route through Databricks to a third-party provider such as OpenAI or Anthropic — so credentials, governance and logging stay in one place.',
      takeaways: [
        'Pay-per-token = experiments and variable load.',
        'Provisioned throughput = production, predictable performance.',
        '**External models** = third-party providers, governed through Databricks.',
      ],
    },
    {
      id: 'concept-mlflow-uc',
      type: 'concept',
      title: 'MLflow and Unity Catalog — the lifecycle and the rules',
      body: '**MLflow** is how a GenAI application stops being a notebook. It tracks experiments, **packages** a chain as a model (a `pyfunc` or LangChain flavour), versions it, traces its execution, and evaluates its quality.\n\n**Unity Catalog** is the single governance layer over everything: tables, **vector indexes**, functions, and **registered models** — all named `catalog.schema.object`, all under one permission model.\n\nThat is the platform’s core argument. Your documents, the index built from them, the model serving them and the chain wiring them together are governed by **one** system, not four.',
      takeaways: [
        'MLflow = track, package, version, trace, evaluate.',
        'Unity Catalog = one permission model over data **and** AI assets.',
        'Models are registered as `catalog.schema.model`, with versions and aliases.',
      ],
    },
    {
      id: 'check-uc-scope',
      type: 'truefalse',
      statement:
        'Unity Catalog governs tables and files, while vector indexes and registered models are governed separately by Mosaic AI.',
      answer: false,
      explanation:
        '**False**, and this is the idea the platform is built around. Unity Catalog governs **all** of it — Delta tables, vector search indexes, functions, and registered models alike, under one `catalog.schema.object` namespace.\n\nThis is why permissions hold end to end: a user who cannot read the source table should not be able to reach its contents through a retrieval endpoint either. One governance model, not one per product.',
    },
    {
      id: 'mcq-components',
      type: 'mcq',
      question:
        'A team is building a RAG assistant over a Delta table of support articles that is updated throughout the day. They want minimal operational overhead and no pipeline to keep retrieval current. Which setup fits best?',
      options: [
        {
          id: 'a',
          text: 'A Direct Vector Access index, with a scheduled job pushing new embeddings via the REST API.',
        },
        {
          id: 'b',
          text: 'A Delta Sync index with Databricks-computed embeddings, pointed at the source table.',
        },
        {
          id: 'c',
          text: 'A Full-Text Search index, since support articles are mostly keyword lookups.',
        },
        {
          id: 'd',
          text: 'Fine-tune a foundation model nightly on the support articles and serve it via Model Serving.',
        },
      ],
      correct: ['b'],
      optionFeedback: {
        a: 'This works, but it is precisely the operational overhead they asked to avoid — a job to own, schedule, monitor and repair. Direct Vector Access is for when you *want* manual control.',
        b: '**Correct.** Delta Sync follows the source table automatically, and Databricks-computed embeddings mean no embedding pipeline either. Minimum moving parts for a Delta-backed source.',
        c: 'BM25 keyword search would miss the semantic matching RAG depends on — the “can I expense my car?” problem. Useful *combined* with vectors as hybrid search, not instead of them.',
        d: 'Fine-tuning teaches behaviour, not facts, and a nightly retraining loop is far more overhead than an auto-syncing index — while still being a day out of date.',
      },
      explanation:
        'Match the index type to the source. A **Delta table** as the system of record points at a **Delta Sync** index; let Databricks compute the embeddings unless you have a specific reason to manage them yourself.',
      examObjective:
        'Create and query a Mosaic AI Vector Search index (and keep it synced).',
    },
    {
      id: 'flashcard-stack',
      type: 'flashcard',
      front: 'Name the five core Mosaic AI components and the job each one owns.',
      back: '**Vector Search** — store and retrieve embeddings.\n**Model Serving** — put a model or chain behind a REST endpoint.\n**Foundation Model APIs** — call models Databricks already hosts.\n**MLflow** — track, package, version and evaluate.\n**Unity Catalog** — govern all of the above.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You now have the map',
      points: [
        '**Vector Search** retrieves; four index types, split by *auto-sync* and *who embeds*.',
        '**Model Serving** turns any registered model — including a whole chain — into an endpoint.',
        '**Foundation Model APIs**: pay-per-token, provisioned throughput, or batch-optimized; **external models** route to third parties.',
        '**MLflow** packages and evaluates; **Unity Catalog** governs data, indexes and models together.',
        'Delta Sync follows your table; Direct Vector Access is the manual, opt-in path.',
      ],
      closing:
        'Foundations complete. From here you design a real application — starting with turning a fuzzy business problem into a pipeline.',
    },
  ],
}
