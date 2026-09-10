import type { Explainer } from '@/types/content'

/**
 * Visual explainers — interactive pages that build one mental model, linked
 * from the home page and from the tracks they support.
 *
 * These exist for the questions a card sequence answers badly: *how do two
 * whole systems relate to each other?* A lesson can define Unity Catalog and a
 * lesson can define Azure Storage, but neither shape shows a learner the line
 * between them, which is the thing they actually get wrong.
 *
 * Add one here only when it clears the bar in `Explainer.answers`: name the
 * questions a learner can answer after using it. If the list is hard to write,
 * the material belongs in a lesson instead.
 */
export const explainers: Explainer[] = [
  {
    id: 'catalog-and-stacks',
    title: 'The Catalog and the Stacks',
    summary:
      'Where your data physically sits in Azure, what Unity Catalog actually stores, and why a catalog is **not** a folder and a table is **not** a file.',
    url: 'https://claude.ai/code/artifact/203123f1-8213-4e34-8c47-e4e295124af9',
    minutes: 20,
    answers: [
      'Where are my actual files, and what is a storage account and a container?',
      'What is a Delta table physically made of — and why is it never a single file?',
      'What does Unity Catalog store, if it stores no data?',
      'How does a table name relate to a path in Azure Storage?',
      'What is the difference between a managed and an external table?',
      'Where do compute and access control fit?',
    ],
    modes: [
      {
        label: 'Guided story',
        note: 'Starts on an empty screen and builds the whole architecture in 16 steps, in the order you would really build it — cloud, then storage, then files, then names, then permissions.',
      },
      {
        label: 'Full picture',
        note: 'The finished architecture, pan-and-zoom, with a detail panel behind every object.',
      },
      {
        label: 'Library analogy',
        note: 'The same diagram with every label swapped for its equivalent in a physical library. The boxes never move, so each concept maps one-to-one.',
      },
    ],
    /*
      Attached to the tracks whose learners meet these objects, not to every
      Databricks track: the Generative AI cert never asks where a Parquet file
      lives, and a link that is not for you is noise.
    */
    certIds: [
      'databricks-intro-data-engineering',
      'databricks-data-engineer-associate',
      'databricks-data-engineer-professional',
      'databricks-data-analyst-associate',
    ],
  },
]

/** Explainers attached to a given certification, for its track page. */
export function explainersForCert(certId: string): Explainer[] {
  return explainers.filter((e) => e.certIds.includes(certId))
}
