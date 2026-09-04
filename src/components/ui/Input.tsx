import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'h-10 w-full rounded-lg border border-border bg-surface px-3.5 text-sm text-ink-900',
          'placeholder:text-ink-400',
          'focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]/40 focus:border-accent',
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-ink-900',
          'placeholder:text-ink-400',
          'focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]/40 focus:border-accent',
          className,
        )}
        {...props}
      />
    );
  },
);
Textarea.displayName = 'Textarea';
