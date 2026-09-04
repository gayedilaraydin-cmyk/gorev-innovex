import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Görüntüleyici sayfası her 15 saniyede bir heartbeat gönderiyor; 30
// saniyelik pencere bir kaçırılan atışa tolerans tanır ama sekme
// kapatıldıktan sonra göstergenin makul sürede sönmesini sağlar.
const ACTIVE_WINDOW_MS = 30_000;

export async function GET(_request: Request, { params }: { params: Promise<{ boardId: string }> }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Giriş gerekli.' }, { status: 401 });
  }

  const { boardId } = await params;
  const board = await prisma.board.findUnique({
    where: { id: boardId },
    select: { lastViewedAt: true },
  });
  if (!board) {
    return NextResponse.json({ error: 'Pano bulunamadı.' }, { status: 404 });
  }

  const active = board.lastViewedAt
    ? Date.now() - board.lastViewedAt.getTime() < ACTIVE_WINDOW_MS
    : false;

  return NextResponse.json({ active });
}
