import { ChevronDown } from 'lucide-react';
import type { FAQItem } from '../data/tools';

export function FAQ({ items, title = 'Frequently asked questions' }: { items: FAQItem[]; title?: string }) {
  return (
    <section aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="mb-4 text-2xl font-semibold">{title}</h2>
      <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-ink-900">
        {items.map((f) => (
          <details key={f.q} className="group px-5 py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-ink-900 dark:text-white [&::-webkit-details-marker]:hidden">
              <h3 className="text-base font-medium">{f.q}</h3>
              <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
            </summary>
            <p className="mt-2 leading-7 text-slate-600 dark:text-slate-400">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
