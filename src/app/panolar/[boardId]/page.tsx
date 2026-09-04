import { notFound, redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { serializeTask } from '@/lib/tasks';
import { BoardManager } from '@/components/BoardManager';

export default async function BoardPage({ params }: { params: Promise<{ boardId: string }> }) {
  if (!(await isAuthenticated())) redirect('/login');

  const { boardId } = await params;
  const board = await prisma.board.findUnique({
    where: { id: boardId },
    include: { tasks: { orderBy: { createdAt: 'desc' } } },
  });
  if (!board) notFound();

  return (
    <BoardManager
      boardId={board.id}
      boardName={board.name}
      slug={board.slug}
      initialTasks={board.tasks.map(serializeTask)}
    />
  );
}
