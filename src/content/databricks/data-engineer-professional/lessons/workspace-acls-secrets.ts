import type { Lesson } from '@/types/content'

/**
 * Lesson: workspace ACLs (least privilege) and the secrets module.
 * Maps to exam Section 7 (use ACLs to secure workspace objects; least privilege)
 * and Section 1 (secure, configurable code). Covers sample question 6 (secrets
 * redaction).
 */
export const workspaceAclsSecretsLesson: Lesson = {
  id: 'workspace-acls-secrets',
  title: 'Least privilege, and never a plaintext password',
  summary:
    'ACLs on workspace objects for least-privilege access, and the secrets module for configurable credentials that never print in plaintext.',
  estimatedMinutes: 10,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'The password in the notebook',
      body: 'A notebook connects to an external database with the password typed as a string literal. Anyone who can read the notebook can read the password — and it’s now in Git history, the job logs, and three people’s laptops.\n\nDatabricks gives you two tools to stop this: **ACLs** to control who can even open the notebook, and the **secrets module** to keep the credential out of the code entirely.',
      atWork:
        'A leaked credential in notebook source is one of the most common — and most testable — security failures.',
    },
    {
      id: 'concept-acls',
      type: 'concept',
      title: 'ACLs: who can do what to an object',
      body: 'Access Control Lists (ACLs) govern **workspace objects** — notebooks, folders, jobs, clusters, pipelines, secret scopes. Each grants a permission level (e.g. CAN VIEW, CAN RUN, CAN MANAGE) to a user, group, or service principal.\n\nThe guiding rule is **least privilege**: grant the *minimum* level needed. A job runner needs CAN RUN, not CAN MANAGE; a reviewer needs CAN VIEW, not edit rights.',
      takeaways: [
        'ACLs secure workspace objects (notebooks, jobs, clusters, scopes).',
        'Levels range from CAN VIEW up to CAN MANAGE.',
        'Least privilege: grant the smallest level that works.',
      ],
    },
    {
      id: 'concept-secrets',
      type: 'concept',
      title: 'The secrets module keeps credentials out of code',
      body: 'A **secret scope** stores sensitive values (passwords, tokens, keys) outside your code. Code fetches them at runtime with `dbutils.secrets.get(scope, key)`. Access to the scope is itself ACL-controlled, so only authorized principals can read a secret.\n\nThe credential never appears in the notebook source, Git, or a shared config.',
      takeaways: [
        'Secrets live in an ACL-controlled scope, not in code.',
        'Fetch at runtime with `dbutils.secrets.get(scope, key)`.',
        'Source, Git, and configs stay credential-free.',
      ],
    },
    {
      id: 'concept-redaction',
      type: 'concept',
      title: 'Secrets are redacted if you try to print them',
      body: 'Databricks guards against accidental leaks: if you `print()` a value retrieved from `dbutils.secrets.get`, the output shows `[REDACTED]` instead of the real value. The *variable still holds the real secret* — the connection using it works fine — but the displayed text is masked.\n\nSo the classic "let me just print it to check" reveals nothing useful, by design.',
      takeaways: [
        'Retrieved secrets work normally in code (e.g. as a JDBC password).',
        'Printing one outputs `[REDACTED]`, not the value.',
        'Redaction is display-only; the value itself is intact.',
      ],
    },
    {
      id: 'mcq-secrets',
      type: 'mcq',
      question:
        'A notebook sets `password = dbutils.secrets.get(scope="db_creds", key="jdbc_password")`, then `print(password)`, and uses `password` as the JDBC password (permissions are correctly configured). What happens?',
      options: [
        {
          id: 'a',
          text: 'The connection succeeds; the string "REDACTED" is printed.',
        },
        {
          id: 'b',
          text: 'The connection succeeds; the password prints in plain text.',
        },
        {
          id: 'c',
          text: 'An input box appears; if the right password is entered, the connection succeeds and prints in plain text.',
        },
        {
          id: 'd',
          text: 'An input box appears; the encoded password is saved to DBFS.',
        },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'Correct — the real value is used for the connection, but printing a secret outputs [REDACTED].',
        b: 'Databricks masks printed secret values precisely to prevent this.',
        c: '`dbutils.secrets.get` reads from the scope non-interactively; no input box appears.',
        d: 'No prompt, and nothing is written to DBFS.',
      },
      explanation:
        'The secret is fetched and used normally (the JDBC connect works), but any attempt to display it prints `[REDACTED]`.',
      examObjective:
        'Understand the notebook development environment, variable management, and creating secure, configurable code.',
    },
    {
      id: 'mistake-redacted-broken',
      type: 'mistake',
      title: '"REDACTED means my secret is broken"',
      myth: '“print(password) shows [REDACTED], so the secret didn’t load and my connection will fail.”',
      reality:
        'Redaction is purely cosmetic. The variable holds the true secret and any real use of it — a database connection, an API call — works. Only the *printed* representation is masked.',
    },
    {
      id: 'flash-redacted',
      type: 'flashcard',
      front: 'What prints when you print() a value from dbutils.secrets.get, and does the secret still work?',
      back: '`[REDACTED]` is printed, but the variable holds the real value — connections using it succeed.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now handle credentials safely',
      points: [
        'ACLs secure workspace objects; grant least privilege (CAN VIEW/RUN/MANAGE).',
        'Secret scopes keep credentials out of code, Git, and configs.',
        'Fetch secrets with `dbutils.secrets.get(scope, key)`.',
        'Printing a secret shows `[REDACTED]`, but the value still works.',
        'Redaction is display-only — not a sign the secret failed to load.',
      ],
      closing: 'Next: giving different users different rows of the same table. 🎭',
    },
  ],
}
