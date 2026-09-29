import type { ReactNode } from 'react';
import { Breadcrumb } from './Breadcrumb';
import { SEO } from './SEO';

/** Marks text the site owner must replace before launch. */
export function Replace({ children }: { children: ReactNode }) {
  return <mark className="rounded bg-amber-100 px-1 text-amber-900">[REPLACE: {children}]</mark>;
}

interface Props { title: string; description: string; path: string; children: ReactNode; noindex?: boolean }

export function PageShell({ title, description, path, children, noindex }: Props) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <SEO title={title} description={description} path={path} noindex={noindex} />
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: title }]} />
      <h1 className="mb-6 text-3xl font-bold sm:text-4xl">{title}</h1>
      <div className="content text-slate-600 dark:text-slate-300">{children}</div>
    </div>
  );
}
