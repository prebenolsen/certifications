import type { Lesson } from '@/types/content'

/**
 * Lesson: What is GitHub Copilot?
 * Maps to the "Use GitHub Copilot features" domain — the foundational
 * understanding of what Copilot is and the ways you trigger it (inline
 * suggestions, chat, CLI, Plan Mode). Sets up the responsible-use theme.
 */
export const copilotOverviewLesson: Lesson = {
  id: 'copilot-overview',
  title: 'What is GitHub Copilot?',
  summary:
    'The AI pair programmer: what it is, the two ways you work with it (inline suggestions and chat), how it actually produces code, and why you stay in charge.',
  estimatedMinutes: 9,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'The half hour you didn’t spend coding',
      body: 'You sit down to build one small feature. But first you write the same boilerplate you’ve written a hundred times, then tab over to the browser to look up the exact argument order of a function, then hunt through docs for a regex you half-remember.\n\nThe actual *thinking* took five minutes. The rest was friction. **GitHub Copilot exists to remove that friction** — so more of your time is spent on the problem, not the plumbing.',
      atWork:
        'The tax isn’t just minutes — every trip to the browser breaks your focus. Staying *in flow* is the real win.',
    },
    {
      id: 'analogy-pair',
      type: 'analogy',
      title: 'A pair programmer who never gets tired',
      body: 'Imagine an experienced developer sitting beside you, watching what you type. As you start a function they murmur, “you probably want this next” and sketch it out. When you’re stuck you can just *ask* them a question in plain English.\n\nThat’s Copilot: an ever-present **pair programmer**. But like any pair, they *suggest* — they don’t get to commit code without you agreeing.',
      mapping: [
        { from: 'Partner watching you type', to: 'Inline suggestions from your code + comments' },
        { from: 'Asking them a question aloud', to: 'Copilot Chat (natural language)' },
        { from: 'You decide what to keep', to: 'You accept, edit, or reject every suggestion' },
      ],
    },
    {
      id: 'concept-what',
      type: 'concept',
      title: 'What GitHub Copilot actually is',
      body: 'GitHub Copilot is an **AI pair programmer**: a tool that generates code suggestions and answers coding questions, right inside your development environment. It’s built by GitHub on top of large language models.\n\nIt can complete a line, draft a whole function from a comment, explain unfamiliar code, write tests, or help you debug — without you leaving your editor.',
      takeaways: [
        'An AI assistant for *writing and understanding* code.',
        'Lives inside your editor — no separate app to switch to.',
        'Powered by a large language model (LLM).',
      ],
    },
    {
      id: 'concept-two-ways',
      type: 'concept',
      title: 'Two ways you work with it',
      body: 'There are two core ways to interact with Copilot:\n\n**Inline suggestions** — as you type, Copilot shows greyed-out “ghost text” predicting what comes next. Press *Tab* to accept, or keep typing to ignore it.\n\n**Copilot Chat** — a conversation panel where you ask questions in plain language (“why is this test failing?”) and get an answer, with code, in context.\n\nSame assistant, two doorways: one *anticipates*, the other *converses*.',
      takeaways: [
        'Inline = ghost text you accept with Tab; great for flow.',
        'Chat = ask a question, get an explained answer; great for “how/why”.',
      ],
    },
    {
      id: 'diagram-inline-vs-chat',
      type: 'diagram',
      title: 'Inline suggestions vs Chat',
      spec: {
        kind: 'compare',
        left: {
          label: 'Inline suggestions',
          tone: 'brand',
          items: [
            'Triggered by typing',
            'Ghost text → Tab to accept',
            'Best for boilerplate & flow',
          ],
        },
        right: {
          label: 'Copilot Chat',
          tone: 'accent',
          items: [
            'Triggered by a question',
            'Conversation with explanations',
            'Best for “explain / fix / how do I…”',
          ],
        },
      },
      caption:
        'Beyond these two, Copilot also reaches you through the CLI, github.com, and Plan Mode — but inline + chat are the heart of it.',
    },
    {
      id: 'tf-not-perfect',
      type: 'truefalse',
      statement:
        'Every suggestion GitHub Copilot offers is guaranteed to compile and be correct.',
      answer: false,
      explanation:
        'Copilot predicts *likely* code, not *verified* code. Suggestions can be wrong, outdated, or subtly buggy. Treat every one as a draft to review — this is the single most important habit when using it.',
    },
    {
      id: 'concept-how',
      type: 'concept',
      title: 'How it comes up with a suggestion',
      body: 'Copilot doesn’t search a database and paste a matching snippet. It runs a **large language model** that predicts the most probable next code, one piece at a time, from the *context* it can see: your open file, nearby files, comments, and the cursor position.\n\nThink of it as autocomplete that has read an enormous amount of code and grasps *intent* — but is still guessing, based on patterns, not looking anything up.',
      takeaways: [
        'It **generates** predictions; it doesn’t retrieve stored answers.',
        'Better context in → better suggestion out.',
        'Because it’s probabilistic, the same prompt can yield different results.',
      ],
    },
    {
      id: 'mistake-search',
      type: 'mistake',
      title: 'Copilot is not a code search engine',
      myth: '“Copilot finds an existing file somewhere on GitHub and copies it into my editor.”',
      reality:
        'It generates code token by token from a trained model — there’s usually no single source file being copied. (For the rare case where output closely matches public code, a separate **duplication-detection** filter can block it — more on that later.)',
    },
    {
      id: 'concept-everywhere',
      type: 'concept',
      title: 'More than editor autocomplete',
      body: 'Copilot started in the IDE, but it now meets you across your whole workflow: in your **editor** (VS Code, Visual Studio, JetBrains, Neovim), on **github.com**, in the **command line (CLI)**, in **pull requests** (summaries and review), and on **mobile**.\n\nSame assistant, wherever the work is — you don’t have to come to it.',
      takeaways: [
        'IDE, github.com, CLI, pull requests, mobile.',
        'The exam expects you to know Copilot spans the whole developer workflow, not just the editor.',
      ],
    },
    {
      id: 'concept-pilot',
      type: 'concept',
      title: 'You’re still the pilot',
      body: 'The name is deliberate: a *copilot* assists, but the human flies the plane. Copilot proposes; **you decide**. Read each suggestion, make sure you understand it, and test it before you trust it.\n\nThat responsibility — validating AI output rather than pasting it blindly — is a theme the exam returns to again and again.',
      takeaways: [
        'Copilot accelerates you; it doesn’t replace your judgment.',
        'Always review and test before accepting.',
      ],
    },
    {
      id: 'mcq-interaction',
      type: 'mcq',
      question:
        'A developer wants Copilot to *explain why a function is throwing an error* and suggest a fix, in a back-and-forth conversation. Which way of interacting with Copilot fits best?',
      options: [
        { id: 'a', text: 'Inline suggestions (ghost text as they type)' },
        { id: 'b', text: 'Copilot Chat' },
        { id: 'c', text: 'They can’t — Copilot only writes new code, it can’t explain existing code' },
        { id: 'd', text: 'They must first export the code to an external website' },
      ],
      correct: ['b'],
      optionFeedback: {
        a: 'Inline suggestions predict the *next* code as you type — great for writing, but they’re not a conversation for “why is this failing?”.',
        b: 'Chat is the conversational doorway: ask in plain language, get an explanation plus a suggested fix, in context.',
        c: 'Explaining and debugging existing code is one of Copilot’s core strengths, especially through Chat.',
        d: 'Copilot works right inside your environment — no export to an external site is needed.',
      },
      explanation:
        'Inline suggestions *anticipate* the next code; Chat *converses* — asking questions, explaining code, and proposing fixes. Matching the task to the right doorway is a basic Copilot skill.',
      examObjective:
        'Use GitHub Copilot in the IDE: trigger Copilot through inline suggestions, chat, CLI, and Plan Mode.',
    },
    {
      id: 'flash-definition',
      type: 'flashcard',
      front: 'In one phrase, what is GitHub Copilot?',
      back: 'An **AI pair programmer** — an LLM-powered assistant that generates code suggestions and answers coding questions inside your development environment.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You now understand what Copilot is',
      points: [
        'Copilot is an AI pair programmer that lives in your dev environment.',
        'Two core doorways: **inline suggestions** (Tab to accept) and **Chat** (conversation).',
        'It **generates** likely code from context — it doesn’t look up and paste files.',
        'It spans the whole workflow: IDE, github.com, CLI, PRs, mobile.',
        'You stay the pilot: review, understand, and test before you trust.',
      ],
      closing: 'One assistant, many plans. Next: which Copilot — Free, Pro, Business, or Enterprise? 🎫',
    },
  ],
}
