import type { Comment, Task } from '@prisma/client';

export type ApiTaskStatus =
  | 'todo'
  | 'in_progress'
  | 'waiting_client'
  | 'waiting_team'
  | 'done'
  | 'cancelled'
  | 'meeting_notes';
export type ApiTaskSource = 'manual' | 'ai';

// Aciliyet × zorluk sınıflandırması — durumdan (ApiTaskStatus) bağımsız,
// opsiyonel bir öncelik etiketi.
export type ApiTaskPriority =
  | 'urgent'
  | 'not_urgent'
  | 'urgent_hard'
  | 'urgent_easy'
  | 'not_urgent_hard'
  | 'not_urgent_easy';

// Görevin ilgili olduğu departman(lar) — çoklu seçilebilir.
export type ApiTaskDepartment = 'advertising' | 'business_dev' | 'design' | 'content' | 'finance';

export interface ApiComment {
  id: string;
  body: string;
  createdAt: string;
}

export interface ApiTask {
  id: string;
  title: string;
  description: string | null;
  status: ApiTaskStatus;
  source: ApiTaskSource;
  priority: ApiTaskPriority | null;
  departments: ApiTaskDepartment[];
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  comments: ApiComment[];
}

const STATUS_TO_API: Record<Task['status'], ApiTaskStatus> = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  WAITING_CLIENT: 'waiting_client',
  WAITING_TEAM: 'waiting_team',
  DONE: 'done',
  CANCELLED: 'cancelled',
  MEETING_NOTES: 'meeting_notes',
};

export const STATUS_FROM_API: Record<ApiTaskStatus, Task['status']> = {
  todo: 'TODO',
  in_progress: 'IN_PROGRESS',
  waiting_client: 'WAITING_CLIENT',
  waiting_team: 'WAITING_TEAM',
  done: 'DONE',
  cancelled: 'CANCELLED',
  meeting_notes: 'MEETING_NOTES',
};

const SOURCE_TO_API: Record<Task['source'], ApiTaskSource> = {
  MANUAL: 'manual',
  AI: 'ai',
};

export const SOURCE_FROM_API: Record<ApiTaskSource, Task['source']> = {
  manual: 'MANUAL',
  ai: 'AI',
};

const PRIORITY_TO_API: Record<NonNullable<Task['priority']>, ApiTaskPriority> = {
  URGENT: 'urgent',
  NOT_URGENT: 'not_urgent',
  URGENT_HARD: 'urgent_hard',
  URGENT_EASY: 'urgent_easy',
  NOT_URGENT_HARD: 'not_urgent_hard',
  NOT_URGENT_EASY: 'not_urgent_easy',
};

export const PRIORITY_FROM_API: Record<ApiTaskPriority, NonNullable<Task['priority']>> = {
  urgent: 'URGENT',
  not_urgent: 'NOT_URGENT',
  urgent_hard: 'URGENT_HARD',
  urgent_easy: 'URGENT_EASY',
  not_urgent_hard: 'NOT_URGENT_HARD',
  not_urgent_easy: 'NOT_URGENT_EASY',
};

const DEPARTMENT_TO_API: Record<Task['departments'][number], ApiTaskDepartment> = {
  ADVERTISING: 'advertising',
  BUSINESS_DEV: 'business_dev',
  DESIGN: 'design',
  CONTENT: 'content',
  FINANCE: 'finance',
};

export const DEPARTMENT_FROM_API: Record<ApiTaskDepartment, Task['departments'][number]> = {
  advertising: 'ADVERTISING',
  business_dev: 'BUSINESS_DEV',
  design: 'DESIGN',
  content: 'CONTENT',
  finance: 'FINANCE',
};

function serializeComment(comment: Comment): ApiComment {
  return {
    id: comment.id,
    body: comment.body,
    createdAt: comment.createdAt.toISOString(),
  };
}

// `comments` yalnızca sorguya `include: { comments: true }` eklendiğinde
// dolu gelir (bkz. her route'ta ilgili prisma çağrısı); eklenmediği
// yerlerde (ör. panolar-genel istatistik sorgusu) boş dizi varsayılır —
// o kullanımlar zaten yorumlara ihtiyaç duymuyor.
type TaskWithRelations = Task & { comments?: Comment[] };

export function serializeTask(task: TaskWithRelations): ApiTask {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: STATUS_TO_API[task.status],
    source: SOURCE_TO_API[task.source],
    priority: task.priority ? PRIORITY_TO_API[task.priority] : null,
    departments: task.departments.map((d) => DEPARTMENT_TO_API[d]),
    dueDate: task.dueDate ? task.dueDate.toISOString() : null,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
    comments: (task.comments ?? []).map(serializeComment),
  };
}

const API_TASK_STATUSES: ApiTaskStatus[] = [
  'todo',
  'in_progress',
  'waiting_client',
  'waiting_team',
  'done',
  'cancelled',
  'meeting_notes',
];

export function isApiTaskStatus(value: unknown): value is ApiTaskStatus {
  return typeof value === 'string' && (API_TASK_STATUSES as string[]).includes(value);
}

export function isApiTaskSource(value: unknown): value is ApiTaskSource {
  return value === 'manual' || value === 'ai';
}

const API_TASK_PRIORITIES: ApiTaskPriority[] = [
  'urgent',
  'not_urgent',
  'urgent_hard',
  'urgent_easy',
  'not_urgent_hard',
  'not_urgent_easy',
];

export function isApiTaskPriority(value: unknown): value is ApiTaskPriority {
  return typeof value === 'string' && (API_TASK_PRIORITIES as string[]).includes(value);
}

const API_TASK_DEPARTMENTS: ApiTaskDepartment[] = [
  'advertising',
  'business_dev',
  'design',
  'content',
  'finance',
];

export function isApiTaskDepartment(value: unknown): value is ApiTaskDepartment {
  return typeof value === 'string' && (API_TASK_DEPARTMENTS as string[]).includes(value);
}

export function isApiTaskDepartmentArray(value: unknown): value is ApiTaskDepartment[] {
  return Array.isArray(value) && value.every(isApiTaskDepartment);
}
