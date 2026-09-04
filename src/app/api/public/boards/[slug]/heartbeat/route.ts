import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Kimlik doğrulaması gerektirmez — gizli linki açan bir görüntüleyicinin
// "hâlâ burada" sinyalini periyodik olarak gönderdiği uç. Sahip panelindeki
// "İnceleyen var" göstergesi (bkz. /api/boards/[boardId]/presence) bu
// zaman damgasını okur.
export async function POST(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const board = await prisma.board.findUnique({ where: { slug }, select: { id: true } });
  if (!board) {
    return NextResponse.json({ error: 'Pano bulunamadı.' }, { status: 404 });
  }

  await prisma.board.update({
    where: { id: board.id },
    data: { lastViewedAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}
