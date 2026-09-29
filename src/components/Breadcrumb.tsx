import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface Crumb { label: string; to?: string }

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-5 text-sm">
      <ol className="flex flex-wrap items-center gap-1.5 text-slate-600 dark:text-slate-400">
        {items.map((it, i) => {
          const last = i === items.length - 1;
          return (
            <li key={it.label} className="flex items-center gap-1.5">
              {it.to && !last ? (
                <Link to={it.to} className="hover:text-brand-700 hover:underline dark:hover:text-brand-300">{it.label}</Link>
              ) : (
                <span aria-current={last ? 'page' : undefined} className={last ? 'text-slate-900 dark:text-slate-100' : undefined}>{it.label}</span>
              )}
              {!last && <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
