# Research — Data Analyst Associate

**Date:** 2026-09-09 · **Why:** the cert was parked at 2/24 and is now being
authored in full. Verified the volatile specifics before writing: product names
Databricks has renamed, and the mechanics the exam asks about by name.

## Renames the learner will hit (exam guide vs current docs)

| Exam guide says | Current docs say | Note |
|---|---|---|
| **AI/BI Genie spaces** | **Genie Agents** ("formerly known as Genie Spaces") | Same thing. Part of a family: **Genie One** (ask-your-data UI), **Genie Agents** (curated spaces), **Genie Code** (the coding assistant). |
| **Databricks Assistant** | **Genie Code** | Same assistant, in notebooks, SQL editor, jobs, dashboards, file editor. |
| **DeltaLive tables** (sic) | **Lakeflow Pipelines** | DLT → Lakeflow Spark Declarative Pipelines → Lakeflow pipelines. See the DE Associate research note. |
| Workflows | **Lakeflow Jobs** | |

Teach the exam's name first, note the current one — the house convention already
used for *Git folder (formerly Databricks Repos)*.

## Unity Catalog

- Definition: *"the unified governance layer for data and AI built into Databricks."*
- Hierarchy: **metastore → catalog → schema → objects** (tables, views, volumes,
  functions, models, services). Storage credentials, external locations,
  connections and shares hang off the **metastore**, not the three-level path.
- **Securable object** = *"an object on which you can grant permissions to users,
  service principals, or groups."*
- Tables/volumes are **managed** (UC controls governance *and* file storage) or
  **external** (governance only).
- Auto-enabled for workspaces created after **8 Nov 2023**.
- Features: access control at query time, lineage, audit logging, discovery via
  Catalog Explorer, classification/quality monitoring, sharing via open sharing.

### Privileges — verified names

Querying one table needs **three** grants: `SELECT` on the table, **`USE CATALOG`**
on its catalog, **`USE SCHEMA`** on its schema.

- Data access: `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `MODIFY`, `EXECUTE`, `REFRESH`
- Discovery/metadata: `BROWSE`, `READ METADATA`, `APPLY TAG`
- Traversal: `USE CATALOG`, `USE SCHEMA`, `USE MARKETPLACE ASSETS`
- Creation: `CREATE TABLE`, `CREATE SCHEMA`, `CREATE MATERIALIZED VIEW`, …
- Management: `MANAGE`, `MANAGE ACCESS CONTROL`
- `ALL PRIVILEGES`

Inheritance flows **down**: a grant on a schema covers all current *and future*
tables in it. Metastore-level grants generally do **not** inherit down (exception:
`READ METADATA`). `MANAGE` ≠ ownership: it can grant, transfer ownership, rename
and drop, but does **not** confer the data privileges themselves.

## Databricks SQL objects

| Object | Verified definition |
|---|---|
| **Materialized view** | *"a Unity Catalog managed table that physically stores the results of a query, defined outside of a Lakeflow pipeline."* Refresh is **incremental or full** — a cost model picks, overridable with `REFRESH POLICY`. `TRIGGER ON UPDATE` or `SCHEDULE CRON`. |
| **Streaming table** | *"a table registered to Unity Catalog with extra support for streaming or incremental data processing, defined outside of a Lakeflow pipeline."* Each refresh *"only evaluates new rows that have arrived after the last update, and appends only the new data."* |
| **Dynamic view** | A view whose logic branches on the caller: `is_account_group_member()` (recommended for UC), `session_user()`; `is_member()` is legacy/Hive-metastore. Used for row filtering, column masking, redaction. |
| **Foreign table** | *"Read-only access to data in external systems connected through Lakehouse Federation."* |

**Important for cost questions:** creating or refreshing a materialized view or
streaming table runs on a **serverless pipeline**, not on the SQL warehouse —
warehouse size does not cap that compute.

## Photon

- Native **C++ vectorized** query engine, fully compatible with Apache Spark APIs.
- Accelerates SQL, DataFrame calls, ETL, stateless streaming; biggest wins on
  hash joins, shuffles, aggregations, Parquet/Delta writes, BI queries.
- **On by default** for SQL warehouses, serverless compute and serverless
  pipelines; optional (a checkbox) on classic compute.
- *"Queries that normally complete in under two seconds don't see meaningful
  improvement"* — planning/scheduling dominates.
- Photon instances **consume DBUs at a different rate**.

## Query history & profile

- `system.query.history` records queries run on SQL warehouses and serverless.
- Filterable by `executed_by`, `compute`, `execution_status`, `start_time`.
- Metrics: `total_duration_ms`, `compilation_duration_ms`, `read_rows`,
  `read_bytes`, `read_files`, `read_io_cache_percent`.
- `statement_id` links a history row to its **query profile**.
- Sample Q10's answer set (filter by user/date/compute/status · detailed
  execution metrics) matches this exactly.

## AI/BI dashboards

- **Data tab** holds **datasets** ("defined from tables, views, or custom queries");
  **Canvas tab** holds the widgets.
- Filters exist at **global, page-level and widget-level**; cross-filtering and
  drill-through supported.
- Published dashboards use **shared or individual data permissions** ("run as
  owner" vs "run as viewer" in the UI).
- Can be shared with anyone in the **account**, even without workspace access,
  and embedded in external sites via **iframes**.
- **Scheduled refresh** plus email/Slack **subscriptions**.

## Genie Agents (exam: "Genie spaces")

- Requires a **pro or serverless SQL warehouse** (need `CAN USE` on it).
- Up to **30 tables or views** per agent, curated from Unity Catalog.
- Configuration: **sample/common questions**, **general instructions**,
  **trusted assets** (accepted example SQL queries, shown in the SQL Queries
  context).
- Permissions: creator gets `CAN MANAGE`; editors `CAN EDIT`; users `CAN VIEW`/
  `CAN RUN` **plus `SELECT` on the underlying data** — data access is evaluated
  per end user, and row filters still apply.
- Limits: 10,000 conversations per agent, 10,000 messages per conversation.

## Databricks Assistant slash commands

Documented: **`/optimize`** (evaluate and optimise SQL/Python/PySpark),
**`/fix`** and **`/doc`** (both propose changes in a diff you accept or reject).
The exam's sample question 2 answers **`/explain`** for a step-by-step walkthrough
of a query — teach it as the exam states it.

## Marketplace

- *"an open exchange where data providers, software vendors, and technology
  partners publish offerings"* — datasets (catalogs, plus volumes for
  non-tabular), notebooks, AI models, MCP servers.
- Powered by the **open sharing protocol** (Delta Sharing family), so no copy.
- **Provider** publishes, **consumer** requests. Public listings offer **instant
  access**: agree to the terms and the shared catalog appears — no provider
  approval, no pipeline.

## Sources

- https://docs.databricks.com/aws/en/data-governance/unity-catalog/
- https://docs.databricks.com/aws/en/data-governance/unity-catalog/manage-privileges/privileges
- https://docs.databricks.com/aws/en/genie/ and https://docs.databricks.com/aws/en/genie/set-up
- https://docs.databricks.com/aws/en/notebooks/use-databricks-assistant
- https://docs.databricks.com/aws/en/dashboards/
- https://docs.databricks.com/aws/en/views/materialized · .../views/dynamic · .../tables/streaming · .../tables/
- https://docs.databricks.com/aws/en/compute/photon
- https://docs.databricks.com/aws/en/admin/system-tables/query-history
- https://docs.databricks.com/aws/en/marketplace/
- https://docs.databricks.com/aws/en/discover/
- `../exam-guide.md`
