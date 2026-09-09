import type { Lesson } from '@/types/content'

/**
 * Lesson: creating, sharing, and improving a Genie space.
 * Maps to exam Section 7 (create Genie spaces by defining sample questions and
 * domain-specific instructions, choosing SQL warehouses, curating Unity Catalog
 * datasets, and vetting queries as Trusted Assets; assign permissions and
 * distribute via embedded links and external apps; optimize by tracking user
 * questions, response accuracy and feedback, updating instructions and trusted
 * assets, validating with benchmarks, and refreshing Unity Catalog metadata).
 * Research: src_material/.../research/platform-and-naming.md
 */
export const genieBuildOptimizeLesson: Lesson = {
  id: 'genie-build-optimize',
  title: 'Building & improving a Genie space',
  summary:
    'Curate the tables, write the instructions, vet the trusted queries, share it — then close the loop on the questions it got wrong.',
  estimatedMinutes: 11,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'Right query, wrong definition',
      body: 'Someone asks the new Genie space for "active customers this month". The SQL is flawless — and the number is wrong, because in your company "active" excludes trial accounts and Genie had no way to know.\n\nA space is only as good as what you told it. Building one is mostly writing down the things your team knows and never says out loud.',
      atWork:
        'The first month of a Genie space is a feedback loop, not a launch.',
    },
    {
      id: 'concept-curate',
      type: 'concept',
      title: 'Start by curating the data',
      body: 'Choose the tables and views the space may use — **up to 30**. Fewer, better ones beat more: pick the certified, well-named gold tables an analyst would actually use, not the raw bronze layer.\n\nThe space also needs a **pro or serverless SQL warehouse** to run its queries; you need `CAN USE` on it to select it.\n\nBefore adding a table, make sure its Unity Catalog metadata is good — **column comments** especially. Genie reads that metadata, so a column called `amt` with no description is a question waiting to be answered wrongly.',
      takeaways: [
        'Up to 30 tables or views — curate, do not dump.',
        'Requires a pro or serverless SQL warehouse.',
        'Good column comments in Unity Catalog directly improve answers.',
      ],
    },
    {
      id: 'concept-instructions',
      type: 'concept',
      title: 'Instructions: the things everyone already knows',
      body: '**General instructions** are plain-language notes about your business that no schema can express: *"Active customers exclude trials." "Revenue is net of returns." "Fiscal year starts in April." "Always filter out the test store, id 999."*\n\nThis is the highest-value part of a space and the part most often skipped. Every ambiguity you write down here is a class of wrong answer you will never have to correct.',
      takeaways: [
        'Definitions, business rules, and known caveats — in plain language.',
        'Write the rules your team applies without thinking.',
        'Each instruction removes a whole category of mistake.',
      ],
    },
    {
      id: 'concept-samples-trusted',
      type: 'concept',
      title: 'Sample questions and trusted assets',
      body: '**Sample questions** appear on the space’s landing page. They teach users what this space is for — "revenue by region last quarter" — and quietly steer them away from questions its data cannot answer.\n\n**Trusted assets** are vetted SQL queries you have reviewed and approved for known questions. When a user asks something a trusted query covers, Genie uses that instead of writing its own. It is how you guarantee the important numbers are computed the *approved* way, every time.',
      takeaways: [
        'Sample questions set expectations and demonstrate scope.',
        'Trusted assets are reviewed queries Genie can rely on.',
        'Use trusted assets for metrics that must always be computed identically.',
      ],
    },
    {
      id: 'diagram-build',
      type: 'diagram',
      title: 'What you configure',
      spec: {
        kind: 'flow',
        steps: [
          {
            label: 'Curate data',
            sublabel: 'up to 30 tables/views + a SQL warehouse',
            tone: 'brand',
          },
          {
            label: 'Write instructions',
            sublabel: 'definitions, rules, caveats',
            tone: 'accent',
          },
          {
            label: 'Add examples',
            sublabel: 'sample questions · trusted queries',
            tone: 'good',
          },
          {
            label: 'Share and monitor',
            sublabel: 'permissions · feedback · benchmarks',
            tone: 'neutral',
          },
        ],
      },
      caption:
        'The last step is not the end — reviewing real questions is what turns a space from plausible into reliable.',
    },
    {
      id: 'concept-permissions-distribution',
      type: 'concept',
      title: 'Permissions and getting it to people',
      body: 'Genie spaces are shared like other workspace objects. The creator gets **CAN MANAGE**; collaborators who will curate it need **CAN EDIT**; everyday users need **CAN VIEW / CAN RUN** — **plus `SELECT` on the underlying tables**, because data access is always evaluated per user.\n\nDistribution goes further than the workspace: a space can be reached by link and **embedded in external applications**, so stakeholders ask their questions inside a tool they already use.',
      takeaways: [
        'CAN MANAGE (creator) · CAN EDIT (curators) · CAN VIEW/RUN (users).',
        'Users still need `SELECT` on the data itself.',
        'Spaces can be linked and embedded in external apps.',
      ],
    },
    {
      id: 'concept-optimize',
      type: 'concept',
      title: 'Optimising: close the loop',
      body: 'A space improves by review, not by hope. Four habits:\n\n• **Read the questions users actually asked** and check the answers were right.\n• **Collect feedback** — users flag good and bad responses; each bad one names a missing instruction or a table nobody described.\n• **Update instructions and trusted assets** in response, rather than explaining the same caveat in person again.\n• **Validate with benchmarks** — keep a set of questions with known-correct answers and re-run them after changes, so an improvement for one question does not quietly break another.\n\nAnd keep the **Unity Catalog metadata fresh**: renamed columns and new tables need comments before Genie can use them well.',
      takeaways: [
        'Review real questions and their accuracy; act on user feedback.',
        'Fix problems in the instructions and trusted assets, not in conversation.',
        'Benchmarks catch regressions after a change.',
        'Refreshed comments and tags in Unity Catalog feed straight into answer quality.',
      ],
    },
    {
      id: 'mistake-launch',
      type: 'mistake',
      title: 'Treating a space as a launch, not a loop',
      myth: '"The space is set up and shared — that project is finished."',
      reality:
        'Week one is when you learn what people actually ask, and it is never what you predicted. Wrong answers at that point are not failures of the tool; they are **missing instructions** you can now write.\n\nThe teams that get value review the question log for the first few weeks, add an instruction or a trusted query each time an answer misses, and re-run their benchmark set. The ones that "launch and leave" end up with a space nobody trusts.',
    },
    {
      id: 'mcq-optimize',
      type: 'mcq',
      question:
        'A Genie space consistently returns the wrong figure for "active customers", because the business excludes trial accounts from that definition. What is the most effective fix?',
      options: [
        {
          id: 'a',
          text: 'Add a general instruction stating that active customers exclude trials, and a trusted query that computes it the approved way.',
        },
        {
          id: 'b',
          text: 'Add more tables to the space so it has extra context to work from.',
        },
        {
          id: 'c',
          text: 'Tell users to phrase the question more carefully each time they ask it.',
        },
        {
          id: 'd',
          text: 'Remove the customers table from the space so the wrong answer cannot be produced.',
        },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'The definition is written down once and applied to every future question, and the trusted query pins the approved calculation.',
        b: 'More tables widen the scope and typically make ambiguity worse, not better.',
        c: 'Relying on every user to phrase it correctly is the problem instructions exist to solve.',
        d: 'Removing the data removes the capability along with the mistake.',
      },
      explanation:
        'Wrong answers usually mean **missing context**. Encode the business rule as an **instruction**, and pin the calculation with a **trusted asset** so the metric is always computed the approved way.',
      examObjective:
        'Optimize AI/BI Genie spaces by tracking user questions, response accuracy, and feedback; updating instructions and trusted assets based on stakeholder input; validating accuracy with benchmarks; refreshing Unity Catalog metadata.',
    },
    {
      id: 'tf-trusted',
      type: 'truefalse',
      statement:
        'A trusted asset is a SQL query that has been reviewed and approved, which Genie can use instead of generating its own for that question.',
      answer: true,
      explanation:
        'That is exactly the point: for questions that matter, the answer comes from a query a human vetted — so the important numbers are computed the same, approved way every time.',
    },
    {
      id: 'flash-space-parts',
      type: 'flashcard',
      front: 'What do you configure when creating a Genie space?',
      back: 'Curated **Unity Catalog tables/views** (up to 30), a **pro or serverless SQL warehouse**, **general instructions**, **sample questions**, and vetted **trusted assets**.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now build and run a Genie space',
      points: [
        'Curate up to 30 well-documented tables; pick a pro or serverless warehouse.',
        'Instructions carry the business rules no schema can express.',
        'Sample questions set expectations; trusted assets pin the approved SQL.',
        'CAN MANAGE / CAN EDIT / CAN VIEW–RUN, plus `SELECT` on the data itself.',
        'Improve by reviewing real questions, acting on feedback, and re-running benchmarks.',
        'Keep Unity Catalog comments current — Genie reads them.',
      ],
      closing:
        'Next module: shaping the tables underneath all of this so the questions are easy to answer. 🧱',
    },
  ],
}
