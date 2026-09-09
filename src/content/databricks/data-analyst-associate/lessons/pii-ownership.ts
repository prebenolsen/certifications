import type { Lesson } from '@/types/content'

/**
 * Lesson: ownership and PII protection best practices.
 * Maps to exam Section 9 (apply best practices for storage and management to
 * ensure data security, including table ownership and PII protection).
 * The final lesson of the certification.
 */
export const piiOwnershipLesson: Lesson = {
  id: 'pii-ownership',
  title: 'Ownership & protecting personal data',
  summary:
    'Who is responsible for a table, how to show different people different parts of it, and the storage habits that keep sensitive data from leaking sideways.',
  estimatedMinutes: 10,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'The export that made a copy',
      body: 'Support needs customer records to investigate a complaint, but not email addresses. Someone helpfully exports a filtered spreadsheet and drops it in a shared folder.\n\nThat file is now outside Unity Catalog: no permissions, no lineage, no audit, no deletion when the customer asks. One convenient export undid every control on the table.',
      atWork:
        'Most personal-data incidents are not break-ins. They are copies made by helpful people solving an access problem the slow way.',
    },
    {
      id: 'concept-ownership',
      type: 'concept',
      title: 'Ownership is accountability, not vanity',
      body: 'Every securable has an **owner** — by default whoever created it. The owner can grant and revoke access, alter the object, and transfer ownership.\n\nSo ownership is really the answer to "who decides who sees this, and who fixes it when it breaks?" A table owned by one person becomes orphaned the moment they change team. **Own shared data with a group**, so responsibility survives staff changes and there is always someone to ask.',
      takeaways: [
        'The creator owns it by default; ownership carries the access decisions.',
        'Transfer ownership of shared tables to a **group**.',
        'An unowned or orphaned table is one nobody will maintain or secure.',
      ],
    },
    {
      id: 'concept-classify',
      type: 'concept',
      title: 'Classify before you protect',
      body: 'You cannot protect what nobody has labelled. **Tag the columns** that hold personal data — `pii = email`, `pii = national_id` — at the column level, in Unity Catalog.\n\nThat classification does two jobs: analysts searching the catalog can see what is sensitive before they build on it, and governance policies have something concrete to act on. Classification is the step teams skip, and it is the step everything else depends on.',
      takeaways: [
        'Tag personal data at the **column** level.',
        'Tags make sensitivity visible in search and Catalog Explorer.',
        'Policies act on tags — untagged PII cannot be governed automatically.',
      ],
    },
    {
      id: 'concept-masking',
      type: 'concept',
      title: 'Show different people different data',
      body: 'Rather than making filtered copies, keep **one table** and vary what each person sees:\n\n• A **column mask** replaces a value for unauthorised users — the column stays present and joins still work, but the value is redacted or partially shown.\n• A **row filter** hides entire rows — a regional analyst sees only their region.\n• A **dynamic view** does either, in SQL: `CASE WHEN is_account_group_member(\'support\') THEN … ELSE \'REDACTED\' END`.\n\nAll three are enforced by the platform on every access path, so there is no unprotected copy for someone to find.',
      takeaways: [
        'Column mask = hide the value; row filter = hide the row.',
        'A dynamic view expresses either using group membership.',
        'One governed table beats several filtered copies, always.',
      ],
    },
    {
      id: 'diagram-copies',
      type: 'diagram',
      title: 'Two ways to give support restricted access',
      spec: {
        kind: 'compare',
        left: {
          label: 'A filtered copy',
          sublabel: 'export, or a second table',
          tone: 'bad',
          items: [
            'Drifts from the source immediately',
            'No lineage, no audit, its own permissions',
            'Deletion requests must find every copy',
          ],
        },
        right: {
          label: 'One table, masked',
          sublabel: 'column masks and row filters',
          tone: 'good',
          items: [
            'Always current — there is only one table',
            'Governed, logged, and revocable in one place',
            'Nothing to hunt down when a record must go',
          ],
        },
      },
      caption:
        'Every copy is a new thing to secure, refresh, and eventually delete. Prefer masking the original.',
    },
    {
      id: 'concept-storage-habits',
      type: 'concept',
      title: 'Storage habits that keep data governed',
      body: 'Four practices carry most of the risk:\n\n• **Prefer managed tables.** Databricks controls the files, so governance and lifecycle stay attached to the data.\n• **Keep credentials out of queries and notebooks.** Access comes from Unity Catalog grants and secrets, never from a password pasted into a cell.\n• **Do not export sensitive data to spreadsheets** to work around an access problem — fix the grant instead.\n• **Remember that time travel keeps history.** Deleting a row removes it from current reads, but older versions can still be queried until the files pass their retention window and are vacuumed.',
      takeaways: [
        'Managed tables keep governance attached to the data.',
        'No credentials in code; no sensitive exports as a workaround.',
        'Deletion is not immediate erasure — history retains it until vacuumed.',
      ],
    },
    {
      id: 'mistake-copy',
      type: 'mistake',
      title: 'Solving an access problem with a copy',
      myth: '"Support cannot see the customers table, so I will make them a version without the sensitive columns."',
      reality:
        'You have created a second table to keep in sync, secure, document, and delete from — and the moment it drifts, two teams have different customer data.\n\nA **column mask** on the original gives support exactly the view they need, from the same table everyone else uses, with permissions and audit intact. One table, many views of it.',
    },
    {
      id: 'mcq-pii',
      type: 'mcq',
      question:
        'Support staff need the customers table but must not see email addresses, while the CRM team must. What is the best approach?',
      options: [
        {
          id: 'a',
          text: 'Tag the email column as PII and apply a column mask (or dynamic view) that reveals it only to the CRM group.',
        },
        {
          id: 'b',
          text: 'Create a second table for support with the email column removed, refreshed nightly.',
        },
        {
          id: 'c',
          text: 'Grant support SELECT on the table and ask them not to query the email column.',
        },
        {
          id: 'd',
          text: 'Export a filtered spreadsheet for support whenever they need customer details.',
        },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'One governed table, enforced per user on every access path, with the sensitive column classified so policies and searches can see it.',
        b: 'A second table drifts, doubles the maintenance, and creates another copy of personal data to secure and delete.',
        c: 'A policy request is not a control — the data is fully readable to anyone who queries it.',
        d: 'Exports leave Unity Catalog entirely: no permissions, no audit, no deletion path.',
      },
      explanation:
        'Protect **in place**: classify the column, then mask it for those who should not see the value. Copies and conventions are not controls.',
      examObjective:
        'Apply best practices for storage and management to ensure data security, including table ownership and PII protection.',
    },
    {
      id: 'tf-delete',
      type: 'truefalse',
      statement:
        'Deleting a customer’s rows from a Delta table immediately makes that data unrecoverable.',
      answer: false,
      explanation:
        'The delete creates a new version that excludes the rows, but earlier versions remain queryable until the old files pass the retention window and are removed by `VACUUM`. Genuine erasure needs both steps.',
    },
    {
      id: 'flash-mask-filter',
      type: 'flashcard',
      front: 'Column mask or row filter — what does each hide?',
      back: '**Column mask:** the *value* in a column, for users who may not see it (the column and joins still work). **Row filter:** entire *rows*, so a user only sees the records they are allowed to.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now handle sensitive data properly',
      points: [
        'Ownership means accountability — own shared tables with a group.',
        'Classify personal data with column tags before protecting it.',
        'Column masks hide values, row filters hide rows, dynamic views do either.',
        'One masked table always beats several filtered copies.',
        'Prefer managed tables; keep credentials out of code; avoid exports.',
        'Deletion plus retention: history keeps data until it is vacuumed.',
      ],
      closing:
        'That is the whole journey: platform → find it → bring it in → query it → make it fast → show it → let others ask → model it → secure it. You are ready to certify. 🎓',
    },
  ],
}
