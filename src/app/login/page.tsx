'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Lock } from 'lucide-react';
import { BrandMark } from '@/components/BrandMark';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg px-4">
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full opacity-[0.08] blur-3xl"
        style={{ background: 'var(--accent)' }}
        aria-hidden="true"
      />

      <Card className="relative w-full max-w-sm shadow-[var(--shadow-raised)]">
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5 py-7">
            <div className="space-y-2 text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-accent">
                <Lock className="h-4.5 w-4.5" />
              </div>
              <BrandMark height={24} className="mx-auto" />
              <p className="pt-1 text-sm text-ink-600">Panolara erişmek için parolayı gir.</p>
            </div>

            {error && (
              <p className="rounded-lg bg-danger-soft px-3.5 py-2.5 text-sm text-danger">{error}</p>
            )}

            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Parola"
              autoFocus
              required
            />

            <Button
              type="submit"
              variant="primary"
              disabled={submitting || !password}
              className="w-full justify-center"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Giriş Yap
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
