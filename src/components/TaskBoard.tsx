'use client';

import { useState } from 'react';
import { Calendar, Check, Pencil, Sparkles, Trash2, X } from 'lucide-react';
import type { ApiTask, ApiTaskStatus } from '@/lib/tasks';
import { STATUS_LABEL, STATUS_ORDER, formatDate } from '@/lib/ui-labels';

const STATUS_DOT: Record<ApiTaskStatus, string> = {
  todo: 'bg-ink-400',
  in_progress: 'bg-accent',
  pending: 'bg-pending',
  done: 'bg-success',
  cancelled: 'bg-danger',
  meeting_notes: 'bg-ink-700',
};

export interface TaskEditInput {
  title: string;
  description: string | null;
  dueDate: string | null;
}

interface TaskBoardProps {
  tasks: ApiTask[];
  editable: boolean;
  onStatusChange?: (taskId: string, status: ApiTaskStatus) => void;
  onDelete?: (taskId: string) => void;
  onEdit?: (taskId: string, input: TaskEditInput) => void;
}

function TaskCard({
  task,
  editable,
  onStatusChange,
  onDelete,
  onEdit,
}: {
  task: ApiTask;
  editable: boolean;
  onStatusChange?: (taskId: string, status: ApiTaskStatus) => void;
  onDelete?: (taskId: string) => void;
  onEdit?: (taskId: string, input: TaskEditInput) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? '');
  const [dueDate, setDueDate] = useState(task.dueDate ? task.dueDate.slice(0, 10) : '');

  function handleSave() {
    if (!title.trim() || !onEdit) return;
    onEdit(task.id, {
      title: title.trim(),
      description: description.trim() || null,
      dueDate: dueDate || null,
    });
    setIsEditing(false);
  }

  function handleCancel() {
    setTitle(task.title);
    setDescription(task.description ?? '');
    setDueDate(task.dueDate ? task.dueDate.slice(0, 10) : '');
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <div className="space-y-2 rounded-md border border-accent/40 bg-surface p-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
          className="h-8 w-full rounded border border-border bg-surface px-2 text-sm font-medium text-ink-900 focus:border-accent"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          placeholder="Açıklama"
          className="w-full rounded border border-border bg-surface px-2 py-1.5 text-xs text-ink-700 focus:border-accent"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="h-8 rounded border border-border bg-surface px-2 text-xs text-ink-700 focus:border-accent"
        />
        <div className="flex justify-end gap-1.5 pt-1">
          <button
            onClick={handleCancel}
            aria-label="Vazgeç"
            className="inline-flex h-7 w-7 items-center justify-center rounded text-ink-400 hover:bg-surface-2"
          >
            <X className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            aria-label="Kaydet"
            className="inline-flex h-7 w-7 items-center justify-center rounded bg-accent text-accent-ink hover:opacity-90 disabled:opacity-50"
          >
            <Check className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2 rounded-md border border-border bg-surface-2/40 p-3">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium leading-snug text-ink-900">{task.title}</p>
        {editable && (
          <div className="-mr-1 -mt-1 flex shrink-0 items-center gap-0.5">
            {onEdit && (
              <button
                onClick={() => setIsEditing(true)}
                aria-label="Görevi düzenle"
                className="rounded p-1 text-ink-400 hover:bg-surface-2 hover:text-ink-700"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(task.id)}
                aria-label="Görevi sil"
                className="rounded p-1 text-ink-400 hover:bg-danger-soft hover:text-danger"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
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
  );
}

export function TaskBoard({ tasks, editable, onStatusChange, onDelete, onEdit }: TaskBoardProps) {
  const columns: Record<ApiTaskStatus, ApiTask[]> = {
    todo: [],
    in_progress: [],
    done: [],
    pending: [],
    cancelled: [],
    meeting_notes: [],
  };
  for (const task of tasks) columns[task.status].push(task);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                <TaskCard
                  key={task.id}
                  task={task}
                  editable={editable}
                  onStatusChange={onStatusChange}
                  onDelete={onDelete}
                  onEdit={onEdit}
                />
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
