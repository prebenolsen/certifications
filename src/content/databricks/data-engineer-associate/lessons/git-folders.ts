import type { Lesson } from '@/types/content'

/**
 * Lesson: Git folders and the development workflow in the workspace.
 * Maps to exam Section 5 (manage code development workflow in the workspace
 * UI: branches, commits, pushes, and pull requests via Git integration).
 */
export const gitFoldersLesson: Lesson = {
  id: 'git-folders',
  title: 'Git folders: version control in the workspace',
  summary:
    'How Databricks Git folders bring branches, commits, and pull requests to notebook development — and where the PR actually happens.',
  estimatedMinutes: 8,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'notebook_final_v3_REAL_fixed',
      body: 'The workspace has five copies of the ETL notebook: `etl`, `etl_backup`, `etl_final`, `etl_final_v2`, `etl_test_DO_NOT_DELETE`. Nobody knows which one production runs. Someone edits the wrong one; nothing changes in prod; an hour is lost figuring out why.\n\nThis is life without version control — and **Git folders** are how Databricks ends it.',
      atWork:
        'Filename-based versioning is the smoke; no source control is the fire.',
    },
    {
      id: 'concept-gitfolders',
      type: 'concept',
      title: 'What a Git folder is',
      body: 'A **Git folder** (formerly *Databricks Repos*) is a clone of a Git repository living inside your workspace. You connect a provider — GitHub, GitLab, Azure DevOps — and the folder’s contents mirror the repo.\n\nNotebooks and files inside it are ordinary workspace assets you can open and run, but they carry the repo’s full Git state: a current **branch**, uncommitted changes, and sync with the remote.',
      takeaways: [
        'Git folder = a repo clone inside the workspace.',
        'Works with GitHub, GitLab, Azure DevOps, Bitbucket.',
        'Notebooks in it are runnable *and* version-controlled.',
      ],
    },
    {
      id: 'concept-workflow',
      type: 'concept',
      title: 'The daily workflow, entirely in the UI',
      body: 'From the Git dialog inside the workspace you can:\n\n• **Create and switch branches** — start `feature/fix-null-handling` without touching main.\n• **Commit & push** — stage your notebook changes with a message and push to the remote.\n• **Pull** — bring in teammates’ merged changes.\n\nEveryone works in their own branch (often their own Git folder), and main stays deployable.',
      takeaways: [
        'Branch → edit notebooks → commit & push → pull to sync.',
        'Feature branches keep main clean.',
        'No terminal required — the workspace UI drives Git.',
      ],
    },
    {
      id: 'diagram-gitflow',
      type: 'diagram',
      title: 'From idea to merged',
      spec: {
        kind: 'flow',
        steps: [
          { label: 'Branch', sublabel: 'feature/… in the Git folder', tone: 'brand' },
          { label: 'Edit & run', sublabel: 'notebooks in the workspace', tone: 'accent' },
          { label: 'Commit & push', sublabel: 'workspace Git dialog', tone: 'accent' },
          { label: 'Pull request', sublabel: 'in the Git provider', tone: 'good' },
        ],
        arrows: [null, null, 'review & merge'],
      },
      caption:
        'Development happens in the workspace; the **pull request and review happen in the Git provider** (GitHub, etc.).',
    },
    {
      id: 'mistake-pr',
      type: 'mistake',
      title: 'Where does the PR live?',
      myth: '“Databricks has Git integration, so I create and review pull requests inside the workspace.”',
      reality:
        'The workspace handles **branch, commit, push, pull**. The **pull request** itself — opening it, review, approval, merge — happens in your Git provider (GitHub/GitLab/Azure DevOps). Databricks links you there. The provider stays the source of truth for code review.',
    },
    {
      id: 'mcq-gitfolders',
      type: 'mcq',
      question:
        'A data engineer must fix a transformation bug without risking the production code, get the fix reviewed, and only then have it land in main. Which sequence is correct?',
      options: [
        { id: 'a', text: 'Edit the production notebook directly in the workspace and export a backup copy first.' },
        { id: 'b', text: 'Create a feature branch in the Git folder, fix and test the notebook, commit and push from the workspace, then open a pull request in the Git provider for review and merge.' },
        { id: 'c', text: 'Clone the notebook to notebook_v2, edit it, and rename it back after testing.' },
        { id: 'd', text: 'Commit directly to main from the workspace — Git tracks history, so review is unnecessary.' },
      ],
      correct: ['b'],
      optionFeedback: {
        a: 'Editing prod directly is the risk; a backup copy is filename-versioning again.',
        b: 'Branch → edit → commit/push (workspace) → PR (provider): the intended workflow end to end.',
        c: 'That is the notebook_final_v3 world this lesson exists to end.',
        d: 'History is not review — the PR gate is what keeps main deployable.',
      },
      explanation:
        'Isolation comes from the **branch**, safety from the **review**, and the division of labor is: workspace for editing/committing, provider for the PR.',
      examObjective:
        'Manage your code development workflow within the workspace UI, including creating and switching branches in Databricks Git Folders, committing and pushing changes, and creating pull requests using Git integration.',
    },
    {
      id: 'tf-branch',
      type: 'truefalse',
      statement:
        'Switching branches in a Git folder changes which version of the notebooks you see and run in the workspace.',
      answer: true,
      explanation:
        'The Git folder reflects its checked-out branch — switch branches and the files update in place. That is also the caution: a *shared* Git folder switching branches changes what everyone attached to it sees, which is why per-developer folders are the norm.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'Your notebooks are now software',
      points: [
        'Git folders clone a repo into the workspace, per developer.',
        'Branch, commit, push, and pull happen in the workspace UI.',
        'Pull requests and review happen in the Git provider.',
        'Main stays deployable; filename-versioning dies.',
      ],
      closing: 'Code is versioned — but jobs and pipelines need versioning too. Enter Asset Bundles. 📦',
    },
  ],
}
