import type { Lesson } from '@/types/content'

/**
 * Lesson: a scalable Python project structure for Asset Bundles.
 * Maps to exam Section 1 (design a scalable Python project optimized for
 * Databricks Asset Bundles, enabling modular development, deployment, CI/CD).
 */
export const pythonProjectStructureLesson: Lesson = {
  id: 'python-project-structure',
  title: 'A Python project that scales',
  summary:
    'Move logic out of notebooks into an importable package, build it as a wheel, and let Asset Bundles deploy it — the structure that makes testing and CI/CD possible.',
  estimatedMinutes: 10,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'The 2,000-line notebook',
      body: 'The whole pipeline lives in one notebook: helper functions, transforms, and the run itself, all tangled together. You can’t unit-test a function without running the notebook, two pipelines copy-paste the same cleaning code, and every change risks the whole thing.\n\nThe fix is to treat your data-engineering code like *software*: a proper Python package, imported by thin notebooks.',
      atWork:
        'Professional-level work is judged on modularity, testability, and repeatable deployment — all of which start with project structure.',
    },
    {
      id: 'analogy-library',
      type: 'analogy',
      title: 'Notebooks are the front desk, not the warehouse',
      body: 'A well-run store keeps its stock in an organized warehouse (the package) and puts a small, friendly front desk out front (the notebook). Customers interact with the desk; the desk fetches from the warehouse. You never pile all the inventory on the counter.',
      mapping: [
        { from: 'Organized warehouse', to: 'Importable Python package (`src/`)' },
        { from: 'Small front desk', to: 'Thin notebook that calls the package' },
        { from: 'Inventory on the counter', to: 'All logic crammed into one notebook' },
      ],
    },
    {
      id: 'concept-src-layout',
      type: 'concept',
      title: 'The src-layout package',
      body: 'Put reusable logic in a **package** under `src/` — modules grouped by responsibility (ingest, transform, quality). Notebooks and jobs then just `import` from it. This makes each function independently **unit-testable**, **reusable** across pipelines, and reviewable in normal pull requests.\n\nThe notebook shrinks to orchestration: import, call, done.',
      takeaways: [
        'Logic lives in `src/<package>/…` modules, not in notebooks.',
        'Notebooks import and orchestrate — thin by design.',
        'Result: testable, reusable, reviewable code.',
      ],
    },
    {
      id: 'example-layout',
      type: 'example',
      title: 'A bundle-ready layout',
      intro: 'One repo, clean separation of package / notebooks / bundle config:',
      code: {
        language: 'text',
        content:
          "my_pipeline/\n├── databricks.yml            # Asset Bundle definition\n├── pyproject.toml            # builds the wheel\n├── src/\n│   └── my_pipeline/\n│       ├── __init__.py\n│       ├── transforms.py     # pure, testable functions\n│       └── ingest.py\n├── resources/\n│   └── jobs.yml              # job/pipeline definitions\n├── notebooks/\n│   └── run_daily.py          # thin: imports my_pipeline\n└── tests/\n    └── test_transforms.py",
      },
      explanation:
        '`pyproject.toml` builds `src/my_pipeline` into a **wheel**. The bundle deploys the wheel and the notebooks together, so a job task can `import my_pipeline` after the wheel is installed.',
    },
    {
      id: 'concept-wheel',
      type: 'concept',
      title: 'Ship the package as a wheel',
      body: 'A **wheel** (`.whl`) is Python’s built package format. Building your `src/` package into a wheel gives you a single versioned artifact to install on clusters or reference from a job task. Asset Bundles can build and upload the wheel as part of `databricks bundle deploy`.\n\nThat one artifact is what makes deployment repeatable across dev, staging, and prod.',
      takeaways: [
        'A wheel is one versioned, installable artifact.',
        'Bundles build + upload it during deploy.',
        'Same wheel promotes cleanly through environments.',
      ],
    },
    {
      id: 'mistake-percent-run',
      type: 'mistake',
      title: '`%run` is not modularity',
      myth: '“I split my code across notebooks and glue them with `%run`, so it’s modular.”',
      reality:
        '`%run` just pastes one notebook’s globals into another — no packaging, no versioning, and still not unit-testable outside Databricks. Real modularity is an importable package (a wheel) with tests, deployed by a bundle.',
    },
    {
      id: 'mcq-structure',
      type: 'mcq',
      question:
        'A team wants their PySpark logic to be unit-testable in CI, reusable across three pipelines, and deployed identically to dev and prod. Which structure best supports this?',
      options: [
        {
          id: 'a',
          text: 'A src-layout Python package built as a wheel, imported by thin notebooks and deployed via Asset Bundles.',
        },
        {
          id: 'b',
          text: 'One large notebook per pipeline, sharing code by copy-paste.',
        },
        {
          id: 'c',
          text: 'Several notebooks chained with %run to share helper functions.',
        },
        {
          id: 'd',
          text: 'All logic in the driver of a single job, configured by hand in each workspace.',
        },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'Correct — a wheel-packaged package is importable, testable in CI, reusable, and deployable identically by a bundle.',
        b: 'Copy-paste guarantees drift and can’t be unit-tested in isolation.',
        c: '%run shares globals but gives no packaging, versioning, or off-platform testing.',
        d: 'Hand-configuring each workspace is the opposite of repeatable deployment.',
      },
      explanation:
        'A modular, bundle-ready project = an importable package built as a wheel, thin notebooks, tests, and Asset Bundle deployment.',
      examObjective:
        'Design and implement a scalable Python project structure optimized for Databricks Asset Bundles, enabling modular development, deployment automation, and CI/CD integration.',
    },
    {
      id: 'flash-wheel',
      type: 'flashcard',
      front: 'What single artifact makes your Python logic installable and deployable repeatably across environments?',
      back: 'A **wheel** (`.whl`) built from your `src/` package — built and uploaded by `databricks bundle deploy`.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now structure a project for scale',
      points: [
        'Keep logic in an importable `src/` package; keep notebooks thin.',
        'Package the code as a versioned wheel.',
        'Asset Bundles build, upload, and deploy the wheel + resources.',
        '`%run` is not modularity — it shares globals, not packages.',
        'This structure is what makes unit tests and CI/CD possible.',
      ],
      closing: 'Next: getting the right libraries onto the cluster in the first place. 📦',
    },
  ],
}
