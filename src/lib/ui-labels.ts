import type { ApiTaskStatus } from '@/lib/tasks';

export const STATUS_LABEL: Record<ApiTaskStatus, string> = {
  todo: 'Yapılacaklar',
  in_progress: 'Devam Edenler',
  done: 'Tamamlananlar',
  pending: 'Bekleyenler',
  cancelled: 'İptal Edilenler',
  meeting_notes: 'Toplantı Notları',
};

export const STATUS_ORDER: ApiTaskStatus[] = [
  'todo',
  'in_progress',
  'done',
  'pending',
  'cancelled',
  'meeting_notes',
];

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
