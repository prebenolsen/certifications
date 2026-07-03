import type { Lesson } from '@/types/content'

/**
 * Lesson: cleaning bronze data into silver with PySpark, plus quality checks.
 * Maps to exam Section 3 (implement data cleaning by reading bronze tables,
 * cleaning nulls, standardizing types, writing silver tables; apply data
 * quality checks and validation rules).
 */
export const bronzeToSilverLesson: Lesson = {
  id: 'bronze-to-silver',
  title: 'Bronze to silver: making data trustworthy',
  summary:
    'The medallion architecture, the PySpark cleanup toolkit (nulls, types), and quality checks that stop bad data at the door.',
  estimatedMinutes: 10,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'Raw data lies',
      body: 'The bronze `customers` table just ingested has ages stored as strings (`"34"`), phone numbers that are sometimes null, dates in three formats, and a `country` column containing both `"NO"` and `"Norway"`.\n\nIf analysts query this directly, every one of them re-fixes these problems — differently. The **silver layer** exists so the fixing happens once, in one place, with rules everyone shares.',
      atWork:
        'When two dashboards disagree, the usual culprit is two analysts cleaning raw data in two different ways.',
    },
    {
      id: 'analogy-kitchen',
      type: 'analogy',
      title: 'Medallion = a restaurant’s food flow',
      body: 'A restaurant never cooks straight from the delivery truck. Deliveries go to the **loading dock** as-is (bronze), get **washed, trimmed and portioned** in prep (silver), and are **plated into dishes** for service (gold).\n\nCrucially, the dock keeps receiving raw goods untouched — if a prep batch is ruined, you can always re-prep from raw.',
      mapping: [
        { from: 'Loading dock — accept everything as delivered', to: 'Bronze: raw, as ingested' },
        { from: 'Prep station — washed, trimmed, portioned', to: 'Silver: cleaned, typed, deduplicated' },
        { from: 'Plated dishes ready to serve', to: 'Gold: business-ready aggregates' },
      ],
    },
    {
      id: 'diagram-medallion',
      type: 'diagram',
      title: 'The medallion architecture',
      spec: {
        kind: 'flow',
        steps: [
          { label: 'Bronze', sublabel: 'raw, append-only', tone: 'warn' },
          { label: 'Silver', sublabel: 'cleaned & conformed', tone: 'accent' },
          { label: 'Gold', sublabel: 'business-ready', tone: 'good' },
        ],
        arrows: ['clean · type · dedupe', 'aggregate · model'],
      },
      caption:
        'Each hop raises quality. Bronze is never edited in place — it is the replayable source of truth.',
    },
    {
      id: 'concept-cleaning',
      type: 'concept',
      title: 'The cleanup toolkit',
      body: 'A silver job reads bronze, applies a small set of standard moves, and writes a new table:\n\n• **Nulls**: `dropna()` to remove rows missing critical fields, `fillna()` to default the rest.\n• **Types**: `cast()` strings into real `int`/`double`/`timestamp` columns.\n• **Values**: normalize inconsistent codes (`when/otherwise`, mappings).\n\nSame moves in SQL: `WHERE x IS NOT NULL`, `CAST(...)`, `CASE WHEN`.',
      takeaways: [
        'dropna / fillna for nulls — decide per column which is right.',
        'cast() early: typed columns catch bad data and enable date math.',
        'Write to a **new** silver table; never mutate bronze.',
      ],
    },
    {
      id: 'example-cleaning',
      type: 'example',
      title: 'A real silver job',
      intro: 'Read bronze → clean → write silver:',
      code: {
        language: 'python',
        content:
          'from pyspark.sql import functions as F\n\nbronze = spark.read.table("crm.bronze_customers")\n\nsilver = (bronze\n  .dropna(subset=["customer_id"])                  # no id, no row\n  .fillna({"phone": "unknown"})                    # default the optional\n  .withColumn("age", F.col("age").cast("int"))     # "34" -> 34\n  .withColumn("signup_date",\n              F.to_date("signup_date", "yyyy-MM-dd"))\n  .dropDuplicates(["customer_id"]))\n\nsilver.write.mode("overwrite").saveAsTable("crm.silver_customers")',
      },
      explanation:
        'Notice the shape: **read a table, return a better table**. Every transformation is a pure step — which makes the job testable and re-runnable.',
    },
    {
      id: 'concept-quality',
      type: 'concept',
      title: 'Quality checks: trust, verified',
      body: 'Cleaning fixes what you *expected* to be wrong. **Quality checks** catch what you didn’t. Two levels:\n\n• **Table constraints** on Delta tables: `NOT NULL` and `CHECK` constraints make the table itself **reject** invalid writes (`ALTER TABLE ... ADD CONSTRAINT valid_age CHECK (age >= 0)`).\n• **Pipeline expectations**: declarative rules in Lakeflow pipelines that count, drop, or fail on violating rows — so you can *measure* quality per run, not just enforce it.',
      takeaways: [
        'Constraints = the table defends itself.',
        'Expectations = quality measured and acted on per pipeline run.',
        'Silver and gold should both carry validation rules.',
      ],
    },
    {
      id: 'mistake-overwrite-bronze',
      type: 'mistake',
      title: 'The tidy-bronze temptation',
      myth: '“The bronze table is messy — let’s just clean it in place and keep one tidy table.”',
      reality:
        'Bronze’s messiness is its value: it is the **faithful record of what the source actually sent**. Clean it in place and you can never replay history, debug an ingestion bug, or recover from a cleaning mistake. Keep bronze raw and append-only; put the cleaned view of the world in silver.',
    },
    {
      id: 'mcq-cleaning',
      type: 'mcq',
      question:
        'A bronze table has `order_total` stored as a string, some rows with a null `order_id`, and occasional exact-duplicate rows. Which sequence produces a correct silver table?',
      options: [
        { id: 'a', text: 'Drop rows with null order_id → cast order_total to double → dropDuplicates → write to a new silver table.' },
        { id: 'b', text: 'fillna("0") on order_id → write over the bronze table.' },
        { id: 'c', text: 'Cast order_total to double in a view over bronze; keep duplicates since storage is cheap.' },
        { id: 'd', text: 'Delete the null and duplicate rows from bronze, then rename bronze to silver.' },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'Filter the unusable, fix the types, deduplicate, and write a **new** table — the standard silver recipe.',
        b: 'Inventing fake ids corrupts joins downstream, and overwriting bronze destroys the raw record.',
        c: 'Duplicates aren’t a storage problem — they’re a *correctness* problem (double-counted revenue).',
        d: 'Mutating and renaming bronze means there is no raw layer left to replay from.',
      },
      explanation:
        'Silver = a new table derived from bronze with nulls handled, types standardized, and duplicates removed. Bronze remains untouched.',
      examObjective:
        'Implement data cleaning by reading bronze tables with PySpark/SQL, cleaning nulls, standardizing data types, and writing to new silver tables.',
    },
    {
      id: 'flash-medallion',
      type: 'flashcard',
      front: 'Which medallion layer is append-only and never edited in place — and why?',
      back: '**Bronze.** It is the replayable record of what sources actually sent; every downstream fix can be rebuilt from it.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You now clean data like a pipeline, not a script',
      points: [
        'Medallion: bronze (raw) → silver (clean) → gold (business-ready).',
        'The toolkit: dropna/fillna, cast, normalize values, dropDuplicates.',
        'Always write silver as a new table; bronze stays raw.',
        'Constraints and expectations turn “probably fine” into verified quality.',
      ],
      closing: 'Clean tables want company. Next: combining them with joins. 🤝',
    },
  ],
}
