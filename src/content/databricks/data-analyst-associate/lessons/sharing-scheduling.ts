import type { Lesson } from '@/types/content'

/**
 * Lesson: sharing dashboards and keeping them fresh.
 * Maps to exam Section 6 (configure permissions through the UI to share
 * dashboards with workspace users/groups, external users through shareable
 * links, and embed dashboards in external apps; schedule an automatic
 * dashboard refresh).
 * Research: src_material/.../research/platform-and-naming.md
 */
export const sharingSchedulingLesson: Lesson = {
  id: 'sharing-scheduling',
  title: 'Sharing a dashboard, and keeping it fresh',
  summary:
    'Permissions for colleagues, links for people outside the workspace, dashboards embedded elsewhere — and the refresh schedule that decides whether any of it is current.',
  estimatedMinutes: 10,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'Two ways to get this wrong',
      body: 'Monday: the CFO cannot open the dashboard you sent, because she has no access to your workspace.\n\nTuesday: she can open it, and it shows Friday’s numbers — nobody scheduled a refresh, so the published version froze at the moment you clicked publish.\n\nSharing and refreshing are the two steps between "I built it" and "they use it".',
      atWork:
        'A dashboard nobody can open, or nobody can trust the date on, is a dashboard that did not get built.',
    },
    {
      id: 'concept-permissions',
      type: 'concept',
      title: 'Permissions: who may see and change it',
      body: 'Dashboards are shared like other workspace objects, from the **Share** dialog: pick a user, a **group**, or a service principal, and give them a level — typically **CAN VIEW** (open it), **CAN EDIT** (change it), or **CAN MANAGE** (change it and control access).\n\nGrant to groups rather than individuals so access follows team membership. And grant the smallest level that works: a stakeholder who only reads the numbers needs CAN VIEW, never CAN MANAGE.',
      takeaways: [
        'Levels: CAN VIEW, CAN EDIT, CAN MANAGE.',
        'Share with groups so joiners and leavers are handled automatically.',
        'Least privilege — reading a dashboard never requires managing it.',
      ],
    },
    {
      id: 'concept-data-permissions',
      type: 'concept',
      title: 'Whose data permissions apply?',
      body: 'A published dashboard runs its queries either with the **publisher’s** credentials or with **each viewer’s own**.\n\nWith the publisher’s credentials, everyone sees the same numbers even if they have no access to the underlying tables — convenient for executives, and a deliberate decision to make, because it bypasses their own data permissions.\n\nWith individual permissions, each viewer’s Unity Catalog grants apply, so row filters and column masks still work and two viewers may legitimately see different numbers.',
      takeaways: [
        'Publish with the publisher’s credentials, or with each viewer’s own.',
        "Publisher's credentials = one shared view of the data, bypassing viewer grants.",
        'Individual permissions = Unity Catalog rules (including masks) still apply per viewer.',
      ],
    },
    {
      id: 'diagram-audience',
      type: 'diagram',
      title: 'Three audiences, three mechanisms',
      spec: {
        kind: 'flow',
        steps: [
          {
            label: 'Colleagues',
            sublabel: 'share with users and groups in the workspace',
            tone: 'brand',
          },
          {
            label: 'People outside the workspace',
            sublabel: 'account-level sharing · shareable link',
            tone: 'accent',
          },
          {
            label: 'Another application',
            sublabel: 'embed the dashboard in an iframe',
            tone: 'good',
          },
        ],
      },
      caption:
        'The further out you share, the more deliberate the decision — an embedded dashboard is a published surface, not an internal report.',
    },
    {
      id: 'concept-external-embed',
      type: 'concept',
      title: 'Beyond the workspace: links and iframes',
      body: 'A published dashboard can be shared with **anyone registered in your Databricks account**, even if they have no access to the workspace it lives in — which is how executives and analysts in other teams get in without being granted workspace permissions.\n\nIt can also be **embedded in an external site or application** through an iframe, so a dashboard appears inside a customer portal or an internal tool without anyone leaving that tool. Both routes carry the published version, so review what the published data shows before opening either.',
      takeaways: [
        'Account-level sharing reaches people with no workspace access.',
        'An iframe embeds the dashboard inside another application.',
        'Both serve the published version — check what it exposes first.',
      ],
    },
    {
      id: 'concept-schedule',
      type: 'concept',
      title: 'Scheduled refresh and subscriptions',
      body: 'A published dashboard does not update itself by accident: you give it a **refresh schedule** (say, every weekday at 06:00) and it re-runs its datasets so viewers open current numbers.\n\nMatch the schedule to the data, not to hope — refreshing hourly a table that loads once a night burns compute for no new rows. You can also add **subscriptions**, sending the refreshed dashboard by email or Slack, which is how people who never open the workspace still get their Monday numbers.',
      takeaways: [
        'A refresh schedule re-runs the datasets behind the published version.',
        'Align the schedule with when the source data actually changes.',
        'Subscriptions deliver the refreshed dashboard by email or Slack.',
      ],
    },
    {
      id: 'mistake-stale',
      type: 'mistake',
      title: '"It is live, so it is current"',
      myth: '"The dashboard queries the table directly, so whatever it shows must be up to date."',
      reality:
        'Two things stand between the table and the viewer. The **published** version refreshes on its schedule — with no schedule, it shows whatever it last computed. And the table itself only changes when the **Lakeflow Job** that loads it runs.\n\nWhen someone says the numbers look old, check both: the dashboard’s refresh and the upstream job. Putting the last-refreshed time in a text widget saves that conversation entirely.',
    },
    {
      id: 'mcq-sharing',
      type: 'mcq',
      question:
        'A finance director with no access to your workspace must see the dashboard every morning with the latest overnight figures, without being granted permissions on the underlying tables. What should you configure?',
      options: [
        {
          id: 'a',
          text: 'Publish it with the publisher’s credentials, share it with her at account level, and set a daily refresh schedule.',
        },
        {
          id: 'b',
          text: 'Grant her CAN MANAGE on the dashboard and SELECT on every underlying table.',
        },
        {
          id: 'c',
          text: 'Export the dashboard to PDF each morning and email it manually.',
        },
        {
          id: 'd',
          text: 'Send her a link to your draft dashboard so she always sees your latest edits.',
        },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'Account-level sharing reaches her without workspace access, publisher credentials mean no table grants are needed, and the schedule keeps the figures current.',
        b: 'CAN MANAGE lets her change and re-share the dashboard, and granting table access is exactly what the requirement avoids.',
        c: 'A manual export puts a person in the loop every morning and produces no live dashboard.',
        d: 'Drafts are the editing surface — viewers should never be pointed at one.',
      },
      explanation:
        'Three settings, three requirements: **account-level sharing** for reach, **publisher credentials** so no table grants are needed, and a **refresh schedule** for freshness.',
      examObjective:
        'Configure permissions through the UI to share dashboards with workspace users/groups, external users through shareable links, and embed dashboards in external apps.',
    },
    {
      id: 'tf-refresh',
      type: 'truefalse',
      statement:
        'A published dashboard automatically shows the newest data every time it is opened, even without a refresh schedule.',
      answer: false,
      explanation:
        'Without a schedule, the published dashboard serves the results from its last refresh. Freshness is a setting you configure — which is why a "last refreshed" note on the dashboard is worth adding.',
    },
    {
      id: 'flash-credentials',
      type: 'flashcard',
      front: 'What changes when a dashboard is published with the publisher’s credentials instead of the viewer’s?',
      back: 'Queries run as the **publisher**, so viewers see the data without needing their own grants on the underlying tables — deliberately bypassing their Unity Catalog permissions. With individual permissions, each viewer’s grants, row filters and masks apply.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now put a dashboard in front of people',
      points: [
        'Share with users and groups: CAN VIEW, CAN EDIT, CAN MANAGE — least privilege.',
        'Publish with the publisher’s credentials or with each viewer’s own permissions.',
        'Account-level sharing reaches people without workspace access; iframes embed it elsewhere.',
        'A refresh schedule keeps the published version current; subscriptions push it out.',
        'Stale numbers mean either no refresh, or the upstream job did not run.',
      ],
      closing:
        'Next: being told when a number crosses a line, instead of watching for it. 🔔',
    },
  ],
}
