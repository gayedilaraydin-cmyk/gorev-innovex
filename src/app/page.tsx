import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { OwnerDashboard } from '@/components/OwnerDashboard';
import { serializeTask } from '@/lib/tasks';
import { dailyCompletionSeries, summarizeTasks } from '@/lib/stats';

export default async function HomePage() {
  if (!(await isAuthenticated())) redirect('/login');

  const [boards, allTasks] = await Promise.all([
    prisma.board.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { tasks: true } } },
    }),
    prisma.task.findMany(),
  ]);

  const serializedTasks = allTasks.map(serializeTask);

  return (
    <OwnerDashboard
      initialBoards={boards.map((board) => ({
        id: board.id,
        name: board.name,
        slug: board.slug,
        createdAt: board.createdAt.toISOString(),
        taskCount: board._count.tasks,
      }))}
      stats={summarizeTasks(serializedTasks)}
      series={dailyCompletionSeries(serializedTasks)}
    />
  );
}
