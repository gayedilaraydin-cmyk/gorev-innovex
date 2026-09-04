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
import { Calendar, Flag, GripVertical, MessageCircle, Sparkles, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { TaskDetailModal } from '@/components/TaskDetailModal';
import type { ApiTask, ApiTaskDepartment, ApiTaskPriority, ApiTaskStatus } from '@/lib/tasks';
import {
  DEPARTMENT_LABEL,
  PRIORITY_LABEL,
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
  departments: ApiTaskDepartment[];
}

interface TaskBoardProps {
  tasks: ApiTask[];
  editable: boolean;
  onStatusChange?: (taskId: string, status: ApiTaskStatus) => void;
  onDelete?: (taskId: string) => void;
  onEdit?: (taskId: string, input: TaskEditInput) => void;
  onAddComment?: (taskId: string, body: string) => Promise<void>;
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
  onOpen,
  onDelete,
  dragAttributes,
  dragListeners,
}: {
  task: ApiTask;
  editable: boolean;
  onOpen?: () => void;
  onDelete?: (taskId: string) => void;
  dragAttributes?: DraggableAttributes;
  dragListeners?: Record<string, unknown>;
}) {
  const isNotesCard = task.status === 'meeting_notes';

  return (
    <div
      {...dragAttributes}
      {...dragListeners}
      onClick={onOpen}
      className={`group space-y-2.5 rounded-lg border border-border bg-surface p-3.5 text-left shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-raised)] ${
        dragListeners ? 'cursor-grab touch-none active:cursor-grabbing' : onOpen ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start gap-2">
        {editable && (
          <GripVertical className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-400/0 transition-colors group-hover:text-ink-400" />
        )}
        <p className="flex-1 text-sm font-medium leading-snug text-ink-900">{task.title}</p>
        {editable && onDelete && (
          <div className="-mr-1 -mt-1 flex shrink-0 items-center gap-0.5 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
            <Button
              variant="danger-ghost"
              size="icon"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
              aria-label="Görevi sil"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>

      {!isNotesCard && task.description && (
        <p className="text-xs leading-relaxed text-ink-600">{task.description}</p>
      )}

      {task.departments.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {task.departments.map((d) => (
            <Badge key={d} tone="neutral">
              {DEPARTMENT_LABEL[d]}
            </Badge>
          ))}
        </div>
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
        {task.comments.length > 0 && (
          <span className="inline-flex items-center gap-1 text-[11px] text-ink-400">
            <MessageCircle className="h-3 w-3" />
            {task.comments.length}
          </span>
        )}
      </div>
    </div>
  );
}

function DraggableTaskCard(props: {
  task: ApiTask;
  editable: boolean;
  onOpen?: () => void;
  onDelete?: (taskId: string) => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: props.task.id,
    disabled: !props.editable,
  });

  return (
    <div ref={setNodeRef} className={isDragging ? 'opacity-30' : undefined}>
      <TaskCardBody
        {...props}
        dragAttributes={props.editable ? attributes : undefined}
        dragListeners={props.editable ? listeners : undefined}
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

export function TaskBoard({ tasks, editable, onStatusChange, onDelete, onEdit, onAddComment }: TaskBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);
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
  const openTask = openTaskId ? tasks.find((t) => t.id === openTaskId) : undefined;

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
              onOpen={() => setOpenTaskId(task.id)}
              onDelete={onDelete}
            />
          ))}
        </DroppableColumn>
      ))}
    </div>
  );

  const modal = openTask ? (
    <TaskDetailModal
      task={openTask}
      editable={editable}
      onClose={() => setOpenTaskId(null)}
      onSave={onEdit ? (input) => onEdit(openTask.id, input) : undefined}
      onDelete={onDelete ? () => onDelete(openTask.id) : undefined}
      onAddComment={onAddComment ? (body) => onAddComment(openTask.id, body) : undefined}
    />
  ) : null;

  if (!editable) {
    return (
      <>
        {board}
        {modal}
      </>
    );
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      {board}
      <DragOverlay>
        {activeTask ? (
          <div className="rotate-2 opacity-95">
            <TaskCardBody task={activeTask} editable={false} />
          </div>
        ) : null}
      </DragOverlay>
      {modal}
    </DndContext>
  );
}
