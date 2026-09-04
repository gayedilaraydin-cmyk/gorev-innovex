import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(_request: Request, { params }: { params: Promise<{ boardId: string }> }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Giriş gerekli.' }, { status: 401 });
  }

  const { boardId } = await params;
  const existing = await prisma.board.findUnique({ where: { id: boardId } });
  if (!existing) {
    return NextResponse.json({ error: 'Pano bulunamadı.' }, { status: 404 });
  }

  await prisma.board.delete({ where: { id: boardId } });
  return new NextResponse(null, { status: 204 });
}
