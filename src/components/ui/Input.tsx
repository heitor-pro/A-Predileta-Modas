import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-silver-600 dark:text-silver-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={cn(
            'w-full rounded-xl border border-silver-300 dark:border-silver-700 bg-transparent px-4 py-2.5 text-sm outline-none transition-colors focus:border-silver-500 dark:focus:border-silver-400 placeholder:text-silver-400',
            error && 'border-red-400 focus:border-red-500',
            className
          )}
          {...props}
        />
        {error && (
          <span id={`${inputId}-error`} className="text-xs text-red-500">
            {error}
          </span>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
