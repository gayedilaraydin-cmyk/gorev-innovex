import { DailyCompletionChart } from '@/components/DailyCompletionChart';
import { StatTiles } from '@/components/StatTiles';
import type { DailyCompletionPoint, TaskStatsSummary } from '@/lib/stats';

export function DashboardStats({
  stats,
  series,
}: {
  stats: TaskStatsSummary;
  series: DailyCompletionPoint[];
}) {
  return (
    <section className="mb-8 space-y-4">
      <StatTiles
        items={[
          { label: 'Toplam Görev', value: String(stats.total) },
          { label: 'Devam Eden', value: String(stats.inProgress) },
          { label: 'Tamamlanan', value: String(stats.done) },
          { label: 'Tamamlanma Oranı', value: `%${stats.completionRate}` },
          { label: 'Bugün Tamamlanan', value: String(stats.doneToday) },
          { label: 'Son 7 Gün', value: String(stats.doneLast7Days) },
        ]}
      />
      <div className="rounded-lg border border-border bg-surface p-4">
        <h2 className="mb-3 font-display text-sm font-semibold text-ink-900">
          Son 14 günde tamamlanan görevler
        </h2>
        <DailyCompletionChart data={series} />
      </div>
    </section>
  );
}
