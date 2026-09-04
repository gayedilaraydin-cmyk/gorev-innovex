'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export function CopyLinkButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // pano panosuz kalmasın diye sessizce yut — kopyalama tarayıcı izni
      // olmadan çalışmayabilir, kullanıcı linki elle seçip kopyalayabilir.
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 text-xs font-medium text-ink-700 hover:bg-surface-2"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? 'Kopyalandı' : 'Kopyala'}
    </button>
  );
}
