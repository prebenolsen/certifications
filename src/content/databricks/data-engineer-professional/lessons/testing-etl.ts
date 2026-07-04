import type { Lesson } from '@/types/content'

/**
 * Lesson: testing an ETL pipeline.
 * Maps to exam Section 1 (develop unit and integration tests using
 * assertDataFrameEqual, assertSchemaEqual, DataFrame.transform, and a debugger).
 */
export const testingEtlLesson: Lesson = {
  id: 'testing-etl',
  title: 'Testing an ETL pipeline',
  summary:
    'Write composable transforms with DataFrame.transform, then unit-test them with assertDataFrameEqual and assertSchemaEqual — plus integration tests and the debugger.',
  estimatedMinutes: 10,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'The silent schema change',
      body: 'A refactor renamed a column from `amt` to `amount`. Nothing errored — the pipeline ran, wrote data, and every downstream total quietly went to null. Nobody noticed for a week.\n\nA one-line schema assertion in a test would have caught it before deploy. Testing is what turns "it ran" into "it’s correct."',
      atWork:
        'Professional pipelines ship with tests. The exam names the exact tools: assertDataFrameEqual, assertSchemaEqual, DataFrame.transform.',
    },
    {
      id: 'concept-transform',
      type: 'concept',
      title: 'DataFrame.transform makes logic testable',
      body: '`DataFrame.transform(fn)` applies a function that takes a DataFrame and returns a DataFrame, so you can build a pipeline as a **chain of named, pure transforms**: `df.transform(clean).transform(enrich)`.\n\nEach transform is an ordinary function you can call in a test with a tiny input DataFrame — no cluster, no notebook, no full pipeline run required.',
      takeaways: [
        '`transform(fn)` chains DataFrame→DataFrame functions.',
        'Each transform is a pure, independently testable unit.',
        'Compose the pipeline from small, named steps.',
      ],
    },
    {
      id: 'example-transform',
      type: 'example',
      title: 'Composable transforms',
      intro: 'Small pure functions, chained:',
      code: {
        language: 'python',
        content:
          "def drop_invalid(df):\n    return df.filter(df.amount > 0)\n\ndef add_year(df):\n    return df.withColumn('year', year(df.order_ts))\n\nsilver = (bronze\n    .transform(drop_invalid)\n    .transform(add_year))",
      },
      explanation:
        'Because `drop_invalid` and `add_year` are plain functions, a test can call `drop_invalid(small_df)` directly and check the result — the essence of unit-testing a transform.',
    },
    {
      id: 'concept-assertions',
      type: 'concept',
      title: 'assertDataFrameEqual and assertSchemaEqual',
      body: 'PySpark ships test helpers (`pyspark.testing`). **`assertDataFrameEqual(actual, expected)`** checks rows match (with options for ordering and float tolerance). **`assertSchemaEqual(actual.schema, expected.schema)`** checks column names, types, and nullability — the guard that would have caught the `amt`→`amount` rename.\n\nUnit tests use tiny hand-built DataFrames so they run fast and deterministically.',
      takeaways: [
        '`assertDataFrameEqual` — the rows are what you expect.',
        '`assertSchemaEqual` — columns/types/nullability are what you expect.',
        'Feed transforms small literal DataFrames for fast, deterministic tests.',
      ],
    },
    {
      id: 'example-test',
      type: 'example',
      title: 'A unit test',
      intro: 'Tiny input, explicit expected output:',
      code: {
        language: 'python',
        content:
          "from pyspark.testing import assertDataFrameEqual\n\ndef test_drop_invalid(spark):\n    inp = spark.createDataFrame(\n        [(1, 10.0), (2, -5.0)], ['id', 'amount'])\n    expected = spark.createDataFrame(\n        [(1, 10.0)], ['id', 'amount'])\n    assertDataFrameEqual(drop_invalid(inp), expected)",
      },
      explanation:
        'The test builds a two-row input where one row is invalid, runs the transform, and asserts only the valid row survives — no cluster data, no side effects.',
    },
    {
      id: 'concept-unit-vs-integration',
      type: 'concept',
      title: 'Unit vs integration tests',
      body: '**Unit tests** check one transform in isolation on synthetic data — fast, run in CI on every commit. **Integration tests** run the *assembled* pipeline end to end against a realistic (often sampled) dataset, verifying the pieces work together and the final table’s schema and counts are right.\n\nYou want many fast unit tests and a few thorough integration tests. The built-in **debugger** helps when a test fails — step through the failing transform to see where the data went wrong.',
      takeaways: [
        'Unit: one transform, synthetic input, runs constantly.',
        'Integration: whole pipeline, realistic data, runs less often.',
        'Use the debugger to step through a failing transform.',
      ],
    },
    {
      id: 'tf-schema',
      type: 'truefalse',
      statement:
        'assertDataFrameEqual passing guarantees the two DataFrames also have identical schemas including nullability.',
      answer: false,
      explanation:
        'Row-equality and schema-equality are separate concerns. Use `assertSchemaEqual` to assert column names, types, and nullability explicitly — a rename or type change is a schema issue.',
    },
    {
      id: 'mcq-testing',
      type: 'mcq',
      question:
        'You want CI to fail if a refactor changes a transform’s output columns or types, without running the whole pipeline. What’s the best approach?',
      options: [
        {
          id: 'a',
          text: 'Unit-test the transform on a small DataFrame and assert with assertSchemaEqual (and assertDataFrameEqual for values).',
        },
        {
          id: 'b',
          text: 'Run the full pipeline nightly and eyeball the output table.',
        },
        { id: 'c', text: 'Add a comment documenting the expected schema.' },
        { id: 'd', text: 'Only check row counts after each production run.' },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'Correct — a fast unit test with assertSchemaEqual catches column/type/nullability drift in CI, before deploy.',
        b: 'Eyeballing nightly output is slow, manual, and catches problems after they ship.',
        c: 'A comment enforces nothing.',
        d: 'Row counts miss schema changes entirely (the amt→amount case).',
      },
      explanation:
        'Schema drift is caught cheaply by a unit test using `assertSchemaEqual` on a small input — deterministic and CI-friendly.',
      examObjective:
        'Develop unit and integration tests using assertDataFrameEqual, assertSchemaEqual, DataFrame.transform, and testing frameworks to ensure code correctness.',
    },
    {
      id: 'flash-assertions',
      type: 'flashcard',
      front: 'Which helper checks column names/types/nullability, and which checks row values?',
      back: '`assertSchemaEqual` checks the **schema**; `assertDataFrameEqual` checks the **rows/values**.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now test a pipeline',
      points: [
        'Build pipelines from pure `DataFrame.transform` steps you can call in tests.',
        '`assertDataFrameEqual` checks rows; `assertSchemaEqual` checks the schema.',
        'Unit-test transforms on tiny synthetic DataFrames in CI.',
        'Integration-test the assembled pipeline on realistic data.',
        'Use the debugger to step through a failing transform.',
      ],
      closing: 'Next module: getting every data format into the lakehouse. 📥',
    },
  ],
}
