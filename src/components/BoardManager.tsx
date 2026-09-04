'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { AddTaskForm } from '@/components/AddTaskForm';
import { CopyLinkButton } from '@/components/CopyLinkButton';
import { TaskBoard } from '@/components/TaskBoard';
import type { ApiTask, ApiTaskStatus } from '@/lib/tasks';

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

  async function handleAdd(input: { title: string; description?: string; dueDate?: string }) {
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
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link href="/" className="mb-4 inline-flex items-center gap-1.5 text-sm text-ink-600 hover:text-ink-900">
        <ArrowLeft className="h-3.5 w-3.5" />
        Panolar
      </Link>

      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-xl font-semibold text-ink-900">{boardName}</h1>
        <div className="flex items-center gap-2">
          <code className="max-w-[260px] truncate rounded-md bg-surface-2 px-2.5 py-1.5 font-[family-name:var(--font-mono-link)] text-xs text-ink-700">
            {publicLink}
          </code>
          <CopyLinkButton value={publicLink} />
        </div>
      </header>

      {error && <p className="mb-4 rounded-md bg-danger-soft px-3 py-2 text-sm text-danger">{error}</p>}

      <div className="mb-6">
        <AddTaskForm onSubmit={handleAdd} />
      </div>

      <TaskBoard tasks={tasks} editable onStatusChange={handleStatusChange} onDelete={handleDelete} />
    </div>
  );
}
