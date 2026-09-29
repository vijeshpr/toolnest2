import type { ReactNode } from 'react';
import { AlertCircle, Info, TriangleAlert } from 'lucide-react';
import { cn } from '../../lib/utils';

type Tone = 'error' | 'warning' | 'info';
const styles: Record<Tone, string> = {
  error: 'border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200',
  warning: 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200',
  info: 'border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-200',
};

export function Alert({ tone = 'info', children }: { tone?: Tone; children: ReactNode }) {
  const Icon = tone === 'error' ? AlertCircle : tone === 'warning' ? TriangleAlert : Info;
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={cn('flex gap-3 rounded-xl border p-3.5 text-sm', styles[tone])}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <div>{children}</div>
    </div>
  );
}
