'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/Badge';

const POLL_INTERVAL_MS = 8_000;

// Panonun gizli linkini şu anda birinin açık tuttuğunu (bkz.
// PresenceHeartbeat + /api/boards/[boardId]/presence) sahip panelinde
// göstermek için periyodik olarak yoklar.
export function ViewerPresenceBadge({ boardId }: { boardId: string }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        const res = await fetch(`/api/boards/${boardId}/presence`);
        if (!res.ok) return;
        const data = (await res.json()) as { active: boolean };
        if (!cancelled) setActive(data.active);
      } catch {
        // sessizce yut — bir sonraki yoklamada tekrar dener
      }
    }

    check();
    const interval = setInterval(check, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [boardId]);

  if (!active) return null;

  return (
    <Badge tone="success">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
      </span>
      İnceleyen var
    </Badge>
  );
}
