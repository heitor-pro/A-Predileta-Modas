import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-silver-200/70 dark:border-silver-800/80 bg-white/70 dark:bg-ink-card/70 backdrop-blur-sm shadow-sm',
        className
      )}
      {...props}
    />
  );
}
