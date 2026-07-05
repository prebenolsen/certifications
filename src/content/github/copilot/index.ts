import type { Certification } from '@/types/content'
import { planned } from '@/content/authoring'
import { copilotOverviewLesson } from './lessons/copilot-overview'
import { copilotPlansLesson } from './lessons/copilot-plans'
import { enablingCopilotLesson } from './lessons/enabling-copilot'

/**
 * GitHub Copilot certification (Exam GH-300).
 *
 * The exam has six named skill domains rather than numbered sections; each
 * module below maps back to one via `examSections`. Modules are ordered for a
 * natural learning arc — first *what Copilot is* and *how it works under the
 * hood*, then *using it responsibly*, then the craft of *prompting*, then the
 * *features* and how they lift *productivity*, and finally the *privacy /
 * safeguard* and *administration* concerns that matter in a real org.
 *
 * The largest domain ("Use GitHub Copilot features", 25–30%) is deliberately
 * split across two modules — hands-on features (Module 5) and org-wide
 * administration (Module 8) — because they're taught very differently.
 */
export const githubCopilot: Certification = {
  id: 'github-copilot',
  title: 'GitHub Copilot (GH-300)',
  provider: 'GitHub',
  summary:
    'Master GitHub Copilot end to end: responsible AI use, how Copilot handles your data, prompt engineering and context crafting, the full feature set (IDE, CLI, Chat, Agent/Edit mode, MCP, code review, Spaces), productivity and testing workflows, privacy and content exclusions, and organization-wide administration.',
  officialUrl:
    'https://learn.microsoft.com/en-us/credentials/certifications/github-copilot/',
  examFacts: {
    questions: 60,
    minutes: 100,
    passingNote:
      'Passing score 700/1000. Proctored via Pearson VUE; may include interactive components. Question count is not officially published (~55–65). Offered in English, Spanish, Portuguese (BR), Korean, and Japanese.',
    validityYears: 2,
  },
  modules: [
    {
      id: 'foundations',
      order: 1,
      title: 'Meet GitHub Copilot',
      summary:
        'What Copilot is, the plans (Free, Pro, Business, Enterprise) and what each unlocks, and getting it enabled in your IDE.',
      examSections: ['Use GitHub Copilot features'],
      icon: '🚀',
      lessons: [
        copilotOverviewLesson,
        copilotPlansLesson,
        enablingCopilotLesson,
      ],
    },
    {
      id: 'data-architecture',
      order: 2,
      title: 'How Copilot Works: Data & Architecture',
      summary:
        'Where your code goes, how a prompt is built and filtered, the life of a suggestion, and the limits of the LLM behind it.',
      examSections: ['Understand GitHub Copilot data and architecture'],
      icon: '🧠',
      lessons: [
        planned(
          'data-flow',
          'Where your code goes and how it is used',
          'Data usage, flow, and sharing; input processing, prompt building, proxy filtering, and post-processing.',
        ),
        planned(
          'suggestion-lifecycle',
          'The life of a code suggestion',
          'From your keystrokes to a rendered suggestion — the full request lifecycle.',
        ),
        planned(
          'llm-limitations',
          'What LLMs (and Copilot) can and cannot do',
          'Why a probabilistic model hallucinates, goes stale, and needs your judgment.',
        ),
      ],
    },
    {
      id: 'responsible-ai',
      order: 3,
      title: 'Using Copilot Responsibly',
      summary:
        'Responsible AI principles, the real risks and harms of generative tools, and why you must always validate AI output.',
      examSections: ['Use GitHub Copilot responsibly'],
      icon: '⚖️',
      lessons: [
        planned(
          'genai-risks',
          'Risks and limitations of generative AI',
          'Hallucination, bias, IP concerns, and over-reliance — named plainly.',
        ),
        planned(
          'ethical-ai',
          'Ethical and responsible AI use',
          'Potential harms of AI usage and the mitigation strategies that address them.',
        ),
        planned(
          'validating-output',
          'Trust, but verify: validating AI output',
          'Why AI output must be reviewed, and how to operate Copilot responsibly day to day.',
        ),
      ],
    },
    {
      id: 'prompt-engineering',
      order: 4,
      title: 'Prompt Engineering & Context',
      summary:
        'Write prompts Copilot understands: prompt structure, how context is gathered, zero-shot vs few-shot, and the process flow that uses chat history.',
      examSections: ['Apply prompt engineering and context crafting'],
      icon: '💬',
      lessons: [
        planned(
          'prompt-structure',
          'Anatomy of a good prompt',
          'Prompt structure and context — the parts of a prompt that steer a useful answer.',
        ),
        planned(
          'context-in-copilot',
          'How Copilot builds context',
          'What Copilot pulls in — open files, selection, neighboring tabs — to determine context.',
        ),
        planned(
          'shot-prompting',
          'Zero-shot and few-shot prompting',
          'When to just ask vs when to show examples, and why examples change the output.',
        ),
        planned(
          'prompt-best-practices',
          'Prompt-crafting best practices',
          'Principles and the prompt process flow, including how chat history is used.',
        ),
      ],
    },
    {
      id: 'features',
      order: 5,
      title: 'Copilot Features in Depth',
      summary:
        'The hands-on toolkit: inline suggestions, Chat and Plan Mode, the Copilot CLI, Agent/Edit mode and MCP, plus code review, Spaces, Spark, and PR summaries.',
      examSections: ['Use GitHub Copilot features'],
      icon: '🛠️',
      lessons: [
        planned(
          'inline-and-chat',
          'Inline suggestions, Chat, and Plan Mode',
          'The core ways to trigger Copilot, and the limits, options, feedback, and commands of Chat.',
        ),
        planned(
          'copilot-cli',
          'GitHub Copilot in the command line',
          'Installing the Copilot CLI, its key commands, interactive sessions, and generating scripts.',
        ),
        planned(
          'agent-edit-mcp',
          'Agent Mode, Edit Mode, and MCP',
          'Multi-step autonomous work, multi-file edits, sub-agents and agent sessions, and extending Copilot with MCP.',
        ),
        planned(
          'code-review-spaces',
          'Code review, Spaces, Spark, and PR summaries',
          'Copilot code review, pull-request summaries, Copilot Spaces, Spark, and instructions/prompt files for consistency.',
        ),
      ],
    },
    {
      id: 'productivity',
      order: 6,
      title: 'Boosting Developer Productivity',
      summary:
        'Put Copilot to work: generate, refactor, and document code; accelerate learning and modernize legacy code; write tests; and harden security and performance.',
      examSections: ['Improve developer productivity with GitHub Copilot'],
      icon: '📈',
      lessons: [
        planned(
          'code-gen-refactor',
          'Generating, refactoring, and documenting code',
          'The everyday productivity wins — and where they fit in the SDLC.',
        ),
        planned(
          'accelerate-learning',
          'Learning faster and modernizing legacy code',
          'Reducing context switching, generating sample data, and modernizing old code.',
        ),
        planned(
          'testing-with-copilot',
          'Writing tests with Copilot',
          'Unit and integration tests, finding edge cases, and writing meaningful assertions.',
        ),
        planned(
          'security-performance',
          'Security and performance improvements',
          'Using Copilot to suggest security fixes and performance optimizations.',
        ),
      ],
    },
    {
      id: 'privacy-safeguards',
      order: 7,
      title: 'Privacy, Exclusions & Safeguards',
      summary:
        'Keep sensitive code out, understand who owns the output, and turn on the safeguards — duplication detection, security warnings — then troubleshoot when suggestions misbehave.',
      examSections: ['Configure privacy, content exclusions, and safeguards'],
      icon: '🔒',
      lessons: [
        planned(
          'content-exclusions',
          'Content exclusions and editor settings',
          'Configuring content exclusions and the editor settings that control what Copilot sees.',
        ),
        planned(
          'output-ownership',
          'Who owns Copilot’s output?',
          'Ownership and the limitations of generated outputs.',
        ),
        planned(
          'duplication-safeguards',
          'Duplication detection and security warnings',
          'Enabling the duplication-detection filter and security warnings, and troubleshooting suggestions and exclusions.',
        ),
      ],
    },
    {
      id: 'administration',
      order: 8,
      title: 'Administration & Governance',
      summary:
        'Run Copilot for an organization: org-wide policies and feature availability, Copilot Code Review policies, audit-log events, and subscription management via the REST API.',
      examSections: ['Use GitHub Copilot features'],
      icon: '🏢',
      lessons: [
        planned(
          'org-policies',
          'Organization-wide policies and settings',
          'Policy management, Copilot Code Review policies, and feature availability across IDEs and github.com.',
        ),
        planned(
          'audit-logs',
          'Auditing Copilot with audit-log events',
          'Using audit-log events to see how Copilot is being used across the org.',
        ),
        planned(
          'rest-api-subscriptions',
          'Managing subscriptions with the REST API',
          'Programmatically managing Copilot seats and subscriptions via the REST API.',
        ),
      ],
    },
  ],
}
