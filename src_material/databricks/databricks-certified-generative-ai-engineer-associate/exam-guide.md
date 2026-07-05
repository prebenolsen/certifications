# Databricks Certified Generative AI Engineer Associate — source material

Official page: <https://www.databricks.com/learn/certification/genai-engineer-associate>

## Exam facts

- **Questions:** 45 scored (plus a few unscored pilot items)
- **Duration:** 90 minutes
- **Cost:** USD 200
- **Delivery:** Multiple-choice, online-proctored or test center; no aids
- **Validity:** 2 years (recertification required)
- **Prerequisites:** None required; related training highly recommended
- **Recommended experience:** 6+ months hands-on building generative-AI
  solutions on Databricks

## What it assesses

Designing and implementing **LLM-enabled solutions using Databricks**: breaking
complex requirements into tasks, choosing appropriate models/tools/approaches
from the current GenAI landscape, and using Databricks-specific tools —
**Mosaic AI Vector Search** (semantic similarity), **Mosaic AI Model Serving**
(deploying models), **MLflow** (lifecycle management), and **Unity Catalog**
(governance). Central themes: **RAG (retrieval-augmented generation)**, prompt
engineering, embeddings, chunking, guardrails, and LLM evaluation.

## Sections and weightings

| # | Section | Weight |
|---|---------|:------:|
| 1 | Design Applications | 14% |
| 2 | Data Preparation | 14% |
| 3 | Application Development | 30% |
| 4 | Assembling and Deploying Applications | 22% |
| 5 | Governance | 8% |
| 6 | Evaluation and Monitoring | 12% |

## Detailed objectives

### Section 1 — Design Applications (14%)
- Design prompt–response pairs that reflect a use case's business objectives.
- Identify the input/output requirements that translate a business problem into
  a GenAI pipeline.
- Select the model task(s) and chain components (tools, retrievers, prompts)
  needed to produce a desired output for a given input.
- Determine the tools/data the model needs access to for the use case.
- Decompose a complex requirement into an ordered series of tasks/subtasks
  (multi-stage reasoning).

### Section 2 — Data Preparation (14%)
- Apply an appropriate **chunking strategy** for a given document structure and
  model context-length constraints (fixed size, overlap, structure-aware).
- Filter extraneous/irrelevant content from source documents.
- Choose the right Python packages/tools to extract text from documents
  (e.g., unstructured, PyPDF).
- Prepare and write chunked data for embedding into a vector store, with useful
  **metadata** for filtering.
- Recognize how source-data quality drives retrieval and response quality.

### Section 3 — Application Development (30%)
- Create the tools/retrievers needed to fetch data for a retrieval model.
- Select an **orchestration framework** (e.g., LangChain) to build chains of
  prompt templates, models, and retrievers.
- Craft effective **prompts**; augment prompts with retrieved context (RAG).
- Select the appropriate **embedding model** and chunking approach for retrieval.
- Select an LLM for a task based on context window, cost, latency, and quality.
- Implement **guardrails** and mitigate **hallucinations** and prompt injection.
- Build metadata-filtered retrieval and prompt templates for consistent output.

### Section 4 — Assembling and Deploying Applications (22%)
- Code a chain/app (e.g., LangChain or an MLflow `pyfunc` model).
- Register a model/chain to **Unity Catalog** via **MLflow**.
- Create and query a **Mosaic AI Vector Search** index (and keep it synced).
- Deploy a **Model Serving** endpoint (LLM and/or embedding model).
- Use **Foundation Model APIs** (pay-per-token / provisioned throughput) and
  **external models**.
- Sequence the steps to deploy an end-to-end RAG application.

### Section 5 — Governance (8%)
- Use **guardrails**/safety filters to prevent malicious or unwanted inputs and
  outputs.
- Apply **masking** and protect PII/sensitive data.
- Meet **legal and licensing** requirements for data sources and models
  (provenance, allowed use).
- Govern GenAI assets with **Unity Catalog**.

### Section 6 — Evaluation and Monitoring (12%)
- Select appropriate **LLM evaluation metrics** for a task (e.g., faithfulness,
  answer relevance, toxicity, correctness).
- Evaluate models/chains with **MLflow evaluate**, including **LLM-as-a-judge**.
- Monitor a deployed solution with **inference tables** and **Lakehouse
  Monitoring**; track quality drift over time.
- Control **cost and latency** of a deployed solution.
- Distinguish the evaluation phase (pre-deploy) from the monitoring phase
  (post-deploy).

## Key tools & concepts to cover

RAG · embeddings & vector similarity · Mosaic AI Vector Search · chunking
strategies · prompt engineering · LangChain chains/agents/tools · guardrails ·
hallucination mitigation · prompt injection · Foundation Model APIs · external
models · MLflow (tracking, `pyfunc`, model registry, evaluate) · Unity Catalog
governance · Model Serving endpoints · LLM-as-a-judge · inference tables ·
Lakehouse Monitoring · cost/latency trade-offs.
