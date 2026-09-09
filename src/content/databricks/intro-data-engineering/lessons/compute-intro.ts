import type { Lesson } from '@/types/content'

/**
 * Lesson 6: the things a newcomer actually clicks on, and the meter.
 *
 * Introduces **DBU** and **SQL warehouse**. Cluster sizing, autoscaling and
 * Photon are certification material and are left out on purpose.
 */
export const computeIntroLesson: Lesson = {
  id: 'compute-intro',
  title: 'Where the work runs',
  summary:
    'Workspace, notebook, cluster, SQL warehouse — the vendor names for familiar things, and the unit that meters them.',
  estimatedMinutes: 6,
  status: 'complete',
  cards: [
    {
      id: 'concept-workspace',
      type: 'concept',
      title: 'The workspace',
      body: 'The **workspace** is what you log into: a browser environment holding your code, queries, dashboards, scheduled jobs and the folders they live in.\n\nOne detail worth knowing early — organisations usually run **several** workspaces, typically one per environment (development, test, production) or per department. The tables they read are shared and governed centrally; the workspace is just the room you work in.',
      takeaways: [
        'A workspace is where you work, not where the data is stored.',
        'Several workspaces, one governance layer over the same data.',
      ],
    },
    {
      id: 'concept-notebook',
      type: 'concept',
      title: 'The notebook',
      body: 'A **notebook** is a document of code cells with their output underneath — run a cell, see the table or chart it produced, keep going. It is the normal way to explore data and develop a transformation, and several people can be in the same one at once.\n\nThe catch a newcomer trips over: a notebook cannot run on its own. It is text until you **attach compute** to it. The notebook holds the instructions; something else has to do the work.',
      takeaways: [
        'Python and SQL can be mixed cell by cell in the same notebook.',
        'No attached compute means no execution — the cell simply waits.',
      ],
    },
    {
      id: 'concept-cluster',
      type: 'concept',
      title: 'Clusters: machines rented for the afternoon',
      body: 'A **cluster** is a group of machines started on demand to run your work — this is where Apache Spark spreads the job out. You describe roughly what you want, the platform starts the machines, and they run until stopped.\n\nTwo kinds, and the difference is mostly about money:\n\n**All-purpose** — created by a person, often shared by a team, and it keeps running (and billing) until it is stopped or times out. Right for interactive work.\n\n**Job** — created automatically for one scheduled run and **deleted when the run ends**. Cheaper per unit of work, and it cannot be left on by accident.',
      takeaways: [
        'Use an all-purpose cluster while developing; let scheduled work create job clusters.',
        '**Auto-termination** shuts an idle cluster down. Leaving it off is the classic first big bill.',
      ],
    },
    {
      id: 'concept-warehouse',
      type: 'concept',
      title: 'SQL warehouses',
      body: 'A **SQL warehouse** is compute for SQL specifically — what the query editor and dashboards run on. Despite the name it stores nothing at all: the tables live in cloud storage under Unity Catalog, exactly as before.\n\nSo the warehouse you pick changes only speed, how many people can query at once, and cost. It never changes which data exists or what a query returns.\n\n**Serverless** warehouses start in a few seconds because the machines are already waiting, rather than being provisioned when you ask.',
      takeaways: [
        'A SQL warehouse runs queries; it does not hold data.',
        'Bigger makes one heavy query faster; scaling out serves more concurrent users.',
      ],
    },
    {
      id: 'diagram-compare',
      type: 'diagram',
      title: 'Cluster or SQL warehouse?',
      spec: {
        kind: 'compare',
        left: {
          label: 'Cluster',
          sublabel: 'general-purpose compute',
          tone: 'brand',
          items: [
            'Runs notebooks, pipelines and jobs',
            'Python, SQL, Scala, R, any library',
            'All-purpose (shared, lingers) or job (per run, deleted after)',
            'What data engineers work on',
          ],
        },
        right: {
          label: 'SQL warehouse',
          sublabel: 'compute for SQL only',
          tone: 'accent',
          items: [
            'Runs queries and dashboards',
            'SQL only',
            'Serverless starts in seconds; auto-stops when idle',
            'What analysts work on',
          ],
        },
      },
      caption:
        'Both are rented machines, both are billed while running, and neither stores your data. The choice is about the kind of work, not about where the tables are.',
    },
    {
      id: 'concept-dbu',
      type: 'concept',
      title: 'The DBU: the meter on the wall',
      body: 'Compute is billed in **DBUs** (*Databricks Units*) — roughly "how much processing did that consume". It is not a machine-hour: a larger or more capable cluster burns DBUs faster, so ten minutes on one cluster is not ten minutes on another.\n\nThe consequence runs through everything: **decisions that look technical are usually cost decisions.** How big a cluster is, whether scheduled work uses a job cluster, whether anything shuts down when idle — each is a line on the bill.',
      takeaways: [
        'DBUs, not hours. Capability changes the burn rate.',
        'The cloud machines are billed by your cloud provider on top of the DBUs.',
      ],
    },
    {
      id: 'mistake-cluster-storage',
      type: 'mistake',
      title: 'The most expensive misunderstanding',
      myth: '"My tables live on my cluster, so I had better not shut it down or I will lose my work."',
      reality:
        'Storage and compute are entirely separate. Tables live in cloud storage, governed by Unity Catalog; a cluster is borrowed machinery that reads and writes them.\n\nTerminate every cluster in the workspace and not one row is lost — the next query simply starts new machines. This is why idle compute is pure waste, and why auto-termination is on by default.',
    },
    {
      id: 'check-terminate',
      type: 'truefalse',
      statement:
        'Terminating a cluster deletes the tables that were created using it.',
      answer: false,
      explanation:
        'Compute and storage are separate. The tables sit in cloud storage under Unity Catalog and outlive any cluster; terminating one only stops the billing.',
    },
    {
      id: 'flash-dbu',
      type: 'flashcard',
      front: 'What is a **DBU**?',
      back: 'A **Databricks Unit** — the unit compute is billed in, measuring processing consumed rather than time elapsed. Bigger or more capable compute burns DBUs faster.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'The room, the tools, the meter',
      points: [
        'A **workspace** is the environment you log into; organisations run several.',
        'A **notebook** is code plus its output, and does nothing until compute is attached.',
        'A **cluster** is machines on demand: **all-purpose** for interactive work, **job** for scheduled runs.',
        'A **SQL warehouse** runs SQL and stores nothing.',
        'Compute is metered in **DBUs**, which makes most sizing decisions cost decisions.',
      ],
      closing:
        'You know where work runs. Next: the tools that get the data in and shape it. 🔄',
    },
  ],
}
