import type { Lesson } from '@/types/content'

/**
 * Lesson: CI/CD with Databricks Asset Bundles and Git Folders.
 * Maps to exam Section 9 (build and deploy resources with Asset Bundles;
 * integrate Git-based CI/CD using Databricks Git Folders).
 */
export const cicdAssetBundlesLesson: Lesson = {
  id: 'cicd-asset-bundles',
  title: 'Shipping with Asset Bundles & Git',
  summary:
    'Package a pipeline as a Databricks Asset Bundle and promote it identically across dev/staging/prod, with Git Folders and CI/CD driving the flow.',
  estimatedMinutes: 10,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: '"It worked in dev"',
      body: 'Promoting to prod means someone hand-recreates the job, re-points paths, re-uploads notebooks, and hopes they matched dev. One missed setting and prod behaves differently.\n\n**Asset Bundles** make the whole project — jobs, pipelines, notebooks, wheel — one versioned, declarative artifact you deploy identically to every environment. No more hand-assembly.',
      atWork:
        'Repeatable, reviewable deployment is a defining Professional skill; the exam pairs Asset Bundles with Git-based CI/CD.',
    },
    {
      id: 'concept-bundle',
      type: 'concept',
      title: 'A bundle is your project as code',
      body: 'A **Databricks Asset Bundle** describes your resources — jobs, declarative pipelines, notebooks, wheels, cluster settings — in a `databricks.yml` file (plus `resources/*.yml`). The bundle *is* the source of truth: `databricks bundle deploy` creates or updates exactly those resources in a workspace.\n\nBecause it’s YAML in Git, every change is diffable, reviewable, and reproducible.',
      takeaways: [
        '`databricks.yml` declares jobs, pipelines, notebooks, wheels, compute.',
        '`bundle deploy` provisions exactly what the file says.',
        'The bundle is versioned config — reviewable in PRs.',
      ],
    },
    {
      id: 'concept-targets',
      type: 'concept',
      title: 'Targets promote the same bundle',
      body: 'A bundle defines **targets** (dev, staging, prod) that override just what differs — the workspace, catalog, schedule, or a variable — while the resource *definitions* stay identical. `databricks bundle deploy -t prod` deploys the same jobs to prod with prod’s settings.\n\nOne definition, many environments: promotion becomes a flag, not a rebuild.',
      takeaways: [
        'Targets override per-environment values (workspace, catalog, vars).',
        'Resource definitions are shared across all targets.',
        '`deploy -t prod` promotes the same code with prod config.',
      ],
    },
    {
      id: 'example-bundle',
      type: 'example',
      title: 'databricks.yml with targets',
      intro: 'Shared definitions up top; per-environment overrides below:',
      code: {
        language: 'yaml',
        content:
          "bundle:\n  name: orders_pipeline\n\nresources:\n  jobs:\n    daily_orders:\n      tasks:\n        - task_key: run\n          notebook_task: { notebook_path: ./notebooks/run_daily.py }\n\ntargets:\n  dev:\n    default: true\n    variables: { catalog: dev }\n  prod:\n    workspace: { host: https://prod.cloud.databricks.com }\n    variables: { catalog: prod }",
      },
      explanation:
        'The `daily_orders` job is defined once. `dev` and `prod` change only the workspace and catalog. `databricks bundle deploy -t prod` ships the identical job to prod.',
    },
    {
      id: 'concept-git-folders',
      type: 'concept',
      title: 'Git Folders connect the workspace to Git',
      body: '**Databricks Git Folders** (Repos) clone a Git repository into the workspace, so notebooks and bundle files are version-controlled and branch-aware right where they run. Development happens on a branch; changes go back through pull requests in your Git provider.\n\nGit Folders are how code *enters* the workspace under version control; bundles are how it’s *deployed*.',
      takeaways: [
        'Git Folders bring a Git repo (branches/PRs) into the workspace.',
        'Notebooks and bundle config are version-controlled at the source.',
        'Git Folders = code in; Asset Bundles = deploy out.',
      ],
    },
    {
      id: 'concept-cicd',
      type: 'concept',
      title: 'CI/CD ties it together',
      body: 'A CI/CD pipeline (GitHub Actions, Azure DevOps, etc.) runs on a merge: **test** the wheel/transforms, then `databricks bundle validate` and `databricks bundle deploy -t staging`, run integration tests, and on approval `deploy -t prod`. The CLI is the automation surface, the bundle is the artifact, Git is the trigger.\n\nEvery prod change is now a reviewed, tested, reproducible deployment.',
      takeaways: [
        'Merge → CI runs tests + `bundle validate` + `deploy` per target.',
        'Same bundle flows dev → staging → prod.',
        'Deployments are tested, reviewed, and reproducible.',
      ],
    },
    {
      id: 'tf-hand-deploy',
      type: 'truefalse',
      statement:
        'Asset Bundles require you to manually recreate each job and pipeline in the production workspace.',
      answer: false,
      explanation:
        'The opposite — a bundle *declares* the resources and `bundle deploy -t prod` creates/updates them automatically, so promotion is repeatable with no hand-assembly.',
    },
    {
      id: 'mcq-cicd',
      type: 'mcq',
      question:
        'A team wants prod deployments to be reviewed in PRs, tested in CI, and identical to what ran in staging, with only workspace/catalog differing. What approach fits?',
      options: [
        {
          id: 'a',
          text: 'Define resources in a Databricks Asset Bundle with dev/staging/prod targets; deploy via the CLI from CI, triggered by Git merges.',
        },
        {
          id: 'b',
          text: 'Manually clone each job in the prod workspace UI and update the paths.',
        },
        {
          id: 'c',
          text: 'Export notebooks to DBC archives and import them into prod by hand.',
        },
        { id: 'd', text: 'Keep everything in one shared workspace and skip environments.' },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'Correct — bundles + targets give one reviewable definition promoted identically via CLI from CI, with Git as the trigger.',
        b: 'Manual UI recreation is exactly the drift-prone process bundles eliminate.',
        c: 'DBC import/export handles notebooks only, by hand — no jobs, pipelines, or targets.',
        d: 'One shared workspace with no environments removes the safety of staging→prod promotion.',
      },
      explanation:
        'Reviewable, tested, identical promotion = Asset Bundles with per-environment **targets**, deployed by the **CLI** in **CI/CD**, versioned via **Git**.',
      examObjective:
        'Build and deploy Databricks resources using Databricks Asset Bundles, and integrate with Git-based CI/CD workflows using Databricks Git Folders.',
    },
    {
      id: 'flash-targets',
      type: 'flashcard',
      front: 'In an Asset Bundle, what lets the same job definition deploy to dev, staging, and prod with only per-environment differences?',
      back: '**Targets** — they override values like workspace, catalog, and variables while sharing the resource definitions; `bundle deploy -t <target>`.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now ship like a pro',
      points: [
        'An Asset Bundle declares jobs/pipelines/notebooks/wheels in `databricks.yml`.',
        'Targets promote the same definitions across dev/staging/prod.',
        '`databricks bundle deploy -t <target>` provisions resources — no hand-assembly.',
        'Git Folders bring version-controlled code into the workspace.',
        'CI/CD ties it together: merge → test → validate → deploy per target.',
      ],
      closing: 'That’s the full pipeline lifecycle — build, secure, optimize, observe, and ship. 🎓',
    },
  ],
}
