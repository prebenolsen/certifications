import type { Lesson } from '@/types/content'

/**
 * Lesson: compute options and picking the right one per workload.
 * Maps to exam Section 1 (compute services: characteristics, limitations,
 * cost models). Covers sample question 4.
 */
export const computeChoicesLesson: Lesson = {
  id: 'compute-choices',
  title: 'Picking the right compute (without overpaying)',
  summary:
    'All-purpose clusters, job clusters, SQL warehouses, and serverless — what each is for, what each costs, and how the exam tests the choice.',
  estimatedMinutes: 9,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'The bill nobody can explain',
      body: 'Finance flags your team’s Databricks spend: it has tripled. The cause? A big **all-purpose cluster** someone spun up for a demo months ago — still running scheduled ETL every night, at interactive prices, 24/7.\n\nEvery compute type on the platform exists for a specific job. Using the wrong one works — it just wastes money or time.',
      atWork:
        'The most common real-world compute mistake is running production jobs on all-purpose clusters that never terminate.',
    },
    {
      id: 'concept-allpurpose-job',
      type: 'concept',
      title: 'All-purpose vs job clusters',
      body: 'An **all-purpose cluster** is for humans: you create it, attach notebooks, iterate, and share it with teammates. It stays up until stopped (or auto-terminates when idle).\n\nA **job cluster** is for machines: Lakeflow Jobs creates it when a scheduled run starts and **deletes it when the run ends**. You cannot attach to it interactively — and it is billed at a cheaper rate.',
      takeaways: [
        'Humans iterating → all-purpose.',
        'Scheduled production runs → job cluster (auto-created, auto-deleted, cheaper).',
        'Job clusters are the default answer for “run this pipeline nightly.”',
      ],
    },
    {
      id: 'concept-warehouse',
      type: 'concept',
      title: 'SQL warehouses: compute for queries',
      body: 'A **SQL warehouse** is compute specialized for SQL: dashboards, BI tools, and ad hoc analyst queries. It is designed for **many simultaneous users**, queues and load-balances queries, and scales out by adding clusters when concurrency rises.\n\nThe **serverless** flavor starts in seconds because Databricks keeps warm capacity ready — no more “analyst waits five minutes for a cluster.”',
      takeaways: [
        'BI / SQL / dashboards → SQL warehouse, not a notebook cluster.',
        'Built for **concurrency**: autoscales with the number of users.',
        'Serverless = near-instant startup, managed by Databricks.',
      ],
    },
    {
      id: 'diagram-compute',
      type: 'diagram',
      title: 'The compute menu at a glance',
      spec: {
        kind: 'compare',
        left: {
          label: 'All-purpose cluster',
          sublabel: 'interactive development',
          tone: 'brand',
          items: [
            'Notebooks, exploration, debugging',
            'Shared by a team',
            'Runs until stopped / idle timeout',
            'Highest per-hour rate',
          ],
        },
        right: {
          label: 'Job cluster',
          sublabel: 'scheduled production',
          tone: 'good',
          items: [
            'Created per job run, deleted after',
            'No interactive access',
            'Cheaper rate than all-purpose',
            'Fresh, reproducible environment each run',
          ],
        },
      },
      caption:
        'Third option: **SQL warehouses** for BI/SQL concurrency. Serverless variants of all of these trade control for instant startup.',
    },
    {
      id: 'concept-cost',
      type: 'concept',
      title: 'How the money works',
      body: 'You pay two meters: **DBUs** (Databricks Units — the platform fee, priced per compute type) and, for classic compute, the underlying **cloud VMs** in your account.\n\nThis is why compute choice is a cost decision: the same query costs different amounts on an all-purpose cluster, a job cluster, or a serverless warehouse. **Autoscaling** and **auto-termination** are your main levers against waste.',
      takeaways: [
        'Cost = DBUs × rate for that compute type (+ cloud VM cost for classic).',
        'Job compute is billed cheaper than all-purpose.',
        'Idle clusters burn money — set auto-termination.',
      ],
    },
    {
      id: 'mistake-bigger',
      type: 'mistake',
      title: '“Just make the cluster bigger”',
      myth: '“Queries are slow and users are queuing — we need a much larger cluster.”',
      reality:
        'For **many concurrent SQL users**, one giant cluster does not help: the bottleneck is concurrency, not raw size. A SQL warehouse with **autoscaling** adds clusters when users pile in and removes them when they leave — matching cost to demand.',
    },
    {
      id: 'mcq-compute',
      type: 'mcq',
      question:
        'Business analysts run ad hoc SQL queries on curated Delta tables throughout the day. You need efficient query performance, fast startup, support for many simultaneous users, and cost control (no permanently oversized clusters). Which configuration fits best?',
      options: [
        { id: 'a', text: 'A job cluster with autoscaling designed for scheduled ETL workflows.' },
        { id: 'b', text: 'An all-purpose cluster with a fixed number of worker nodes.' },
        { id: 'c', text: 'A high-concurrency SQL compute resource with autoscaling enabled.' },
        { id: 'd', text: 'A single-node cluster for lightweight development tasks.' },
      ],
      correct: ['c'],
      optionFeedback: {
        a: 'Job clusters exist per scheduled run — analysts firing ad hoc queries all day need something persistent and shared.',
        b: 'A fixed-size all-purpose cluster either wastes money at night or queues users at peak — and it is the most expensive rate.',
        c: 'Concurrency-oriented SQL compute with autoscaling handles many users and scales cost with demand.',
        d: 'A single node cannot serve a whole team of analysts.',
      },
      explanation:
        'Match the workload’s shape: **many users + SQL + all day** → concurrency-oriented SQL compute (a SQL warehouse) with autoscaling. The other options optimize for a different shape of work.',
      examObjective:
        'Understand the platform’s compute services, including characteristics, limitations, and cost models, and select the most suitable option for each workload use case.',
    },
    {
      id: 'tf-jobcluster',
      type: 'truefalse',
      statement: 'A job cluster keeps running after its job finishes so the next run starts faster.',
      answer: false,
      explanation:
        'Job clusters are **ephemeral**: created when the run starts, terminated when it ends. That is exactly why they are cheap. (Fast startup for interactive SQL is what **serverless** compute is for.)',
    },
    {
      id: 'flash-compute',
      type: 'flashcard',
      front: 'Interactive development · scheduled pipeline · BI dashboards — which compute for each?',
      back: 'Development → **all-purpose cluster** · scheduled pipeline → **job cluster** · BI/SQL → **SQL warehouse** (serverless for instant startup).',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now pick compute like an engineer',
      points: [
        'All-purpose clusters: humans iterating; priciest; keep auto-termination on.',
        'Job clusters: created and destroyed per scheduled run; cheaper.',
        'SQL warehouses: concurrency-oriented SQL compute for BI; autoscale with users.',
        'Serverless: Databricks-managed capacity, near-instant startup.',
        'Cost = DBUs per compute type (+ your cloud VMs for classic compute).',
      ],
      closing: 'Compute sorted. Now let’s get some data onto the platform. 📥',
    },
  ],
}
