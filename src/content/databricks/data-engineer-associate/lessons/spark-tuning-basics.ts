import type { Lesson } from '@/types/content'

/**
 * Lesson: the basic Spark tuning parameters.
 * Maps to exam Section 3 (understand basic tuning parameters —
 * spark.sql.shuffle.partitions, spark.default.parallelism,
 * spark.executor/driver.memory, spark.sql.autoBroadcastJoinThreshold —
 * and re-measure performance).
 */
export const sparkTuningBasicsLesson: Lesson = {
  id: 'spark-tuning-basics',
  title: 'The four tuning knobs (and the golden rule)',
  summary:
    'shuffle.partitions, default.parallelism, executor/driver memory, and the broadcast threshold — what each controls and how to change them safely.',
  estimatedMinutes: 9,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'Tuned for somebody else’s job',
      body: 'Spark’s defaults are compromises chosen for a hypothetical average workload. `spark.sql.shuffle.partitions` defaults to **200** whether you are shuffling 10 MB or 10 TB — meaning tiny jobs fragment into confetti and huge jobs choke on oversized partitions.\n\nFour parameters cover most of what an associate-level engineer ever tunes. Knowing what each *controls* matters more than memorizing values.',
      atWork:
        'Before touching any knob, capture the current runtime and stage metrics. Untracked tuning is just superstition.',
    },
    {
      id: 'concept-shuffle-partitions',
      type: 'concept',
      title: 'spark.sql.shuffle.partitions',
      body: 'How many partitions the data is split into **after a shuffle** (joins, groupBy). Default: 200.\n\nToo **few** → each partition is huge → memory pressure, spill, slow stragglers. Too **many** → thousands of micro-tasks whose scheduling overhead outweighs the work. Rule of thumb: aim for partitions of roughly 100–200 MB. (Its RDD-era sibling `spark.default.parallelism` sets the same idea for non-SQL operations.)',
      takeaways: [
        'Controls post-shuffle partition count (default 200).',
        'Too few = spill; too many = overhead.',
        'AQE can coalesce partitions automatically — check before hand-tuning.',
      ],
    },
    {
      id: 'concept-memory',
      type: 'concept',
      title: 'spark.executor.memory & spark.driver.memory',
      body: '**Executor memory** is where tasks hold their working data — shuffles, joins, aggregations, caches. Undersized: spills and executor OOM kills.\n\n**Driver memory** is the coordinator’s budget. It only becomes the bottleneck when you pull data *to* the driver — `collect()`, huge `toPandas()`, broadcasting a too-big table. A driver OOM almost always means “the code brought too much data home,” not “the driver is too small.”',
      takeaways: [
        'Executor memory serves the distributed work.',
        'Driver memory serves coordination — and collect() abuse.',
        'Fix the access pattern before raising memory.',
      ],
    },
    {
      id: 'concept-broadcast',
      type: 'concept',
      title: 'spark.sql.autoBroadcastJoinThreshold',
      body: 'Tables **smaller than this threshold** (default 10 MB) are automatically broadcast in joins — copied whole to every executor so the big side never shuffles.\n\nRaising it lets bigger dimension tables skip the shuffle; raising it too far broadcasts something huge and blows up executors (or the driver, which coordinates the broadcast). Setting it to `-1` disables auto-broadcasting entirely.',
      takeaways: [
        'Below the threshold → automatic broadcast join.',
        'Raise carefully: broadcasting big tables causes OOM.',
        '-1 disables; F.broadcast() forces per join.',
      ],
    },
    {
      id: 'diagram-knobs',
      type: 'diagram',
      title: 'Which knob for which pain',
      spec: {
        kind: 'compare',
        left: {
          label: 'Symptom',
          tone: 'bad',
          items: [
            'Spill + slow big stages',
            'Thousands of 50 ms tasks',
            'Executor OOM in wide stages',
            'Big-table join shuffles a tiny lookup',
          ],
        },
        right: {
          label: 'First knob to inspect',
          tone: 'good',
          items: [
            'shuffle.partitions too **low**',
            'shuffle.partitions too **high**',
            'executor.memory (after ruling out skew)',
            'autoBroadcastJoinThreshold (or F.broadcast)',
          ],
        },
      },
      caption: 'Symptoms map to knobs — start from the metric, not from the config file.',
    },
    {
      id: 'concept-remeasure',
      type: 'concept',
      title: 'The golden rule: re-measure',
      body: 'Tuning is an experiment: **baseline → change one parameter → re-run → compare stage metrics**. Change two knobs at once and you cannot attribute the result; skip the re-measure and you cannot prove there was one.\n\nKeep the numbers (runtime, shuffle sizes, spill) from before and after. A tuning change without a measured improvement gets reverted — config debt is real debt.',
      takeaways: [
        'One change at a time.',
        'Compare stage metrics, not gut feel.',
        'No measured win → revert the change.',
      ],
    },
    {
      id: 'mistake-cargo-cult',
      type: 'mistake',
      title: 'Cargo-cult configs',
      myth: '“Our last project set shuffle.partitions to 2000 and it flew — put that in every job’s config.”',
      reality:
        'That value fit *that* job’s data volume. Pasted onto a small job, 2000 partitions is pure scheduling overhead; onto a bigger one, it may still be too few. Copied configs without measurements are how clusters accumulate mysterious settings nobody dares delete. Tune per workload, keep the evidence.',
    },
    {
      id: 'mcq-tuning',
      type: 'mcq',
      question:
        'A join between a large fact table and a 40 MB dimension table shuffles both sides (the UI shows shuffle on both). The team wants the dimension broadcast instead. Which change targets this directly?',
      options: [
        { id: 'a', text: 'Raise spark.sql.autoBroadcastJoinThreshold above 40 MB (or wrap the dimension in F.broadcast()).' },
        { id: 'b', text: 'Raise spark.driver.memory so the shuffle completes faster.' },
        { id: 'c', text: 'Set spark.sql.shuffle.partitions to 2000 so each shuffled partition is smaller.' },
        { id: 'd', text: 'Lower spark.executor.memory to force earlier spilling.' },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'The 40 MB table exceeds the 10 MB default threshold — raise it (or force with broadcast()) and the shuffle disappears.',
        b: 'Driver memory does not influence executor-side shuffles.',
        c: 'That reshapes the shuffle; the goal was to eliminate it.',
        d: 'Deliberately causing spill helps nothing.',
      },
      explanation:
        'The broadcast threshold decides *whether* a join shuffles at all — the highest-leverage knob when a smallish dimension table is involved.',
      examObjective:
        'Understand the basic tuning parameters (spark.sql.shuffle.partitions, spark.default.parallelism, spark.executor/driver.memory, spark.sql.autoBroadcastJoinThreshold) and re-measure the performance.',
    },
    {
      id: 'flash-knobs',
      type: 'flashcard',
      front: 'Name the four associate-level tuning parameters and one word for what each controls.',
      back: '`shuffle.partitions` — **granularity** · `default.parallelism` — granularity (RDD ops) · `executor/driver.memory` — **capacity** · `autoBroadcastJoinThreshold` — **join strategy**.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You now tune with evidence',
      points: [
        'shuffle.partitions sets post-shuffle granularity — the most-touched knob.',
        'Executor memory serves tasks; driver OOM usually means collect() abuse.',
        'The broadcast threshold decides whether small-table joins shuffle at all.',
        'Golden rule: baseline, one change, re-measure, keep or revert.',
      ],
      closing: 'Knobs in hand — now let’s watch the pipelines that use them. 📈',
    },
  ],
}
