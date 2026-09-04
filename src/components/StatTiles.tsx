import type { LucideIcon } from 'lucide-react';

type Tone = 'neutral' | 'accent' | 'success';

const toneClasses: Record<Tone, string> = {
  neutral: 'bg-surface-2 text-ink-700',
  accent: 'bg-accent-soft text-accent',
  success: 'bg-success-soft text-success',
};

export interface StatTileItem {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: Tone;
}

export function StatTiles({ items }: { items: StatTileItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-border bg-surface p-4 shadow-[var(--shadow-card)]"
        >
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-lg ${toneClasses[item.tone ?? 'neutral']}`}
          >
            <item.icon className="h-4 w-4" />
          </span>
          <p className="mt-3 font-display text-2xl font-bold tabular-nums text-ink-900">{item.value}</p>
          <p className="mt-0.5 text-xs text-ink-600">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
