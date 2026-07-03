import type { Lesson } from '@/types/content'

/**
 * Lesson: diagnosing cluster problems — startup failures, library conflicts,
 * out-of-memory. Maps to exam Section 6 (diagnose cluster startup failures,
 * library conflicts, and out-of-memory issues).
 */
export const clusterTroubleshootingLesson: Lesson = {
  id: 'cluster-troubleshooting',
  title: 'Cluster triage: startup, libraries & OOM',
  summary:
    'The three ways clusters ruin your morning — won’t start, wrong libraries, out of memory — and the diagnosis path for each.',
  estimatedMinutes: 9,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'Three tickets, one morning',
      body: '09:02 — “my cluster has been *Pending* for 20 minutes.” 09:15 — “pandas broke after I installed a package yesterday.” 09:31 — “the job died with `java.lang.OutOfMemoryError`.”\n\nThree different failures with three different diagnosis paths — and none of them is fixed by “turn it off and on again.” This lesson is the triage guide.',
      atWork:
        'Cluster triage is the unofficial exam of every data engineering on-call rotation.',
    },
    {
      id: 'concept-startup',
      type: 'concept',
      title: 'Won’t start: it’s usually the cloud or the init',
      body: 'A cluster stuck in Pending or failing to launch is rarely “Databricks being down.” The usual suspects, in order:\n\n• **Cloud capacity / quota** — your account hit its vCPU quota, or the chosen instance type has no capacity in that zone. Fix: another instance type/zone, or a quota increase.\n• **Init scripts** — a custom startup script errors or hangs, killing the launch. Check the init script logs.\n• **Permissions/networking** — instance profiles or VPC config broken by an infra change.',
      takeaways: [
        'Read the termination/launch **event log** first — it names the cause.',
        'Capacity errors → change instance type or raise quota.',
        'A failing init script fails the whole cluster.',
      ],
    },
    {
      id: 'concept-libraries',
      type: 'concept',
      title: 'Library conflicts: whose version wins?',
      body: 'The runtime ships pinned versions of hundreds of packages. Installing your own can silently **replace** one that something else depends on — and the error appears far from the cause (“pandas broke” because a transitive dependency was upgraded).\n\nContainment strategy: prefer **notebook-scoped** installs (`%pip install` — affects only that notebook’s session) over **cluster-scoped** libraries (affect everyone on the cluster). Pin versions explicitly, and test runtime upgrades — each runtime version changes the baseline.',
      takeaways: [
        '%pip install = notebook-scoped; cluster libraries = everyone’s problem.',
        'Pin versions; unpinned installs drift.',
        '“X suddenly broke” after an install → suspect a transitive upgrade.',
      ],
    },
    {
      id: 'concept-oom',
      type: 'concept',
      title: 'Out of memory: driver or executor? It matters.',
      body: 'OOM is two diseases:\n\n• **Driver OOM** — almost always the code pulling data *to* the driver: `collect()`, `toPandas()` on millions of rows, or broadcasting a huge table. Fix the pattern, not the memory.\n\n• **Executor OOM** — the distributed work doesn’t fit: partitions too large (too few), skew concentrating data in one task, or memory-hungry wide operations. Fix partitioning/skew first; bigger instances are the last resort.',
      takeaways: [
        'Driver OOM → look for collect()/toPandas()/oversized broadcast.',
        'Executor OOM → partitions and skew before instance size.',
        'The stack trace tells you which side died — read it.',
      ],
    },
    {
      id: 'diagram-triage',
      type: 'diagram',
      title: 'The triage map',
      spec: {
        kind: 'flow',
        steps: [
          { label: 'Cluster won’t start', sublabel: 'event log → capacity? init script?', tone: 'warn' },
          { label: 'Weird import errors', sublabel: 'library conflict → scope & pin', tone: 'accent' },
          { label: 'OOM', sublabel: 'driver (collect?) vs executor (skew/partitions?)', tone: 'bad' },
        ],
      },
      caption: 'Three symptoms, three first questions. The logs answer all of them.',
    },
    {
      id: 'mistake-bigger',
      type: 'mistake',
      title: 'The memory reflex',
      myth: '“OutOfMemoryError = we need instances with more memory.”',
      reality:
        'Often the cheapest instance would have sufficed. A `collect()` on a billion rows will OOM *any* driver; a skewed join concentrates one partition on one executor **no matter its size**. Doubling memory doubles cost and usually just delays the same crash. Diagnose which side ran out and *why* it held that much data first.',
    },
    {
      id: 'mcq-oom',
      type: 'mcq',
      question:
        'A notebook aggregates a large DataFrame, then calls .toPandas() to hand the result to a plotting library — and the cluster dies with a driver OutOfMemoryError. The aggregation output is ~200 GB. What is the right fix?',
      options: [
        { id: 'a', text: 'Rework the flow so the 200 GB never lands on the driver — aggregate/downsample further in Spark and only convert a small result to pandas.' },
        { id: 'b', text: 'Switch to a driver instance with 256 GB of RAM.' },
        { id: 'c', text: 'Increase spark.executor.memory.' },
        { id: 'd', text: 'Add retries to the job so it eventually succeeds.' },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'toPandas() materializes everything on the driver — keep big data distributed, convert only small final results.',
        b: 'Even if it barely fits today, next month’s data won’t — the pattern is the bug.',
        c: 'The executors are fine; the driver is what died.',
        d: 'A deterministic OOM fails identically on every retry.',
      },
      explanation:
        'Driver OOMs are usually written in the code: `collect()`/`toPandas()` on big data. The fix is keeping the data distributed, not renting a bigger single machine.',
      examObjective: 'Diagnose cluster startup failures, library conflicts, and out-of-memory issues.',
    },
    {
      id: 'flash-scoped',
      type: 'flashcard',
      front: 'You need a specific package version for one analysis without affecting teammates on the shared cluster. What do you use?',
      back: '**Notebook-scoped** install: `%pip install pkg==1.2.3` — it applies to your notebook session only.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You are now the calm person on call',
      points: [
        'Startup failures: event log → cloud capacity/quota, then init scripts.',
        'Library conflicts: prefer notebook-scoped installs, pin versions.',
        'Driver OOM = data pulled home (collect/toPandas); executor OOM = partitions/skew.',
        'Bigger hardware is the last fix, not the first.',
      ],
      closing: 'Final module: locking all of this down properly. 🔐',
    },
  ],
}
