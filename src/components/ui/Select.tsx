import { forwardRef, type SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  size?: 'sm' | 'md';
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, size = 'md', children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            'w-full appearance-none rounded-lg border border-border bg-surface pl-3.5 pr-9 text-sm text-ink-900',
            size === 'md' ? 'h-10' : 'h-8 text-xs',
            'focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]/40 focus:border-accent',
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-400" />
      </div>
    );
  },
);
Select.displayName = 'Select';
