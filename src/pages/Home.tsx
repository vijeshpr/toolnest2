import { Gauge, Lock, Smartphone, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdPlaceholder } from '../components/AdPlaceholder';
import { CategoryCard } from '../components/CategoryCard';
import { FAQ } from '../components/FAQ';
import { SEO } from '../components/SEO';
import { ToolGrid } from '../components/ToolGrid';
import { ToolSearch } from '../components/ToolSearch';
import { LinkButton } from '../components/ui/Button';
import { SITE } from '../config/site';
import { categories } from '../data/categories';
import type { FAQItem } from '../data/tools';
import { popularTools, tools } from '../data/tools';
import { faqLd, websiteLd } from '../lib/seo';

const faqs: FAQItem[] = [
  { q: 'Are these tools really free?', a: 'Yes. Every tool is free to use with no account. The site may show ads or offer optional extras in the future to cover running costs.' },
  { q: 'Are my files or text uploaded?', a: 'The calculators, text tools, QR generator and image tools all do their work in your browser, so your input is not sent to our servers by the tools themselves. See the Privacy Policy for what the site does collect.' },
  { q: 'How accurate are the calculators?', a: 'They use standard formulas and are suitable for estimates. For financial, tax or legal decisions, confirm the numbers with your lender, the official source or a professional.' },
  { q: 'Do I need to install anything?', a: 'No. Everything runs in a modern web browser on your phone or computer.' },
  { q: 'Can I suggest a new tool?', a: 'Yes, please use the contact page. Tool ideas that many people ask for are added first.' },
];

const why = [
  { icon: Lock, title: 'Your input stays with you', text: 'Calculations and image processing happen in your browser, so files and text are not uploaded by the tools.' },
  { icon: Gauge, title: 'Light and quick', text: 'Each tool loads only when you open it, so pages start fast even on a slow connection.' },
  { icon: Smartphone, title: 'Made for phones first', text: 'Large inputs, clear results and no horizontal scrolling on small screens.' },
  { icon: Sparkles, title: 'Plain explanations', text: 'Every tool says what it does, shows an example and answers common questions.' },
];

export default function Home() {
  const chips = ['emi', 'compress image', 'age', 'percentage', 'qr'];
  return (
    <>
      <SEO path="/" jsonLd={[websiteLd(), faqLd(faqs)]} />

      <section aria-labelledby="hero-heading" className="border-b border-slate-200 bg-gradient-to-b from-brand-50 to-slate-50 dark:border-slate-800 dark:from-brand-900/20 dark:to-ink-950">
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pt-20">
          <h1 id="hero-heading" className="max-w-3xl text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-6xl">
            {SITE.tagline}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            Calculators, converters, text and image tools. No sign-up, and the tools run in your browser.
          </p>
          <div className="mt-8 max-w-2xl">
            <ToolSearch large />
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              Try:{' '}
              {chips.map((c, i) => (
                <span key={c}>
                  <Link to={`/tools?q=${encodeURIComponent(c)}`} className="text-brand-700 underline underline-offset-2 dark:text-brand-300">{c}</Link>
                  {i < chips.length - 1 ? ', ' : ''}
                </span>
              ))}
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-16 px-4 py-14 sm:px-6">
        <section aria-labelledby="popular-heading">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 id="popular-heading" className="text-2xl font-semibold sm:text-3xl">Popular tools</h2>
            <Link to="/tools" className="text-sm font-medium text-brand-700 hover:underline dark:text-brand-300">View all tools</Link>
          </div>
          <ToolGrid tools={popularTools().slice(0, 6)} />
        </section>

        <AdPlaceholder slot="home-after-popular" className="!my-0" />

        <section aria-labelledby="cat-heading">
          <h2 id="cat-heading" className="mb-6 text-2xl font-semibold sm:text-3xl">Browse by category</h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => <li key={c.id}><CategoryCard category={c} /></li>)}
          </ul>
        </section>

        <section aria-labelledby="all-heading">
          <h2 id="all-heading" className="mb-6 text-2xl font-semibold sm:text-3xl">All tools</h2>
          <ToolGrid tools={tools} />
        </section>

        <section aria-labelledby="why-heading">
          <h2 id="why-heading" className="mb-6 text-2xl font-semibold sm:text-3xl">Why use {SITE.name}</h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {why.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-ink-900">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300"><Icon className="h-5 w-5" aria-hidden="true" /></span>
                <div>
                  <h3 className="font-semibold text-ink-900 dark:text-white">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <AdPlaceholder slot="home-before-faq" className="!my-0" />

        <div className="mx-auto max-w-3xl"><FAQ items={faqs} /></div>

        <section className="rounded-3xl bg-brand-700 px-6 py-10 text-center text-white sm:px-10">
          <h2 className="text-2xl font-semibold !text-white">Missing a tool you need?</h2>
          <p className="mx-auto mt-2 max-w-xl text-brand-100">Tell us what would save you time and we will consider it for the next release.</p>
          <div className="mt-6"><LinkButton to="/contact" variant="secondary" size="lg">Suggest a tool</LinkButton></div>
        </section>
      </div>
    </>
  );
}
