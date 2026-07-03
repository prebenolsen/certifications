/**
 * Managed vs external tables: what DROP TABLE deletes in each case.
 * The key teaching point — managed = Databricks owns the data files;
 * external = you own them, so DROP only removes the metadata pointer.
 */
export function ManagedVsExternalDiagram() {
  return (
    <svg
      viewBox="0 0 560 280"
      className="h-auto w-full"
      role="img"
      aria-label="Managed tables store data in Databricks-managed storage and DROP deletes the files; external tables point to your own storage and DROP keeps the files"
    >
      {/* Managed */}
      <rect x="16" y="16" width="252" height="248" rx="12" fill="#fce8e4" stroke="#e2492e" strokeWidth="1.5" />
      <text x="32" y="42" fontSize="14" fontWeight="700" fill="#b83a24">Managed table</text>
      <rect x="32" y="56" width="220" height="46" rx="8" fill="#ffffff" stroke="#f0b8ac" />
      <text x="44" y="76" fontSize="12" fill="#0f172a">Metadata (Unity Catalog)</text>
      <text x="44" y="93" fontSize="11" fill="#64748b">name, schema, location</text>
      <line x1="142" y1="102" x2="142" y2="124" stroke="#94a3b8" strokeWidth="1.5" />
      <rect x="32" y="124" width="220" height="60" rx="8" fill="#ffffff" stroke="#f0b8ac" />
      <text x="44" y="146" fontSize="12" fill="#0f172a">Data files (Databricks-owned)</text>
      <text x="44" y="164" fontSize="11" fill="#64748b">managed storage location</text>
      <rect x="32" y="200" width="220" height="46" rx="8" fill="#fee2e2" stroke="#dc2626" />
      <text x="44" y="222" fontSize="12" fontWeight="700" fill="#dc2626">DROP TABLE →</text>
      <text x="44" y="239" fontSize="11" fill="#991b1b">metadata AND files deleted</text>

      {/* External */}
      <rect x="292" y="16" width="252" height="248" rx="12" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.5" />
      <text x="308" y="42" fontSize="14" fontWeight="700" fill="#15803d">External table</text>
      <rect x="308" y="56" width="220" height="46" rx="8" fill="#ffffff" stroke="#a7e3ba" />
      <text x="320" y="76" fontSize="12" fill="#0f172a">Metadata (Unity Catalog)</text>
      <text x="320" y="93" fontSize="11" fill="#64748b">name, schema, pointer →</text>
      <line x1="418" y1="102" x2="418" y2="124" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 3" />
      <rect x="308" y="124" width="220" height="60" rx="8" fill="#ffffff" stroke="#a7e3ba" />
      <text x="320" y="146" fontSize="12" fill="#0f172a">Data files (YOUR storage)</text>
      <text x="320" y="164" fontSize="11" fill="#64748b">e.g. your own S3 bucket</text>
      <rect x="308" y="200" width="220" height="46" rx="8" fill="#dcfce7" stroke="#16a34a" />
      <text x="320" y="222" fontSize="12" fontWeight="700" fill="#15803d">DROP TABLE →</text>
      <text x="320" y="239" fontSize="11" fill="#166534">metadata only; files remain</text>
    </svg>
  )
}
