import type { Lesson } from '@/types/content'

/**
 * Lesson: the ways data gets into Databricks.
 * Maps to exam Section 3 (explain the approaches for bringing data into
 * Databricks — S3 ingestion, Delta Sharing, API-driven intake, Auto Loader,
 * Marketplace) and (use the Workspace UI to upload a data file).
 */
export const ingestionMethodsLesson: Lesson = {
  id: 'ingestion-methods',
  title: 'Six ways data arrives',
  summary:
    'UI upload, cloud storage, Delta Sharing, API intake, Auto Loader, and the Marketplace — what each is for, and the two that involve no copying at all.',
  estimatedMinutes: 10,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'Four requests, one week',
      body: 'A colleague emails a 200-row CSV of budget targets. Marketing’s clickstream lands in S3 all day. A partner offers you their product catalog. A vendor has only a REST API.\n\nFour sources, four different answers — and two of them do not involve copying any data at all. Choosing correctly is most of exam Section 3.',
      atWork:
        'The wrong choice usually shows up as a fragile pipeline nobody wants to own six months later.',
    },
    {
      id: 'concept-ui-upload',
      type: 'concept',
      title: 'UI upload — the small, one-off file',
      body: 'The workspace has an **upload data** page: drag in a CSV, JSON, or similar file, preview the parsed columns, adjust types and the header setting, choose a catalog and schema, and create a table.\n\nIt is genuinely useful for the budget spreadsheet a colleague emails you. It is genuinely wrong for anything recurring: every refresh means a human repeating the drag, and there is no record of what changed.',
      takeaways: [
        'Best for small, one-off files you were handed.',
        'Creates a real Unity Catalog table you can query and grant on.',
        'A recurring upload is a pipeline waiting to be built.',
      ],
    },
    {
      id: 'concept-cloud-storage',
      type: 'concept',
      title: 'Cloud storage — the everyday source',
      body: 'Most data arrives as files in **cloud object storage** (S3, ADLS, GCS). Rather than each user pasting bucket paths and credentials, an admin registers the location once in Unity Catalog — as an **external location** or a **volume** — and grants access to it.\n\nFrom there you read the files directly with `read_files(...)`, or load them into a table. Governance applies to the files the same way it applies to tables.',
      takeaways: [
        'Cloud storage is registered in Unity Catalog, then granted like any object.',
        'A **volume** is the governed home for files (including non-tabular ones).',
        '`read_files(...)` queries files straight from a path.',
      ],
    },
    {
      id: 'concept-sharing-marketplace',
      type: 'concept',
      title: 'Delta Sharing and Marketplace — arriving without a copy',
      body: 'Two of the six methods move no data.\n\n**Delta Sharing** is an open protocol for reading someone else’s live tables. A provider puts tables in a *share* and grants it to you; the share appears in your catalog and you query the provider’s current data. Recipients do not have to be Databricks customers.\n\n**Marketplace** is the public storefront built on that protocol: browse listings, accept the terms, and the data product appears as a catalog — often with instant access.',
      takeaways: [
        'Both deliver a **catalog you query live** — nothing is copied or scheduled.',
        'Delta Sharing = a named partner; Marketplace = a public catalog of listings.',
        'No pipeline means no staleness and no reconciliation.',
      ],
    },
    {
      id: 'concept-api-autoloader',
      type: 'concept',
      title: 'API intake and Auto Loader — the recurring cases',
      body: '**API-driven intake** covers sources with no files and no connector: code (usually in a notebook) calls the vendor’s REST API, and a **Lakeflow Job** runs it on a schedule with retries and alerts. You own the code, so keep it small.\n\n**Auto Loader** is for files that keep arriving. It discovers new files incrementally and loads only those, remembering what it has already processed — the subject of the next lesson.',
      takeaways: [
        'No connector and no files → API call, scheduled by a job.',
        'Files arriving continuously → Auto Loader.',
        'Both are recurring pipelines, not one-off actions.',
      ],
    },
    {
      id: 'diagram-decide',
      type: 'diagram',
      title: 'Copy or connect?',
      spec: {
        kind: 'compare',
        left: {
          label: 'Data is copied in',
          sublabel: 'you own a pipeline',
          tone: 'accent',
          items: [
            'UI upload — one small file, by hand',
            'Cloud storage load — files into a table',
            'Auto Loader — new files, incrementally',
            'API intake — your code on a schedule',
          ],
        },
        right: {
          label: 'Data stays where it is',
          sublabel: 'you own a grant',
          tone: 'good',
          items: [
            'Delta Sharing — a partner’s live tables',
            'Marketplace — a published data product',
            'Nothing to refresh, nothing to reconcile',
          ],
        },
      },
      caption:
        'Ask first whether the data needs to move at all. A share beats a pipeline whenever it is available.',
    },
    {
      id: 'concept-choosing',
      type: 'concept',
      title: 'Choosing, in two questions',
      body: '**Where does it live?** Someone else’s Databricks or a published listing → Delta Sharing or Marketplace. Files in cloud storage → Auto Loader or a direct load. Only an API → your own code on a schedule. A file on your laptop → UI upload.\n\n**How often does it arrive?** Once → upload or a one-time load. Continuously → Auto Loader. On a schedule → a Lakeflow Job around whichever method fits.',
      takeaways: [
        'Location picks the method; frequency picks whether it needs scheduling.',
        'Prefer sharing over copying whenever the source offers it.',
      ],
    },
    {
      id: 'mistake-manual',
      type: 'mistake',
      title: 'The recurring manual upload',
      myth: '"The partner sends a new CSV every Monday, so I upload it through the UI every Monday."',
      reality:
        'That is a pipeline with a human in it: it breaks when you are on holiday, nobody can tell which week’s file is loaded, and there is no history of what changed.\n\nHave the file land in cloud storage and let **Auto Loader** pick it up — or, better, ask whether the partner can **share** the table instead of exporting it at all.',
    },
    {
      id: 'mcq-ingestion',
      type: 'mcq',
      question:
        'A partner already uses Databricks and offers to provide their product catalog, which changes daily. Your team needs current data with the least maintenance. What is the best approach?',
      options: [
        {
          id: 'a',
          text: 'Ask them to share the table via Delta Sharing, then query the shared catalog directly.',
        },
        {
          id: 'b',
          text: 'Ask for a daily CSV export to S3 and build an Auto Loader pipeline to ingest it.',
        },
        {
          id: 'c',
          text: 'Upload their export through the workspace UI each morning.',
        },
        {
          id: 'd',
          text: 'Write a notebook that scrapes their catalog through a REST API on a schedule.',
        },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'Sharing gives live data with no copy, no schedule, and no reconciliation — and revoking access is a single change on their side.',
        b: 'Export plus ingest builds a pipeline to solve a problem sharing removes entirely.',
        c: 'A daily manual upload puts a person in the critical path of a daily report.',
        d: 'API scraping is the fallback for sources with no better option; here there is a much better one.',
      },
      explanation:
        'When the source is another Databricks account, **Delta Sharing** beats every copying method: live data, one grant, nothing to schedule or reconcile.',
      examObjective:
        'Explain the approaches for bringing data into Databricks, covering ingestion from S3, data sharing with external systems via Delta Sharing, API-driven data intake, the Auto Loader feature, and Marketplace.',
    },
    {
      id: 'tf-upload',
      type: 'truefalse',
      statement:
        'A file uploaded through the workspace UI becomes an ordinary Unity Catalog table that you can query and grant permissions on.',
      answer: true,
      explanation:
        'The upload page writes a real table into the catalog and schema you choose. It is a normal governed table from then on — the limitation is the manual, one-off nature of the upload itself, not the result.',
    },
    {
      id: 'flash-no-copy',
      type: 'flashcard',
      front: 'Which two ingestion approaches involve no copying of data?',
      back: '**Delta Sharing** (a partner’s live tables) and the **Marketplace** (a published data product). Both arrive as a catalog you query in place.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now choose an ingestion route',
      points: [
        'UI upload: small, one-off files — creates a real governed table.',
        'Cloud storage: registered in Unity Catalog as an external location or volume.',
        'Delta Sharing and Marketplace: live data, no copy, no pipeline.',
        'API intake: your code, scheduled by a Lakeflow Job.',
        'Auto Loader: files that keep arriving, loaded incrementally.',
        'Decide by *where the data lives*, then by *how often it arrives*.',
      ],
      closing: 'Next: the one that handles files arriving forever — Auto Loader. 🚚',
    },
  ],
}
