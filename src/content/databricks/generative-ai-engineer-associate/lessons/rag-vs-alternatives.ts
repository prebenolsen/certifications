import type { Lesson } from '@/types/content'

/**
 * Lesson: RAG vs fine-tuning vs prompt engineering.
 * The choosing lesson. Introduces the retrieve-then-generate loop deliberately
 * simplified — Module GA4 draws the full architecture.
 */
export const ragVsAlternativesLesson: Lesson = {
  id: 'rag-vs-alternatives',
  title: 'RAG, fine-tuning, or just prompting?',
  summary:
    'The three ways to give a model new knowledge or new behavior, what each actually changes, and how to choose between them.',
  estimatedMinutes: 12,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: '“It needs to know our policies”',
      body: 'The ask is simple enough: an assistant that answers questions about **your company’s** internal policies. The model has never seen a single one of them.\n\nSomeone suggests fine-tuning it on the policy documents. Someone else suggests pasting the policies into the prompt. A third person says you need a vector database.\n\nAll three are real options. Only one is right here — and choosing correctly is an exam objective *and* the difference between a two-day project and a two-month one.',
      atWork:
        'Picking the wrong lever is the most expensive mistake in a GenAI project, because it is usually discovered late.',
    },
    {
      id: 'concept-three-levers',
      type: 'concept',
      title: 'Three levers, three different jobs',
      body: 'When a model does not do what you need, you can change exactly three things:\n\n• **Prompt engineering** — change the *instructions*. Cheapest, instant, no infrastructure.\n• **RAG** — change the *information available* at question time, by retrieving relevant text and putting it in the prompt.\n• **Fine-tuning** — change the *model itself*, by continuing training on your examples.\n\nThe decisive question is not “which is best?” It is **what is actually missing** — instructions, knowledge, or behaviour.',
      takeaways: [
        'Prompting fixes **unclear instructions**.',
        'RAG fixes **missing knowledge**.',
        'Fine-tuning fixes **wrong behaviour, format or style**.',
      ],
    },
    {
      id: 'analogy-new-hire',
      type: 'analogy',
      title: 'Briefing a new colleague',
      body: 'A capable new hire joins. They know their profession but nothing about your company.\n\n• You could **explain the task better** — “summarise in three bullets, always cite the section.” That is prompt engineering.\n• You could **hand them the policy binder** to consult while they work. That is RAG.\n• You could **send them on a months-long training programme** until your house style is second nature. That is fine-tuning.\n\nNobody sends a new hire on a training course to teach them this quarter’s prices. You hand them the price list.',
      mapping: [
        { from: 'Clearer instructions', to: 'Prompt engineering' },
        { from: 'The binder on the desk', to: 'Retrieved context (RAG)' },
        { from: 'Months of training', to: 'Fine-tuning' },
        { from: 'This quarter’s prices', to: 'Fast-changing knowledge → always RAG' },
      ],
    },
    {
      id: 'concept-rag',
      type: 'concept',
      title: 'RAG adds knowledge, at question time',
      body: '**Retrieval-Augmented Generation** does not change the model at all. It changes what the model *sees*:\n\n1. Take the user’s question.\n2. Retrieve the most relevant chunks from your data.\n3. Paste them into the prompt, with instructions to answer from them.\n4. Let the model generate.\n\nThe knowledge lives in your vector index, not in the weights — so updating it is an **update to a table**, not a retraining run. Change a policy this morning and the assistant is correct this afternoon.',
      takeaways: [
        'The model is untouched — only the prompt gets richer.',
        'Knowledge stays **fresh and editable**, because it lives in your data.',
        'Answers can **cite sources**, because you know which chunks you sent.',
      ],
    },
    {
      id: 'diagram-rag-loop',
      type: 'diagram',
      title: 'The retrieve-then-generate loop',
      spec: {
        kind: 'flow',
        steps: [
          { label: 'Question', sublabel: 'from the user', tone: 'neutral' },
          { label: 'Retrieve', sublabel: 'nearest chunks', tone: 'accent' },
          { label: 'Augment', sublabel: 'chunks + instructions', tone: 'brand' },
          { label: 'Generate', sublabel: 'grounded answer', tone: 'good' },
        ],
        arrows: ['embed & search', 'build prompt', 'call the LLM'],
      },
      caption:
        'The shape of every RAG application. **Module GA4** fills in the real components.',
    },
    {
      id: 'concept-finetuning',
      type: 'concept',
      title: 'Fine-tuning changes behaviour, not facts',
      body: 'Fine-tuning continues training on your own examples, adjusting the weights. It is powerful for teaching the model **how to act**:\n\n• A rigid output format you cannot reliably prompt for.\n• A specialised tone or domain vocabulary.\n• A narrow task done so often that a smaller, cheaper fine-tuned model beats a large general one.\n\nWhat it is **bad** at is facts. Training does not file information away for accurate recall — it shifts the patterns the model tends to produce. Fine-tuned facts blur, and they go stale the moment the source changes.',
      takeaways: [
        'Best for **format, tone, and specialised behaviour**.',
        'Needs curated training examples — the real cost is the dataset.',
        'New facts mean **retraining**; there is no cheap update path.',
      ],
    },
    {
      id: 'mistake-finetune-docs',
      type: 'mistake',
      title: 'Fine-tune it on our documents so it knows them',
      myth:
        'We have 10,000 internal documents. If we fine-tune a model on all of them, it will know their contents and can answer questions about them.',
      reality:
        'This is the most common and most expensive misconception in GenAI.\n\nTraining on documents teaches the model to **write text that sounds like them** — the vocabulary, the cadence, the structure. It does not install retrievable facts. You get a model that produces confident, plausible, unciteable answers, and hallucinates *more* convincingly because it has learned the house style.\n\nFor answering **from** documents, RAG wins on every axis: accuracy, freshness, cost, and the ability to cite a source.',
    },
    {
      id: 'diagram-compare',
      type: 'diagram',
      title: 'Choosing between them',
      spec: {
        kind: 'compare',
        left: {
          label: 'Reach for RAG',
          tone: 'brand',
          items: [
            'Answers must come from your data',
            'Content changes often',
            'You need citations',
            'Access must respect permissions',
          ],
        },
        right: {
          label: 'Reach for fine-tuning',
          tone: 'accent',
          items: [
            'Output format or tone is the problem',
            'The task is narrow and repeated',
            'Behaviour is stable over time',
            'You want a smaller, cheaper model',
          ],
        },
      },
      caption:
        'Try **prompt engineering first** in both cases — it is free, and it often turns out to be enough.',
    },
    {
      id: 'scenario-combine',
      type: 'scenario',
      title: 'They are not mutually exclusive',
      body: 'A mature system often uses all three: a **fine-tuned** model that reliably emits your JSON schema, fed **retrieved** policy chunks, under a carefully **engineered** prompt.\n\nThe exam tends to ask which lever solves a *specific* stated problem — so read for what is actually missing. “Answers are outdated” is a knowledge problem. “Answers are correct but the format is wrong” is a behaviour problem.',
      atWork:
        'Sequence them by cost: prompt first, then RAG, and only fine-tune once you can show the other two cannot get you there.',
    },
    {
      id: 'check-freshness',
      type: 'truefalse',
      statement:
        'If your source documents are updated daily, fine-tuning is a poor fit for keeping the application current.',
      answer: true,
      explanation:
        '**True.** Every meaningful content change would require another training run, then evaluation and redeployment — for information that is stale again tomorrow.\n\nRAG handles this natively: update the source table, let the index sync, and the next question retrieves the new content. Freshness requirements are one of the clearest signals pointing at RAG.',
    },
    {
      id: 'mcq-choose',
      type: 'mcq',
      question:
        'An engineering team’s assistant retrieves the right documents and answers accurately, but responses are long prose paragraphs. They need strict JSON matching an internal schema, and prompt instructions are followed only about 70% of the time. What should they do?',
      options: [
        {
          id: 'a',
          text: 'Add more documents to the vector index so the model has better examples.',
        },
        {
          id: 'b',
          text: 'Fine-tune a model on examples of the required JSON output, keeping RAG for the content.',
        },
        {
          id: 'c',
          text: 'Switch from RAG to fine-tuning entirely, training on the source documents.',
        },
        {
          id: 'd',
          text: 'Increase the context window so complete JSON fits in the response.',
        },
      ],
      correct: ['b'],
      optionFeedback: {
        a: 'Retrieval is already working — the right documents are being found and the answers are accurate. The failure is in output *shape*, which more documents cannot fix.',
        b: '**Correct.** The knowledge problem is solved by RAG; the remaining problem is behaviour — a consistent output format. That is exactly what fine-tuning is for, and the two compose.',
        c: 'This would discard the part that works and apply fine-tuning to the part it is worst at — facts. Accuracy and freshness would both degrade.',
        d: 'Nothing indicates responses are being truncated. The output is the wrong *format*, not the wrong length.',
      },
      explanation:
        'Diagnose before choosing. Split the complaint into knowledge and behaviour: knowledge → RAG, behaviour → fine-tuning, instructions → prompting. Here knowledge was fine and behaviour was not, and the fix keeps both levers.',
      examObjective:
        'Select the model task(s) and chain components (tools, retrievers, prompts) needed to produce a desired output for a given input.',
    },
    {
      id: 'flashcard-choose',
      type: 'flashcard',
      front: 'RAG or fine-tuning — what is the one-line rule?',
      back: '**RAG adds knowledge; fine-tuning changes behaviour.** If the model needs to *know* something (especially something that changes), retrieve it. If it needs to *act* differently — format, tone, style — fine-tune it. Try prompting before either.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You now understand which lever to pull',
      points: [
        'Three levers: **prompting** (instructions), **RAG** (knowledge), **fine-tuning** (behaviour).',
        'RAG leaves the model untouched and keeps knowledge fresh, editable and citable.',
        'Fine-tuning teaches format, tone and specialised behaviour — **not facts**.',
        'Training on documents does not make a model “know” them; it makes it *sound* like them.',
        'They combine. Sequence by cost: prompt → retrieve → fine-tune.',
      ],
      closing:
        'You know what to build and why. Next: **the Databricks components** you will build it from.',
    },
  ],
}
