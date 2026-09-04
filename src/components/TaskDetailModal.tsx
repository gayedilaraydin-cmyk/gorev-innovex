'use client';

import { useState, type FormEvent } from 'react';
import { Loader2, MessageCircle, Send, Trash2, X } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { ApiTask, ApiTaskDepartment, ApiTaskPriority } from '@/lib/tasks';
import {
  DEPARTMENT_LABEL,
  DEPARTMENT_ORDER,
  PRIORITY_LABEL,
  PRIORITY_ORDER,
  STATUS_LABEL,
  formatDateTime,
  isUrgentPriority,
} from '@/lib/ui-labels';
import type { TaskEditInput } from '@/components/TaskBoard';

interface TaskDetailModalProps {
  task: ApiTask;
  editable: boolean;
  onClose: () => void;
  onSave?: (input: TaskEditInput) => void;
  onDelete?: () => void;
  onAddComment?: (body: string) => Promise<void>;
}

export function TaskDetailModal({ task, editable, onClose, onSave, onDelete, onAddComment }: TaskDetailModalProps) {
  const isNotesCard = task.status === 'meeting_notes';
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? '');
  const [dueDate, setDueDate] = useState(task.dueDate ? task.dueDate.slice(0, 10) : '');
  const [priority, setPriority] = useState<ApiTaskPriority | ''>(task.priority ?? '');
  const [departments, setDepartments] = useState<ApiTaskDepartment[]>(task.departments);
  const [commentBody, setCommentBody] = useState('');
  const [postingComment, setPostingComment] = useState(false);

  function toggleDepartment(d: ApiTaskDepartment) {
    setDepartments((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));
  }

  function handleSave() {
    if (!title.trim() || !onSave) return;
    onSave({
      title: title.trim(),
      description: description.trim() || null,
      dueDate: dueDate || null,
      priority: priority || null,
      departments,
    });
    onClose();
  }

  async function handleAddComment(event: FormEvent) {
    event.preventDefault();
    if (!commentBody.trim() || !onAddComment) return;
    setPostingComment(true);
    try {
      await onAddComment(commentBody.trim());
      setCommentBody('');
    } finally {
      setPostingComment(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-[2px]" onClick={onClose} aria-hidden="true" />

      <div className="relative flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-[var(--shadow-raised)]">
        <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
          <div className="min-w-0 flex-1">
            <Badge tone="neutral" className="mb-2">
              {STATUS_LABEL[task.status]}
            </Badge>
            {editable ? (
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-9 text-base font-semibold"
              />
            ) : (
              <h2 className="font-display text-base font-semibold text-ink-900">{task.title}</h2>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {editable && onDelete && (
              <Button
                variant="danger-ghost"
                size="icon"
                onClick={() => {
                  onDelete();
                  onClose();
                }}
                aria-label="Görevi sil"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Kapat">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="space-y-4 px-5 py-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-600">
                {isNotesCard ? 'Notlar' : 'Açıklama'}
              </label>
              {editable ? (
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={isNotesCard ? 6 : 3}
                  placeholder={isNotesCard ? 'Toplantı notlarını buraya yaz…' : 'Açıklama (opsiyonel)'}
                />
              ) : task.description ? (
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-700">{task.description}</p>
              ) : (
                <p className="text-sm text-ink-400">Boş</p>
              )}
            </div>

            <div className="flex flex-wrap gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink-600">Termin</label>
                {editable ? (
                  <Input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="h-9 w-auto"
                  />
                ) : (
                  <p className="text-sm text-ink-700">{task.dueDate ? formatDateTime(task.dueDate) : '—'}</p>
                )}
              </div>
              <div className="min-w-[180px] flex-1">
                <label className="mb-1.5 block text-xs font-medium text-ink-600">Öncelik</label>
                {editable ? (
                  <Select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as ApiTaskPriority | '')}
                    className="h-9"
                  >
                    <option value="">Öncelik yok</option>
                    {PRIORITY_ORDER.map((p) => (
                      <option key={p} value={p}>
                        {PRIORITY_LABEL[p]}
                      </option>
                    ))}
                  </Select>
                ) : task.priority ? (
                  <Badge tone={isUrgentPriority(task.priority) ? 'danger' : 'neutral'}>
                    {PRIORITY_LABEL[task.priority]}
                  </Badge>
                ) : (
                  <p className="text-sm text-ink-400">—</p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-600">Departman</label>
              {editable ? (
                <div className="flex flex-wrap gap-1.5">
                  {DEPARTMENT_ORDER.map((d) => {
                    const selected = departments.includes(d);
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => toggleDepartment(d)}
                        className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                          selected
                            ? 'border-accent bg-accent-soft text-accent'
                            : 'border-border bg-surface text-ink-600 hover:bg-surface-2'
                        }`}
                      >
                        {DEPARTMENT_LABEL[d]}
                      </button>
                    );
                  })}
                </div>
              ) : task.departments.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {task.departments.map((d) => (
                    <Badge key={d} tone="neutral">
                      {DEPARTMENT_LABEL[d]}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-ink-400">—</p>
              )}
            </div>

            {editable && (
              <Button variant="primary" size="sm" onClick={handleSave} disabled={!title.trim()}>
                Kaydet
              </Button>
            )}

            <div className="border-t border-border pt-4">
              <h3 className="mb-3 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-ink-400">
                <MessageCircle className="h-3.5 w-3.5" />
                Yorumlar {task.comments.length > 0 && `(${task.comments.length})`}
              </h3>

              {task.comments.length === 0 ? (
                <p className="text-sm text-ink-400">Henüz yorum yok.</p>
              ) : (
                <ul className="space-y-3">
                  {task.comments.map((comment) => (
                    <li key={comment.id} className="rounded-lg bg-surface-2 px-3 py-2.5">
                      <p className="text-sm leading-relaxed text-ink-800">{comment.body}</p>
                      <p className="mt-1 text-[11px] text-ink-400">{formatDateTime(comment.createdAt)}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {editable && onAddComment && (
          <form onSubmit={handleAddComment} className="border-t border-border p-3">
            <div className="flex items-end gap-2">
              <Textarea
                value={commentBody}
                onChange={(e) => setCommentBody(e.target.value)}
                placeholder="Bir yorum yaz…"
                rows={1}
                className="min-h-[38px] py-2"
              />
              <Button
                type="submit"
                variant="primary"
                size="icon"
                disabled={postingComment || !commentBody.trim()}
                aria-label="Yorum ekle"
              >
                {postingComment ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
