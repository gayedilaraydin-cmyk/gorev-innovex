import { CalendarCheck, CheckCircle2, ListTodo, TrendingUp } from 'lucide-react';
import { StatTiles } from '@/components/StatTiles';
import type { TaskStatsSummary } from '@/lib/stats';

export function BoardStatsSummary({ stats }: { stats: TaskStatsSummary }) {
  return (
    <StatTiles
      items={[
        { label: 'Toplam Görev', value: String(stats.total), icon: ListTodo, tone: 'neutral' },
        { label: 'Tamamlanan', value: String(stats.done), icon: CheckCircle2, tone: 'success' },
        { label: 'Tamamlanma Oranı', value: `%${stats.completionRate}`, icon: TrendingUp, tone: 'accent' },
        { label: 'Bugün Tamamlanan', value: String(stats.doneToday), icon: CalendarCheck, tone: 'success' },
        { label: 'Son 7 Gün', value: String(stats.doneLast7Days), icon: CalendarCheck, tone: 'neutral' },
        { label: 'Son 30 Gün', value: String(stats.doneLast30Days), icon: CalendarCheck, tone: 'neutral' },
      ]}
    />
  );
}
