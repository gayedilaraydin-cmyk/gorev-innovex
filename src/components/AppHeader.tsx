import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { BrandMark } from '@/components/BrandMark';
import type { ReactNode } from 'react';

interface AppHeaderProps {
  backHref?: string;
  backLabel?: string;
  right?: ReactNode;
}

export function AppHeader({ backHref, backLabel = 'Geri', right }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-surface/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <div className="flex items-center gap-4">
          <BrandMark height={20} />
          {backHref && (
            <Link
              href={backHref}
              className="inline-flex items-center gap-1.5 border-l border-border pl-4 text-sm text-ink-600 transition-colors hover:text-ink-900"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {backLabel}
            </Link>
          )}
        </div>
        {right}
      </div>
    </header>
  );
}
