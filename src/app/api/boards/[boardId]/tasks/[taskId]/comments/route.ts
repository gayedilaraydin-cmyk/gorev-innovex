import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Yalnızca sahip yorum ekleyebilir — müşteri gizli linkten yorumları
// görebilir (bkz. serializeTask'in comments alanı) ama ekleyemez, "panolara
// müdahale edemesinler" kuralıyla tutarlı.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ boardId: string; taskId: string }> },
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Giriş gerekli.' }, { status: 401 });
  }

  const { boardId, taskId } = await params;
  const task = await prisma.task.findFirst({ where: { id: taskId, boardId } });
  if (!task) {
    return NextResponse.json({ error: 'Görev bulunamadı.' }, { status: 404 });
  }

  const body = (await request.json().catch(() => null)) as { body?: unknown } | null;
  const commentBody = typeof body?.body === 'string' ? body.body.trim() : '';
  if (!commentBody || commentBody.length > 2000) {
    return NextResponse.json({ error: 'Geçerli bir yorum metni gerekli.' }, { status: 400 });
  }

  const comment = await prisma.comment.create({
    data: { taskId, body: commentBody },
  });

  return NextResponse.json(
    { comment: { id: comment.id, body: comment.body, createdAt: comment.createdAt.toISOString() } },
    { status: 201 },
  );
}
