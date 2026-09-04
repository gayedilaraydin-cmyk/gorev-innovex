import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type Tone = 'neutral' | 'accent' | 'danger' | 'success' | 'pending' | 'team';

const toneClasses: Record<Tone, string> = {
  neutral: 'bg-surface-2 text-ink-600',
  accent: 'bg-accent-soft text-accent',
  danger: 'bg-danger-soft text-danger',
  success: 'bg-success-soft text-success',
  pending: 'bg-pending-soft text-pending',
  team: 'bg-team-soft text-team',
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export function Badge({ className, tone = 'neutral', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium leading-none',
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}
