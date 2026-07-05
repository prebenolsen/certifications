import type { Lesson } from '@/types/content'

/**
 * Lesson: Which Copilot — Free, Pro, Business, or Enterprise?
 * Maps to the "Use GitHub Copilot features" domain and the audience profile's
 * "Copilot features across various plans". The load-bearing idea for the exam:
 * organization governance (policy management, content exclusions, audit logs)
 * starts at Business, and Enterprise adds deep github.com integration.
 */
export const copilotPlansLesson: Lesson = {
  id: 'copilot-plans',
  title: 'Which Copilot: Free, Pro, Business, or Enterprise?',
  summary:
    'The plan families — individual vs organization — and the governance features (content exclusions, audit logs, policy control) that only appear once you reach Business and Enterprise.',
  estimatedMinutes: 9,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'One developer vs five hundred',
      body: 'A solo developer wants Copilot to write code faster. Done — they pick an individual plan and start typing.\n\nNow a company wants to roll Copilot out to **500 engineers**. Suddenly the questions change: *Can we stop it suggesting code that matches public repos? Can we see who’s using it? Can we turn features off org-wide?* Those aren’t coding questions — they’re **governance** questions, and only some plans answer them.',
      atWork:
        'Picking a plan isn’t about price first — it’s about whether it has the *controls* your situation requires.',
    },
    {
      id: 'analogy-tiers',
      type: 'analogy',
      title: 'Like personal vs business software licensing',
      body: 'Think of a productivity app. A **personal** license just makes *you* productive. A **business** license adds an admin console: central billing, who-can-do-what policies, and usage reports. An **enterprise** license layers on deep integration with the company’s own systems and knowledge.\n\nCopilot’s plans follow exactly that ladder — each rung adds *control and integration*, not just more of the same coding help.',
      mapping: [
        { from: 'Personal license', to: 'Copilot Free / Pro / Pro+ (individual)' },
        { from: 'Business license + admin console', to: 'Copilot Business (org governance)' },
        { from: 'Enterprise integration & knowledge', to: 'Copilot Enterprise (github.com-deep)' },
      ],
    },
    {
      id: 'concept-two-families',
      type: 'concept',
      title: 'The one split that matters: individual vs organization',
      body: 'Every plan falls into one of two families:\n\n**Individual** plans (Free, Pro, Pro+) are bought by *one developer* for their own use. No admin, no central policy.\n\n**Organization** plans (Business, Enterprise) are bought by a *company* and managed centrally: an admin assigns seats and sets policy for everyone.\n\nGet this split right and the rest of the details fall into place.',
      takeaways: [
        'Individual = one person, self-managed (Free, Pro, Pro+).',
        'Organization = company-managed with admin control (Business, Enterprise).',
        'Governance features live only in the organization family.',
      ],
    },
    {
      id: 'concept-individual',
      type: 'concept',
      title: 'The individual plans',
      body: '**Free** — a no-cost entry point with a *capped* number of completions and chat messages per month. Great for trying Copilot.\n\n**Pro** — a paid individual plan (roughly $10/month) with unlimited completions and access to more capable models. It’s **free for verified students, teachers, and maintainers of popular open-source projects**.\n\n**Pro+** — the top individual tier, with the largest allowance of premium requests and the widest model choice.',
      takeaways: [
        'Free = capped monthly usage, no cost.',
        'Pro = unlimited completions; free for students/teachers/OSS maintainers.',
        'Pro+ = most premium requests and models, for power users.',
      ],
    },
    {
      id: 'concept-business',
      type: 'concept',
      title: 'Copilot Business: governance arrives',
      body: 'Copilot **Business** is the first plan built for organizations. On top of the coding help, it adds the controls a company needs:\n\n• **Organization-wide policy management** — turn features on/off for everyone\n• **Content exclusions** — stop Copilot from seeing specified files/repos\n• **Audit logs** — see how Copilot is being used\n• **Seat (license) management**\n• **IP indemnification** and a guarantee your code isn’t used to train the model',
      takeaways: [
        'Business = the entry point for org governance.',
        'Policy management, content exclusions, and audit logs start here.',
        'Your code stays yours — not used for training.',
      ],
    },
    {
      id: 'concept-enterprise',
      type: 'concept',
      title: 'Copilot Enterprise: everything, plus github.com',
      body: 'Copilot **Enterprise** includes *everything in Business*, then adds deep integration with **github.com** itself:\n\n• Copilot Chat on github.com, aware of your repositories\n• **Knowledge bases** — Copilot can draw on your org’s own docs and code\n• **Pull request summaries** generated for reviewers\n\nWhere Business governs Copilot, Enterprise *weaves it into your whole GitHub workflow*.',
      takeaways: [
        'Enterprise ⊃ Business (a strict superset).',
        'Adds github.com-native Copilot, knowledge bases, and PR summaries.',
      ],
    },
    {
      id: 'diagram-ladder',
      type: 'diagram',
      title: 'The capability ladder',
      spec: {
        kind: 'flow',
        steps: [
          { label: 'Free', sublabel: 'capped, individual', tone: 'neutral' },
          { label: 'Pro / Pro+', sublabel: 'unlimited, individual', tone: 'accent' },
          { label: 'Business', sublabel: '+ org governance', tone: 'brand' },
          { label: 'Enterprise', sublabel: '+ github.com integration', tone: 'good' },
        ],
        arrows: ['more usage', 'add control', 'add integration'],
      },
      caption:
        'Each rung *adds* to the one before. The jump that unlocks governance is Individual → Business.',
    },
    {
      id: 'tf-enterprise-superset',
      type: 'truefalse',
      statement:
        'Copilot Enterprise includes all the features of Copilot Business, plus more.',
      answer: true,
      explanation:
        'Enterprise is a strict superset of Business: it keeps every governance feature (policy, content exclusions, audit logs) and adds deep github.com integration like knowledge bases and PR summaries.',
    },
    {
      id: 'mistake-governance-tier',
      type: 'mistake',
      title: 'Governance features on an individual plan?',
      myth: '“I have Copilot Pro, so I can set content exclusions and pull audit logs for my team.”',
      reality:
        'Individual plans (Free/Pro/Pro+) have **no org governance**. Content exclusions, organization-wide policy management, and audit logs require **Copilot Business or Enterprise**. Needing any of those is the signal to move up to an organization plan.',
    },
    {
      id: 'mcq-choose-plan',
      type: 'mcq',
      question:
        'A company adopting Copilot needs to (1) prevent Copilot from using certain sensitive repositories as context and (2) review an audit trail of Copilot usage — but does *not* need Copilot built into github.com. What is the *minimum* plan that meets these needs?',
      options: [
        { id: 'a', text: 'Copilot Free' },
        { id: 'b', text: 'Copilot Pro+' },
        { id: 'c', text: 'Copilot Business' },
        { id: 'd', text: 'Copilot Enterprise' },
      ],
      correct: ['c'],
      optionFeedback: {
        a: 'Free is an individual plan with no content exclusions or audit logs.',
        b: 'Pro+ is still an *individual* plan — powerful for one developer, but no org governance.',
        c: 'Business is the lowest plan with content exclusions, policy management, and audit logs — and github.com integration isn’t required, so no need to go higher.',
        d: 'Enterprise would work, but it’s more than needed here — its extra github.com integration isn’t required, so Business is the *minimum*.',
      },
      explanation:
        'Content exclusions and audit logs first appear at **Business**. Since the deeper github.com features of Enterprise aren’t needed, Business is the minimum fit — matching the plan to the actual requirements, not the biggest badge.',
      examObjective:
        'Understand GitHub Copilot features across the available plans (individual, Business, Enterprise) and the governance capabilities each plan unlocks.',
    },
    {
      id: 'flash-business-line',
      type: 'flashcard',
      front:
        'What is the lowest Copilot plan that offers organization-wide policy management, content exclusions, and audit logs?',
      back: '**Copilot Business.** Individual plans (Free/Pro/Pro+) have none of these; Enterprise has them too, plus github.com integration.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now pick the right Copilot',
      points: [
        'Two families: individual (Free, Pro, Pro+) vs organization (Business, Enterprise).',
        'Free = capped; Pro = unlimited (free for students/teachers/OSS); Pro+ = most premium.',
        'Business = the first plan with governance: policy, content exclusions, audit logs.',
        'Enterprise = Business + deep github.com integration (knowledge bases, PR summaries).',
        'Choose by the *controls* you need, then the minimum plan that provides them.',
      ],
      closing: 'You’ve picked a plan. Now let’s get Copilot switched on in your editor. 🔌',
    },
  ],
}
