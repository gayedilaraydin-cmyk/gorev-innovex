import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { OwnerDashboard } from '@/components/OwnerDashboard';

export default async function HomePage() {
  if (!(await isAuthenticated())) redirect('/login');

  const boards = await prisma.board.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { tasks: true } } },
  });

  return (
    <OwnerDashboard
      initialBoards={boards.map((board) => ({
        id: board.id,
        name: board.name,
        slug: board.slug,
        createdAt: board.createdAt.toISOString(),
        taskCount: board._count.tasks,
      }))}
    />
  );
}
