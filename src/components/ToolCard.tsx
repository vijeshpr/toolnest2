import { Link } from 'react-router-dom';
import { getCategory } from '../data/categories';
import { toolPath, type ToolMeta } from '../data/tools';

export function ToolCard({ tool }: { tool: ToolMeta }) {
  const Icon = tool.icon;
  return (
    <Link
      to={toolPath(tool)}
      className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-soft transition-colors hover:border-brand-400 dark:border-slate-800 dark:bg-ink-900 dark:hover:border-brand-500"
    >
      <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <h3 className="text-base font-semibold text-ink-900 group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-300">{tool.name}</h3>
      <p className="mt-1.5 line-clamp-2 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-400">{tool.description}</p>
      <p className="mt-4 text-xs text-slate-500 dark:text-slate-500">{getCategory(tool.categories[0]).name}</p>
    </Link>
  );
}
