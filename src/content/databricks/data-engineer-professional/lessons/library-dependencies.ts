import type { Lesson } from '@/types/content'

/**
 * Lesson: managing third-party libraries and dependencies.
 * Maps to exam Section 1 (manage and troubleshoot external third-party library
 * installations — PyPI packages, local wheels, and source archives).
 */
export const libraryDependenciesLesson: Lesson = {
  id: 'library-dependencies',
  title: 'Installing the right libraries, the right way',
  summary:
    'PyPI, local wheels, and source archives across notebook, cluster, and serverless scopes — and how to untangle a version conflict.',
  estimatedMinutes: 10,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: '"It works on my cluster"',
      body: 'Your notebook needs `pandas==2.1`, but a teammate on the same cluster installed `pandas==1.5` for their job — and now both break intermittently. Meanwhile an internal library isn’t on PyPI at all, and the serverless job can’t see the wheel you uploaded.\n\nKnowing *where* and *how* a library is installed — and at what scope — is what keeps environments reproducible.',
      atWork:
        'Dependency issues are the number-one "why did the pipeline suddenly fail?" — the exam expects you to diagnose them.',
    },
    {
      id: 'concept-scopes',
      type: 'concept',
      title: 'Scope decides who is affected',
      body: 'A library can be installed at three scopes. **Notebook-scoped** (`%pip install` in a notebook) affects only that notebook’s session — isolated and safe. **Cluster-scoped** libraries are installed on every notebook/job on that cluster — shared, so conflicts bite everyone. **Serverless / environment** dependencies are declared per job in an environment spec.\n\nPrefer the *narrowest* scope that works.',
      takeaways: [
        'Notebook-scoped (`%pip`) = just this session, isolated.',
        'Cluster-scoped = everyone on the cluster (shared conflicts).',
        'Serverless = declared in the job’s environment spec.',
      ],
    },
    {
      id: 'concept-sources',
      type: 'concept',
      title: 'Three places a package comes from',
      body: '**PyPI** — the public index; `%pip install great-expectations`. **Local wheel** — a prebuilt `.whl` (e.g. your internal package or an air-gapped dependency); `%pip install /Volumes/…/my_lib-1.0-py3-none-any.whl`. **Source archive** — a `.tar.gz` sdist that pip *builds* on install; slower and needs build tools, but works when no wheel is published.\n\nWheels install fastest; source archives are the fallback when only source exists.',
      takeaways: [
        'PyPI: public packages by name.',
        'Local wheel: a prebuilt `.whl` from a Volume/path — fast, offline-friendly.',
        'Source archive (`.tar.gz`): pip builds it on install — slower fallback.',
      ],
    },
    {
      id: 'example-installs',
      type: 'example',
      title: 'The three installs',
      intro: 'Same `%pip`, three sources:',
      code: {
        language: 'python',
        content:
          "# From PyPI\n%pip install great-expectations==0.18.8\n\n# From a local wheel on a Unity Catalog Volume\n%pip install /Volumes/prod/libs/wheels/my_lib-1.0-py3-none-any.whl\n\n# From a source archive (pip builds it)\n%pip install /Volumes/prod/libs/src/legacy_lib-0.3.tar.gz\n\ndbutils.library.restartPython()   # apply the new environment",
      },
      explanation:
        'After a notebook-scoped install you call `dbutils.library.restartPython()` so the session picks up the new packages. The wheel installs in seconds; the `.tar.gz` may compile first.',
    },
    {
      id: 'concept-conflicts',
      type: 'concept',
      title: 'Troubleshooting a version conflict',
      body: 'When two packages demand incompatible versions of a shared dependency, installs "resolve" to something one of them can’t use — and you get an `ImportError` or odd runtime failures. Fixes, in order: **pin** exact versions, **isolate** with notebook scope instead of cluster scope, and check the **Databricks Runtime** — it ships many libraries preinstalled, and your pin may be fighting the built-in one.',
      takeaways: [
        'Pin exact versions to make installs reproducible.',
        'Isolate with notebook scope to avoid cluster-wide clashes.',
        'The runtime preinstalls libraries — your version may collide with it.',
      ],
    },
    {
      id: 'tf-notebook-scope',
      type: 'truefalse',
      statement:
        'A notebook-scoped `%pip install` changes the library versions for every other job running on the same cluster.',
      answer: false,
      explanation:
        'Notebook-scoped installs are isolated to that notebook’s Python session. Only **cluster-scoped** libraries affect everyone on the cluster.',
    },
    {
      id: 'mcq-source',
      type: 'mcq',
      question:
        'An internal package is not on PyPI. You have its prebuilt `.whl` file and want a fast, reproducible install that doesn’t affect other jobs on the cluster. What do you do?',
      options: [
        {
          id: 'a',
          text: 'Notebook-scoped %pip install of the local wheel from a Unity Catalog Volume.',
        },
        {
          id: 'b',
          text: 'Install it cluster-scoped so every job on the cluster shares it.',
        },
        {
          id: 'c',
          text: 'Publish the package to public PyPI first, then pip install by name.',
        },
        {
          id: 'd',
          text: 'Paste the library’s source into the notebook and run it inline.',
        },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'Correct — a notebook-scoped install of the wheel is fast, reproducible, and isolated from other jobs.',
        b: 'Cluster scope affects every job and invites conflicts — not what’s asked.',
        c: 'Publishing an internal package to public PyPI is a security problem and unnecessary.',
        d: 'Pasting source is unmaintainable and defeats packaging.',
      },
      explanation:
        'A prebuilt wheel installed notebook-scoped from a Volume is the fast, isolated, reproducible path for an off-PyPI internal library.',
      examObjective:
        'Manage and troubleshoot external third-party library installations and dependencies in Databricks, including PyPI packages, local wheels, and source archives.',
    },
    {
      id: 'flash-restart',
      type: 'flashcard',
      front: 'After a notebook-scoped `%pip install`, what call ensures the session uses the new packages?',
      back: '`dbutils.library.restartPython()` — it restarts the Python interpreter with the updated environment.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now manage dependencies',
      points: [
        'Scopes: notebook (isolated) < cluster (shared) < serverless (env spec).',
        'Sources: PyPI by name, local `.whl` (fast), source `.tar.gz` (built on install).',
        'Restart Python after a notebook-scoped install.',
        'Conflicts: pin versions, isolate with notebook scope, mind runtime preinstalls.',
        'Prefer the narrowest scope and a prebuilt wheel.',
      ],
      closing: 'Next: when a plain function isn’t enough — writing UDFs. 🧩',
    },
  ],
}
