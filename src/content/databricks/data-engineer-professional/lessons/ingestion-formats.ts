import type { Lesson } from '@/types/content'

/**
 * Lesson: ingesting diverse formats from message buses and cloud storage.
 * Maps to exam Section 2 (design ingestion pipelines for Delta, Parquet, ORC,
 * AVRO, JSON, CSV, XML, text, and binary from diverse sources).
 */
export const ingestionFormatsLesson: Lesson = {
  id: 'ingestion-formats',
  title: 'Every format, one landing zone',
  summary:
    'Read Delta, Parquet, ORC, AVRO, JSON, CSV, XML, text, and binary from cloud storage and message buses — and land them all as Delta.',
  estimatedMinutes: 10,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'Nine sources, nine formats',
      body: 'A partner drops CSVs, an app emits JSON to Kafka, a legacy system exports AVRO, and finance sends XML. Your job is to get all of them into the lakehouse — reliably, with schemas intact — and make them queryable together.\n\nThe pattern is always the same: read the source format, land it as **Delta**. What changes is which reader and which options.',
      atWork:
        'Ingesting a zoo of formats from cloud storage and message buses is the daily reality — and a whole exam section.',
    },
    {
      id: 'concept-self-describing',
      type: 'concept',
      title: 'Self-describing vs text formats',
      body: '**Self-describing** columnar/binary formats — **Parquet, ORC, AVRO, Delta** — carry their schema *inside* the files. Reads are fast and types are known. **Text** formats — **CSV, JSON, XML, plain text** — carry little or no schema, so you infer it (a scan) or, better, supply one.\n\nThis split explains most ingestion behavior: text formats need schema help and cleaning; binary formats mostly just read.',
      takeaways: [
        'Parquet/ORC/AVRO/Delta embed their schema — fast, typed.',
        'CSV/JSON/XML/text are schema-light — infer or supply a schema.',
        'The format tells you how much schema work to expect.',
      ],
    },
    {
      id: 'example-readers',
      type: 'example',
      title: 'One API, many formats',
      intro: '`spark.read.format(...)` (or Auto Loader’s `read_files`) covers them all:',
      code: {
        language: 'python',
        content:
          "spark.read.format('parquet').load(path)      # self-describing\nspark.read.format('avro').load(path)\nspark.read.format('json').schema(s).load(path) # supply schema\nspark.read.format('csv').option('header', True).load(path)\nspark.read.format('xml').option('rowTag', 'record').load(path)\nspark.read.format('binaryFile').load(path)     # images, PDFs\n\n# Land any of them as Delta\ndf.write.format('delta').saveAsTable('bronze.source_x')",
      },
      explanation:
        'XML needs a `rowTag`; CSV needs `header`/`sep`; `binaryFile` reads raw bytes (with path + length) for images or PDFs. Whatever the input, the output is Delta.',
    },
    {
      id: 'concept-buses',
      type: 'concept',
      title: 'Cloud storage vs message buses',
      body: 'Two source families. **Cloud object storage** (S3/ADLS/GCS) holds files — read them directly or incrementally with Auto Loader (`read_files`). **Message buses** (Kafka, Kinesis, Event Hubs, Pub/Sub) stream records — read with the streaming source, where the payload is usually bytes you parse (often JSON or AVRO) into columns.\n\nAuto Loader is the go-to for files; the streaming connectors handle buses.',
      takeaways: [
        'Files in cloud storage → Auto Loader / direct read.',
        'Records on a bus → streaming source connector.',
        'Bus payloads are bytes — parse JSON/AVRO into columns.',
      ],
    },
    {
      id: 'concept-land-as-delta',
      type: 'concept',
      title: 'Always land as Delta',
      body: 'Whatever the source format, the **bronze** target should be **Delta**. That immediately buys ACID transactions, schema enforcement/evolution, time travel, and data skipping on data that arrived as a schema-less CSV or an opaque AVRO blob.\n\nKeep the raw payload too (a `_rescued_data` column or the original bytes) so nothing is lost, then refine downstream.',
      takeaways: [
        'Bronze target format = Delta, always.',
        'Delta adds ACID, evolution, time travel, skipping.',
        'Preserve the raw payload for reprocessing.',
      ],
    },
    {
      id: 'tf-parquet-schema',
      type: 'truefalse',
      statement:
        'Reading a CSV file and reading a Parquet file require the same amount of schema handling.',
      answer: false,
      explanation:
        'Parquet embeds its schema, so it reads with types intact. CSV is schema-light — you must infer (a costly scan) or supply a schema, and handle malformed rows.',
    },
    {
      id: 'mcq-format',
      type: 'mcq',
      question:
        'You must ingest AVRO from a bus, XML from a vendor, and CSV from a partner, then query them together with reliable types and time travel. What target and approach fit best?',
      options: [
        {
          id: 'a',
          text: 'Read each with its format reader (supplying schemas for text formats) and land all as Delta bronze tables.',
        },
        {
          id: 'b',
          text: 'Store each in its original format and query across CSV/XML/AVRO files directly forever.',
        },
        { id: 'c', text: 'Convert everything to CSV first for a common format, then query the CSVs.' },
        { id: 'd', text: 'Load all sources into an in-memory DataFrame and never persist them.' },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'Correct — use the right reader per format and land everything as Delta to get types, ACID, and time travel.',
        b: 'Querying heterogeneous raw files forever gives no ACID, evolution, or skipping.',
        c: 'CSV is the *least* typed format — converting to it throws away schema and precision.',
        d: 'In-memory only means no persistence, no time travel, and it vanishes on cluster stop.',
      },
      explanation:
        'The ingestion pattern: format-appropriate reader in, **Delta** out — one governed, time-travelable bronze layer regardless of source format.',
      examObjective:
        'Design and implement data ingestion pipelines to efficiently ingest a variety of data formats (Delta, Parquet, ORC, AVRO, JSON, CSV, XML, Text, Binary) from diverse sources such as message buses and cloud storage.',
    },
    {
      id: 'flash-binaryfile',
      type: 'flashcard',
      front: 'Which reader ingests images or PDFs as raw bytes, and what does XML ingestion require?',
      back: '`binaryFile` reads raw bytes; XML ingestion needs a `rowTag` option identifying the record element.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now ingest any format',
      points: [
        'Self-describing (Parquet/ORC/AVRO/Delta) carry schema; text (CSV/JSON/XML) don’t.',
        'One read API with per-format options; `binaryFile` for images/PDFs.',
        'Files → Auto Loader; message buses → streaming connectors (parse the bytes).',
        'Always land bronze as Delta for ACID, evolution, and time travel.',
        'Keep the raw payload so you can reprocess.',
      ],
      closing: 'Next: one table that serves both batch and streaming without duplicates. 🔁',
    },
  ],
}
