import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: 'promo' | 'featured' | 'new';
}

const tones = {
  promo: 'bg-ink text-paper dark:bg-paper dark:text-ink',
  featured: 'bg-silver-300 text-ink',
  new: 'border border-silver-400 text-silver-700 dark:text-silver-200',
};

export function Badge({ className, tone = 'new', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider',
        tones[tone],
        className
      )}
      {...props}
    />
  );
}
