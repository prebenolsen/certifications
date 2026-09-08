# Research — Module GA1: GenAI Foundations on Databricks

Verified against Databricks documentation on **2026-09-08**. Step 3 of the
authoring loop (see `CLAUDE.md`). Facts here are what the lessons may assert;
everything else should be taught from understanding, not copied from docs.

---

## ⚠ Naming drift: the exam guide is behind the product

The single most important finding for this certification. The official exam guide
(and therefore the exam) uses **Mosaic AI** naming. The current documentation has
moved on.

| Exam guide / exam says | Documentation now says |
|---|---|
| **Mosaic AI Vector Search** | **Databricks AI Search** (docs: "formerly Databricks Vector Search") |
| Mosaic AI Agent Framework | **Custom Agents**; **Agent Bricks** as the agent control plane |
| Mosaic AI Model Serving | **Model Serving** (Mosaic AI prefix largely dropped) |
| — (not in guide) | **Agent Bricks**, **MLflow Tracing**, **Databricks Apps**, **Unity Gateway** |

A community MVP article notes Databricks has renamed **34+ products and
features**, several more than once, and points to the community-run
[REbricked](https://rebricked.org) project as a rename database.

**House convention for this repo** (already used in authored content, e.g.
`git-folders.ts` → *"A **Git folder** (formerly *Databricks Repos*)"*, and
`asset-bundles.ts`): lead with one name, put the other in parentheses.

**Decision for this cert — pending user confirmation:** lead with the **exam
guide's** name (that is what the exam asks) and note the current name once, e.g.
*"**Mosaic AI Vector Search** — renamed **Databricks AI Search** in the current
docs."* Teach the exam's vocabulary; don't let the learner be confused when they
open the console.

---

## Verified facts

### Databricks AI Search / Mosaic AI Vector Search

Source: <https://docs.databricks.com/aws/en/generative-ai/vector-search>

**Index types (four, not two — the exam guide implies fewer):**

1. **Delta Sync Index with Databricks-computed embeddings** — Databricks computes
   embeddings with a specified model; index auto-syncs with the source Delta table.
2. **Delta Sync Index with self-managed embeddings** — you supply pre-computed
   embeddings in the source Delta table; still auto-syncs.
3. **Direct Vector Access Index** — no auto-sync; you update via REST API.
4. **Full-Text Search Index** — BM25 keyword search, no vector embeddings
   (storage-optimized endpoints).

**Similarity:** HNSW (Hierarchical Navigable Small World) algorithm with **L2
distance**. For cosine similarity, embeddings must be **normalized first** —
normalized vectors give equivalent L2 rankings. *(This is a strong MCQ candidate
and a likely learner misconception: "Vector Search uses cosine similarity" is
only conditionally true.)*

**Hybrid search:** vector similarity + Okapi BM25, merged with **Reciprocal Rank
Fusion (RRF)**.

**Endpoint types:** *Standard* (~320M vectors @ 768 dims, high QPS) vs
*Storage-optimized* (1B+ vectors, 10–20× faster indexing, ~250 ms latency).

**Embedding provision:** Databricks-managed (via Foundation Model APIs or a
custom serving endpoint) or self-managed.

### Foundation Model APIs

Source: <https://docs.databricks.com/aws/en/machine-learning/foundation-model-apis/>

Three modes — the exam guide names only the first two:

1. **Pay-per-token** — easiest entry point; has a **priority mode** variant for
   latency-sensitive work.
2. **Provisioned throughput** — recommended for production; **on-demand** (no
   commitment) or **reserved** (fixed 1- or 3-month terms).
3. **AI Functions optimized models** — recommended for **batch inference**.

Provisioned throughput can serve models downloaded from Hugging Face or another
external source and registered in **Unity Catalog**.

### Current end-to-end RAG stack

Source: <https://docs.databricks.com/aws/en/generative-ai/tutorials/ai-cookbook/>

Index data (AI Search) → build agent (Custom Agents) → **MLflow Tracing** for
observability → evaluate/monitor → serve, optionally with a **Databricks Apps**
UI → govern via Unity Catalog.

**Note:** "Agent Bricks" templates (Knowledge Assistant, Supervisor Agent) are
current product surface but are **not** in the exam guide. Mention at most in
passing — do not build lessons on them.

---

## Open questions / not yet verified

- Which specific embedding models are recommended today (BGE / GTE families) —
  the FM APIs overview page did not enumerate model families. Verify before
  authoring `embeddings-vectors`.
- Whether MLflow 3.x changes the `pyfunc` / LangChain flavor story the exam guide
  assumes. Verify before **Module GA6** (packaging), not needed for GA1.

---

## Sources

- [Databricks AI Search overview](https://docs.databricks.com/aws/en/generative-ai/vector-search)
- [Foundation Model APIs](https://docs.databricks.com/aws/en/machine-learning/foundation-model-apis/)
- [Databricks AI cookbook (RAG/agents)](https://docs.databricks.com/aws/en/generative-ai/tutorials/ai-cookbook/)
- [Mosaic AI Vector Search (GCP docs, older naming)](https://docs.databricks.com/gcp/en/vector-search/vector-search)
- [Rename-history community article](https://community.databricks.com/t5/mvp-articles/how-to-track-the-latest-databricks-feature-names-complete-rename/td-p/163759)
