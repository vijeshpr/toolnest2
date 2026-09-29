import { useParams } from 'react-router-dom';
import { Breadcrumb } from '../components/Breadcrumb';
import { SEO } from '../components/SEO';
import { ToolGrid } from '../components/ToolGrid';
import { findCategory } from '../data/categories';
import { toolsInCategory } from '../data/tools';
import { breadcrumbLd } from '../lib/seo';
import NotFound from './NotFound';

export default function CategoryPage() {
  const { id } = useParams();
  const cat = findCategory(id);
  if (!cat) return <NotFound />;
  const path = `/categories/${cat.id}`;
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <SEO
        title={`${cat.name} – Free Online Tools`}
        description={`${cat.description} Free ${cat.name.toLowerCase()} you can use in your browser, no sign-up needed.`}
        path={path}
        jsonLd={[breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Categories', path: '/categories' }, { name: cat.name, path }])]}
      />
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Categories', to: '/categories' }, { label: cat.name }]} />
      <h1 className="text-3xl font-bold sm:text-4xl">{cat.name}</h1>
      <p className="mb-6 mt-2 text-slate-600 dark:text-slate-400">{cat.description}</p>
      <ToolGrid tools={toolsInCategory(cat.id)} emptyTitle="New tools are coming soon" emptyText="We are adding tools to this category. Use the contact page to suggest one." />
    </div>
  );
}
