'use client';

import { useEffect } from 'react';

const HEARTBEAT_INTERVAL_MS = 15_000;

// Görsel bir çıktısı yok — pano açıkken periyodik olarak "hâlâ burada"
// sinyali gönderir, sahip panelindeki "İnceleyen var" göstergesini besler.
export function PresenceHeartbeat({ slug }: { slug: string }) {
  useEffect(() => {
    function ping() {
      fetch(`/api/public/boards/${slug}/heartbeat`, { method: 'POST', keepalive: true }).catch(() => {});
    }
    ping();
    const interval = setInterval(ping, HEARTBEAT_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [slug]);

  return null;
}
