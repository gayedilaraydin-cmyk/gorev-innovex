import { StatTiles } from '@/components/StatTiles';
import type { TaskStatsSummary } from '@/lib/stats';

export function BoardStatsSummary({ stats }: { stats: TaskStatsSummary }) {
  return (
    <StatTiles
      items={[
        { label: 'Toplam Görev', value: String(stats.total) },
        { label: 'Tamamlanan', value: String(stats.done) },
        { label: 'Tamamlanma Oranı', value: `%${stats.completionRate}` },
        { label: 'Bugün Tamamlanan', value: String(stats.doneToday) },
        { label: 'Son 7 Gün', value: String(stats.doneLast7Days) },
        { label: 'Son 30 Gün', value: String(stats.doneLast30Days) },
      ]}
    />
  );
}
