import type { Task } from '@prisma/client';

export type ApiTaskStatus =
  | 'todo'
  | 'in_progress'
  | 'done'
  | 'pending'
  | 'cancelled'
  | 'meeting_notes';
export type ApiTaskSource = 'manual' | 'ai';

export interface ApiTask {
  id: string;
  title: string;
  description: string | null;
  status: ApiTaskStatus;
  source: ApiTaskSource;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

const STATUS_TO_API: Record<Task['status'], ApiTaskStatus> = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  DONE: 'done',
  PENDING: 'pending',
  CANCELLED: 'cancelled',
  MEETING_NOTES: 'meeting_notes',
};

export const STATUS_FROM_API: Record<ApiTaskStatus, Task['status']> = {
  todo: 'TODO',
  in_progress: 'IN_PROGRESS',
  done: 'DONE',
  pending: 'PENDING',
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

export function serializeTask(task: Task): ApiTask {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: STATUS_TO_API[task.status],
    source: SOURCE_TO_API[task.source],
    dueDate: task.dueDate ? task.dueDate.toISOString() : null,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  };
}

const API_TASK_STATUSES: ApiTaskStatus[] = [
  'todo',
  'in_progress',
  'done',
  'pending',
  'cancelled',
  'meeting_notes',
];

export function isApiTaskStatus(value: unknown): value is ApiTaskStatus {
  return typeof value === 'string' && (API_TASK_STATUSES as string[]).includes(value);
}

export function isApiTaskSource(value: unknown): value is ApiTaskSource {
  return value === 'manual' || value === 'ai';
}
