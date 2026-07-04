import type { Lesson } from '@/types/content'

/**
 * Lesson: data skipping, file pruning, and controlling output file size.
 * Maps to exam Section 6 (optimization techniques: data skipping, file pruning).
 * Covers sample question 7 (sizing Parquet output via maxPartitionBytes, no shuffle).
 */
export const dataSkippingPruningLesson: Lesson = {
  id: 'data-skipping-pruning',
  title: 'The files Spark never reads',
  summary:
    'How file statistics let Delta skip data, and how to size output files — including hitting a target part-file size without shuffling.',
  estimatedMinutes: 11,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'Reading 4 files instead of 40,000',
      body: 'Your query filters `WHERE event_date = \'2026-07-01\'`. The table has 40,000 files. A great query engine opens **four** of them and ignores the rest.\n\nThat skipping is not magic — it is powered by statistics Delta records per file. Understanding it (and the file sizes behind it) is half of performance tuning.',
      atWork:
        'When a query is slow "for no reason," the answer is usually that data skipping isn’t working — bad file sizes or an unhelpful filter.',
    },
    {
      id: 'concept-stats',
      type: 'concept',
      title: 'Every file carries min/max stats',
      body: 'When Delta writes a data file, it records **statistics** in the transaction log — for the leading columns it stores the **min and max value** in that file (plus null counts).\n\nAt query time, the engine reads the log, compares your filter to each file’s min/max, and **skips any file that can’t contain matching rows**. It never even opens them.',
      takeaways: [
        'Delta stores per-file min/max in the transaction log.',
        'Filters are checked against those ranges before reading.',
        'Files that can’t match are skipped entirely — data skipping.',
      ],
    },
    {
      id: 'concept-pruning',
      type: 'concept',
      title: 'File pruning needs clustered data',
      body: 'Skipping only helps if the values you filter on are **physically clustered** into few files. If `event_date` rows are scattered across every file, each file’s min/max spans the whole range and nothing can be skipped.\n\nThis is why Liquid Clustering (or a good sort order) matters: it packs similar values together so min/max ranges are *tight* and pruning is effective.',
      takeaways: [
        'Tight min/max ranges → aggressive skipping.',
        'Scattered values → every file "might match" → no skipping.',
        'Clustering/ordering is what makes skipping work.',
      ],
    },
    {
      id: 'tf-skipping',
      type: 'truefalse',
      statement:
        'Data skipping works equally well whether or not the filtered column’s values are clustered into few files.',
      answer: false,
      explanation:
        'Skipping depends on tight per-file min/max ranges. If values are scattered across all files, every file’s range overlaps the filter and none can be skipped — clustering is what makes pruning effective.',
    },
    {
      id: 'concept-file-size',
      type: 'concept',
      title: 'File size is a tuning knob',
      body: 'Files that are **too small** flood the engine with overhead (open millions of files, huge log). Files **too large** hurt skipping granularity and parallelism. The sweet spot is roughly a few hundred MB to ~1 GB.\n\nDelta tables get **auto-optimize / auto-compaction** to manage this for you. Plain Parquet does not — there you control size yourself through how the data is partitioned in memory before the write.',
      takeaways: [
        'Too many tiny files = overhead; too few huge files = poor parallelism/skipping.',
        'Delta auto-optimizes; plain Parquet does not.',
        'For Parquet, output files = in-memory partitions at write time.',
      ],
    },
    {
      id: 'concept-no-shuffle',
      type: 'concept',
      title: 'Sizing without rearranging: maxPartitionBytes',
      body: 'To hit a target part-file size on a write **without a shuffle**, control the *input* partition size. `spark.sql.files.maxPartitionBytes` caps how many bytes go into each partition when reading. With only **narrow** transformations after (no shuffle), those partitions flow straight to the writer — one output file each, at the target size.\n\n`repartition()` and sort-based repartitioning cause a **full shuffle** (rearranging data). `coalesce()` only merges partitions and can’t split oversized ones. `spark.sql.shuffle.partitions` only affects wide operations — irrelevant if there is no shuffle.',
      takeaways: [
        '`maxPartitionBytes` sets read split size → output file size with narrow ops.',
        '`repartition()` = full shuffle = rearranging data.',
        '`coalesce()` only merges; `shuffle.partitions` only affects wide ops.',
      ],
    },
    {
      id: 'mcq-parquet-size',
      type: 'mcq',
      question:
        'A 1 TB JSON dataset must be written to Parquet with a target part-file size of 512 MB. Because it is Parquet (not Delta), auto-optimize is unavailable. Which approach works *without rearranging the data*?',
      options: [
        {
          id: 'a',
          text: 'Ingest, run the narrow transforms, repartition to 2,048 partitions, then write to Parquet.',
        },
        {
          id: 'b',
          text: 'Set advisoryPartitionSizeInBytes to 512 MB, ingest, run narrow transforms, coalesce to 2,048 partitions, then write.',
        },
        {
          id: 'c',
          text: 'Set spark.sql.files.maxPartitionBytes to 512 MB, ingest, run the narrow transforms, then write to Parquet.',
        },
        {
          id: 'd',
          text: 'Set spark.sql.shuffle.partitions to 2,048, ingest, run narrow transforms, sort the data to repartition, then write.',
        },
      ],
      correct: ['c'],
      optionFeedback: {
        a: 'repartition() triggers a full shuffle — that *is* rearranging the data.',
        b: 'advisoryPartitionSizeInBytes only affects AQE shuffles, and coalesce can’t split large partitions to the target size.',
        c: 'Correct — maxPartitionBytes sizes the read splits to 512 MB; narrow transforms preserve them; each becomes one ~512 MB file with no shuffle.',
        d: 'shuffle.partitions only matters for wide ops, and sorting forces a shuffle — again rearranging data.',
      },
      explanation:
        'With only narrow transformations, output files mirror input partitions. Setting `maxPartitionBytes` to 512 MB yields 512 MB output files and never shuffles.',
      examObjective:
        'Understand the optimization techniques used by Databricks to ensure performance of queries on large datasets (data skipping, file pruning, etc.).',
    },
    {
      id: 'concept-deletion-vectors',
      type: 'concept',
      title: 'Deletion vectors: delete without rewriting',
      body: 'Normally a DELETE or UPDATE rewrites every file that held a changed row. **Deletion vectors** instead record "these row positions are gone" in a side file, leaving the data file in place. The rewrite happens later, lazily, during OPTIMIZE.\n\nThis makes DELETE/UPDATE/MERGE far cheaper and keeps writes fast, at the cost of a small read-time filter until compaction cleans up.',
      takeaways: [
        'Deletion vectors mark removed rows instead of rewriting files.',
        'DELETE/UPDATE/MERGE become much cheaper.',
        'OPTIMIZE later materializes the changes and reclaims space.',
      ],
    },
    {
      id: 'flash-maxpartitionbytes',
      type: 'flashcard',
      front: 'Which config sizes output files on a narrow-only write without shuffling?',
      back: '`spark.sql.files.maxPartitionBytes` — it caps read-split size, and with no shuffle each partition becomes one output file of that size.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now make Spark read less',
      points: [
        'Delta stores per-file min/max; filters skip files that can’t match.',
        'Skipping only works when values are clustered into few files.',
        'File size matters: avoid tiny-file overhead and oversized files.',
        'Size Parquet output with `maxPartitionBytes` + narrow ops — no shuffle.',
        'Deletion vectors make deletes/updates cheap by deferring the rewrite.',
      ],
      closing: 'Next: propagating just the changed rows downstream — Change Data Feed. 🔁',
    },
  ],
}
