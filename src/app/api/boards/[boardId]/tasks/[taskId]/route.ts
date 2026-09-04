import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isApiTaskStatus, serializeTask, STATUS_FROM_API } from '@/lib/tasks';

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
  } | null;

  if (body?.status !== undefined && !isApiTaskStatus(body.status)) {
    return NextResponse.json({ error: 'Geçersiz durum.' }, { status: 400 });
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
    },
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
