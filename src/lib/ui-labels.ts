import type { ApiTaskStatus } from '@/lib/tasks';

export const STATUS_LABEL: Record<ApiTaskStatus, string> = {
  todo: 'Yapılacak',
  in_progress: 'Devam Ediyor',
  done: 'Tamamlandı',
};

export const STATUS_ORDER: ApiTaskStatus[] = ['todo', 'in_progress', 'done'];

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
