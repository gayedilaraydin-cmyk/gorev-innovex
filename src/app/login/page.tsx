'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Lock } from 'lucide-react';
import { BrandMark } from '@/components/BrandMark';

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError('Parola hatalı.');
        return;
      }
      router.push('/');
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-5 rounded-lg border border-border bg-surface p-6"
      >
        <div className="space-y-1 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft text-accent">
            <Lock className="h-4.5 w-4.5" />
          </div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink-400">Görev</p>
          <BrandMark height={24} />
          <p className="pt-1 text-sm text-ink-600">Panolara erişmek için parolayı gir.</p>
        </div>

        {error && (
          <p className="rounded-md bg-danger-soft px-3 py-2 text-sm text-danger">{error}</p>
        )}

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Parola"
          autoFocus
          required
          className="h-10 w-full rounded-md border border-border bg-surface px-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-accent"
        />

        <button
          type="submit"
          disabled={submitting || !password}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-full bg-accent text-sm font-medium text-accent-ink hover:opacity-90 disabled:opacity-50"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Giriş Yap
        </button>
      </form>
    </div>
  );
}
