/** MethaTwin cover: the plant chain, from feed to economics, with one headline figure per stage. */
const STAGES = [
  { tag: "01", name: "Feed", value: "Slurry + silage", note: "3 literature feeds" },
  { tag: "02", name: "Digester", value: "36/36", note: "ADM1 vs BSM2, within 1 %" },
  { tag: "03", name: "Upgrading", value: "0.46 % CO₂", note: "DWSIM water scrubbing" },
  { tag: "04", name: "ML surrogate", value: "R² 0.992–0.999", note: "2,000 simulations" },
  { tag: "05", name: "Economics", value: "140–157 €/MWh", note: "Verified optima" },
];

export function MethaTwinChain() {
  return (
    <div className="w-full">
      <p className="mb-5 font-mono text-[0.6875rem] text-muted">Digital twin · 200 Nm³/h biomethane plant, digester to gas grid</p>
      <ol className="grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-5">
        {STAGES.map((s, i) => (
          <li key={s.tag} className="relative bg-bg-deep p-4">
            <span className="font-mono text-[0.6875rem] text-accent">{s.tag}</span>
            <p className="mt-2 text-[0.8125rem] text-muted">{s.name}</p>
            <p className="mt-1 text-[0.9375rem] leading-snug font-medium text-ink">{s.value}</p>
            <p className="mt-2 text-[0.75rem] leading-snug text-muted">{s.note}</p>
            {i < STAGES.length - 1 && (
              <span aria-hidden className="absolute top-1/2 -right-2 z-10 hidden -translate-y-1/2 text-accent sm:block">
                →
              </span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
