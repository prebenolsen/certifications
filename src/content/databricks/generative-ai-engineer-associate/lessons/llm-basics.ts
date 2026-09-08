import type { Lesson } from '@/types/content'

/**
 * Lesson: how large language models actually work.
 * Foundations primer for the GenAI Engineer certification — establishes the
 * "a model generates, it does not look up" mental model that the RAG,
 * fine-tuning and guardrails lessons all depend on.
 */
export const llmBasicsLesson: Lesson = {
  id: 'llm-basics',
  title: 'How large language models actually work',
  summary:
    'Tokens, next-token prediction, and context windows — why an LLM is a probabilistic generator, not a database.',
  estimatedMinutes: 10,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'The answer that was confidently wrong',
      body: 'You ask a model which internal policy covers parental leave. It answers instantly, in fluent prose, citing *“Policy HR-114, section 3”*.\n\nThere is no Policy HR-114. The model did not lie, and it did not fail to find the document — **it was never looking for a document at all.**\n\nAlmost every design decision in this certification exists because of what the model is actually doing instead.',
      atWork:
        'Every hallucination, guardrail and RAG pattern you will meet later is a response to the mechanism in this lesson. Get this right and the rest of the exam stops feeling arbitrary.',
    },
    {
      id: 'analogy-autocomplete',
      type: 'analogy',
      title: 'Autocomplete that read the internet',
      body: 'Your phone suggests the next word from the few you just typed. It has seen a lot of messages, so it knows *“see you”* is often followed by *“later”*.\n\nAn LLM is that same trick, scaled almost beyond recognition: far more text, far more context, and a far richer sense of which word fits. But the job is unchanged — **look at everything so far, propose what comes next.**\n\nIt is not consulting knowledge. It is continuing a pattern.',
      mapping: [
        { from: 'The words you typed', to: 'The prompt (plus what it has generated so far)' },
        { from: 'Suggested next word', to: 'Predicted next token' },
        { from: 'Learned from your messages', to: 'Learned from training data' },
        { from: 'No idea what it is saying', to: 'No retrieval, no lookup, no database' },
      ],
    },
    {
      id: 'concept-next-token',
      type: 'concept',
      title: 'One token at a time',
      body: 'A model does not compose an answer and then write it. It produces a **probability distribution over every possible next token**, picks one, appends it to the text, and runs the whole thing again.\n\n"Paris" is not retrieved from a fact store. Given *“The capital of France is”*, it is simply the continuation the training data made overwhelmingly likely.\n\nThe entire response is that loop, repeated — each token conditioned on everything before it.',
      takeaways: [
        'Output is generated **left to right**, one token per step.',
        'Each step is a *prediction*, not a lookup.',
        'Facts are a side effect of patterns in training data — not stored records.',
      ],
    },
    {
      id: 'diagram-loop',
      type: 'diagram',
      title: 'The generation loop',
      spec: {
        kind: 'flow',
        steps: [
          { label: 'Prompt', sublabel: 'your text', tone: 'neutral' },
          { label: 'Tokens', sublabel: 'split into pieces', tone: 'accent' },
          { label: 'Probabilities', sublabel: 'over every next token', tone: 'brand' },
          { label: 'Pick one', sublabel: 'sample or take the top', tone: 'warn' },
          { label: 'Append', sublabel: 'then repeat', tone: 'good' },
        ],
        arrows: ['tokenize', 'predict', 'sample', 'loop back'],
      },
      caption:
        'The loop runs until a stop token or the length limit. **Nothing in it consults a database.**',
    },
    {
      id: 'concept-tokens',
      type: 'concept',
      title: 'Tokens, not words',
      body: 'Models do not see letters or words — they see **tokens**: common chunks of text. A frequent word is usually one token; a rare or long one splits into several. As a rule of thumb, **one token ≈ 4 characters** of English.\n\nThis explains a famous party trick: ask a model how many *r*’s are in “strawberry” and it may stumble. It never saw the letters — it saw two or three opaque chunks.\n\nTokens are also the billing and limit unit. Everything is counted in tokens.',
      takeaways: [
        'Token = a chunk of text, roughly 4 characters of English.',
        'Cost, context limits and rate limits are all measured in **tokens**.',
        'Character-level tasks are hard because the model never sees characters.',
      ],
    },
    {
      id: 'check-lookup',
      type: 'truefalse',
      statement:
        'When an LLM answers a factual question correctly, it is retrieving that fact from a database of knowledge stored inside it.',
      answer: false,
      explanation:
        '**False.** There is no lookup step and no stored record. The model predicts the most likely continuation, and for well-represented facts that continuation happens to be correct.\n\nThis is exactly why it can be *just as fluent* when it is wrong — the mechanism is identical either way. It is also why giving the model the real document (RAG) works so well: you move the fact into the text it is continuing from.',
    },
    {
      id: 'concept-context',
      type: 'concept',
      title: 'The context window is a desk, not a memory',
      body: 'The **context window** is the maximum number of tokens the model can consider at once — the prompt, any retrieved documents, the conversation so far, *and* the answer being generated, all sharing one budget.\n\nThink of a desk. Everything the model can reason about must be laid out on it. Anything not on the desk does not exist.\n\nWhen a chat “remembers” earlier turns, nothing was memorised — the whole transcript is being re-sent on the desk every single time.',
      takeaways: [
        'Context window = prompt + history + retrieved text + response.',
        'Nothing persists between calls. Each request starts from an empty desk.',
        'Exceed it and content must be truncated or summarised away.',
      ],
    },
    {
      id: 'mistake-bigger-context',
      type: 'mistake',
      title: 'Just use the biggest context window',
      myth:
        'A model with a huge context window means we can stop worrying about retrieval — just paste in all the documents and let it sort them out.',
      reality:
        'Bigger windows cost more, run slower, and **degrade in quality**: models reliably attend best to the beginning and end of a long context, and can lose material buried in the middle.\n\nStuffing 200 documents in to answer from one is paying full price for 199 distractions. Retrieving the *right* three chunks usually beats supplying everything — cheaper, faster, and more accurate.\n\nA large window is a useful ceiling, not a substitute for good retrieval.',
    },
    {
      id: 'example-temperature',
      type: 'example',
      title: 'Same prompt, different dice',
      intro:
        'If the model outputs probabilities, something must choose. **Temperature** controls how adventurous that choice is:',
      code: {
        language: 'python',
        content:
          'prompt = "Write a product name for a coffee subscription."\n\n# temperature = 0 → always take the most likely token\n# Run 1: "Daily Grind"\n# Run 2: "Daily Grind"      ← identical, deterministic\n\n# temperature = 1.0 → sample from the distribution\n# Run 1: "Bean Voyage"\n# Run 2: "Morning Ritual"   ← varies every call',
      },
      explanation:
        'Low temperature for anything that must be **consistent and factual** — extraction, classification, RAG answers. Higher temperature where you want **variety** — brainstorming, creative copy.\n\nNote what temperature does *not* do: it never makes the model more truthful. It only changes how the next token gets picked.',
    },
    {
      id: 'mcq-context',
      type: 'mcq',
      question:
        'A support assistant must answer from a 40-page policy manual. During testing, long conversations start producing errors and the manual’s middle sections are ignored. What is the most likely cause?',
      options: [
        {
          id: 'a',
          text: 'The model’s training data is out of date and needs refreshing.',
        },
        {
          id: 'b',
          text: 'The whole manual plus the growing conversation is filling the context window, pushing content out and burying the rest.',
        },
        {
          id: 'c',
          text: 'Temperature is set too low, making the model repeat itself.',
        },
        {
          id: 'd',
          text: 'The model has run out of memory from the earlier conversations.',
        },
      ],
      correct: ['b'],
      optionFeedback: {
        a: 'Training data would produce *consistently* wrong answers, not answers that degrade as the conversation grows. The failure scales with conversation length — that points at context, not training.',
        b: '**Correct.** Manual + history + answer share one token budget. As history grows, something must give, and material in the middle of a long context is attended to least reliably.',
        c: 'Low temperature makes output more deterministic, not less accurate. It would not cause middle sections to be skipped.',
        d: 'Models hold no memory between calls — each request is independent. There is nothing to run out of; the limit is the per-request context window.',
      },
      explanation:
        'This is the practical argument for retrieval. Rather than sending 40 pages every turn, retrieve the two or three relevant passages and send those. Smaller context, sharper attention, lower cost — the reasoning behind the whole RAG architecture.',
      examObjective:
        'Select an LLM for a task based on context window, cost, latency, and quality.',
    },
    {
      id: 'flashcard-token',
      type: 'flashcard',
      front: 'What is a token, and roughly how much text is one?',
      back: 'The chunk of text a model actually processes — **roughly 4 characters** of English. Common words are one token; rare words split into several. Cost, context limits and rate limits are all counted in tokens.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You now understand what the model is actually doing',
      points: [
        'An LLM **predicts the next token**, repeatedly — it never looks anything up.',
        'It reads **tokens** (≈ 4 characters), which is why cost and limits are counted that way.',
        'The **context window** holds prompt, history, retrieved text and answer — and nothing persists between calls.',
        'A bigger window is not a replacement for retrieving the right content.',
        'Temperature changes *how* the next token is picked — never how truthful it is.',
      ],
      closing:
        'Generation explains why models hallucinate. Next: **embeddings** — the trick that lets you find the right text to put in front of the model in the first place.',
    },
  ],
}
