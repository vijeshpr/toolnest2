import type { LucideIcon } from 'lucide-react';

export function EmptyState({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text?: string }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 px-6 py-10 text-center dark:border-slate-700">
      <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <p className="font-medium text-ink-900 dark:text-white">{title}</p>
      {text && <p className="mt-1 max-w-sm text-sm text-slate-600 dark:text-slate-400">{text}</p>}
    </div>
  );
}
