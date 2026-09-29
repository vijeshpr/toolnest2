import { useSearchParams } from 'react-router-dom';
import { Breadcrumb } from '../components/Breadcrumb';
import { SEO } from '../components/SEO';
import { ToolGrid } from '../components/ToolGrid';
import { ToolSearch } from '../components/ToolSearch';
import { searchTools, tools } from '../data/tools';
import { breadcrumbLd } from '../lib/seo';

export default function Tools() {
  const [params] = useSearchParams();
  const q = (params.get('q') || '').slice(0, 80);
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <SEO
        title="All Free Online Tools"
        description="Browse every free ToolNest tool: calculators, converters, text tools and image tools. Search by name or keyword."
        path="/tools"
        jsonLd={[breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Tools', path: '/tools' }])]}
      />
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Tools' }]} />
      <h1 className="text-3xl font-bold sm:text-4xl">All tools</h1>
      <p className="mb-6 mt-2 max-w-2xl text-slate-600 dark:text-slate-400">{tools.length} free tools. Search by name or by what you want to do, such as “loan” or “compress”.</p>
      {/* key remounts the search when the URL query changes so the initial value is applied */}
      {q ? <PrefilledSearch key={q} q={q} /> : <ToolSearch inline />}
    </div>
  );
}

/** Shows results for a query passed in the URL (?q=...), from the homepage suggestions. */
function PrefilledSearch({ q }: { q: string }) {
  return (
    <div>
      <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">Results for “{q}”</p>
      <ToolGrid tools={searchTools(q)} emptyTitle={`No tools match “${q}”`} emptyText="Try a broader word such as “image”, “loan” or “text”." />
      <div className="mt-10"><h2 className="mb-4 text-xl font-semibold">Search again</h2><ToolSearch inline /></div>
    </div>
  );
}
