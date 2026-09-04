import { prisma } from '@/lib/prisma';
import { serializeTask } from '@/lib/tasks';
import { TaskBoard } from '@/components/TaskBoard';

export default async function PublicBoardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const board = await prisma.board.findUnique({
    where: { slug },
    include: { tasks: { orderBy: { createdAt: 'desc' } } },
  });

  if (!board) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-center">
        <div>
          <p className="font-display text-lg font-semibold text-ink-900">Bu bağlantı geçersiz</p>
          <p className="mt-1 text-sm text-ink-600">Pano bulunamadı. Linki sağlayan kişiyle iletişime geçin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-6">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-400">Görev Panosu</p>
        <h1 className="font-display text-xl font-semibold text-ink-900">{board.name}</h1>
        <p className="mt-1 text-sm text-ink-600">Bu görünüm salt okunur — yalnızca bu linki alanlar görebilir.</p>
      </header>

      <TaskBoard tasks={board.tasks.map(serializeTask)} editable={false} />
    </div>
  );
}
