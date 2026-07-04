import type { Lesson } from '@/types/content'

/**
 * Lesson: reading the query profile to find bottlenecks.
 * Maps to exam Section 6 (use the query profile to analyze a query and identify
 * bottlenecks: bad data skipping, inefficient joins, data shuffling).
 */
export const queryProfilingLesson: Lesson = {
  id: 'query-profiling',
  title: 'Finding the bottleneck in a query',
  summary:
    'Read the query profile to spot the three classic bottlenecks — poor data skipping, the wrong join, and heavy shuffles — and know the fix for each.',
  estimatedMinutes: 10,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: '"The query is slow" — but why?',
      body: 'A dashboard query takes 4 minutes. Do you add more workers? Rewrite the SQL? Re-cluster the table? Guessing wastes days. The **query profile** turns the guess into a diagnosis: it shows how many bytes were read, which join ran, and how much data moved across the network.\n\nRead the profile first; then you fix the actual bottleneck.',
      atWork:
        'The exam hands you a slow query and expects you to name the bottleneck from profile symptoms.',
    },
    {
      id: 'concept-profile',
      type: 'concept',
      title: 'What the query profile shows',
      body: 'The **query profile** (in Databricks SQL / query history) visualizes the executed plan stage by stage: rows and **bytes read** per scan, the **join type** chosen, **rows shuffled**, time spent, and spill. Each node’s metrics tell you where the time and data actually went — not where you assume they did.',
      takeaways: [
        'Per-stage metrics: bytes read, rows, join type, shuffle, spill.',
        'Shows the *executed* plan, not the query text.',
        'Read it before changing anything.',
      ],
    },
    {
      id: 'concept-bad-skipping',
      type: 'concept',
      title: 'Symptom 1: bad data skipping',
      body: 'If a filtered query’s scan reports reading **far more bytes/files than the result needs** — nearly the whole table for a narrow filter — data skipping isn’t working. The values you filter on are scattered across files, so min/max pruning can’t skip anything.\n\n**Fix:** cluster the table on the filter columns (Liquid Clustering) so values pack into few files with tight ranges.',
      takeaways: [
        'Symptom: huge bytes read for a selective filter.',
        'Cause: filtered values scattered across files.',
        'Fix: Liquid Clustering / ordering on the filter columns.',
      ],
    },
    {
      id: 'concept-bad-join',
      type: 'concept',
      title: 'Symptom 2: the wrong join',
      body: 'A big **sort-merge (shuffle) join** where one side is actually small shows up as large shuffle volume and long join time. Spark shuffled both sides when it could have broadcast the small one.\n\n**Fix:** let AQE broadcast it (ensure stats/thresholds allow it) or add a `BROADCAST` hint — ship the small table to every executor and skip the big shuffle.',
      takeaways: [
        'Symptom: large shuffle on a join with a small side.',
        'Cause: a shuffle join used where a broadcast would do.',
        'Fix: broadcast the small side (AQE or hint).',
      ],
    },
    {
      id: 'concept-shuffle',
      type: 'concept',
      title: 'Symptom 3: heavy shuffling & spill',
      body: 'Wide operations (joins, aggregations, `distinct`) shuffle data across the network. The profile shows big **shuffle read/write** and, worse, **spill** (data overflowing memory to disk) — the signature of an oversized or skewed stage.\n\n**Fix:** reduce the data before the shuffle (filter/aggregate earlier), address **skew** (AQE skew handling), or right-size shuffle partitions. Shuffle is often unavoidable, but excessive shuffle and spill are fixable.',
      takeaways: [
        'Symptom: large shuffle read/write and disk spill.',
        'Cause: too much data (or skew) crossing the network.',
        'Fix: filter earlier, handle skew, right-size partitions.',
      ],
    },
    {
      id: 'diagram-symptoms',
      type: 'diagram',
      title: 'Symptom → cause → fix',
      spec: {
        kind: 'flow',
        steps: [
          { label: 'Huge bytes read', sublabel: 'bad skipping → cluster the table', tone: 'warn' },
          { label: 'Big join shuffle', sublabel: 'wrong join → broadcast small side', tone: 'accent' },
          { label: 'Shuffle + spill', sublabel: 'too much/skew → filter early, fix skew', tone: 'bad' },
        ],
      },
      caption:
        'Three profile signatures, three fixes — read the metrics, don’t guess.',
    },
    {
      id: 'mcq-profile',
      type: 'mcq',
      question:
        'A selective query — `WHERE region = \'EU\'` returning 0.5% of rows — reads almost the entire table according to its query profile. What is the bottleneck and fix?',
      options: [
        {
          id: 'a',
          text: 'Poor data skipping: region values are scattered across files. Cluster the table on region so pruning works.',
        },
        {
          id: 'b',
          text: 'A shuffle join: add more shuffle partitions.',
        },
        { id: 'c', text: 'Insufficient executors: double the cluster size.' },
        { id: 'd', text: 'Slow disks: switch to a faster instance type.' },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'Correct — reading the whole table for a 0.5% filter means min/max pruning can’t skip; clustering on region tightens ranges so most files are skipped.',
        b: 'The symptom is scan volume, not a join shuffle.',
        c: 'More executors read the same excess bytes — the scan is the problem, not parallelism.',
        d: 'Faster disks read the unneeded data faster; they don’t make skipping work.',
      },
      explanation:
        'Massive bytes read for a highly selective filter is the classic *bad data skipping* signature — fixed by clustering on the filter column, not more hardware.',
      examObjective:
        'Use the query profile to analyze the query and identify bottlenecks, such as bad data skipping, inefficient types of joins, and data shuffling.',
    },
    {
      id: 'flash-scan',
      type: 'flashcard',
      front: 'In a query profile, what does "bytes read ≫ result size" for a selective filter indicate?',
      back: 'Poor **data skipping** — the filter column isn’t clustered, so min/max pruning can’t skip files. Cluster on that column.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now diagnose a slow query',
      points: [
        'The query profile shows per-stage bytes, join type, shuffle, and spill.',
        'Huge bytes read for a selective filter = bad skipping → cluster the table.',
        'Big shuffle on a small-sided join = wrong join → broadcast it.',
        'Large shuffle + spill = too much data/skew → filter early, fix skew.',
        'Diagnose from metrics before adding hardware.',
      ],
      closing: 'Next module: sharing data across organizations and querying systems in place. 🔗',
    },
  ],
}
