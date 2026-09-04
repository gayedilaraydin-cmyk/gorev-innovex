import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { serializeTask } from '@/lib/tasks';

// Kimlik doğrulaması gerektirmez — linki elinde bulunduran herkesin
// panoyu salt-okunur görüntüleyebildiği gizli paylaşım linki.
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const board = await prisma.board.findUnique({
    where: { slug },
    include: { tasks: { orderBy: { createdAt: 'desc' } } },
  });

  if (!board) {
    return NextResponse.json({ error: 'Pano bulunamadı.' }, { status: 404 });
  }

  return NextResponse.json({
    name: board.name,
    tasks: board.tasks.map(serializeTask),
  });
}
