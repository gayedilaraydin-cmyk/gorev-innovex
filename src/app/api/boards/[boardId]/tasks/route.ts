import { NextResponse } from 'next/server';
import { isAuthenticated, isValidApiKey } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isApiTaskPriority, isApiTaskSource, PRIORITY_FROM_API, serializeTask, SOURCE_FROM_API } from '@/lib/tasks';

export async function GET(_request: Request, { params }: { params: Promise<{ boardId: string }> }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Giriş gerekli.' }, { status: 401 });
  }

  const { boardId } = await params;
  const tasks = await prisma.task.findMany({ where: { boardId }, orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ tasks: tasks.map(serializeTask) });
}

export async function POST(request: Request, { params }: { params: Promise<{ boardId: string }> }) {
  const viaOwnerSession = await isAuthenticated();
  const viaApiKey = isValidApiKey(request.headers.get('authorization'));
  if (!viaOwnerSession && !viaApiKey) {
    return NextResponse.json({ error: 'Giriş gerekli.' }, { status: 401 });
  }

  const { boardId } = await params;
  const board = await prisma.board.findUnique({ where: { id: boardId } });
  if (!board) {
    return NextResponse.json({ error: 'Pano bulunamadı.' }, { status: 404 });
  }

  const body = (await request.json().catch(() => null)) as {
    title?: unknown;
    description?: unknown;
    dueDate?: unknown;
    source?: unknown;
    priority?: unknown;
  } | null;

  const title = typeof body?.title === 'string' ? body.title.trim() : '';
  if (!title || title.length > 200) {
    return NextResponse.json({ error: 'Geçerli bir görev başlığı gerekli.' }, { status: 400 });
  }

  const description =
    typeof body?.description === 'string' && body.description.trim() ? body.description.trim() : null;
  const dueDate = typeof body?.dueDate === 'string' && body.dueDate ? new Date(body.dueDate) : null;
  const priority = isApiTaskPriority(body?.priority) ? PRIORITY_FROM_API[body.priority] : null;

  // API anahtarıyla eklenen görevler varsayılan olarak "ai" kaynaklı sayılır
  // (Claude/otomasyon), panelden eklenenler "manual" — ikisi de açıkça
  // belirtilirse üzerine yazılabilir.
  const requestedSource = isApiTaskSource(body?.source) ? body.source : undefined;
  const source = SOURCE_FROM_API[requestedSource ?? (viaApiKey && !viaOwnerSession ? 'ai' : 'manual')];

  const task = await prisma.task.create({
    data: { boardId, title, description, dueDate, source, priority },
  });

  return NextResponse.json({ task: serializeTask(task) }, { status: 201 });
}
