# Certification Roadmap

A living tracker for **which certifications this platform covers, what's missing,
and the natural path forward** for a Databricks-focused data engineer branching
into Azure data platforms, Infrastructure as Code (IaC), and GitHub Copilot.

- For the *lesson-level* inventory of authored content, see [`CONTENT.md`](CONTENT.md).
- This file is about the *certification catalog and direction* — what to build/
  study next, and why.

**Learner profile:** 7 years as a Databricks data engineer. Wants to complete as
many certifications as possible within the domain: **Databricks · Azure · GitHub
Copilot**, plus growth into **IaC** and **data platforms built on Azure**.

Legend — platform build status:
✅ authored (complete) · 🚧 scaffolded (modules + planned lessons, authoring pending) ·
🅿️ parked (intentionally unfinished) · ⬜ not yet on the platform (candidate)

---

## A. What we have (on the platform today)

| Certification | Provider | Code | Build status | Lessons |
|---|---|---|---|---|
| Data Engineer Associate | Databricks | — | ✅ complete | 24 / 24 |
| Data Engineer Professional | Databricks | — | ✅ complete | 31 / 31 |
| Generative AI Engineer Associate | Databricks | — | 🚧 scaffolded | 0 / 35 |
| GitHub Copilot | GitHub | GH-300 | 🚧 scaffolded | 3 / 27 (Module 1 done) |
| Data Analyst Associate | Databricks | — | 🅿️ parked | 2 / 24 |

**Immediate build backlog (already scaffolded, just needs authoring):**
1. **GitHub Copilot (GH-300)** — resume at Module 2 (Data & Architecture).
2. **Databricks GenAI Engineer Associate** — start at Module 1 (Foundations).

---

## B. What's missing (candidate certifications by track)

### Track 1 — Databricks (finish the ladder)
Leverages existing expertise most directly; same platform this repo already covers.

| Certification | Status | Why it fits |
|---|---|---|
| Apache Spark Developer Associate | ⬜ | Formalizes the Spark core you already use daily — an easy win. |
| Machine Learning Associate | ⬜ | Bridges DE into MLflow, feature stores, model lifecycle. |
| Machine Learning Professional | ⬜ | Advanced MLOps; natural follow-on to ML Associate. |
| Data Analyst Associate | 🅿️ | Already scaffolded but parked; low priority for a DE. |

### Track 2 — Azure data platform (the Azure-side counterpart to your DE role)
> ⚠️ **DP-203 (Azure Data Engineer Associate) was retired in 2025.** The current
> Azure data-engineering path is **Microsoft Fabric**, not DP-203.

| Certification | Code | Status | Why it fits |
|---|---|---|---|
| Azure Data Fundamentals | DP-900 | ⬜ | Foundational Azure data concepts; quick, orienting badge. |
| Fabric Data Engineer Associate | DP-700 | ⬜ | The direct Azure counterpart to your Databricks DE work. |
| Fabric Analytics Engineer Associate | DP-600 | ⬜ | Analytics/modeling on Fabric; complements DP-700. |

### Track 3 — Azure core & Infrastructure as Code (the "data platform on Azure" foundation)
The infra the data platform runs on, plus the IaC to provision it repeatably.

| Certification | Code | Status | Why it fits |
|---|---|---|---|
| Azure Fundamentals | AZ-900 | ⬜ | Baseline Azure cloud literacy; fast on-ramp. |
| Azure Administrator Associate | AZ-104 | ⬜ | Real platform depth: networking, storage, identity, governance. |
| HashiCorp Terraform Associate | 003 | ⬜ | **The** IaC cert — cloud-agnostic, pairs perfectly with Azure. |
| Azure Solutions Architect Expert | AZ-305 | ⬜ | Longer-term stretch: design end-to-end Azure platforms. |

> **IaC note:** Terraform is the vendor-neutral IaC credential. Azure's native
> IaC is **Bicep/ARM** (no standalone cert — it's exercised inside AZ-104/AZ-305).
> Learn Terraform for the cert + portability; know Bicep for Azure-native shops.

### Track 4 — GitHub (automation & the Copilot family)
Ties the data platform together with CI/CD and versioning; extends the Copilot work.

| Certification | Status | Why it fits |
|---|---|---|
| GitHub Foundations | ⬜ | Baseline GitHub fluency; quick badge. |
| GitHub Actions | ⬜ | CI/CD for data pipelines *and* IaC — high leverage for a platform DE. |
| GitHub Copilot (GH-300) | 🚧 | Already scaffolded here. |
| GitHub Advanced Security | ⬜ | Optional; security-scanning depth. |

---

## C. Natural next step(s) — a sequenced path

Ordered to build momentum (finish what's started), then widen the moat
(Databricks → Azure data → Azure infra + IaC → automation), with foundations
slotted in only where they genuinely help.

**Phase 1 — Finish what's on the platform** *(no new exams; author existing content)*
- Author **Databricks GenAI Engineer Associate** (your chosen next cert).
- Author **GitHub Copilot (GH-300)** remaining modules.

**Phase 2 — Complete the Databricks ladder** *(highest ROI; you already know most of it)*
- **Apache Spark Developer Associate** (easy win).
- **Databricks ML Associate** (broadens DE → ML).

**Phase 3 — Azure data platform** *(your role, on Azure)*
- **DP-900** (optional quick foundation) → **DP-700 Fabric Data Engineer**.
- Then **DP-600 Fabric Analytics Engineer** if going deeper on analytics.

**Phase 4 — Azure foundation + IaC** *(the "data platform on Azure" goal)*
- **AZ-900** (fast) → **AZ-104 Azure Administrator**.
- **HashiCorp Terraform Associate** (the IaC credential).
- Stretch goal: **AZ-305 Solutions Architect Expert**.

**Phase 5 — Automation & breadth** *(glue + optional)*
- **GitHub Actions** (CI/CD for pipelines and IaC) and **GitHub Foundations**.
- Optional AI-adjacent: **AI-900**, **AI-102**, or **DP-100** if ML interest grows.

### The single recommended thread
`GenAI Engineer (author) → Spark Developer → DP-700 (Fabric) → Terraform Associate → AZ-104`
— it moves you Databricks → Azure data → IaC → Azure infra without wasted detours,
and every step reinforces the "data platform on Azure" foundation you want.

---

## D. Maintenance notes

- Update **Section A** whenever a cert is added/authored here (keep it in step
  with [`CONTENT.md`](CONTENT.md) and [`CHANGELOG.md`](CHANGELOG.md)).
- Re-check exam codes periodically — Microsoft rotates them (e.g., DP-203 →
  Fabric). Exact question counts / prices are intentionally *not* tracked here;
  they don't matter for learning and they drift.
- When a candidate cert moves from ⬜ to 🚧, add its full module/lesson table to
  `CONTENT.md` via the `add-certification` skill.
