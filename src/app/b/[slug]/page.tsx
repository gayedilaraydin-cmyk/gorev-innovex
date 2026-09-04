import { prisma } from '@/lib/prisma';
import { serializeTask } from '@/lib/tasks';
import { summarizeTasks } from '@/lib/stats';
import { BoardStatsSummary } from '@/components/BoardStatsSummary';
import { BrandMark } from '@/components/BrandMark';
import { TaskBoard } from '@/components/TaskBoard';

export default async function PublicBoardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const board = await prisma.board.findUnique({
    where: { slug },
    include: { tasks: { orderBy: { createdAt: 'desc' } } },
  });

  if (!board) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <BrandMark height={20} />
        <div>
          <p className="font-display text-lg font-semibold text-ink-900">Bu bağlantı geçersiz</p>
          <p className="mt-1 text-sm text-ink-600">Pano bulunamadı. Linki sağlayan kişiyle iletişime geçin.</p>
        </div>
      </div>
    );
  }

  const tasks = board.tasks.map(serializeTask);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-6">
        <BrandMark height={20} />
        <p className="mt-3 text-xs font-medium uppercase tracking-wide text-ink-400">Görev Panosu</p>
        <h1 className="font-display text-xl font-semibold text-ink-900">{board.name}</h1>
        <p className="mt-1 text-sm text-ink-600">Bu görünüm salt okunur — yalnızca bu linki alanlar görebilir.</p>
      </header>

      <div className="mb-6">
        <BoardStatsSummary stats={summarizeTasks(tasks)} />
      </div>

      <TaskBoard tasks={tasks} editable={false} />
    </div>
  );
}
