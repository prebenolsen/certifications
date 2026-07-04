import type { Lesson } from '@/types/content'

/**
 * Lesson: Structured Streaming behavior, triggers, and SLA tuning.
 * Maps to exam Section 1 (Structured Streaming vs declarative pipelines;
 * production SLA-ready pipelines). Covers sample question 2 (trigger interval).
 */
export const structuredStreamingTuningLesson: Lesson = {
  id: 'structured-streaming-tuning',
  title: 'Keeping a stream under its SLA',
  summary:
    'The micro-batch model, trigger intervals, and why smaller, more frequent batches beat a peak-hour backlog — plus Structured Streaming vs declarative pipelines.',
  estimatedMinutes: 11,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'Fine at midnight, drowning at noon',
      body: 'Your stream processes each micro-batch in under 3 seconds normally. At peak, batches balloon to 30+ seconds, blowing your 10-second SLA. The trigger interval is 10 seconds.\n\nThe fix isn’t more hardware — it’s understanding how batch *size* drives spill, and how the trigger interval controls that size.',
      atWork:
        'This is a signature Professional question: diagnose a streaming SLA miss and pick the adjustment that actually helps.',
    },
    {
      id: 'analogy-checkout',
      type: 'analogy',
      title: 'A supermarket checkout',
      body: 'A 10-second trigger is a cashier who waits 10 seconds before scanning, letting a big pile build up. At quiet times the pile is small. At rush hour the pile grows huge, overflows the belt (spills to disk), and each "batch" takes forever.\n\nScanning more often — every 5 seconds — keeps each pile small and moving, so no single batch overwhelms the belt.',
      mapping: [
        { from: 'The waiting cashier', to: 'The trigger interval' },
        { from: 'The pile of groceries', to: 'The micro-batch of records' },
        { from: 'Belt overflowing', to: 'Shuffle/records spilling to disk' },
      ],
    },
    {
      id: 'concept-microbatch',
      type: 'concept',
      title: 'Structured Streaming runs one micro-batch at a time',
      body: 'Structured Streaming processes data as a sequence of small **micro-batches**, executed **sequentially** — it starts batch N+1 only after batch N finishes and commits its offsets to the **checkpoint**.\n\nBatches do *not* overlap. So a slow batch delays the next one; there is no "idle executor picking up the next batch while this one finishes."',
      takeaways: [
        'Data is processed as sequential micro-batches.',
        'Batch N+1 waits for batch N to commit — no overlap.',
        'Progress (offsets) is saved in the checkpoint between batches.',
      ],
    },
    {
      id: 'concept-trigger',
      type: 'concept',
      title: 'The trigger interval sets how much accumulates',
      body: 'With a `processingTime="10 seconds"` trigger, the stream gathers ~10 seconds of arrivals into each batch. During peak arrival rates, that is a *lot* of records — big enough to spill shuffle data to disk, which is what makes the batch slow and inconsistent.\n\nShorten the trigger to 5 seconds and each batch carries roughly half the data: smaller shuffles, no spill, faster and steadier processing.',
      takeaways: [
        'Longer interval → bigger batches → more spill risk at peak.',
        'Shorter interval → smaller batches → steadier processing time.',
        'You can change the trigger without touching the checkpoint.',
      ],
    },
    {
      id: 'mcq-trigger',
      type: 'mcq',
      question:
        'A Structured Streaming job with a 10-second trigger processes each batch in under 3s normally, but at peak batches exceed 30s. Records must be processed in under 10s. Which adjustment meets the requirement?',
      options: [
        {
          id: 'a',
          text: 'Use Trigger.Once and schedule a job every 8 seconds so each run clears the backlog.',
        },
        {
          id: 'b',
          text: 'Decrease the trigger interval to 5 seconds; more frequent batches prevent records backing up and large batches from spilling.',
        },
        {
          id: 'c',
          text: 'Decrease the trigger interval to 5 seconds so idle executors start the next batch while previous long tasks finish.',
        },
        {
          id: 'd',
          text: 'The interval can’t change without a new checkpoint; instead raise shuffle partitions to maximize parallelism.',
        },
      ],
      correct: ['b'],
      optionFeedback: {
        a: 'Trigger.Once processes all available data in one batch — at peak that’s the same huge, spilling batch you already have.',
        b: 'Correct — smaller, more frequent batches carry less data each, avoiding the spill that inflates peak-hour times.',
        c: 'Right change, wrong reason: batches run sequentially and never overlap, so no "idle executor picks up the next batch."',
        d: 'False premise — the trigger interval can change without a new checkpoint; more partitions don’t fix oversized batches.',
      },
      explanation:
        'The batch is too big at peak and spills. A shorter trigger yields smaller batches — the reasoning in B. C picks the same action but justifies it with overlap that doesn’t exist.',
      examObjective:
        'Understand Spark Structured Streaming behavior and determine the optimal approach for production SLA-ready pipelines.',
    },
    {
      id: 'concept-triggers-types',
      type: 'concept',
      title: 'Trigger modes at a glance',
      body: '**processingTime="N seconds"** — micro-batch every N seconds; the default for continuous low-latency streams.\n\n**availableNow** — process all currently available data in one or more batches, then stop. Ideal for scheduled incremental jobs (batch-like economics, streaming semantics).\n\n**Continuous** — experimental, very low latency, rarely on the exam. (The old `Trigger.Once` is superseded by `availableNow`.)',
      takeaways: [
        'processingTime → always-on, latency-driven.',
        'availableNow → run, drain the backlog, stop (great for jobs).',
        'Same code, different economics — switch by trigger.',
      ],
    },
    {
      id: 'diagram-ss-vs-lsdp',
      type: 'diagram',
      title: 'Structured Streaming vs declarative pipelines',
      spec: {
        kind: 'compare',
        left: {
          label: 'Spark Structured Streaming',
          sublabel: 'you write the plumbing',
          tone: 'accent',
          items: [
            'Full control of triggers, state, sinks',
            'You manage checkpoints & retries',
            'Best for custom, low-level logic',
          ],
        },
        right: {
          label: 'Lakeflow Declarative Pipelines',
          sublabel: 'you declare the result',
          tone: 'brand',
          items: [
            'Dependencies, retries, quality handled for you',
            'Built-in expectations & lineage',
            'Best for maintainable production ETL',
          ],
        },
      },
      caption:
        'Choose Structured Streaming for fine-grained control; declarative pipelines for managed, maintainable ETL.',
    },
    {
      id: 'flash-microbatch',
      type: 'flashcard',
      front: 'Do Structured Streaming micro-batches overlap so a new batch starts while the previous finishes?',
      back: 'No — they run **sequentially**. Batch N+1 begins only after batch N commits its offsets to the checkpoint.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now tune a stream to its SLA',
      points: [
        'Structured Streaming = sequential, non-overlapping micro-batches.',
        'Trigger interval controls batch size; big peak batches spill and slow down.',
        'Shorten the interval to shrink batches — the fix for peak-hour SLA misses.',
        'processingTime vs availableNow: always-on vs run-and-stop economics.',
        'Declarative pipelines manage the plumbing; Structured Streaming gives control.',
      ],
      closing: 'Next: the declarative pipelines that manage all that plumbing for you. 🌊',
    },
  ],
}
