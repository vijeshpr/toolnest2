import { Breadcrumb } from '../components/Breadcrumb';
import { CategoryCard } from '../components/CategoryCard';
import { SEO } from '../components/SEO';
import { categories } from '../data/categories';
import { breadcrumbLd } from '../lib/seo';

export default function Categories() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <SEO
        title="Tool Categories"
        description="Browse ToolNest tools by category: finance, calculators, image tools, text tools, converters, developer tools and productivity."
        path="/categories"
        jsonLd={[breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Categories', path: '/categories' }])]}
      />
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Categories' }]} />
      <h1 className="text-3xl font-bold sm:text-4xl">Categories</h1>
      <p className="mb-6 mt-2 max-w-2xl text-slate-600 dark:text-slate-400">Pick a category to see the tools inside it.</p>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => <li key={c.id}><CategoryCard category={c} /></li>)}
      </ul>
    </div>
  );
}
