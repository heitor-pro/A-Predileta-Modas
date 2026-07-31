import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
      {icon && <div className="text-silver-400">{icon}</div>}
      <h3 className="font-display text-2xl">{title}</h3>
      {description && (
        <p className="max-w-sm text-sm text-silver-500 dark:text-silver-400">{description}</p>
      )}
      {action}
    </div>
  );
}
