import { Link } from 'react-router-dom';
import type { Category } from '../data/categories';
import { toolsInCategory } from '../data/tools';

export function CategoryCard({ category }: { category: Category }) {
  const Icon = category.icon;
  const count = toolsInCategory(category.id).length;
  return (
    <Link
      to={`/categories/${category.id}`}
      className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft transition-colors hover:border-brand-400 dark:border-slate-800 dark:bg-ink-900 dark:hover:border-brand-500"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block font-semibold text-ink-900 group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-300">{category.name}</span>
        <span className="mt-0.5 block text-sm text-slate-600 dark:text-slate-400">{category.description}</span>
        <span className="mt-2 block text-xs text-slate-500">{count} {count === 1 ? 'tool' : 'tools'}</span>
      </span>
    </Link>
  );
}
