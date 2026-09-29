import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, Wrench, X } from 'lucide-react';
import { SITE } from '../config/site';
import { cn } from '../lib/utils';
import { ThemeToggle } from './ThemeToggle';

const nav = [
  { to: '/tools', label: 'Tools' },
  { to: '/categories', label: 'Categories' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'rounded-lg px-3 py-2 text-sm font-medium',
    isActive ? 'text-brand-700 dark:text-brand-300' : 'text-slate-700 hover:text-brand-700 dark:text-slate-300 dark:hover:text-brand-300',
  );

export function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-ink-950/90">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5 font-semibold text-ink-900 dark:text-white" aria-label={`${SITE.name} home`}>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white"><Wrench className="h-5 w-5" aria-hidden="true" /></span>
          <span className="text-lg tracking-tight">{SITE.name}</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {nav.map((n) => <NavLink key={n.to} to={n.to} className={linkClass}>{n.label}</NavLink>)}
          <div className="ml-2"><ThemeToggle /></div>
        </nav>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-slate-200 px-4 py-3 dark:border-slate-800 md:hidden">
          <ul className="flex flex-col">
            {nav.map((n) => (
              <li key={n.to}><NavLink to={n.to} className={(s) => cn(linkClass(s), 'block py-3 text-base')}>{n.label}</NavLink></li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
