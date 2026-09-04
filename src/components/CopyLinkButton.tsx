'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/Button';

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
    <Button variant="secondary" size="sm" onClick={handleCopy}>
      {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? 'Kopyalandı' : 'Kopyala'}
    </Button>
  );
}
