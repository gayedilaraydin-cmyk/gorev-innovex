'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, LayoutGrid, Loader2, LogOut, Plus, Trash2 } from 'lucide-react';
import { AppHeader } from '@/components/AppHeader';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { CopyLinkButton } from '@/components/CopyLinkButton';
import { DashboardStats } from '@/components/DashboardStats';
import type { DailyCompletionPoint, TaskStatsSummary } from '@/lib/stats';

export interface BoardSummary {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  taskCount: number;
}

function publicLinkFor(slug: string): string {
  if (typeof window === 'undefined') return `/b/${slug}`;
  return `${window.location.origin}/b/${slug}`;
}

interface OwnerDashboardProps {
  initialBoards: BoardSummary[];
  stats: TaskStatsSummary;
  series: DailyCompletionPoint[];
}

export function OwnerDashboard({ initialBoards, stats, series }: OwnerDashboardProps) {
  const router = useRouter();
  const [boards, setBoards] = useState(initialBoards);
  const [name, setName] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    setError(null);
    try {
      const res = await fetch('/api/boards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      });
      if (!res.ok) throw new Error();
      const { board } = (await res.json()) as { board: BoardSummary };
      setBoards((prev) => [board, ...prev]);
      setName('');
    } catch {
      setError('Pano oluşturulamadı.');
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    const previous = boards;
    setBoards((prev) => prev.filter((b) => b.id !== id));
    try {
      const res = await fetch(`/api/boards/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
    } catch {
      setBoards(previous);
      setError('Pano silinemedi.');
    }
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-bg">
      <AppHeader
        right={
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-3.5 w-3.5" />
            Çıkış
          </Button>
        }
      />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <DashboardStats stats={stats} series={series} />

        {error && (
          <p className="mb-4 rounded-lg bg-danger-soft px-3.5 py-2.5 text-sm text-danger">{error}</p>
        )}

        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink-900">Panolar</h2>
        </div>

        <Card className="mb-6">
          <CardContent className="py-4">
            <form onSubmit={handleCreate} className="flex flex-col gap-2 sm:flex-row">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Müşteri / pano adı (örn. Aph Innovex)"
                className="sm:flex-1"
              />
              <Button type="submit" variant="primary" disabled={creating || !name.trim()}>
                {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Yeni Pano
              </Button>
            </form>
          </CardContent>
        </Card>

        {boards.length === 0 ? (
          <Card className="border-dashed shadow-none">
            <div className="flex flex-col items-center gap-2 py-16 text-center">
              <LayoutGrid className="h-8 w-8 text-ink-400" />
              <p className="text-sm text-ink-600">
                Henüz pano yok. Yukarıdan bir müşteri adı girip ilkini oluştur.
              </p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {boards.map((board) => (
              <Card key={board.id} className="flex flex-col">
                <CardHeader>
                  <div className="min-w-0">
                    <CardTitle className="truncate text-base">{board.name}</CardTitle>
                    <p className="mt-0.5 text-xs text-ink-400">{board.taskCount} görev</p>
                  </div>
                  <Button
                    variant="danger-ghost"
                    size="icon"
                    onClick={() => handleDelete(board.id)}
                    aria-label="Panoyu sil"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col justify-between gap-4">
                  <code className="block truncate rounded-lg bg-surface-2 px-3 py-2 font-[family-name:var(--font-mono-link)] text-xs text-ink-700">
                    {publicLinkFor(board.slug)}
                  </code>
                  <div className="flex items-center gap-2">
                    <CopyLinkButton value={publicLinkFor(board.slug)} />
                    <Link href={`/panolar/${board.id}`} className="ml-auto">
                      <Button variant="primary" size="sm">
                        Panoyu Aç
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
