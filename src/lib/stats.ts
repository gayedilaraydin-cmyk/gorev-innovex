import type { ApiTask } from '@/lib/tasks';

const TIMEZONE = 'Europe/Istanbul';

function dateKey(iso: string): string {
  // en-CA -> YYYY-MM-DD, gün sınırlarını Türkiye saatine göre hesaplamak için.
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(iso));
}

function isWithinLastDays(iso: string, days: number): boolean {
  return new Date(iso).getTime() >= Date.now() - days * 24 * 60 * 60 * 1000;
}

export interface TaskStatsSummary {
  total: number;
  done: number;
  inProgress: number;
  completionRate: number;
  doneToday: number;
  doneLast7Days: number;
  doneLast30Days: number;
}

export function summarizeTasks(tasks: ApiTask[]): TaskStatsSummary {
  const total = tasks.length;
  const doneTasks = tasks.filter((t) => t.status === 'done');
  const done = doneTasks.length;
  const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
  const todayKey = dateKey(new Date().toISOString());

  return {
    total,
    done,
    inProgress,
    completionRate: total > 0 ? Math.round((done / total) * 100) : 0,
    doneToday: doneTasks.filter((t) => dateKey(t.updatedAt) === todayKey).length,
    doneLast7Days: doneTasks.filter((t) => isWithinLastDays(t.updatedAt, 7)).length,
    doneLast30Days: doneTasks.filter((t) => isWithinLastDays(t.updatedAt, 30)).length,
  };
}

export interface DailyCompletionPoint {
  date: string; // YYYY-MM-DD (Europe/Istanbul)
  count: number;
}

// Son `days` gün için, her gün tamamlanan görev sayısı (en eski gün önce).
// `updatedAt`, bir görevin en son ne zaman DONE durumuna geçtiğinin
// yaklaşık göstergesi olarak kullanılıyor.
export function dailyCompletionSeries(tasks: ApiTask[], days = 14): DailyCompletionPoint[] {
  const doneTasks = tasks.filter((t) => t.status === 'done');
  const counts = new Map<string, number>();

  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    counts.set(dateKey(d.toISOString()), 0);
  }

  for (const task of doneTasks) {
    const key = dateKey(task.updatedAt);
    if (counts.has(key)) counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return Array.from(counts.entries()).map(([date, count]) => ({ date, count }));
}
