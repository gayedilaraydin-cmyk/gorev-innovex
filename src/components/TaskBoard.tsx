'use client';

import { Calendar, Sparkles, Trash2 } from 'lucide-react';
import type { ApiTask, ApiTaskStatus } from '@/lib/tasks';
import { STATUS_LABEL, STATUS_ORDER, formatDate } from '@/lib/ui-labels';

const STATUS_DOT: Record<ApiTaskStatus, string> = {
  todo: 'bg-ink-400',
  in_progress: 'bg-accent',
  done: 'bg-success',
};

interface TaskBoardProps {
  tasks: ApiTask[];
  editable: boolean;
  onStatusChange?: (taskId: string, status: ApiTaskStatus) => void;
  onDelete?: (taskId: string) => void;
}

export function TaskBoard({ tasks, editable, onStatusChange, onDelete }: TaskBoardProps) {
  const columns: Record<ApiTaskStatus, ApiTask[]> = { todo: [], in_progress: [], done: [] };
  for (const task of tasks) columns[task.status].push(task);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {STATUS_ORDER.map((status) => (
        <div key={status} className="rounded-lg border border-border bg-surface">
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <span className={`h-2 w-2 rounded-full ${STATUS_DOT[status]}`} />
            <h3 className="font-display text-sm font-semibold text-ink-900">{STATUS_LABEL[status]}</h3>
            <span className="ml-auto text-xs text-ink-400">{columns[status].length}</span>
          </div>
          <div className="space-y-3 p-3">
            {columns[status].length === 0 ? (
              <p className="py-8 text-center text-xs text-ink-400">Bu sütunda görev yok</p>
            ) : (
              columns[status].map((task) => (
                <div key={task.id} className="space-y-2 rounded-md border border-border bg-surface-2/40 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium leading-snug text-ink-900">{task.title}</p>
                    {editable && onDelete && (
                      <button
                        onClick={() => onDelete(task.id)}
                        aria-label="Görevi sil"
                        className="shrink-0 rounded p-1 text-ink-400 hover:bg-danger-soft hover:text-danger"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  {task.description && (
                    <p className="text-xs leading-relaxed text-ink-600">{task.description}</p>
                  )}

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {task.source === 'ai' ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-medium text-accent">
                        <Sparkles className="h-3 w-3" />
                        Claude
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-ink-600">
                        Manuel
                      </span>
                    )}
                    {task.dueDate && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-ink-400">
                        <Calendar className="h-3 w-3" />
                        {formatDate(task.dueDate)}
                      </span>
                    )}
                  </div>

                  {editable && onStatusChange && (
                    <select
                      value={task.status}
                      onChange={(e) => onStatusChange(task.id, e.target.value as ApiTaskStatus)}
                      className="mt-1 h-8 w-full rounded-md border border-border bg-surface px-2 text-xs text-ink-900 focus:border-accent"
                    >
                      {STATUS_ORDER.map((s) => (
                        <option key={s} value={s}>
                          {STATUS_LABEL[s]}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
