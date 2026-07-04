import type { Lesson } from '@/types/content'

/**
 * Lesson: row filters, column masks, and dynamic views.
 * Maps to exam Section 7 (use row filters and column masks to filter/mask
 * sensitive data). Covers sample question 4 (dynamic view with is_member).
 */
export const rowFiltersColumnMasksLesson: Lesson = {
  id: 'row-filters-column-masks',
  title: 'Same table, different rows per user',
  summary:
    'Enforce fine-grained access at query time with dynamic views, row filters, and column masks driven by group membership.',
  estimatedMinutes: 10,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'One table, many audiences',
      body: 'Analysts across teams need the `user_ltv` table, but only marketing may see customer emails; everyone else should get the value masked. You could maintain a dozen copies with different columns — or enforce the rule *once*, at query time, based on who is asking.',
      atWork:
        'Fine-grained, membership-based masking is a Professional staple — and a classic trick question about what a non-member actually sees.',
    },
    {
      id: 'concept-dynamic-view',
      type: 'concept',
      title: 'Dynamic views react to who runs the query',
      body: 'A **dynamic view** applies logic based on the querying user’s identity or group membership, using functions like `is_member(\'group\')`, `current_user()`, and `is_account_group_member()`.\n\nWith `CASE WHEN is_member(\'marketing\') THEN email ELSE \'REDACTED\' END`, marketing sees real emails and everyone else sees the literal string `REDACTED` — same view, different results per user.',
      takeaways: [
        '`is_member(\'group\')` returns true for members of that group.',
        'A CASE expression can reveal or mask a column per user.',
        'One view enforces the policy for everyone.',
      ],
    },
    {
      id: 'example-view',
      type: 'example',
      title: 'The masking view',
      intro: 'Non-members get the string, not null and not a dropped column:',
      code: {
        language: 'sql',
        content:
          "CREATE VIEW email_ltv AS\nSELECT\n  CASE WHEN is_member('marketing') THEN email\n       ELSE 'REDACTED'\n  END AS email,\n  ltv\nFROM user_ltv;",
      },
      explanation:
        'The view returns exactly two columns — `email` and `ltv`. For a non-marketing analyst, every `email` value is the string `REDACTED`; the column is still there and still named `email`.',
    },
    {
      id: 'mcq-dynamic-view',
      type: 'mcq',
      question:
        'Given the view above, an analyst who is NOT in the marketing group runs `SELECT * FROM email_ltv`. What is returned?',
      options: [
        {
          id: 'a',
          text: 'Two columns (email, ltv); the email column contains the string "REDACTED" in every row.',
        },
        {
          id: 'b',
          text: 'Three columns, one named "REDACTED" containing only nulls.',
        },
        {
          id: 'c',
          text: 'Two columns (email, ltv); the email column contains all null values.',
        },
        {
          id: 'd',
          text: 'The email and ltv columns with the real values from user_ltv.',
        },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'Correct — the CASE returns the literal string "REDACTED" for non-members, in the column still named email.',
        b: 'The view selects two columns; the alias is `email`, not `REDACTED`, and values are a string, not null.',
        c: 'The ELSE branch returns the string "REDACTED", not null.',
        d: 'Only members of marketing see real emails; this analyst is not one.',
      },
      explanation:
        'The dynamic view returns two columns; for a non-member the `email` column holds the literal string `REDACTED` on every row.',
      examObjective:
        'Demonstrate understanding of the Unity Catalog permission inheritance model.',
    },
    {
      id: 'concept-row-filter',
      type: 'concept',
      title: 'Row filters: hide entire rows',
      body: 'A **row filter** is a UDF returning a boolean, attached to a table. Rows for which it returns false are invisible to that user. Example: a region-restricting filter so a regional analyst sees only their region’s rows.\n\nUnlike a dynamic view, a row filter is applied to the **table itself**, so it protects the data no matter how it’s queried.',
      takeaways: [
        'Row filter = boolean UDF attached to a table.',
        'False rows are excluded from that user’s results.',
        'Applied on the table, so all queries inherit it.',
      ],
    },
    {
      id: 'concept-column-mask',
      type: 'concept',
      title: 'Column masks: transform a column’s values',
      body: 'A **column mask** is a UDF attached to a specific column; it rewrites the returned value per user — e.g. show only the last 4 digits of a card number, or hash an email for non-privileged users.\n\nRow filters and column masks are the modern, reusable alternative to hand-writing a dynamic view for every table: define the function once, `ALTER TABLE … SET ROW FILTER / SET MASK`.',
      takeaways: [
        'Column mask = UDF that rewrites a column’s value per user.',
        'Attach with `ALTER TABLE … SET MASK`.',
        'Reusable across tables — cleaner than per-table views.',
      ],
    },
    {
      id: 'tf-row-filter',
      type: 'truefalse',
      statement:
        'A column mask can remove entire rows from a user’s query results.',
      answer: false,
      explanation:
        'A column mask transforms *values within a column*; removing whole rows is the job of a **row filter**. They’re complementary.',
    },
    {
      id: 'flash-nonmember',
      type: 'flashcard',
      front: 'With `CASE WHEN is_member(\'marketing\') THEN email ELSE \'REDACTED\' END AS email`, what does a non-member see in the email column?',
      back: 'The literal string `REDACTED` in every row — the column is still present and named `email` (not null, not dropped).',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now mask at query time',
      points: [
        'Dynamic views use `is_member`/`current_user` to vary results per user.',
        'A CASE-masked column returns the ELSE value (e.g. "REDACTED") for non-members.',
        'Row filters attach a boolean UDF to a table to hide rows.',
        'Column masks attach a UDF to a column to transform values.',
        'Filters/masks are reusable across tables; dynamic views are per-view.',
      ],
      closing: 'Next: de-identifying PII so even the stored data is safe. 🕵️',
    },
  ],
}
