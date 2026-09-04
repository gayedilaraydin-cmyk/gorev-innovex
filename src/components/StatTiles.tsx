export interface StatTileItem {
  label: string;
  value: string;
}

export function StatTiles({ items }: { items: StatTileItem[] }) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
      {items.map((item) => (
        <div key={item.label} className="rounded-lg border border-border bg-surface p-3">
          <p className="font-display text-xl font-bold tabular-nums text-ink-900">{item.value}</p>
          <p className="mt-0.5 text-[11px] leading-tight text-ink-600">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
