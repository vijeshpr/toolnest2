import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface Props {
  label: string;
  value: ReactNode;
  hint?: string;
  highlight?: boolean;
}

export function ResultCard({ label, value, hint, highlight }: Props) {
  return (
    <div
      className={cn(
        'rounded-xl border p-4',
        highlight
          ? 'border-brand-200 bg-brand-50 dark:border-brand-800 dark:bg-brand-900/40'
          : 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60',
      )}
    >
      <p className="text-sm text-slate-600 dark:text-slate-400">{label}</p>
      <p className={cn('mt-1 break-words font-semibold text-ink-900 dark:text-white', highlight ? 'text-2xl sm:text-3xl' : 'text-lg')}>{value}</p>
      {hint && <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{hint}</p>}
    </div>
  );
}
