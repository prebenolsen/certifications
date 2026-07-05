import type { Certification } from '@/types/content'
import { planned } from '@/content/authoring'

/**
 * Databricks Certified Generative AI Engineer Associate.
 *
 * Eight modules following the natural build arc of a RAG application —
 * understand → design → prepare data → build → harden → deploy → govern →
 * evaluate — mapped back to the six official exam sections. The largest section,
 * Application Development (30%), is split across two modules (build vs harden),
 * and a short foundations primer grounds everything before the graded sections.
 */
export const generativeAiEngineerAssociate: Certification = {
  id: 'databricks-generative-ai-engineer-associate',
  title: 'Databricks Certified Generative AI Engineer Associate',
  provider: 'Databricks',
  summary:
    'Design, build, deploy, govern, and evaluate LLM-powered applications on Databricks: retrieval-augmented generation (RAG) with Mosaic AI Vector Search, prompt engineering and orchestration with chains, guardrails and hallucination control, MLflow packaging and Unity Catalog governance, Model Serving and Foundation Model APIs, and LLM evaluation and monitoring.',
  officialUrl:
    'https://www.databricks.com/learn/certification/genai-engineer-associate',
  examFacts: {
    questions: 45,
    minutes: 90,
    passingNote:
      'Multiple-choice, online or test-center proctored. USD 200. ~6+ months of hands-on GenAI experience on Databricks recommended.',
    validityYears: 2,
  },
  modules: [
    {
      id: 'foundations',
      order: 1,
      title: 'GenAI Foundations on Databricks',
      summary:
        'The mental models everything else builds on: how LLMs work, embeddings and vector similarity, when to reach for RAG vs fine-tuning vs prompting, and the Mosaic AI stack.',
      examSections: ['Design Applications'],
      icon: '🧠',
      lessons: [
        planned(
          'llm-basics',
          'How large language models actually work',
          'Tokens, next-token prediction, context windows, and why an LLM is a probabilistic generator — not a database.',
        ),
        planned(
          'embeddings-vectors',
          'Embeddings and vector similarity',
          'Turning text into vectors so “meaning” becomes distance — the idea that makes semantic search possible.',
        ),
        planned(
          'rag-vs-alternatives',
          'RAG, fine-tuning, or just prompting?',
          'The three ways to give an LLM new knowledge or behavior, and how to choose between them.',
        ),
        planned(
          'mosaic-ai-stack',
          'The Databricks GenAI stack (Mosaic AI)',
          'How Vector Search, Model Serving, Foundation Model APIs, MLflow, and Unity Catalog fit together.',
        ),
      ],
    },
    {
      id: 'design',
      order: 2,
      title: 'Designing GenAI Applications',
      summary:
        'Turn a business problem into a GenAI pipeline: define inputs and outputs, design prompt–response pairs, choose models and components, and decompose complex tasks.',
      examSections: ['Design Applications'],
      icon: '🎯',
      lessons: [
        planned(
          'decompose-use-case',
          'From business problem to GenAI pipeline',
          'Translating a fuzzy requirement into concrete inputs, outputs, and the tasks a model must perform.',
        ),
        planned(
          'prompt-response-design',
          'Designing prompt–response pairs',
          'Working backward from the output you need to the prompt and context that produce it.',
        ),
        planned(
          'choosing-model-components',
          'Choosing models, tools, and chain components',
          'Picking the model tasks, retrievers, and tools a use case requires — and what data the model needs access to.',
        ),
        planned(
          'multi-stage-reasoning',
          'When one prompt isn’t enough',
          'Breaking a hard requirement into an ordered series of steps and subtasks.',
        ),
      ],
    },
    {
      id: 'data-preparation',
      order: 3,
      title: 'Preparing Data for Retrieval',
      summary:
        'Get source documents ready for RAG: extract clean text, chunk it well, attach useful metadata, and embed it — because retrieval quality starts with data quality.',
      examSections: ['Data Preparation'],
      icon: '📚',
      lessons: [
        planned(
          'extracting-documents',
          'Extracting text from messy documents',
          'Choosing the right Python tools to pull usable text from PDFs, HTML, and other formats — and filtering the noise.',
        ),
        planned(
          'chunking-strategies',
          'Chunking: size, overlap, and structure',
          'How chunk size and overlap trade off against context limits and retrieval precision.',
        ),
        planned(
          'embeddings-prep',
          'From chunks to embeddings',
          'Embedding chunks into a vector store and attaching metadata that makes filtering possible.',
        ),
        planned(
          'data-quality-retrieval',
          'Garbage in, garbage out',
          'Why source-data quality caps how good your RAG answers can ever be.',
        ),
      ],
    },
    {
      id: 'building',
      order: 4,
      title: 'Building RAG Applications',
      summary:
        'Assemble the core RAG loop: retrieve context with Vector Search, orchestrate with chains, augment prompts with what you retrieved, and engineer prompts that work.',
      examSections: ['Application Development'],
      icon: '🔗',
      lessons: [
        planned(
          'rag-architecture',
          'The anatomy of a RAG application',
          'The retrieve-then-generate loop, end to end, and where each Databricks piece plugs in.',
        ),
        planned(
          'vector-search-retrieval',
          'Retrieving context with Vector Search',
          'Querying a Mosaic AI Vector Search index for the most relevant chunks, with metadata filters.',
        ),
        planned(
          'langchain-chains',
          'Orchestrating with chains',
          'Using an orchestration framework like LangChain to wire prompts, retrievers, and models together.',
        ),
        planned(
          'prompt-augmentation',
          'Augmenting prompts with retrieved context',
          'Injecting retrieved chunks into the prompt so the model answers from your data, not its memory.',
        ),
        planned(
          'prompt-engineering',
          'Prompt engineering that works',
          'Instructions, examples, and templates that steer the model toward consistent, correct output.',
        ),
      ],
    },
    {
      id: 'hardening',
      order: 5,
      title: 'Guardrails, Hallucinations & Model Choice',
      summary:
        'Make the app trustworthy: add guardrails, cut hallucinations, defend against prompt injection, pick the right model for the job, and let agents use tools.',
      examSections: ['Application Development'],
      icon: '🛡️',
      lessons: [
        planned(
          'guardrails',
          'Guardrails: keeping the model in bounds',
          'Constraining inputs and outputs so the app stays safe, on-topic, and on-brand.',
        ),
        planned(
          'hallucinations',
          'Reducing hallucinations',
          'Why models make things up, and the grounding techniques that keep answers factual.',
        ),
        planned(
          'prompt-injection',
          'Defending against prompt injection',
          'How malicious input hijacks a prompt, and how to blunt it.',
        ),
        planned(
          'selecting-models',
          'Choosing the right model',
          'Trading off context window, quality, cost, and latency when selecting an LLM.',
        ),
        planned(
          'agents-tools',
          'Agents and tools: giving the model hands',
          'When to let a model call tools and take actions instead of just answering.',
        ),
      ],
    },
    {
      id: 'deploying',
      order: 6,
      title: 'Assembling & Deploying',
      summary:
        'Ship it: package a chain with MLflow, register it in Unity Catalog, build and sync a Vector Search index, and serve it behind an endpoint — start to finish.',
      examSections: ['Assembling and Deploying Applications'],
      icon: '🚀',
      lessons: [
        planned(
          'mlflow-packaging',
          'Packaging a chain with MLflow',
          'Logging a RAG chain as an MLflow model (pyfunc / LangChain flavor) so it’s reproducible and deployable.',
        ),
        planned(
          'unity-catalog-models',
          'Registering models in Unity Catalog',
          'Promoting a logged model into the Unity Catalog model registry with versions and aliases.',
        ),
        planned(
          'vector-search-index',
          'Creating and syncing a Vector Search index',
          'Building a Mosaic AI Vector Search index over a Delta table and keeping it up to date.',
        ),
        planned(
          'model-serving',
          'Serving models and endpoints',
          'Deploying a model behind a Mosaic AI Model Serving endpoint for real-time queries.',
        ),
        planned(
          'foundation-model-apis',
          'Foundation Model APIs and external models',
          'Pay-per-token vs provisioned throughput, and routing to external providers through Databricks.',
        ),
        planned(
          'deploy-end-to-end',
          'Deploying an end-to-end RAG app',
          'Sequencing every step — index, chain, register, serve — into one working deployment.',
        ),
      ],
    },
    {
      id: 'governance',
      order: 7,
      title: 'Governance & Security',
      summary:
        'Keep it compliant: govern GenAI assets with Unity Catalog, mask and protect sensitive data, and respect the legal and licensing terms of your data and models.',
      examSections: ['Governance'],
      icon: '🔐',
      lessons: [
        planned(
          'genai-governance',
          'Governing GenAI with Unity Catalog',
          'Bringing models, indexes, and data under one governance and permissions model.',
        ),
        planned(
          'masking-pii',
          'Masking and protecting sensitive data',
          'Keeping PII and confidential content out of prompts, logs, and responses.',
        ),
        planned(
          'legal-licensing',
          'Legal, licensing, and data provenance',
          'Staying on the right side of data-source and model-license terms.',
        ),
      ],
    },
    {
      id: 'evaluation',
      order: 8,
      title: 'Evaluation & Monitoring',
      summary:
        'Prove and protect quality: choose the right LLM metrics, evaluate with MLflow and LLM-as-a-judge, monitor live deployments, and control cost and latency.',
      examSections: ['Evaluation and Monitoring'],
      icon: '📊',
      lessons: [
        planned(
          'llm-eval-metrics',
          'How do you grade an LLM?',
          'Choosing evaluation metrics — faithfulness, relevance, toxicity, correctness — that fit the task.',
        ),
        planned(
          'mlflow-evaluate',
          'Evaluating with MLflow and LLM-as-a-judge',
          'Running MLflow evaluate and using a strong model to score another model’s answers.',
        ),
        planned(
          'monitoring-production',
          'Monitoring GenAI in production',
          'Inference tables and Lakehouse Monitoring to catch quality drift after deployment.',
        ),
        planned(
          'cost-latency',
          'Controlling cost and latency',
          'Keeping a deployed solution fast and affordable without wrecking quality.',
        ),
      ],
    },
  ],
}
