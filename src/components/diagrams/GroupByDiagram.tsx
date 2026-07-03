/**
 * How GROUP BY collapses rows into one row per group before aggregating.
 * Left: raw rows. Middle: grouping. Right: one aggregated row per group.
 */
export function GroupByDiagram() {
  const rows = [
    { region: 'North', color: '#dbeafe' },
    { region: 'South', color: '#fef3c7' },
    { region: 'North', color: '#dbeafe' },
    { region: 'South', color: '#fef3c7' },
    { region: 'North', color: '#dbeafe' },
  ]
  return (
    <svg
      viewBox="0 0 560 260"
      className="h-auto w-full"
      role="img"
      aria-label="GROUP BY region collapses five customer rows into two grouped rows with counts: North 3, South 2"
    >
      {/* Input rows */}
      <text x="20" y="24" fontSize="13" fontWeight="700" fill="#334155">customers</text>
      {rows.map((r, i) => (
        <g key={i}>
          <rect x="20" y={36 + i * 34} width="150" height="28" rx="5" fill={r.color} stroke="#cbd5e1" />
          <text x="32" y={55 + i * 34} fontSize="12" fill="#0f172a">{r.region}</text>
        </g>
      ))}

      {/* Arrow + label */}
      <text x="230" y="120" fontSize="13" fontWeight="700" fill="#e2492e">GROUP BY region</text>
      <line x1="185" y1="130" x2="330" y2="130" stroke="#e2492e" strokeWidth="2" markerEnd="url(#arrow)" />
      <text x="205" y="152" fontSize="11" fill="#64748b">count(*)</text>
      <defs>
        <marker id="arrow" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
          <path d="M0,0 L7,3 L0,6 Z" fill="#e2492e" />
        </marker>
      </defs>

      {/* Output rows */}
      <text x="360" y="24" fontSize="13" fontWeight="700" fill="#334155">result</text>
      <rect x="360" y="36" width="180" height="28" rx="5" fill="#dbeafe" stroke="#93c5fd" />
      <text x="372" y="55" fontSize="12" fill="#0f172a">North — count 3</text>
      <rect x="360" y="70" width="180" height="28" rx="5" fill="#fef3c7" stroke="#fcd34d" />
      <text x="372" y="89" fontSize="12" fill="#0f172a">South — count 2</text>
    </svg>
  )
}
