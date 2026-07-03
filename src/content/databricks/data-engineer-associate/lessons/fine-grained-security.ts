import type { Lesson } from '@/types/content'

/**
 * Lesson: row-level security, column masking, and ABAC.
 * Maps to exam Section 7 (understand column-level masking and row-level
 * security; understand Unity Catalog ABAC policies for centralized row
 * filtering and column masking).
 */
export const fineGrainedSecurityLesson: Lesson = {
  id: 'fine-grained-security',
  title: 'Row filters, column masks & ABAC',
  summary:
    'When table-level access is too blunt: showing different slices of the same table to different groups — and scaling that with tag-driven policies.',
  estimatedMinutes: 10,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'One table, three audiences',
      body: 'The `customers` table serves three groups. **EU analysts** may only see EU rows (GDPR). **Support** needs most columns but not full email addresses. **Finance** needs everything.\n\nThe blunt fix — three filtered copies of the table — triples storage, drifts instantly, and *still* leaves the original exposed. Fine-grained security keeps **one table** that shows each viewer exactly what they are allowed to see.',
      atWork:
        'Any time someone proposes “a filtered copy of the table for team X,” row filters and column masks are the answer they haven’t met yet.',
    },
    {
      id: 'concept-rowfilter',
      type: 'concept',
      title: 'Row-level security: filtering rows by who asks',
      body: 'A **row filter** is a SQL function attached to a table. On every query, it runs per row with the *current user’s* context and decides: visible or not.\n\nThe typical shape: `is_account_group_member(\'eu_analysts\')` inside the function decides whether `region = \'EU\'` filtering applies. Same query, different users, different rows — enforced by the platform, invisible to the query author.',
      takeaways: [
        'A function attached to the table decides row visibility per user.',
        'Enforced on every access path — dashboards, notebooks, JDBC alike.',
        'The querying user cannot tell filtered rows ever existed.',
      ],
    },
    {
      id: 'concept-colmask',
      type: 'concept',
      title: 'Column masks: hiding values, not columns',
      body: 'A **column mask** is a function attached to a specific column. Authorized viewers get the real value; everyone else gets the function’s transformation — `NULL`, `"***"`, or a partial reveal like `j***@company.com`.\n\nThe column stays present and queryable (joins and counts still work); only the sensitive **value** is protected. That is the difference from just denying the column.',
      takeaways: [
        'Mask = per-column function: real value for some, redacted for others.',
        'Queries and joins keep working — no broken dashboards.',
        'Partial masking (last 4 digits …) is a function away.',
      ],
    },
    {
      id: 'example-masks',
      type: 'example',
      title: 'Attaching a filter and a mask',
      intro: 'Both are functions plus one ALTER TABLE:',
      code: {
        language: 'sql',
        content:
          "CREATE FUNCTION eu_only(region STRING)\n  RETURN is_account_group_member('global_analysts') OR region = 'EU';\nALTER TABLE customers SET ROW FILTER eu_only ON (region);\n\nCREATE FUNCTION mask_email(email STRING)\n  RETURN CASE WHEN is_account_group_member('pii_readers') THEN email\n              ELSE concat(left(email, 1), '***') END;\nALTER TABLE customers ALTER COLUMN email SET MASK mask_email;",
      },
      explanation:
        'Members of `global_analysts` see all rows; everyone else sees only EU. Members of `pii_readers` see real emails; support sees `j***`. One table, per-viewer reality.',
    },
    {
      id: 'concept-abac',
      type: 'concept',
      title: 'ABAC: policies that scale by tags',
      body: 'Attaching functions table by table works — for a while. With **thousands** of tables, governance teams need one rule, not a thousand ALTER statements.\n\n**ABAC** (attribute-based access control) writes policies against **tags**: “any column tagged `pii.email` is masked for everyone outside `pii_readers`.” Tag the columns (or inherit tags from schemas), and the policy applies **centrally, everywhere, including to tables created tomorrow**.',
      takeaways: [
        'Policies target **tags** (attributes), not individual objects.',
        'One policy governs every current and future tagged column.',
        'Central governance instead of per-table craftsmanship.',
      ],
    },
    {
      id: 'diagram-abac',
      type: 'diagram',
      title: 'Per-object rules vs tag-driven policy',
      spec: {
        kind: 'compare',
        left: {
          label: 'Object-by-object',
          sublabel: 'row filters & masks by hand',
          tone: 'warn',
          items: [
            'ALTER TABLE per table, per column',
            'Precise, but effort scales with table count',
            'New tables start unprotected until someone remembers',
          ],
        },
        right: {
          label: 'ABAC policies',
          sublabel: 'rules bound to tags',
          tone: 'good',
          items: [
            'One policy: “tag pii.email ⇒ masked”',
            'Applies across the estate, centrally managed',
            'New tagged tables are protected automatically',
          ],
        },
      },
      caption: 'Same enforcement underneath — ABAC changes *how rules are managed*, not what users see.',
    },
    {
      id: 'mistake-view-security',
      type: 'mistake',
      title: 'The filtered-view workaround',
      myth: '“We already handle this with views: `CREATE VIEW eu_customers AS SELECT … WHERE region = \'EU\'` and grants on the view.”',
      reality:
        'Workable — until someone gets (or inherits) access to the **base table** and bypasses every view. Row filters and masks attach to **the table itself**, so there is no unprotected object left to find. Views layer security *around* data; filters and masks build it *in*.',
    },
    {
      id: 'mcq-finegrained',
      type: 'mcq',
      question:
        'A governance team must ensure that in every current *and future* table, columns containing national ID numbers are masked for all users outside a small compliance group — across thousands of tables, managed centrally. Which approach fits?',
      options: [
        { id: 'a', text: 'Attach a column mask function manually to each national-ID column found today.' },
        { id: 'b', text: 'Tag national-ID columns and define a Unity Catalog ABAC policy that masks columns carrying that tag for non-compliance users.' },
        { id: 'c', text: 'Create masked views of every table and ask users to query the views.' },
        { id: 'd', text: 'REVOKE SELECT on all tables containing such columns.' },
      ],
      correct: ['b'],
      optionFeedback: {
        a: 'Covers today’s tables only — tomorrow’s start unprotected, and thousands of ALTERs are unmanageable.',
        b: 'Tag-driven central policy: applies estate-wide, automatically covers new tagged columns — the ABAC use case verbatim.',
        c: 'Views can be bypassed by base-table access and double the object count.',
        d: 'Blocks entire tables when only one column needed protection.',
      },
      explanation:
        'The requirements “centrally”, “thousands”, and “future tables” are the three signals that point past per-object masks to **ABAC**.',
      examObjective:
        'Understand Unity Catalog ABAC policies to centrally control row-level filtering and column masking for sensitive data.',
    },
    {
      id: 'flash-rls',
      type: 'flashcard',
      front: 'Row filter vs column mask — what does each hide?',
      back: 'Row filter → **entire rows** (which records you see) · Column mask → **values in one column** (what you see in them). Both are functions attached to the table.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You now secure data at every grain',
      points: [
        'Row filters show each user only their permitted rows — enforced at the table.',
        'Column masks redact values while keeping columns queryable.',
        'Both are SQL functions attached via ALTER TABLE.',
        'ABAC binds these rules to tags: one central policy, whole estate, future-proof.',
      ],
      closing: 'That’s the full journey: platform → ingest → transform → orchestrate → ship → tune → secure. You’re ready to certify. 🎓',
    },
  ],
}
