import type { Lesson } from '@/types/content'

/**
 * Lesson: why Unity Catalog managed tables reduce operational overhead.
 * Maps to exam Section 6 (understand how/why UC managed tables reduce operations
 * overhead and maintenance burden).
 */
export const managedTablesOverheadLesson: Lesson = {
  id: 'managed-tables-overhead',
  title: 'Why managed tables cost you less',
  summary:
    'Unity Catalog managed tables hand file layout, compaction, clustering, and cleanup to Databricks — cutting the maintenance jobs you’d otherwise run yourself.',
  estimatedMinutes: 9,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'The nightly maintenance zoo',
      body: 'Your team runs a fleet of housekeeping jobs: OPTIMIZE here, ZORDER there, VACUUM everywhere, plus scripts to compact small files. They cost compute, they sometimes fail, and someone has to babysit them.\n\nUnity Catalog **managed tables** let Databricks run that maintenance for you — automatically, and only when it helps.',
      atWork:
        'The exam asks *why* managed tables lower operational overhead — the answer is automatic optimization you no longer schedule.',
    },
    {
      id: 'concept-managed',
      type: 'concept',
      title: 'Managed tables: Databricks owns the files',
      body: 'A **managed** table stores its data in a Unity Catalog managed location that Databricks controls end to end — creation, layout, and lifecycle. An **external** table points at files *you* manage in a location you specified.\n\nBecause Databricks owns a managed table’s storage, it’s free to reorganize and clean it up without stepping on files you rely on.',
      takeaways: [
        'Managed = Databricks controls the storage and lifecycle.',
        'External = you own and manage the files.',
        'Ownership is what enables hands-off optimization.',
      ],
    },
    {
      id: 'concept-predictive-optimization',
      type: 'concept',
      title: 'Predictive optimization does the maintenance',
      body: '**Predictive optimization** automatically runs the right maintenance on managed tables — **OPTIMIZE** (compaction), **clustering**, and **VACUUM** (removing stale files) — choosing *when* and *which* based on how each table is actually used. You stop scheduling and tuning those jobs; Databricks decides and pays attention to cost/benefit.\n\nThat’s the operational-overhead reduction: fewer maintenance jobs to write, run, monitor, and debug.',
      takeaways: [
        'Auto-runs OPTIMIZE, clustering, and VACUUM on managed tables.',
        'Triggered by usage — only when it’s worth it.',
        'Replaces hand-scheduled maintenance jobs.',
      ],
    },
    {
      id: 'diagram-compare',
      type: 'diagram',
      title: 'Who does the housekeeping?',
      spec: {
        kind: 'compare',
        left: {
          label: 'External table',
          sublabel: 'you maintain it',
          tone: 'warn',
          items: [
            'You schedule OPTIMIZE / ZORDER',
            'You schedule VACUUM',
            'You monitor small-file buildup',
            'More jobs = more overhead',
          ],
        },
        right: {
          label: 'Managed table',
          sublabel: 'Databricks maintains it',
          tone: 'good',
          items: [
            'Predictive optimization compacts & clusters',
            'Auto VACUUM of stale files',
            'Runs only when beneficial',
            'Fewer jobs = less overhead',
          ],
        },
      },
      caption:
        'Managed tables move the maintenance burden from your job scheduler to the platform.',
    },
    {
      id: 'mistake-managed-lockin',
      type: 'mistake',
      title: '"Managed means my data is trapped"',
      myth: '“If Databricks owns the files, I can’t get my data out or it’s a proprietary format.”',
      reality:
        'Managed tables are still open **Delta** (Parquet + log). You keep full SQL access, can read them anywhere Delta is supported, and can share them via Delta Sharing. You give up manual file micromanagement, not ownership of your data.',
    },
    {
      id: 'tf-external-auto',
      type: 'truefalse',
      statement:
        'Predictive optimization automatically maintains external tables just as it does managed tables.',
      answer: false,
      explanation:
        'Automatic maintenance targets **managed** tables, whose storage Databricks controls. External tables’ files are yours to maintain — you schedule OPTIMIZE/VACUUM yourself.',
    },
    {
      id: 'mcq-managed',
      type: 'mcq',
      question:
        'A team spends significant compute and on-call effort running scheduled OPTIMIZE and VACUUM jobs across hundreds of tables. What change most reduces this operational overhead?',
      options: [
        {
          id: 'a',
          text: 'Use Unity Catalog managed tables and let predictive optimization run maintenance automatically.',
        },
        {
          id: 'b',
          text: 'Move all tables to external locations and keep scheduling the maintenance jobs.',
        },
        { id: 'c', text: 'Stop running OPTIMIZE and VACUUM entirely to save compute.' },
        { id: 'd', text: 'Increase cluster size so the maintenance jobs finish faster.' },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'Correct — managed tables with predictive optimization remove the need to schedule and babysit those jobs.',
        b: 'External tables still require you to run the maintenance yourself.',
        c: 'Skipping maintenance degrades performance (small files, stale data) and can break retention/cost goals.',
        d: 'Bigger clusters run the same manual jobs faster but don’t remove the overhead.',
      },
      explanation:
        'Managed tables reduce operational overhead by letting predictive optimization decide and run maintenance — no more hand-scheduled OPTIMIZE/VACUUM fleets.',
      examObjective:
        'Understand how / why using Unity Catalog managed tables reduces operations overhead and maintenance burden.',
    },
    {
      id: 'flash-predictive',
      type: 'flashcard',
      front: 'Which maintenance operations does predictive optimization run automatically on managed tables?',
      back: '**OPTIMIZE** (compaction), **clustering**, and **VACUUM** — chosen by usage, only when beneficial.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now justify managed tables',
      points: [
        'Managed tables: Databricks controls the storage and lifecycle.',
        'Predictive optimization auto-runs OPTIMIZE, clustering, and VACUUM.',
        'It replaces hand-scheduled maintenance jobs — less overhead.',
        'Automatic maintenance applies to managed, not external, tables.',
        'Still open Delta — no lock-in, just less micromanagement.',
      ],
      closing: 'Next: when a query is still slow, the profile tells you why. 🔎',
    },
  ],
}
