import type { ReactNode } from 'react';
import { Card } from './ui/Card';

/** Standard two-panel tool layout: inputs on the left, results on the right (stacked on mobile). */
export function ToolLayout({ inputs, results }: { inputs: ReactNode; results: ReactNode }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card><div className="space-y-4">{inputs}</div></Card>
      <Card aria-live="polite"><div className="space-y-4">{results}</div></Card>
    </div>
  );
}
