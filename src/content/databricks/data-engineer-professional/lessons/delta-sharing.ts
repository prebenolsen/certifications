import type { Lesson } from '@/types/content'

/**
 * Lesson: Delta Sharing (D2D and open protocol / D2O).
 * Maps to exam Section 4 (Delta Sharing between Databricks deployments (D2D) and
 * to external platforms via the open sharing protocol (D2O); share live data).
 */
export const deltaSharingLesson: Lesson = {
  id: 'delta-sharing',
  title: 'Sharing live data without copies',
  summary:
    'Delta Sharing to other Databricks deployments (D2D) and to any platform via the open protocol (D2O) — sharing live, governed data with no ETL.',
  estimatedMinutes: 9,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'The nightly export nobody trusts',
      body: 'A partner needs your product catalog. Today you dump it to CSV on SFTP every night; the file is always a day stale and occasionally corrupt. They reload it into their own warehouse and the two of you constantly reconcile mismatches.\n\nDelta Sharing replaces the export with a **live pointer**: the partner reads your actual table, current as of now, without you copying anything.',
      atWork:
        'Sharing data across organizations is a Professional topic — and Delta Sharing is Databricks’ answer.',
    },
    {
      id: 'concept-what',
      type: 'concept',
      title: 'What Delta Sharing is',
      body: 'Delta Sharing is an **open protocol** for sharing live data. A **provider** groups tables into a **share** and grants it to a **recipient**. The recipient queries the data directly from the provider’s storage — no copy, no pipeline, always current.\n\nBecause it’s an open protocol, the recipient does not need to be a Databricks customer.',
      takeaways: [
        'Provider bundles tables into a share, grants it to a recipient.',
        'Recipient reads live data directly — no copy, no ETL.',
        'It’s an open protocol, not a Databricks-only feature.',
      ],
    },
    {
      id: 'diagram-d2d-d2o',
      type: 'diagram',
      title: 'Two ways to receive a share',
      spec: {
        kind: 'compare',
        left: {
          label: 'D2D — Databricks-to-Databricks',
          sublabel: 'recipient is on Databricks',
          tone: 'brand',
          items: [
            'Recipient identified by their metastore/sharing id',
            'Share appears as a catalog in Unity Catalog',
            'Full UC governance on the recipient side',
            'Simplest, most secure path',
          ],
        },
        right: {
          label: 'D2O — Databricks-to-Open',
          sublabel: 'recipient on any platform',
          tone: 'accent',
          items: [
            'Recipient uses the open protocol (pandas, Spark, PowerBI…)',
            'Access via a credential/bearer token file',
            'No Databricks account required',
            'Widest reach',
          ],
        },
      },
      caption:
        'Same share, two recipient types: another Databricks deployment (D2D) or any open-protocol client (D2O).',
    },
    {
      id: 'concept-d2d',
      type: 'concept',
      title: 'D2D: sharing between Databricks deployments',
      body: 'When the recipient is also on Databricks, you share **Databricks-to-Databricks**. You register the recipient by their sharing identifier, grant them the share, and it shows up in *their* Unity Catalog as a catalog they can query — with full UC governance and no tokens to manage.\n\nThis is the most secure, lowest-friction option when both sides are Databricks.',
      takeaways: [
        'Recipient identified by their Databricks sharing id.',
        'Share surfaces as a UC catalog on the recipient side.',
        'No credential files — governed end to end by Unity Catalog.',
      ],
    },
    {
      id: 'concept-d2o',
      type: 'concept',
      title: 'D2O: sharing with the rest of the world',
      body: 'When the recipient is *not* on Databricks, you share via the **open sharing protocol**. The recipient gets a **credential file** (a bearer token + endpoint) and reads the data using any open-protocol client — pandas, Apache Spark, Power BI, and others.\n\nThey never need a Databricks account; they just need the token and a connector.',
      takeaways: [
        'For non-Databricks recipients: the open protocol.',
        'Access via a credential (bearer token) file.',
        'Readable from pandas, Spark, BI tools, etc.',
      ],
    },
    {
      id: 'mistake-copy',
      type: 'mistake',
      title: 'Sharing is not copying',
      myth: '“Delta Sharing exports a snapshot of my table to the recipient’s storage.”',
      reality:
        'Nothing is copied. The recipient reads *your* live Delta table through the protocol, so they always see the current data and you keep one source of truth. You can revoke access instantly by dropping the grant.',
    },
    {
      id: 'mcq-sharing',
      type: 'mcq',
      question:
        'You must share a live, governed dataset with a partner who does NOT use Databricks, without building an export pipeline. What do you use?',
      options: [
        {
          id: 'a',
          text: 'Delta Sharing via the open protocol (D2O), giving the partner a credential file to read with an open-protocol client.',
        },
        {
          id: 'b',
          text: 'Databricks-to-Databricks (D2D) sharing to their metastore.',
        },
        { id: 'c', text: 'A nightly job that writes CSVs to a shared cloud bucket.' },
        { id: 'd', text: 'DEEP CLONE the table into the partner’s storage account.' },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'Correct — the open protocol lets a non-Databricks recipient read the live share via a credential file.',
        b: 'D2D requires the recipient to be on Databricks, which they are not.',
        c: 'CSV exports are stale, ungoverned, and exactly the pipeline you’re trying to avoid.',
        d: 'A deep clone copies data and needs syncing — not a live, no-copy share.',
      },
      explanation:
        'A non-Databricks recipient is the D2O case: share via the open protocol with a credential file so they read live data with any compatible client.',
      examObjective:
        'Demonstrate Delta Sharing securely between Databricks deployments (D2D) or to external platforms using the open sharing protocol (D2O).',
    },
    {
      id: 'flash-d2o',
      type: 'flashcard',
      front: 'Which Delta Sharing mode serves a recipient who is not a Databricks customer, and how do they authenticate?',
      back: 'D2O — the **open sharing protocol** — using a **credential (bearer token) file** with any open-protocol client.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now share data live and governed',
      points: [
        'Delta Sharing shares live data via an open protocol — no copies.',
        'Provider bundles tables into a share, grants to a recipient.',
        'D2D: recipient on Databricks; share appears as a UC catalog, no tokens.',
        'D2O: recipient anywhere; a credential file + open-protocol client.',
        'Revoke instantly by dropping the grant; one source of truth stays intact.',
      ],
      closing: 'Next: querying data you don’t even own — Lakehouse Federation. 🌐',
    },
  ],
}
