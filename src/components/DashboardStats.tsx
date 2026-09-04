import { CalendarCheck, CheckCircle2, Clock, ListTodo, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
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
          { label: 'Toplam Görev', value: String(stats.total), icon: ListTodo, tone: 'neutral' },
          { label: 'Devam Eden', value: String(stats.inProgress), icon: Clock, tone: 'accent' },
          { label: 'Tamamlanan', value: String(stats.done), icon: CheckCircle2, tone: 'success' },
          { label: 'Tamamlanma Oranı', value: `%${stats.completionRate}`, icon: TrendingUp, tone: 'accent' },
          { label: 'Bugün Tamamlanan', value: String(stats.doneToday), icon: CalendarCheck, tone: 'success' },
          { label: 'Son 7 Gün', value: String(stats.doneLast7Days), icon: CalendarCheck, tone: 'neutral' },
        ]}
      />
      <Card>
        <CardHeader>
          <CardTitle>Son 14 günde tamamlanan görevler</CardTitle>
        </CardHeader>
        <CardContent>
          <DailyCompletionChart data={series} />
        </CardContent>
      </Card>
    </section>
  );
}
