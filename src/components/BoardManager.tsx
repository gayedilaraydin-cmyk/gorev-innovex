'use client';

import { useState } from 'react';
import { AppHeader } from '@/components/AppHeader';
import { AddTaskForm } from '@/components/AddTaskForm';
import { BoardStatsSummary } from '@/components/BoardStatsSummary';
import { CopyLinkButton } from '@/components/CopyLinkButton';
import { TaskBoard, type TaskEditInput } from '@/components/TaskBoard';
import { ViewerPresenceBadge } from '@/components/ViewerPresenceBadge';
import { summarizeTasks } from '@/lib/stats';
import type { ApiTask, ApiTaskPriority, ApiTaskStatus } from '@/lib/tasks';

interface BoardManagerProps {
  boardId: string;
  boardName: string;
  slug: string;
  initialTasks: ApiTask[];
}

export function BoardManager({ boardId, boardName, slug, initialTasks }: BoardManagerProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [error, setError] = useState<string | null>(null);

  const publicLink = typeof window !== 'undefined' ? `${window.location.origin}/b/${slug}` : `/b/${slug}`;

  async function handleAdd(input: {
    title: string;
    description?: string;
    dueDate?: string;
    priority?: ApiTaskPriority;
  }) {
    const res = await fetch(`/api/boards/${boardId}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      setError('Görev eklenemedi.');
      return;
    }
    const { task } = (await res.json()) as { task: ApiTask };
    setTasks((prev) => [task, ...prev]);
  }

  async function handleStatusChange(taskId: string, status: ApiTaskStatus) {
    const previous = tasks;
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status } : t)));
    const res = await fetch(`/api/boards/${boardId}/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      setTasks(previous);
      setError('Durum güncellenemedi.');
    }
  }

  async function handleEdit(taskId: string, input: TaskEditInput) {
    const previous = tasks;
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, title: input.title, description: input.description, dueDate: input.dueDate, priority: input.priority }
          : t,
      ),
    );
    const res = await fetch(`/api/boards/${boardId}/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      setTasks(previous);
      setError('Görev güncellenemedi.');
    }
  }

  async function handleDelete(taskId: string) {
    const previous = tasks;
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    const res = await fetch(`/api/boards/${boardId}/tasks/${taskId}`, { method: 'DELETE' });
    if (!res.ok) {
      setTasks(previous);
      setError('Görev silinemedi.');
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      <AppHeader backHref="/" backLabel="Panolar" right={<ViewerPresenceBadge boardId={boardId} />} />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-xl font-semibold text-ink-900">{boardName}</h1>
          <div className="flex items-center gap-2">
            <code className="max-w-[260px] truncate rounded-lg bg-surface-2 px-3 py-2 font-[family-name:var(--font-mono-link)] text-xs text-ink-700">
              {publicLink}
            </code>
            <CopyLinkButton value={publicLink} />
          </div>
        </header>

        <div className="mb-6">
          <BoardStatsSummary stats={summarizeTasks(tasks)} />
        </div>

        {error && (
          <p className="mb-4 rounded-lg bg-danger-soft px-3.5 py-2.5 text-sm text-danger">{error}</p>
        )}

        <div className="mb-6">
          <AddTaskForm onSubmit={handleAdd} />
        </div>

        <TaskBoard
          tasks={tasks}
          editable
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </main>
    </div>
  );
}
