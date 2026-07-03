/**
 * A minimal, dependency-free code block. We deliberately avoid a heavy syntax
 * highlighting library — for short SQL snippets a clean monospace block with a
 * language tag is clearer and keeps the bundle small.
 */
export function CodeBlock({
  language,
  content,
}: {
  language: string
  content: string
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900 text-left shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-700 px-4 py-2">
        <span className="font-mono text-xs uppercase tracking-wide text-slate-400">
          {language}
        </span>
        <span className="text-xs text-slate-500">code</span>
      </div>
      <pre className="overflow-x-auto px-4 py-3">
        <code className="font-mono text-sm leading-relaxed text-slate-100">
          {content}
        </code>
      </pre>
    </div>
  )
}
