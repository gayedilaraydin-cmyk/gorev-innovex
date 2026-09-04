'use client';

import { useState, type FormEvent } from 'react';
import { Loader2, Plus, X } from 'lucide-react';

interface AddTaskFormProps {
  onSubmit: (input: { title: string; description?: string; dueDate?: string }) => Promise<void>;
}

export function AddTaskForm({ onSubmit }: AddTaskFormProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        dueDate: dueDate || undefined,
      });
      setTitle('');
      setDescription('');
      setDueDate('');
      setOpen(false);
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex h-9 items-center gap-2 rounded-full bg-accent px-4 text-sm font-medium text-accent-ink hover:opacity-90"
      >
        <Plus className="h-4 w-4" />
        Görev Ekle
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-lg border border-border bg-surface p-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-ink-900">Yeni görev</h3>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded p-1 text-ink-400 hover:bg-surface-2"
          aria-label="Kapat"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Görev başlığı"
        required
        autoFocus
        className="h-9 w-full rounded-md border border-border bg-surface px-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-accent"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Açıklama (opsiyonel)"
        rows={3}
        className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-accent"
      />
      <div className="flex items-center gap-3">
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="h-9 rounded-md border border-border bg-surface px-3 text-sm text-ink-900 focus:border-accent"
        />
        <button
          type="submit"
          disabled={submitting || !title.trim()}
          className="ml-auto inline-flex h-9 items-center gap-2 rounded-md bg-accent px-4 text-sm font-medium text-accent-ink hover:opacity-90 disabled:opacity-50"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Ekle
        </button>
      </div>
    </form>
  );
}
