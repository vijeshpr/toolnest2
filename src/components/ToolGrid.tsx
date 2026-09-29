import { SearchX } from 'lucide-react';
import type { ToolMeta } from '../data/tools';
import { EmptyState } from './ui/EmptyState';
import { ToolCard } from './ToolCard';

export function ToolGrid({ tools, emptyTitle = 'No tools here yet', emptyText }: { tools: ToolMeta[]; emptyTitle?: string; emptyText?: string }) {
  if (!tools.length) return <EmptyState icon={SearchX} title={emptyTitle} text={emptyText} />;
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tools.map((t) => (
        <li key={t.slug}><ToolCard tool={t} /></li>
      ))}
    </ul>
  );
}
