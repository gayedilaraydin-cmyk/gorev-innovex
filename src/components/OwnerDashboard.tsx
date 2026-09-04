'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2, LogOut, Plus, Trash2 } from 'lucide-react';
import { BrandMark } from '@/components/BrandMark';
import { CopyLinkButton } from '@/components/CopyLinkButton';

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

export function OwnerDashboard({ initialBoards }: { initialBoards: BoardSummary[] }) {
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
    <div className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink-400">Görev</p>
          <BrandMark height={26} />
          <p className="mt-1 text-sm text-ink-600">Müşteri panolarını yönet, her biri için gizli bir link üret.</p>
        </div>
        <button
          onClick={handleLogout}
          className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-surface px-3 text-sm text-ink-700 hover:bg-surface-2"
        >
          <LogOut className="h-3.5 w-3.5" />
          Çıkış
        </button>
      </header>

      {error && <p className="mb-4 rounded-md bg-danger-soft px-3 py-2 text-sm text-danger">{error}</p>}

      <form onSubmit={handleCreate} className="mb-8 flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Müşteri / pano adı (örn. Aph Innovex)"
          className="h-10 flex-1 rounded-md border border-border bg-surface px-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-accent"
        />
        <button
          type="submit"
          disabled={creating || !name.trim()}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-accent px-5 text-sm font-medium text-accent-ink hover:opacity-90 disabled:opacity-50"
        >
          {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Yeni Pano
        </button>
      </form>

      {boards.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border py-16 text-center">
          <p className="text-sm text-ink-600">Henüz pano yok. Yukarıdan bir müşteri adı girip ilkini oluştur.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {boards.map((board) => (
            <li
              key={board.id}
              className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface p-4"
            >
              <div className="min-w-0 flex-1">
                <p className="font-display text-sm font-semibold text-ink-900">{board.name}</p>
                <p className="text-xs text-ink-400">{board.taskCount} görev</p>
              </div>

              <code className="max-w-[240px] truncate rounded-md bg-surface-2 px-2.5 py-1.5 font-[family-name:var(--font-mono-link)] text-xs text-ink-700">
                {publicLinkFor(board.slug)}
              </code>
              <CopyLinkButton value={publicLinkFor(board.slug)} />

              <Link
                href={`/panolar/${board.id}`}
                className="inline-flex h-8 items-center gap-1.5 rounded-md border border-accent/30 px-3 text-xs font-medium text-accent hover:bg-accent-soft"
              >
                Aç
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>

              <button
                onClick={() => handleDelete(board.id)}
                aria-label="Panoyu sil"
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-ink-400 hover:bg-danger-soft hover:text-danger"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
