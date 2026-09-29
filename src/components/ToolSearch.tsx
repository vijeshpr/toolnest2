import { useMemo, useState, type KeyboardEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, SearchX, X } from 'lucide-react';
import { searchTools, toolPath } from '../data/tools';
import { analytics } from '../lib/analytics';
import { cn } from '../lib/utils';
import { EmptyState } from './ui/EmptyState';
import { ToolGrid } from './ToolGrid';

interface Props {
  inline?: boolean; // true: results render as a grid below (Tools page). false: dropdown (hero).
  large?: boolean;
  autoFocus?: boolean;
}

export function ToolSearch({ inline = false, large = false, autoFocus = false }: Props) {
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const results = useMemo(() => searchTools(q), [q]);
  const hasQuery = q.trim().length > 0;

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') setQ('');
    if (e.key === 'Enter' && !inline && hasQuery && results[0]) {
      analytics.event('search_select', { tool: results[0].slug });
      navigate(toolPath(results[0]));
    }
  }

  return (
    <div>
      <div className="relative">
        <label htmlFor={inline ? 'tools-search' : 'hero-search'} className="sr-only">Search tools</label>
        <Search className={cn('pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400', large ? 'h-6 w-6' : 'h-5 w-5')} aria-hidden="true" />
        <input
          id={inline ? 'tools-search' : 'hero-search'}
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={onKeyDown}
          autoFocus={autoFocus}
          autoComplete="off"
          maxLength={80}
          placeholder="Search for a tool…"
          className={cn('field-control [&::-webkit-search-cancel-button]:hidden', large ? 'h-14 rounded-2xl pl-14 pr-12 text-lg' : 'h-12 pl-12 pr-11')}
        />
        {hasQuery && (
          <button type="button" onClick={() => setQ('')} aria-label="Clear search" className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
      <p className="sr-only" aria-live="polite">{hasQuery ? `${results.length} ${results.length === 1 ? 'tool' : 'tools'} found` : ''}</p>

      {inline ? (
        <div className="mt-6">
          <ToolGrid tools={results} emptyTitle={`No tools match “${q.trim()}”`} emptyText="Try a broader word such as “image”, “loan” or “text”." />
        </div>
      ) : (
        hasQuery && (
          <div className="mt-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-soft dark:border-slate-800 dark:bg-ink-900">
            {results.length ? (
              <ul>
                {results.slice(0, 6).map((t) => {
                  const Icon = t.icon;
                  return (
                    <li key={t.slug}>
                      <Link
                        to={toolPath(t)}
                        onClick={() => analytics.event('search_select', { tool: t.slug })}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300"><Icon className="h-4 w-4" aria-hidden="true" /></span>
                        <span className="min-w-0 text-left">
                          <span className="block font-medium text-ink-900 dark:text-white">{t.name}</span>
                          <span className="block truncate text-sm text-slate-600 dark:text-slate-400">{t.description}</span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <EmptyState icon={SearchX} title={`No tools match “${q.trim()}”`} text="Try a broader word such as “image”, “loan” or “text”." />
            )}
          </div>
        )
      )}
    </div>
  );
}
