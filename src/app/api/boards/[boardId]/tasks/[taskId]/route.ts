import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  DEPARTMENT_FROM_API,
  isApiTaskDepartmentArray,
  isApiTaskPriority,
  isApiTaskStatus,
  PRIORITY_FROM_API,
  serializeTask,
  STATUS_FROM_API,
} from '@/lib/tasks';

interface RouteParams {
  params: Promise<{ boardId: string; taskId: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Giriş gerekli.' }, { status: 401 });
  }

  const { boardId, taskId } = await params;
  const existing = await prisma.task.findFirst({ where: { id: taskId, boardId } });
  if (!existing) {
    return NextResponse.json({ error: 'Görev bulunamadı.' }, { status: 404 });
  }

  const body = (await request.json().catch(() => null)) as {
    title?: unknown;
    description?: unknown;
    status?: unknown;
    dueDate?: unknown;
    priority?: unknown;
    departments?: unknown;
  } | null;

  if (body?.status !== undefined && !isApiTaskStatus(body.status)) {
    return NextResponse.json({ error: 'Geçersiz durum.' }, { status: 400 });
  }
  if (body?.priority !== undefined && body.priority !== null && !isApiTaskPriority(body.priority)) {
    return NextResponse.json({ error: 'Geçersiz öncelik.' }, { status: 400 });
  }
  if (body?.departments !== undefined && !isApiTaskDepartmentArray(body.departments)) {
    return NextResponse.json({ error: 'Geçersiz departman.' }, { status: 400 });
  }

  const task = await prisma.task.update({
    where: { id: taskId },
    data: {
      ...(typeof body?.title === 'string' && body.title.trim() ? { title: body.title.trim() } : {}),
      ...(body?.description !== undefined
        ? { description: typeof body.description === 'string' && body.description.trim() ? body.description.trim() : null }
        : {}),
      ...(isApiTaskStatus(body?.status) ? { status: STATUS_FROM_API[body.status] } : {}),
      ...(body?.dueDate !== undefined
        ? { dueDate: typeof body.dueDate === 'string' && body.dueDate ? new Date(body.dueDate) : null }
        : {}),
      ...(body?.priority !== undefined
        ? { priority: isApiTaskPriority(body.priority) ? PRIORITY_FROM_API[body.priority] : null }
        : {}),
      ...(isApiTaskDepartmentArray(body?.departments)
        ? { departments: body.departments.map((d) => DEPARTMENT_FROM_API[d]) }
        : {}),
    },
    include: { comments: { orderBy: { createdAt: 'asc' } } },
  });

  return NextResponse.json({ task: serializeTask(task) });
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Giriş gerekli.' }, { status: 401 });
  }

  const { boardId, taskId } = await params;
  const existing = await prisma.task.findFirst({ where: { id: taskId, boardId } });
  if (!existing) {
    return NextResponse.json({ error: 'Görev bulunamadı.' }, { status: 404 });
  }

  await prisma.task.delete({ where: { id: taskId } });
  return new NextResponse(null, { status: 204 });
}
