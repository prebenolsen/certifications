import type { Lesson } from '@/types/content'

/**
 * Lesson: Databricks Asset Bundles (DABs) and the CLI — dev to prod.
 * Maps to exam Section 5 (environment-specific configuration with bundle
 * variables and overrides; deploy bundles to promote jobs, pipelines, and
 * assets across dev/test/prod; use the CLI to validate, deploy, and manage
 * bundles in automated CI/CD workflows). Covers sample question 5.
 */
export const assetBundlesLesson: Lesson = {
  id: 'asset-bundles',
  title: 'Asset Bundles: shipping pipelines like software',
  summary:
    'Everything a pipeline is — code, jobs, clusters, pipelines — declared in one versioned bundle, promoted dev → test → prod with three CLI commands.',
  estimatedMinutes: 10,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'The hand-built production job',
      body: 'Deploy day: an engineer opens the prod workspace and *re-creates by hand* what worked in dev — new job, 14 settings, cluster config, schedule, permissions. She misspells one table name. Prod breaks in a way dev never did, and nobody can diff “what dev has” against “what prod got.”\n\n**Asset Bundles** exist so that deployment is a *command*, not a transcription exercise.',
      atWork:
        'If promoting to prod involves a checklist of UI clicks, every deploy is a fresh chance to introduce a unique, uninspectable error.',
    },
    {
      id: 'analogy-container',
      type: 'analogy',
      title: 'A shipping container for pipelines',
      body: 'Before shipping containers, every dockyard hand-unloaded cargo differently, and things broke in transit. The container standardized the *package*, so any crane at any port handles it identically.\n\nA **bundle** is the shipping container for your project: code plus **declarations of every resource it needs** (jobs, pipelines, clusters) in one versioned box. Dev, test, and prod all receive the *same box* — only labeled differently.',
      mapping: [
        { from: 'The container', to: 'The bundle (databricks.yml + code)' },
        { from: 'Same crane, any port', to: 'Same CLI deploy, any workspace' },
        { from: 'Shipping label per destination', to: 'Target (dev / test / prod)' },
      ],
    },
    {
      id: 'concept-dab',
      type: 'concept',
      title: 'What a bundle is',
      body: 'A **Databricks Asset Bundle** (DAB — being renamed *Declarative Automation Bundle*) is a project folder containing:\n\n• **`databricks.yml`** — the manifest: the bundle’s name, its **resources** (Lakeflow Jobs, declarative pipelines, dashboards…), and its **targets**.\n• **Your code** — notebooks, Python files, SQL.\n\nEverything is plain text in Git. The workspace state becomes a *product of deployment*, never something hand-edited.',
      takeaways: [
        'Bundle = code + YAML-declared resources, versioned together.',
        'Resources: jobs, pipelines, and other workspace assets.',
        'Infrastructure-as-code for the Databricks workspace.',
      ],
    },
    {
      id: 'concept-targets',
      type: 'concept',
      title: 'Targets, variables & overrides',
      body: 'One codebase must run in several environments that differ in details: workspace URL, catalog name, cluster size, schedule on/off.\n\n**Targets** name each environment (`dev`, `test`, `prod`). **Variables** hold the differing values, and per-target **overrides** set them — e.g. dev writes to `dev_catalog` on a tiny cluster with schedules paused; prod writes to `main` on real compute. The pipeline logic itself never forks.',
      takeaways: [
        'Same bundle, different targets — never separate copies per env.',
        'Variables + overrides isolate every environment difference.',
        'Dev targets typically pause schedules and shrink compute.',
      ],
    },
    {
      id: 'example-bundle',
      type: 'example',
      title: 'A minimal databricks.yml',
      intro: 'One job, two environments:',
      code: {
        language: 'yaml',
        content:
          'bundle:\n  name: sales_etl\n\nvariables:\n  catalog:\n    default: dev_catalog\n\nresources:\n  jobs:\n    nightly_etl:\n      name: nightly-etl-${bundle.target}\n      tasks:\n        - task_key: transform\n          notebook_task:\n            notebook_path: ./notebooks/transform.py\n\ntargets:\n  dev:\n    default: true\n  prod:\n    variables:\n      catalog: main\n    workspace:\n      host: https://prod.cloud.databricks.com',
      },
      explanation:
        'Deploying to `prod` swaps the variable values and workspace — the job definition itself is written once. `${bundle.target}` interpolation keeps names unambiguous per environment.',
    },
    {
      id: 'concept-cli',
      type: 'concept',
      title: 'The CLI: validate, deploy, run',
      body: 'Three commands drive the lifecycle:\n\n• **`databricks bundle validate`** — checks the YAML and resolves variables. Cheap; run it on every commit.\n• **`databricks bundle deploy -t prod`** — creates/updates the target workspace’s resources to match the bundle.\n• **`databricks bundle run nightly_etl -t prod`** — triggers a bundled job/pipeline.\n\nBecause these are commands, CI/CD automation is just calling them: PR → validate; merge to main → deploy to test; release → deploy to prod.',
      takeaways: [
        'validate → deploy -t <target> → run.',
        'CI/CD = the same commands, run by the pipeline instead of you.',
        'Deploys are repeatable and diffable — no UI transcription.',
      ],
    },
    {
      id: 'diagram-promotion',
      type: 'diagram',
      title: 'The promotion path',
      spec: {
        kind: 'flow',
        steps: [
          { label: 'Git repo', sublabel: 'bundle: code + databricks.yml', tone: 'brand' },
          { label: 'dev', sublabel: 'deploy -t dev · iterate', tone: 'accent' },
          { label: 'test', sublabel: 'deploy -t test · CI validates', tone: 'warn' },
          { label: 'prod', sublabel: 'deploy -t prod · on release', tone: 'good' },
        ],
        arrows: ['same bundle', 'same bundle', 'same bundle'],
      },
      caption:
        'One versioned definition moves through environments — only target overrides change.',
    },
    {
      id: 'mistake-code-only',
      type: 'mistake',
      title: '“Git already covers this”',
      myth: '“Our notebooks are in Git folders, so our deployment is versioned.”',
      reality:
        'Git folders version the **code** — but a pipeline is also its **job definition**: schedule, cluster, task graph, permissions. Hand-built in the UI, those live outside version control and drift per environment. Bundles put the *whole* pipeline — code **and** resources — under Git.',
    },
    {
      id: 'mcq-dabs',
      type: 'mcq',
      question:
        'A team wants a modular way to deploy, version, and orchestrate ETL pipelines — enabling CI/CD and repeatability across environments. Which feature supports this?',
      options: [
        { id: 'a', text: 'Models in Unity Catalog representing ETL jobs, with CI/CD promoting versions via model aliases tied to job tasks.' },
        { id: 'b', text: 'Transformation logic packaged as wheel libraries in Unity Catalog Volumes, bound to job tasks.' },
        { id: 'c', text: 'API logic in a Volume-mounted notebook triggered via the Jobs API, using notebook revision history as versioning.' },
        { id: 'd', text: 'Asset Bundles (DABs) defining resources and code, versioned in Git, promoted across environments through automated CI/CD.' },
      ],
      correct: ['d'],
      optionFeedback: {
        a: 'UC models version *ML models*, not pipeline definitions — this misuses the registry.',
        b: 'Wheels version code libraries, but say nothing about jobs, schedules, or environments.',
        c: 'Notebook revision history is not a deployment mechanism — no environments, no review, no rollback.',
        d: 'Bundles are purpose-built for exactly this: declared resources + code, in Git, promoted by CLI/CI.',
      },
      explanation:
        'The keywords — *deploy, version, orchestrate, CI/CD, repeatability* — collectively describe what Asset Bundles were created for.',
      examObjective:
        'Deploy Asset Bundles to package, configure, and promote Lakeflow Jobs, pipelines, and workspace assets across dev, test, and prod environments.',
    },
    {
      id: 'flash-cli',
      type: 'flashcard',
      front: 'The three bundle CLI verbs, in lifecycle order?',
      back: '`databricks bundle **validate**` → `**deploy** -t <target>` → `**run** <resource> -t <target>`.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You now deploy like an engineer, not a scribe',
      points: [
        'A bundle = code + YAML-declared jobs/pipelines, versioned together in Git.',
        'Targets + variables + overrides express environment differences once.',
        'validate / deploy / run — the CLI verbs CI/CD automates.',
        'Git folders version code; bundles version the *whole pipeline*.',
      ],
      closing: 'Deployed and automated. Next module: what to do when it breaks anyway. 🔬',
    },
  ],
}
