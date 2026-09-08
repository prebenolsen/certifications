# Research — Lakeflow (for the DE Associate)

**Date:** 2026-09-08 · **Why:** the certification referenced *Lakeflow Jobs*,
*Lakeflow Connect* and *Lakeflow pipelines* throughout without ever defining
Lakeflow, and had no lesson on pipelines at all.

## Naming, as of today

| Learner will see | Status |
|---|---|
| **Delta Live Tables (DLT)** | Oldest name. Still all over blogs and older courses. |
| **Lakeflow Spark Declarative Pipelines** | What the **exam guide** says (line 55, 162). |
| **Lakeflow pipelines** | What the **current docs** say. |

Same product throughout. Teach the exam guide's name, note the current one — the
house convention already used for *Git folder (formerly Databricks Repos)*.

Related renames the content already handles: Workflows → **Lakeflow Jobs**,
Databricks Repos → **Git folders**, Databricks Asset Bundles → **Declarative
Automation Bundles** (both names in the guide).

## Lakeflow has four components, not three

> "Lakeflow is a unified solution for ingestion, transformation, and
> orchestration of your data, and includes Lakeflow Connect, Lakeflow pipelines,
> Lakeflow Designer, and Lakeflow Jobs."

1. **Lakeflow Connect** — ingestion. Managed connectors (SaaS, databases,
   incremental change capture) and standard connectors (files, message buses).
2. **Lakeflow Pipelines** — transformation. Built on **Apache Spark Declarative
   Pipelines**.
3. **Lakeflow Designer** — visual/natural-language authoring; output is a real
   pipeline governed by Unity Catalog. **Was missing from our content entirely.**
4. **Lakeflow Jobs** — orchestration.

## Pipeline vocabulary (the Concepts page)

- **Pipeline** — "the unit of development and execution, and is the container for
  the flows, streaming tables, materialized views, and sinks that you define."
- **Flow** — "the foundational data processing concept in pipelines": reads a
  source, applies logic, writes to a target.
- **Streaming table** — managed table for append-only sources; "each record is
  processed exactly one time."
- **Materialized view** — managed table whose "results are recomputed as needed
  to reflect the current state of the data."
- **View** — "Evaluated on demand, not persisted."
- **Sink** — "a streaming target for a pipeline": Delta tables, Kafka topics,
  EventHubs topics, custom Python.
- **AUTO CDC** — streaming flow that "handles out of order CDC events and
  supports both SCD Type 1 and SCD Type 2." Formerly `APPLY CHANGES INTO`.
- **Expectation** — "optional clauses on datasets that validate data as it flows
  through the pipeline", SQL boolean constraints.

## Expectation syntax — verified

```sql
CREATE OR REFRESH STREAMING TABLE orders_valid(
  CONSTRAINT valid_date
  EXPECT (order_datetime IS NOT NULL AND length(order_datetime) > 0)
  ON VIOLATION DROP ROW
) AS SELECT * FROM STREAM read_files("/databricks-datasets/retail-org/sales_orders");
```

**Three actions, and the default is the one people forget:**

| `ON VIOLATION` | Behaviour |
|---|---|
| *omitted* | **warn** — violating rows are **kept**; the count is recorded in the event log's `ExpectationMetrics` |
| `DROP ROW` | the whole row is dropped |
| `FAIL UPDATE` | processing fails, on both create and refresh |

`expectation_expr` may use literals, column identifiers of the dataset, and
deterministic built-in SQL functions/operators — **no subqueries**.

## Where this touches the Associate exam

The guide never gives pipelines their own section, which is why the gap was easy
to miss — it references them from three others:

- **Section 3 (22%)** — "Gold layer objects such as materialized views, views,
  streaming tables, and tables"; "Apply data quality checks and validation rules".
- **Section 4 (16%)** — "Configure common tasks (notebook, SQL query, dashboard,
  and **pipeline tasks**)".
- **Section 5 (10%)** — "Deploy Declarative Automation Bundles … to package,
  configure, and promote Lakeflow Jobs, **Lakeflow Spark Declarative Pipelines**,
  and other workspace assets".

## Sources

- https://docs.databricks.com/aws/en/data-engineering/ — Lakeflow overview and the four components
- https://docs.databricks.com/aws/en/ldp/concepts — pipeline vocabulary
- https://docs.databricks.com/aws/en/ldp/expectations — expectation syntax and `ON VIOLATION` actions
- https://docs.databricks.com/aws/en/ldp/developer/ldp-sql-ref-create-streaming-table
- https://docs.databricks.com/aws/en/ldp/developer/sql-dev
- `../exam-guide.md`
