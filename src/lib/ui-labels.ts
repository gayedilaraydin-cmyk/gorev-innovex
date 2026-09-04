import type { ApiTaskDepartment, ApiTaskPriority, ApiTaskStatus } from '@/lib/tasks';

export const STATUS_LABEL: Record<ApiTaskStatus, string> = {
  todo: 'Yapılacaklar',
  in_progress: 'Devam Edenler',
  waiting_client: 'Müşteriden Bekleniyor',
  waiting_team: 'Ekipten Bekleniyor',
  done: 'Tamamlananlar',
  cancelled: 'İptal Edilenler',
  meeting_notes: 'Toplantı Notları',
};

export const STATUS_ORDER: ApiTaskStatus[] = [
  'todo',
  'in_progress',
  'waiting_client',
  'waiting_team',
  'done',
  'cancelled',
  'meeting_notes',
];

export const PRIORITY_LABEL: Record<ApiTaskPriority, string> = {
  urgent: 'Acil',
  not_urgent: 'Acil Değil',
  urgent_hard: 'Acil ve Zor',
  urgent_easy: 'Acil ve Kolay',
  not_urgent_hard: 'Acil Değil ve Zor',
  not_urgent_easy: 'Acil Değil ve Kolay',
};

export const PRIORITY_ORDER: ApiTaskPriority[] = [
  'urgent',
  'urgent_hard',
  'urgent_easy',
  'not_urgent',
  'not_urgent_hard',
  'not_urgent_easy',
];

// "Acil" içeren öncelikler kırmızı (danger) tonda, diğerleri nötr gösterilir.
export function isUrgentPriority(priority: ApiTaskPriority): boolean {
  return priority === 'urgent' || priority === 'urgent_hard' || priority === 'urgent_easy';
}

export const DEPARTMENT_LABEL: Record<ApiTaskDepartment, string> = {
  advertising: 'Reklam',
  business_dev: 'İş Geliştirme',
  design: 'Tasarım',
  content: 'İçerik',
  finance: 'Finans',
};

export const DEPARTMENT_ORDER: ApiTaskDepartment[] = [
  'advertising',
  'business_dev',
  'design',
  'content',
  'finance',
];

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

// Yorumlarda tarih mutlaka görünür olmalı — bu yüzden tarih + saat birlikte.
export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('tr-TR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
