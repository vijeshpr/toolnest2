import { Link } from 'react-router-dom';
import { SITE } from '../config/site';
import { popularTools, toolPath } from '../data/tools';

const company = [
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
  { to: '/privacy-policy', label: 'Privacy Policy' },
  { to: '/terms-of-service', label: 'Terms of Service' },
];

export function Footer() {
  const linkCls = 'text-slate-600 hover:text-brand-700 hover:underline dark:text-slate-400 dark:hover:text-brand-300';
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-ink-900">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="text-lg font-semibold text-ink-900 dark:text-white">{SITE.name}</p>
          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600 dark:text-slate-400">
            Free calculators, converters, text and image tools. Most tools run in your browser, so your input stays on your device.
          </p>
        </div>
        <nav aria-label="Popular tools">
          <p className="mb-3 text-sm font-semibold text-ink-900 dark:text-white">Popular tools</p>
          <ul className="space-y-2 text-sm">
            {popularTools().slice(0, 5).map((t) => <li key={t.slug}><Link className={linkCls} to={toolPath(t)}>{t.name}</Link></li>)}
          </ul>
        </nav>
        <nav aria-label="Company">
          <p className="mb-3 text-sm font-semibold text-ink-900 dark:text-white">{SITE.name}</p>
          <ul className="space-y-2 text-sm">
            <li><Link className={linkCls} to="/tools">All tools</Link></li>
            <li><Link className={linkCls} to="/categories">Categories</Link></li>
            {company.map((c) => <li key={c.to}><Link className={linkCls} to={c.to}>{c.label}</Link></li>)}
          </ul>
        </nav>
      </div>
      <div className="border-t border-slate-200 py-5 text-center text-sm text-slate-500 dark:border-slate-800">
        © {new Date().getFullYear()} {SITE.name}. All rights reserved.
      </div>
    </footer>
  );
}
