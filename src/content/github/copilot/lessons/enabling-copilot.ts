import type { Lesson } from '@/types/content'

/**
 * Lesson: Getting set up in your IDE.
 * Maps to the "Use GitHub Copilot features" domain, objective "Enable Copilot
 * in the IDE": the three ingredients (account access, extension, sign-in),
 * supported editors, and confirming it works via the status icon.
 */
export const enablingCopilotLesson: Lesson = {
  id: 'enabling-copilot',
  title: 'Getting set up in your IDE',
  summary:
    'The three ingredients that turn Copilot on — account access, the extension, and signing in — plus supported editors and how to confirm it’s actually working.',
  estimatedMinutes: 8,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'A plan, but a silent editor',
      body: 'You’ve sorted out a Copilot plan. You open VS Code, start typing, and… nothing. No ghost text, no suggestions.\n\nA plan is only *permission* to use Copilot. Three separate things have to line up before a single suggestion appears — and knowing them means you can fix a silent editor in seconds instead of guessing.',
      atWork:
        '“I have Copilot but it’s not working” is one of the most common onboarding tickets. Usually one of three ingredients is missing.',
    },
    {
      id: 'analogy-app',
      type: 'analogy',
      title: 'Install the app, then sign in to unlock it',
      body: 'It’s like any subscription app on a new phone: buying the subscription isn’t enough. You **install the app**, then **sign in** with the account that holds the subscription. Only then does it unlock.\n\nCopilot is the same: the *extension* is the app, and *signing in to GitHub* is what unlocks the access tied to your account.',
      mapping: [
        { from: 'Having a subscription', to: 'Copilot access on your GitHub account' },
        { from: 'Installing the app', to: 'Installing the Copilot extension in your editor' },
        { from: 'Signing in to unlock', to: 'Authorizing the editor with your GitHub account' },
      ],
    },
    {
      id: 'concept-three',
      type: 'concept',
      title: 'The three ingredients',
      body: 'For Copilot to work in your editor, all three must be true:\n\n1. **Access** — your GitHub account has Copilot (a Free/Pro plan, *or* a Business/Enterprise seat assigned by an admin).\n2. **Extension** — the GitHub Copilot extension/plugin is installed in your editor.\n3. **Signed in** — you’ve authorized the editor with that GitHub account.\n\nMiss any one and you get silence. Present all three and suggestions flow.',
      takeaways: [
        'Access + Extension + Sign-in = Copilot active.',
        'A missing one of these is the usual cause of “it’s not working”.',
      ],
    },
    {
      id: 'concept-editors',
      type: 'concept',
      title: 'Where you can install it',
      body: 'Copilot has official extensions for the major editors: **Visual Studio Code**, **Visual Studio**, the **JetBrains** IDEs (IntelliJ, PyCharm, etc.), and **Neovim**, among others.\n\nOn the language side it works across *many* programming languages. It tends to be strongest where it had the most public code to learn from — popular languages like Python, JavaScript, TypeScript, Java, and Go.',
      takeaways: [
        'Editors: VS Code, Visual Studio, JetBrains IDEs, Neovim, and more.',
        'Works with many languages; strongest in widely-used ones.',
      ],
    },
    {
      id: 'diagram-setup',
      type: 'diagram',
      title: 'From account to first suggestion',
      spec: {
        kind: 'flow',
        steps: [
          { label: 'GitHub account', sublabel: 'with Copilot access', tone: 'neutral' },
          { label: 'Install extension', sublabel: 'in your editor', tone: 'accent' },
          { label: 'Sign in', sublabel: 'authorize the editor', tone: 'brand' },
          { label: 'Copilot active', sublabel: 'ghost text appears', tone: 'good' },
        ],
        arrows: ['then', 'then', 'done'],
      },
      caption:
        'Skip a step and Copilot stays quiet. The order is always: access → install → sign in.',
    },
    {
      id: 'concept-confirm',
      type: 'concept',
      title: 'Confirming it’s on',
      body: 'Most editors show a **Copilot status icon** (often in the status bar). It tells you at a glance whether Copilot is active, and clicking it lets you **enable or disable** Copilot — globally or just for the current language/file type.\n\nThe other tell is behavioral: start typing and grey **ghost text** appears. If it does, all three ingredients are in place.',
      takeaways: [
        'The status icon shows active/inactive and is where you toggle it.',
        'You can disable Copilot per-language, not just globally.',
      ],
    },
    {
      id: 'tf-install-enough',
      type: 'truefalse',
      statement:
        'Installing the Copilot extension is enough on its own — you don’t need to sign in to a GitHub account that has Copilot access.',
      answer: false,
      explanation:
        'The extension is only one of three ingredients. Without signing in to a GitHub account that has Copilot access, the extension has no authorization and produces no suggestions.',
    },
    {
      id: 'mistake-seat',
      type: 'mistake',
      title: 'A purchased plan ≠ an assigned seat',
      myth: '“My company bought Copilot Business, so it’s automatically active in my editor.”',
      reality:
        'For organization plans, an **admin must assign you a seat** first — buying the plan doesn’t hand seats out automatically. Once you have a seat, you *still* install the extension and sign in. No seat = no access, no matter how many the company bought.',
    },
    {
      id: 'mcq-troubleshoot',
      type: 'mcq',
      question:
        'A developer on a team with Copilot Business installed the Copilot extension in VS Code and restarted it, but sees no suggestions. What is the most likely missing step?',
      options: [
        { id: 'a', text: 'They haven’t signed in to a GitHub account with an assigned Copilot seat.' },
        { id: 'b', text: 'Copilot doesn’t support VS Code, so it can never work there.' },
        { id: 'c', text: 'Copilot only works after the code is pushed to github.com.' },
        { id: 'd', text: 'The company must switch to Copilot Enterprise before any suggestions appear.' },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'The extension is installed, but without signing in to an account holding an assigned seat there’s no authorization — so no suggestions.',
        b: 'VS Code is one of Copilot’s primary supported editors.',
        c: 'Copilot suggests as you type locally; nothing needs to be pushed first.',
        d: 'Business fully supports IDE suggestions. Enterprise adds github.com features, not basic editor completions.',
      },
      explanation:
        'Enabling Copilot needs three ingredients: access (an assigned seat here), the extension, and signing in. The extension was installed but the sign-in/seat link is missing — the classic cause of a silent editor.',
      examObjective:
        'Use GitHub Copilot in the IDE: enable Copilot in the IDE.',
    },
    {
      id: 'flash-three',
      type: 'flashcard',
      front: 'What three things must be in place to use Copilot in your IDE?',
      back: '(1) A GitHub account with **Copilot access** (plan or assigned seat), (2) the **Copilot extension** installed, and (3) being **signed in** to authorize the editor.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can get Copilot running',
      points: [
        'Three ingredients: account access + extension + signed in.',
        'Supported in VS Code, Visual Studio, JetBrains IDEs, Neovim, and more.',
        'Org plans need an admin to assign a seat before it works for you.',
        'The status icon confirms it’s on and toggles it (globally or per language).',
        'Ghost text appearing = all three ingredients are lined up.',
      ],
      closing: 'Copilot’s on. But how does your code actually reach it — and where does it go? 🔎',
    },
  ],
}
