import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateBoardSlug } from '@/lib/slug';

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Giriş gerekli.' }, { status: 401 });
  }

  const boards = await prisma.board.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { tasks: true } } },
  });

  return NextResponse.json({
    boards: boards.map((board) => ({
      id: board.id,
      name: board.name,
      slug: board.slug,
      createdAt: board.createdAt.toISOString(),
      taskCount: board._count.tasks,
    })),
  });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Giriş gerekli.' }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { name?: unknown } | null;
  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  if (!name || name.length > 200) {
    return NextResponse.json({ error: 'Geçerli bir müşteri/pano adı gerekli.' }, { status: 400 });
  }

  let slug = generateBoardSlug(name);
  // Son derece düşük ihtimalli bir çakışma olursa yeni bir rastgele sonekle tekrar dene.
  for (let attempt = 0; attempt < 5; attempt++) {
    const existing = await prisma.board.findUnique({ where: { slug } });
    if (!existing) break;
    slug = generateBoardSlug(name);
  }

  const board = await prisma.board.create({ data: { name, slug } });

  return NextResponse.json(
    {
      board: {
        id: board.id,
        name: board.name,
        slug: board.slug,
        createdAt: board.createdAt.toISOString(),
        taskCount: 0,
      },
    },
    { status: 201 },
  );
}
