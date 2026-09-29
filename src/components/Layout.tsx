import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { analytics } from '../lib/analytics';
import { Footer } from './Footer';
import { Header } from './Header';

function RouteEffects() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    analytics.pageview(pathname);
  }, [pathname]);
  return null;
}

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only z-50 rounded-lg bg-white px-4 py-2 text-brand-700 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to content</a>
      <RouteEffects />
      <Header />
      <main id="main" className="flex-1">
        <Suspense fallback={<div className="mx-auto max-w-6xl px-4 py-24 text-center text-slate-500" role="status">Loading…</div>}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
