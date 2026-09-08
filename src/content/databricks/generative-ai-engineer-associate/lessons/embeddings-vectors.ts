import type { Lesson } from '@/types/content'

/**
 * Lesson: embeddings and vector similarity.
 * Establishes "meaning as distance" — the idea the whole retrieval half of the
 * certification rests on. Owns the map analogy for the module.
 */
export const embeddingsVectorsLesson: Lesson = {
  id: 'embeddings-vectors',
  title: 'Embeddings and vector similarity',
  summary:
    'Turning text into vectors so meaning becomes distance — the idea that makes semantic search, and therefore RAG, possible.',
  estimatedMinutes: 11,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'The search that found nothing',
      body: 'Your knowledge base contains a document titled *“Reimbursement for personal vehicle use.”* An employee searches for **“can I expense my car?”** and gets zero results.\n\nEvery word they typed is absent from the document. Every concept they meant is present.\n\nKeyword search compares *spellings*. To retrieve the right context for a model, you need something that compares **meanings**.',
      atWork:
        'This gap is the entire reason vector databases exist. If keyword search were enough, RAG would just be a `LIKE` query.',
    },
    {
      id: 'analogy-map',
      type: 'analogy',
      title: 'A map where related things sit close together',
      body: 'Imagine a map of every idea. Oslo and Bergen sit near each other; both sit far from “photosynthesis”. Nothing about the *letters* placed them — their **meaning** did.\n\nAn embedding is a set of coordinates on a map like that, just with hundreds or thousands of axes instead of two. “Car”, “vehicle” and “automobile” land in nearly the same spot. “Car” and “quarterly earnings” land far apart.\n\nOnce meaning is a **position**, similarity becomes something you can measure: *distance*.',
      mapping: [
        { from: 'Coordinates on the map', to: 'The embedding vector' },
        { from: 'Number of axes', to: 'Dimensions (e.g. 768, 1024)' },
        { from: 'Two places close together', to: 'Semantically similar text' },
        { from: 'Measuring the gap', to: 'Similarity search' },
      ],
    },
    {
      id: 'concept-embedding',
      type: 'concept',
      title: 'What an embedding actually is',
      body: 'An **embedding model** takes a piece of text and returns a fixed-length list of numbers — a **vector**. The same text always yields the same vector; similar texts yield nearby vectors.\n\nCrucially, the length never changes. A three-word question and a three-paragraph chunk both become, say, 1024 numbers. That is what makes them comparable at all.\n\nThe model that produced the vector *is* the map. Vectors from two different embedding models are coordinates in two different worlds — meaningless to compare.',
      takeaways: [
        'Text in → a fixed-length **vector** out.',
        'Similar meaning ⇒ nearby vectors.',
        'You must embed queries with the **same model** used for the documents.',
      ],
    },
    {
      id: 'diagram-keyword-vs-semantic',
      type: 'diagram',
      title: 'Two ways to search',
      spec: {
        kind: 'compare',
        left: {
          label: 'Keyword search',
          tone: 'warn',
          items: [
            'Matches characters and words',
            '“car” never matches “vehicle”',
            'Exact, predictable, cheap',
            'Great for IDs, codes, names',
          ],
        },
        right: {
          label: 'Semantic (vector) search',
          tone: 'brand',
          items: [
            'Matches meaning as distance',
            '“car” finds “personal vehicle use”',
            'Needs an embedding model',
            'Great for questions in natural language',
          ],
        },
      },
      caption:
        'Not a competition — production systems often run **both** and merge the results.',
    },
    {
      id: 'concept-distance',
      type: 'concept',
      title: 'Retrieval is a nearest-neighbour search',
      body: 'Semantic search is mechanically simple:\n\n• Embed every document chunk once, up front, and store the vectors.\n• At query time, embed **the question** with the same model.\n• Find the stored vectors **closest** to it and return their text.\n\nThat is the whole idea. “Top-k retrieval” just means *give me the k nearest neighbours*.\n\nScanning millions of vectors exactly would be slow, so vector databases use an **approximate** index — Databricks uses **HNSW** — trading a sliver of accuracy for enormous speed.',
      takeaways: [
        'Documents are embedded **once**; queries are embedded **per request**.',
        '“Top-k” = the k nearest vectors.',
        'Indexes like **HNSW** are approximate by design — that is the speed trade.',
      ],
    },
    {
      id: 'mistake-cosine',
      type: 'mistake',
      title: 'Just switch the metric to cosine similarity',
      myth:
        'Cosine similarity is the standard for text embeddings, so I will select cosine in the index configuration and move on.',
      reality:
        '**Mosaic AI Vector Search** (renamed **Databricks AI Search** in the current docs) uses **HNSW with L2 distance**.\n\nTo get cosine behaviour you **normalise the embeddings first** — once vectors are unit length, L2 ranking and cosine ranking produce the same order. The metric is not a dropdown you flip; it is a property of how you prepared the vectors.\n\nThe deeper point: cosine ignores magnitude and compares direction only. If your vectors are not normalised, L2 and cosine can genuinely disagree.',
    },
    {
      id: 'concept-model-choice',
      type: 'concept',
      title: 'Choosing an embedding model',
      body: 'Embedding models differ in ways that matter operationally:\n\n• **Dimensions** — more can capture more nuance, but costs more storage and slower search.\n• **Max input length** — feed it more text than it accepts and the rest is silently truncated. This is what ties embeddings to your chunking strategy.\n• **Domain fit** — a general model may not separate specialised jargon well.\n\nOn Databricks you either let the platform compute embeddings via **Foundation Model APIs**, or supply your own from a serving endpoint.',
      takeaways: [
        'Dimensions trade nuance against cost and speed.',
        'The model’s **max input length** constrains your chunk size.',
        'Changing the embedding model means **re-embedding everything**.',
      ],
    },
    {
      id: 'check-stores-text',
      type: 'truefalse',
      statement:
        'An embedding vector contains a compressed copy of the original text, so the text can be reconstructed from the vector.',
      answer: false,
      explanation:
        '**False.** A vector is a *position*, not a compressed document. It records where the meaning sits, discarding the exact wording entirely.\n\nThis is why a vector index stores the **original text alongside the vector**: retrieval finds the nearest vectors, then hands back the text those vectors were made from. Without that stored text there would be nothing to give the model.',
    },
    {
      id: 'mcq-embedding',
      type: 'mcq',
      question:
        'A RAG application has been in production for months. The team swaps in a new, better embedding model and re-deploys — updating only the code that embeds the user’s query. Retrieval quality collapses. Why?',
      options: [
        {
          id: 'a',
          text: 'The new model is slower, so retrieval times out and returns fewer results.',
        },
        {
          id: 'b',
          text: 'Query vectors now live in a different vector space from the indexed document vectors, so distances are meaningless.',
        },
        {
          id: 'c',
          text: 'The vector index must be rebuilt whenever any application code changes.',
        },
        {
          id: 'd',
          text: 'The new model returns more dimensions, so the extra ones are ignored.',
        },
      ],
      correct: ['b'],
      optionFeedback: {
        a: 'Latency would show up as slow responses or timeouts, not as confidently retrieving the *wrong* passages. Quality collapsed, which points at correctness.',
        b: '**Correct.** Each embedding model defines its own space. Comparing a vector from model B against documents embedded with model A measures nothing. Both sides must be re-embedded together.',
        c: 'Application code and the index are independent — ordinary code changes need no rebuild. It is specifically changing the *embedding model* that invalidates it.',
        d: 'A dimension mismatch would normally be rejected outright rather than silently truncated — and even at matching dimensions the spaces would still be incompatible.',
      },
      explanation:
        'Treat the embedding model as **part of the index contract**. Changing it is a re-indexing operation: re-embed the whole corpus, then switch queries over. Plan it as a migration, not a config tweak.',
      examObjective:
        'Select the appropriate embedding model and chunking approach for retrieval.',
    },
    {
      id: 'flashcard-embedding',
      type: 'flashcard',
      front: 'Why must a query be embedded with the same model as the documents?',
      back: 'Because each embedding model defines its **own vector space**. Coordinates from two different models are not comparable — distances between them carry no meaning. Change the model and you must **re-embed the entire corpus**.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You now understand how meaning becomes searchable',
      points: [
        'An **embedding** turns text into a fixed-length vector; similar meaning ⇒ nearby vectors.',
        'Retrieval is a **nearest-neighbour** search — “top-k” means the k closest.',
        'Databricks uses **HNSW with L2**; normalise vectors to get cosine behaviour.',
        'Query and documents must share **one embedding model**, or distances mean nothing.',
        'The model’s max input length is what links embeddings to your chunking strategy.',
      ],
      closing:
        'You can now find the right text. Next: **when** putting that text in front of the model is the right move at all — RAG, fine-tuning, or just a better prompt.',
    },
  ],
}
