/**
 * The Unity Catalog 3-level namespace: catalog → schema → table.
 * Deliberately simple: boxes + labels that mirror `catalog.schema.table`.
 */
export function NamespaceDiagram() {
  return (
    <svg
      viewBox="0 0 520 260"
      className="h-auto w-full"
      role="img"
      aria-label="Unity Catalog three level namespace: catalog contains schemas, schemas contain tables and volumes"
    >
      {/* Catalog */}
      <rect x="20" y="20" width="480" height="220" rx="14" fill="#fce8e4" stroke="#e2492e" strokeWidth="2" />
      <text x="40" y="46" fontSize="15" fontWeight="700" fill="#b83a24">
        Catalog · main
      </text>

      {/* Schema A */}
      <rect x="40" y="60" width="210" height="160" rx="10" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.5" />
      <text x="56" y="84" fontSize="13" fontWeight="700" fill="#1e40af">
        Schema · sales
      </text>
      <rect x="56" y="98" width="178" height="34" rx="6" fill="#ffffff" stroke="#93c5fd" />
      <text x="68" y="120" fontSize="12" fill="#0f172a">▦ Table · orders</text>
      <rect x="56" y="140" width="178" height="34" rx="6" fill="#ffffff" stroke="#93c5fd" />
      <text x="68" y="162" fontSize="12" fill="#0f172a">▦ Table · customers</text>
      <rect x="56" y="182" width="178" height="30" rx="6" fill="#ffffff" stroke="#93c5fd" />
      <text x="68" y="202" fontSize="12" fill="#0f172a">🗀 Volume · raw_files</text>

      {/* Schema B */}
      <rect x="268" y="60" width="212" height="160" rx="10" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.5" />
      <text x="284" y="84" fontSize="13" fontWeight="700" fill="#15803d">
        Schema · marketing
      </text>
      <rect x="284" y="98" width="180" height="34" rx="6" fill="#ffffff" stroke="#86efac" />
      <text x="296" y="120" fontSize="12" fill="#0f172a">▦ Table · campaigns</text>
      <rect x="284" y="140" width="180" height="34" rx="6" fill="#ffffff" stroke="#86efac" />
      <text x="296" y="162" fontSize="12" fill="#0f172a">▧ View · active_leads</text>

      {/* Path label */}
      <text x="284" y="204" fontSize="12" fontFamily="monospace" fill="#334155">
        main.sales.orders
      </text>
    </svg>
  )
}
