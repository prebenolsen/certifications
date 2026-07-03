import type { Lesson } from '@/types/content'

/**
 * Lesson: reading the Spark UI — skew, shuffle, spill.
 * Maps to exam Section 6 (identify common performance bottlenecks such as data
 * skew, shuffling, and disk spilling by interpreting stage-level metrics in
 * the Spark UI). Covers sample question 1.
 */
export const sparkUiBottlenecksLesson: Lesson = {
  id: 'spark-ui-bottlenecks',
  title: 'Reading the Spark UI: skew, shuffle & spill',
  summary:
    'The three classic bottlenecks, the stage-level metrics that expose each one, and why “add more executors” usually isn’t the answer.',
  estimatedMinutes: 10,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'One task is holding everyone hostage',
      body: 'A batch job’s runtime **doubled** after a new data source was onboarded. In the Spark UI, the longest stage tells the story: most tasks finish in under 30 seconds… but **one task runs for 10 minutes**. Min and median shuffle read are ~400 MB; **max is over 5 GB**.\n\nThe cluster isn’t slow. One task got 12× more data than its peers — and the whole stage waits for it.',
      atWork:
        'This exact scenario — max ≫ median in task metrics — is both a sample exam question and the most common real-world Spark diagnosis.',
    },
    {
      id: 'concept-shuffle',
      type: 'concept',
      title: 'Shuffle: when data must travel',
      body: 'Some operations — joins, groupBy, distinct — need all rows with the **same key on the same executor**. To arrange that, Spark performs a **shuffle**: every executor writes its rows out grouped by key, and every executor reads its share back over the network.\n\nShuffles are the most expensive thing Spark does: network + disk + serialization. They are not bugs — but *unnecessary* or *oversized* shuffles are the first place to look when a job is slow.',
      takeaways: [
        'Wide operations (join, groupBy, distinct) require shuffles.',
        'Cost = network + disk + serialization of the moved data.',
        'The Spark UI shows shuffle read/write per stage and task.',
      ],
    },
    {
      id: 'concept-skew',
      type: 'concept',
      title: 'Skew: when one key is a whale',
      body: 'After a shuffle, each task gets a range of keys. If one key holds vastly more rows — one huge customer, `country = US`, nulls — its task gets vastly more data. That is **data skew**.\n\nThe signature in the UI: **min/median task metrics look fine, max is enormous**. The fix family: let **AQE skew-join handling** split oversized partitions automatically, or **salt** the hot key to spread it across tasks manually.',
      takeaways: [
        'Skew = a few tasks get most of the data.',
        'Signature: max ≫ median in task duration / shuffle read.',
        'Fixes: AQE skew handling (first), salting (manual).',
      ],
    },
    {
      id: 'concept-spill',
      type: 'concept',
      title: 'Spill: when memory runs out',
      body: 'A task that cannot fit its working set in memory **spills**: it writes intermediate data to disk and reads it back — sometimes repeatedly. The UI shows this as **spill (memory/disk)** metrics on the stage.\n\nSpill is a symptom, not a disease. Causes: partitions too large (too few of them), skew concentrating data in one task, or genuinely undersized executor memory — in that order of likelihood.',
      takeaways: [
        'Spill = disk I/O standing in for missing memory.',
        'Usually caused by too-large partitions or skew — not “not enough RAM”.',
        'Fix the partitioning first; buy memory last.',
      ],
    },
    {
      id: 'diagram-triage',
      type: 'diagram',
      title: 'Stage-level triage',
      spec: {
        kind: 'flow',
        steps: [
          { label: 'Job slow', sublabel: 'find the longest stage', tone: 'bad' },
          { label: 'Read task summary', sublabel: 'min / median / max', tone: 'warn' },
          { label: 'max ≫ median?', sublabel: 'skew → AQE / salt', tone: 'accent' },
          { label: 'All tasks heavy?', sublabel: 'shuffle size / spill → repartition', tone: 'good' },
        ],
      },
      caption:
        'The min/median/max task summary is the single most diagnostic table in the Spark UI.',
    },
    {
      id: 'mistake-moreexecutors',
      type: 'mistake',
      title: '“Scale it up”',
      myth: '“A task is slow — add more executors and it will finish faster.”',
      reality:
        'A skewed task is **one task**: it runs on one core no matter how many executors you add. The new executors idle while the whale task grinds on — you pay more to wait the same. Skew is fixed by **splitting the data** (AQE skew handling, salting), never by adding machines.',
    },
    {
      id: 'mcq-skew',
      type: 'mcq',
      question:
        'A stage shows most tasks finishing in under 30 seconds while one runs over 10 minutes; min/median shuffle read is ~400 MB but max exceeds 5 GB. Which solution reduces the job runtime?',
      options: [
        { id: 'a', text: 'Increase cluster size to add more executors so the slow task finishes faster.' },
        { id: 'b', text: 'Confirm adaptive query execution with skew join handling is active to automatically split the oversized partition at runtime.' },
        { id: 'c', text: 'Reduce spark.sql.shuffle.partitions to coalesce more work into fewer tasks.' },
        { id: 'd', text: 'Manually repartition using a salt key before the join.' },
      ],
      correct: ['b'],
      optionFeedback: {
        a: 'One task on one core — extra executors idle while it runs.',
        b: 'The metrics scream skew; AQE skew-join handling splits the oversized partition automatically — the built-in fix to try first.',
        c: 'Fewer partitions makes each *bigger* — the whale task gets worse.',
        d: 'Salting works, but it is the manual fallback when AQE’s automatic handling isn’t enough — not the first move.',
      },
      explanation:
        'Max ≫ median = skew. Modern Spark ships the fix built in: **AQE skew join handling**. Verify it is active before hand-rolling salt keys.',
      examObjective:
        'Identify common performance bottlenecks such as data skew, shuffling, and disk spilling by interpreting stage-level metrics in the Spark UI.',
    },
    {
      id: 'flash-signatures',
      type: 'flashcard',
      front: 'In stage metrics: what do (1) max ≫ median, (2) huge shuffle read/write, (3) spill bytes each indicate?',
      back: '(1) **Data skew** · (2) an expensive **shuffle** — too much data moving · (3) **memory pressure** — partitions too big or skewed.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now read a slow job’s vital signs',
      points: [
        'Shuffles move keyed data between executors — the costliest operation.',
        'Skew: max ≫ median task metrics; fix with AQE skew handling or salting.',
        'Spill: memory overflow to disk; fix partitioning before buying RAM.',
        'More executors never fix a single slow task.',
      ],
      closing: 'Diagnosis done — next, the tuning knobs themselves. 🎛️',
    },
  ],
}
