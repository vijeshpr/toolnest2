import { SEO } from '../components/SEO';
import { LinkButton } from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <SEO title="Page not found" description="The page you were looking for could not be found." path="/404" noindex />
      <p className="text-5xl font-bold text-brand-600 dark:text-brand-300">404</p>
      <h1 className="mt-4 text-2xl font-semibold">We couldn’t find that page</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">The link may be old or mistyped. Try browsing all tools instead.</p>
      <div className="mt-6 flex justify-center gap-3">
        <LinkButton to="/tools">Browse tools</LinkButton>
        <LinkButton to="/" variant="secondary">Go home</LinkButton>
      </div>
    </div>
  );
}
