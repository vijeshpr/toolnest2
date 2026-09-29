import { Suspense, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { AdPlaceholder } from '../components/AdPlaceholder';
import { Breadcrumb } from '../components/Breadcrumb';
import { FAQ } from '../components/FAQ';
import { SEO } from '../components/SEO';
import { ToolGrid } from '../components/ToolGrid';
import { getCategory } from '../data/categories';
import { getRelatedTools, getToolBySlug, toolPath } from '../data/tools';
import { analytics } from '../lib/analytics';
import { breadcrumbLd, faqLd, webAppLd } from '../lib/seo';
import NotFound from './NotFound';

export default function ToolPage() {
  const { slug } = useParams();
  const tool = getToolBySlug(slug);

  useEffect(() => {
    if (tool) analytics.event('tool_view', { tool: tool.slug });
  }, [tool]);

  if (!tool) return <NotFound />;

  const Tool = tool.component;
  const Icon = tool.icon;
  const cat = getCategory(tool.categories[0]);
  const path = toolPath(tool);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <SEO
        title={tool.seoTitle}
        description={tool.seoDescription}
        path={path}
        jsonLd={[
          webAppLd(tool, path),
          breadcrumbLd([
            { name: 'Home', path: '/' },
            { name: 'Tools', path: '/tools' },
            { name: tool.name, path },
          ]),
          faqLd(tool.faqs),
        ]}
      />
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Tools', to: '/tools' }, { label: cat.name, to: `/categories/${cat.id}` }, { label: tool.name }]} />

      <header className="mb-6 flex items-start gap-4">
        <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-600 text-white sm:flex"><Icon className="h-6 w-6" aria-hidden="true" /></span>
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">{tool.name}</h1>
          <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">{tool.description}</p>
          {tool.localOnly && (
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-sm text-brand-800 dark:bg-brand-900/40 dark:text-brand-200">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Runs in your browser. Your input isn’t sent to our servers.
            </p>
          )}
        </div>
      </header>

      <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" role="status" aria-label="Loading tool" />}>
        <Tool />
      </Suspense>

      <AdPlaceholder slot="tool-below-tool" />

      <div className="content mx-auto max-w-3xl text-slate-600 dark:text-slate-300">
        <h2>About the {tool.name.toLowerCase()}</h2>
        <p>{tool.intro}</p>
        <h2>How to use it</h2>
        <ol>{tool.howTo.map((s) => <li key={s}>{s}</li>)}</ol>
        <h3>Example</h3>
        <p>{tool.example}</p>
      </div>

      <div className="mx-auto mt-10 max-w-3xl"><FAQ items={tool.faqs} /></div>

      <AdPlaceholder slot="tool-before-related" />

      <section aria-labelledby="related-heading" className="mt-6">
        <h2 id="related-heading" className="mb-4 text-2xl font-semibold">More tools you may like</h2>
        <ToolGrid tools={getRelatedTools(tool, 3)} />
      </section>
    </div>
  );
}
