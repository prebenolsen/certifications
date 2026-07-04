import type { Lesson } from '@/types/content'

/**
 * Lesson: Python, Pandas (vectorized), and SQL UDFs.
 * Maps to exam Section 1 (develop User-Defined Functions using Pandas/Python UDF).
 */
export const pythonSqlUdfsLesson: Lesson = {
  id: 'python-sql-udfs',
  title: 'When you need a UDF',
  summary:
    'Row-at-a-time Python UDFs, vectorized Pandas UDFs, and SQL UDFs — the performance trade-offs, and why a built-in usually wins.',
  estimatedMinutes: 10,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'The transform that crawled',
      body: 'A custom scoring function written as a plain Python UDF turned a 3-minute job into a 40-minute one. The logic was fine — the *type* of UDF was the problem. Each row crossed the boundary between the JVM and Python one at a time.\n\nUDFs are sometimes unavoidable, but the kind you pick decides whether they cost you seconds or hours.',
      atWork:
        'The exam wants you to know the performance ladder: built-in > SQL UDF > Pandas UDF > Python UDF.',
    },
    {
      id: 'concept-python-udf',
      type: 'concept',
      title: 'Python UDFs: flexible but slow',
      body: 'A **Python UDF** runs your Python function **one row at a time**. Spark has to serialize each row from the JVM to a Python process, run your code, and serialize the result back. That per-row round trip is the bottleneck.\n\nUse them only when the logic can’t be expressed any other way, and never on the hot path if a vectorized option exists.',
      takeaways: [
        'Executes row-by-row with JVM↔Python serialization each row.',
        'Maximum flexibility, minimum speed.',
        'A last resort, not a default.',
      ],
    },
    {
      id: 'concept-pandas-udf',
      type: 'concept',
      title: 'Pandas UDFs: vectorized and fast',
      body: 'A **Pandas UDF** (vectorized UDF) receives a whole **batch** of rows as a pandas Series/DataFrame using Apache Arrow, runs your code once per batch, and returns a batch. Same Python flexibility, but the per-row serialization overhead is gone — often **10×+ faster** than a plain Python UDF.\n\nIf you must write Python logic over columns, make it a Pandas UDF.',
      takeaways: [
        'Operates on batches via Arrow, not row-by-row.',
        'Dramatically faster than a Python UDF.',
        'The right choice when custom Python is required.',
      ],
    },
    {
      id: 'concept-sql-udf',
      type: 'concept',
      title: 'SQL UDFs: reusable expressions',
      body: 'A **SQL UDF** wraps a SQL expression under a name, e.g. `CREATE FUNCTION mask_email(e STRING) RETURNS STRING RETURN …`. It runs **inside the engine** with no Python at all, so it’s fast and governable in Unity Catalog. Perfect for encapsulating reusable business logic (a masking rule, a tax calc) that’s expressible in SQL.',
      takeaways: [
        'Wraps a SQL expression as a named, reusable function.',
        'Runs in-engine — no serialization cost.',
        'Governed by Unity Catalog like any securable.',
      ],
    },
    {
      id: 'diagram-ladder',
      type: 'diagram',
      title: 'The performance ladder',
      spec: {
        kind: 'flow',
        steps: [
          { label: 'Built-in / SQL', sublabel: 'fastest — in-engine', tone: 'good' },
          { label: 'Pandas UDF', sublabel: 'vectorized (Arrow)', tone: 'accent' },
          { label: 'Python UDF', sublabel: 'row-at-a-time', tone: 'warn' },
        ],
        arrows: ['if no built-in', 'last resort'],
      },
      caption:
        'Climb down only when the rung above can’t express your logic.',
    },
    {
      id: 'mistake-udf-first',
      type: 'mistake',
      title: 'Reaching for a UDF first',
      myth: '“I need custom logic, so I’ll write a UDF.”',
      reality:
        'Check the **built-in functions** first — Spark has hundreds (`regexp_extract`, `date_trunc`, `transform`, `aggregate`, higher-order functions). Built-ins run in-engine and let the optimizer see through them; a UDF is a black box the optimizer can’t improve. Only write a UDF when no built-in combination works.',
    },
    {
      id: 'mcq-udf',
      type: 'mcq',
      question:
        'You must apply a custom Python scoring model to a column on a very large DataFrame, and no built-in expresses it. Which implementation performs best?',
      options: [
        { id: 'a', text: 'A vectorized Pandas UDF that processes batches via Arrow.' },
        { id: 'b', text: 'A plain Python UDF applied row by row.' },
        { id: 'c', text: 'Collect the column to the driver and score it in a Python loop.' },
        { id: 'd', text: 'A SQL UDF, even though the model logic isn’t expressible in SQL.' },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'Correct — a Pandas UDF keeps the Python logic but processes Arrow batches, avoiding per-row overhead.',
        b: 'A row-at-a-time Python UDF is exactly the slow path to avoid at scale.',
        c: 'Collecting a huge column to the driver will OOM and isn’t distributed.',
        d: 'A SQL UDF can’t host arbitrary Python model logic.',
      },
      explanation:
        'When custom Python is required over big data, a **vectorized Pandas UDF** is the fastest correct option; plain Python UDFs pay per-row serialization.',
      examObjective:
        'Develop User-Defined Functions (UDFs) using Pandas/Python UDF.',
    },
    {
      id: 'flash-pandas-vs-python',
      type: 'flashcard',
      front: 'Why is a Pandas UDF faster than a plain Python UDF?',
      back: 'It processes **batches** of rows via Arrow (vectorized) instead of serializing and running **one row at a time**.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now choose the right UDF',
      points: [
        'Built-ins and SQL UDFs run in-engine — fastest, optimizer-visible.',
        'Pandas UDFs vectorize custom Python over Arrow batches.',
        'Python UDFs run row-by-row — flexible but slow; last resort.',
        'Always check built-in functions before writing any UDF.',
        'Ladder: built-in/SQL → Pandas UDF → Python UDF.',
      ],
      closing: 'Next: proving your transforms are correct — testing an ETL pipeline. ✅',
    },
  ],
}
