'use client';

import { useState, type FormEvent } from 'react';
import { Loader2, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input, Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { ApiTaskPriority } from '@/lib/tasks';
import { PRIORITY_LABEL, PRIORITY_ORDER } from '@/lib/ui-labels';

interface AddTaskFormProps {
  onSubmit: (input: {
    title: string;
    description?: string;
    dueDate?: string;
    priority?: ApiTaskPriority;
  }) => Promise<void>;
}

export function AddTaskForm({ onSubmit }: AddTaskFormProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<ApiTaskPriority | ''>('');
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
        priority: priority || undefined,
      });
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('');
      setOpen(false);
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) {
    return (
      <Button variant="primary" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        Görev Ekle
      </Button>
    );
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-3 py-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-semibold text-ink-900">Yeni görev</h3>
            <Button type="button" variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Kapat">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Görev başlığı"
            required
            autoFocus
          />
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Açıklama (opsiyonel)"
            rows={3}
          />
          <div className="flex flex-wrap items-center gap-3">
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-auto"
            />
            <Select
              value={priority}
              onChange={(e) => setPriority(e.target.value as ApiTaskPriority | '')}
              className="w-auto"
            >
              <option value="">Öncelik yok</option>
              {PRIORITY_ORDER.map((p) => (
                <option key={p} value={p}>
                  {PRIORITY_LABEL[p]}
                </option>
              ))}
            </Select>
            <Button type="submit" variant="primary" size="sm" className="ml-auto" disabled={submitting || !title.trim()}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Ekle
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
