'use client';

import { useState, type ReactNode } from 'react';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  type DraggableAttributes,
} from '@dnd-kit/core';
import { Calendar, Check, Flag, GripVertical, Pencil, Sparkles, Trash2, X } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { ApiTask, ApiTaskPriority, ApiTaskStatus } from '@/lib/tasks';
import {
  PRIORITY_LABEL,
  PRIORITY_ORDER,
  STATUS_LABEL,
  STATUS_ORDER,
  formatDate,
  isUrgentPriority,
} from '@/lib/ui-labels';

const STATUS_DOT: Record<ApiTaskStatus, string> = {
  todo: 'bg-ink-400',
  in_progress: 'bg-accent',
  waiting_client: 'bg-pending',
  waiting_team: 'bg-team',
  done: 'bg-success',
  cancelled: 'bg-danger',
  meeting_notes: 'bg-ink-700',
};

const STATUS_TINT: Record<ApiTaskStatus, string> = {
  todo: 'bg-surface-2',
  in_progress: 'bg-accent-soft',
  waiting_client: 'bg-pending-soft',
  waiting_team: 'bg-team-soft',
  done: 'bg-success-soft',
  cancelled: 'bg-danger-soft',
  meeting_notes: 'bg-surface-2',
};

export interface TaskEditInput {
  title: string;
  description: string | null;
  dueDate: string | null;
  priority: ApiTaskPriority | null;
}

interface TaskBoardProps {
  tasks: ApiTask[];
  editable: boolean;
  onStatusChange?: (taskId: string, status: ApiTaskStatus) => void;
  onDelete?: (taskId: string) => void;
  onEdit?: (taskId: string, input: TaskEditInput) => void;
}

function PriorityBadge({ priority }: { priority: ApiTaskPriority }) {
  return (
    <Badge tone={isUrgentPriority(priority) ? 'danger' : 'neutral'}>
      <Flag className="h-3 w-3" />
      {PRIORITY_LABEL[priority]}
    </Badge>
  );
}

function TaskCardBody({
  task,
  editable,
  isEditing,
  onStartEdit,
  onFinishEdit,
  onDelete,
  onEdit,
  dragAttributes,
  dragListeners,
}: {
  task: ApiTask;
  editable: boolean;
  isEditing: boolean;
  onStartEdit: () => void;
  onFinishEdit: () => void;
  onDelete?: (taskId: string) => void;
  onEdit?: (taskId: string, input: TaskEditInput) => void;
  dragAttributes?: DraggableAttributes;
  dragListeners?: Record<string, unknown>;
}) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? '');
  const [dueDate, setDueDate] = useState(task.dueDate ? task.dueDate.slice(0, 10) : '');
  const [priority, setPriority] = useState<ApiTaskPriority | ''>(task.priority ?? '');

  function handleSave() {
    if (!title.trim() || !onEdit) return;
    onEdit(task.id, {
      title: title.trim(),
      description: description.trim() || null,
      dueDate: dueDate || null,
      priority: priority || null,
    });
    onFinishEdit();
  }

  function handleCancel() {
    setTitle(task.title);
    setDescription(task.description ?? '');
    setDueDate(task.dueDate ? task.dueDate.slice(0, 10) : '');
    setPriority(task.priority ?? '');
    onFinishEdit();
  }

  if (isEditing) {
    return (
      <div className="space-y-2 rounded-lg border-2 border-accent/30 bg-surface p-3.5 shadow-[var(--shadow-raised)]">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
          className="h-8 text-sm font-medium"
        />
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          placeholder="Açıklama"
          className="py-1.5 text-xs"
        />
        <div className="flex items-center gap-1.5">
          <Input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="h-8 text-xs"
          />
          <Select
            value={priority}
            onChange={(e) => setPriority(e.target.value as ApiTaskPriority | '')}
            size="sm"
            className="flex-1"
          >
            <option value="">Öncelik yok</option>
            {PRIORITY_ORDER.map((p) => (
              <option key={p} value={p}>
                {PRIORITY_LABEL[p]}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex justify-end gap-1.5 pt-1">
          <Button variant="ghost" size="icon" onClick={handleCancel} aria-label="Vazgeç">
            <X className="h-3.5 w-3.5" />
          </Button>
          <Button variant="primary" size="icon" onClick={handleSave} disabled={!title.trim()} aria-label="Kaydet">
            <Check className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      {...dragAttributes}
      {...dragListeners}
      className={`group space-y-2.5 rounded-lg border border-border bg-surface p-3.5 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-raised)] ${
        dragListeners ? 'cursor-grab touch-none active:cursor-grabbing' : ''
      }`}
    >
      <div className="flex items-start gap-2">
        {editable && (
          <GripVertical className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-400/0 transition-colors group-hover:text-ink-400" />
        )}
        <p className="flex-1 text-sm font-medium leading-snug text-ink-900">{task.title}</p>
        {editable && (
          <div className="-mr-1 -mt-1 flex shrink-0 items-center gap-0.5 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={onStartEdit}
                aria-label="Görevi düzenle"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="danger-ghost"
                size="icon"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => onDelete(task.id)}
                aria-label="Görevi sil"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        )}
      </div>

      {task.description && (
        <p className="text-xs leading-relaxed text-ink-600">{task.description}</p>
      )}

      <div className="flex flex-wrap items-center gap-1.5">
        {task.source === 'ai' ? (
          <Badge tone="accent">
            <Sparkles className="h-3 w-3" />
            Claude
          </Badge>
        ) : (
          <Badge tone="neutral">Manuel</Badge>
        )}
        {task.priority && <PriorityBadge priority={task.priority} />}
        {task.dueDate && (
          <span className="inline-flex items-center gap-1 text-[11px] text-ink-400">
            <Calendar className="h-3 w-3" />
            {formatDate(task.dueDate)}
          </span>
        )}
      </div>
    </div>
  );
}

function DraggableTaskCard(props: {
  task: ApiTask;
  editable: boolean;
  onDelete?: (taskId: string) => void;
  onEdit?: (taskId: string, input: TaskEditInput) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: props.task.id,
    disabled: !props.editable || isEditing,
  });

  return (
    <div ref={setNodeRef} className={isDragging ? 'opacity-30' : undefined}>
      <TaskCardBody
        {...props}
        isEditing={isEditing}
        onStartEdit={() => setIsEditing(true)}
        onFinishEdit={() => setIsEditing(false)}
        dragAttributes={props.editable && !isEditing ? attributes : undefined}
        dragListeners={props.editable && !isEditing ? listeners : undefined}
      />
    </div>
  );
}

function DroppableColumn({
  status,
  count,
  children,
}: {
  status: ApiTaskStatus;
  count: number;
  children: ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col overflow-hidden rounded-xl border bg-surface shadow-[var(--shadow-card)] transition-colors ${
        isOver ? 'border-accent' : 'border-border'
      }`}
    >
      <div className={`flex items-center gap-2 px-4 py-3 ${STATUS_TINT[status]}`}>
        <span className={`h-2 w-2 rounded-full ${STATUS_DOT[status]}`} />
        <h3 className="font-display text-sm font-semibold text-ink-900">{STATUS_LABEL[status]}</h3>
        <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-surface px-1.5 text-[11px] font-medium text-ink-600">
          {count}
        </span>
      </div>
      <div className={`flex-1 space-y-2.5 p-3 ${isOver ? 'bg-accent-soft/30' : ''}`}>
        {count === 0 ? (
          <p className="py-8 text-center text-xs text-ink-400">Bu sütunda görev yok</p>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

export function TaskBoard({ tasks, editable, onStatusChange, onDelete, onEdit }: TaskBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor),
  );

  const columns: Record<ApiTaskStatus, ApiTask[]> = {
    todo: [],
    in_progress: [],
    waiting_client: [],
    waiting_team: [],
    done: [],
    cancelled: [],
    meeting_notes: [],
  };
  for (const task of tasks) columns[task.status].push(task);

  const activeTask = activeId ? tasks.find((t) => t.id === activeId) : undefined;

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;
    const newStatus = over.id as ApiTaskStatus;
    const task = tasks.find((t) => t.id === active.id);
    if (task && task.status !== newStatus && onStatusChange) {
      onStatusChange(String(active.id), newStatus);
    }
  }

  const board = (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {STATUS_ORDER.map((status) => (
        <DroppableColumn key={status} status={status} count={columns[status].length}>
          {columns[status].map((task) => (
            <DraggableTaskCard
              key={task.id}
              task={task}
              editable={editable}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </DroppableColumn>
      ))}
    </div>
  );

  if (!editable) return board;

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      {board}
      <DragOverlay>
        {activeTask ? (
          <div className="rotate-2 opacity-95">
            <TaskCardBody
              task={activeTask}
              editable={false}
              isEditing={false}
              onStartEdit={() => {}}
              onFinishEdit={() => {}}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
