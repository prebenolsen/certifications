import type { Lesson } from '@/types/content'

/**
 * Lesson: what an AI/BI Genie space is.
 * Maps to exam Section 7 (describe the purpose, key features, and components
 * of AI/BI Genie spaces).
 * Naming note: current docs call these **Genie Agents** ("formerly known as
 * Genie Spaces"). The exam guide says Genie spaces — both are taught.
 * Research: src_material/.../research/platform-and-naming.md
 */
export const genieIntroLesson: Lesson = {
  id: 'genie-intro',
  title: 'What is a Genie space?',
  summary:
    'Natural-language questions over a curated set of your tables — what Genie is, what it is made of, and why it is not a chatbot bolted onto a database.',
  estimatedMinutes: 9,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'The eleventh "quick question" this week',
      body: '"What were Nordics sales last quarter?" "And excluding returns?" "And by channel?" Each one takes you four minutes and breaks your concentration for twenty.\n\nNone of them needs an analyst. They need someone who knows which table holds the answer — which is exactly what a **Genie space** is for.',
      atWork:
        'Genie does not replace analysis. It removes the interruptions that were never analysis in the first place.',
    },
    {
      id: 'concept-what',
      type: 'concept',
      title: 'What a Genie space is',
      body: 'A **Genie space** is a curated area where business users ask questions **in plain language** about a specific set of tables, and get answers back as data — usually with the generated SQL visible underneath.\n\nThe important word is *curated*. You choose which tables it may use, describe what they mean, and supply example questions. Genie is not pointed at the whole catalog and left to guess.',
      takeaways: [
        'Plain-language questions over a **chosen** set of tables and views.',
        'Answers come back as data, with the SQL shown.',
        'You curate the scope — it is not an open door to the whole estate.',
      ],
    },
    {
      id: 'analogy-analyst',
      type: 'analogy',
      title: 'A briefed new colleague',
      body: 'A capable analyst joining your team on Monday cannot answer anything useful yet — not because they cannot write SQL, but because they do not know which of your 1,200 tables is the real revenue table, or that "active customer" excludes trials.\n\nBrief them properly and they are productive. A Genie space is that briefing, written down: the tables that matter, what the words mean, and some worked examples.',
      mapping: [
        { from: 'The tables you point them at', to: 'The curated Unity Catalog datasets' },
        { from: '"Active excludes trials"', to: 'General instructions' },
        { from: 'Worked examples from last quarter', to: 'Trusted assets — vetted example queries' },
      ],
    },
    {
      id: 'concept-components',
      type: 'concept',
      title: 'What a space is made of',
      body: 'Four components, all of which you configure:\n\n• **Data** — the tables and views from Unity Catalog it may query.\n• **Instructions** — plain-language notes about your business: definitions, rules, caveats.\n• **Sample questions** — examples shown on the landing page so users know what to ask.\n• **Trusted assets** — vetted SQL queries Genie can rely on for known questions.\n\nAnd one it needs to run at all: a **SQL warehouse** (pro or serverless) that executes the generated queries.',
      takeaways: [
        'Data + instructions + sample questions + trusted assets.',
        'A pro or serverless SQL warehouse actually runs the SQL.',
        'Every component is something a human curates, not something inferred.',
      ],
    },
    {
      id: 'diagram-components',
      type: 'diagram',
      title: 'How a question becomes an answer',
      spec: {
        kind: 'flow',
        steps: [
          {
            label: 'A question in plain language',
            sublabel: '"Nordics revenue last quarter?"',
            tone: 'neutral',
          },
          {
            label: 'Genie space',
            sublabel: 'curated tables · instructions · trusted assets',
            tone: 'brand',
          },
          {
            label: 'SQL on a warehouse',
            sublabel: 'run under the asker’s own permissions',
            tone: 'accent',
          },
          {
            label: 'An answer, with its SQL',
            sublabel: 'reviewable, not a black box',
            tone: 'good',
          },
        ],
      },
      caption:
        'The generated SQL is shown, so an analyst can check what was actually asked of the data.',
    },
    {
      id: 'concept-governance',
      type: 'concept',
      title: 'It cannot show data the asker may not see',
      body: 'Genie runs its queries under the **asking user’s own Unity Catalog permissions**. If a user has no `SELECT` on a table, Genie cannot return its rows to them; if a row filter or column mask applies to that user, it still applies here.\n\nThat is what makes it safe to hand to a wide audience: opening a Genie space does not create a back door around governance. Access to the space and access to the data are two separate grants.',
      takeaways: [
        'Queries run with the end user’s permissions — not the author’s.',
        'Row filters and column masks continue to apply.',
        'Space access and data access are granted separately.',
      ],
    },
    {
      id: 'mistake-magic',
      type: 'mistake',
      title: '"Point it at everything and let it work it out"',
      myth: '"Give Genie the whole catalog — the more tables it can see, the better its answers."',
      reality:
        'The opposite. A space works because its scope is small and well described: a handful of tables whose meaning has been written down. Point it at 400 undocumented tables and it has to guess which `revenue` column you meant, and confident wrong answers are worse than no answers.\n\nSpaces are deliberately capped — up to **30 tables or views** — because curation is the feature.',
    },
    {
      id: 'concept-naming',
      type: 'concept',
      title: 'The name is changing',
      body: 'The exam guide says **AI/BI Genie spaces**. Current documentation calls them **Genie Agents** — *"formerly known as Genie Spaces"* — inside a wider Genie family: **Genie One** (where users ask questions and browse), **Genie Agents** (curated spaces like this one), and **Genie Code** (the coding assistant, previously the Databricks Assistant).\n\nSame product, newer label. Recognise both.',
      takeaways: [
        'Genie space (exam) = Genie Agent (current docs).',
        'The family: Genie One, Genie Agents, Genie Code.',
        '**Genie Code** is the Databricks Assistant renamed.',
      ],
    },
    {
      id: 'mcq-genie',
      type: 'mcq',
      question:
        'A finance team wants to answer their own routine questions about a set of revenue tables without waiting for an analyst. What best describes what a Genie space provides?',
      options: [
        {
          id: 'a',
          text: 'A curated set of Unity Catalog tables that users query in natural language, with the generated SQL shown and each user’s own permissions applied.',
        },
        {
          id: 'b',
          text: 'A copy of the tables in a separate AI system, so questions can be answered without touching production data.',
        },
        {
          id: 'c',
          text: 'A general-purpose chatbot that can answer questions about any table in the metastore.',
        },
        {
          id: 'd',
          text: 'A dashboard builder that turns natural-language prompts into permanent dashboards.',
        },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'Curated scope, natural-language questions, visible SQL, and governance enforced per asker.',
        b: 'Nothing is copied — Genie queries the governed tables in place.',
        c: 'A space is deliberately scoped to a curated set of tables; unlimited scope is what makes answers unreliable.',
        d: 'Genie answers questions conversationally; dashboards remain a separate, curated artefact.',
      },
      explanation:
        'A Genie space is **curated data plus written-down business context**, queried in natural language and governed by each user’s own Unity Catalog permissions.',
      examObjective:
        'Describe the purpose, key features, and components of AI/BI Genie spaces.',
    },
    {
      id: 'tf-permissions',
      type: 'truefalse',
      statement:
        'A user with access to a Genie space can see data from its tables even if they have no SELECT privilege on them.',
      answer: false,
      explanation:
        'Genie evaluates data access with the **end user’s** Unity Catalog permissions. Access to the space is not access to the data — both are needed, and row filters and column masks still apply.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You now know what Genie is',
      points: [
        'A curated space where users ask questions in plain language about chosen tables.',
        'Components: data, instructions, sample questions, trusted assets — plus a SQL warehouse.',
        'The generated SQL is visible, so answers can be checked.',
        'Queries run with each user’s own permissions; masks and filters still apply.',
        'Curation is the feature: a small, well-described scope beats a large vague one.',
        'Exam calls them **Genie spaces**; current docs say **Genie Agents**.',
      ],
      closing: 'Next: building one, and making its answers steadily better. 🛠️',
    },
  ],
}
