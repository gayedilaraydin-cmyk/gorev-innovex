import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger-ghost';
type Size = 'sm' | 'md' | 'icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-accent text-accent-ink shadow-[var(--shadow-accent)] hover:brightness-105 active:brightness-95',
  secondary: 'bg-surface text-ink-700 border border-border hover:bg-surface-2 hover:border-ink-400/30',
  ghost: 'text-ink-600 hover:bg-surface-2 hover:text-ink-900',
  'danger-ghost': 'text-ink-400 hover:bg-danger-soft hover:text-danger',
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-8 px-3.5 text-xs gap-1.5 rounded-full',
  md: 'h-10 px-5 text-sm gap-2 rounded-full',
  icon: 'h-8 w-8 justify-center rounded-lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'secondary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex shrink-0 items-center font-medium disabled:cursor-not-allowed disabled:opacity-50',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';
