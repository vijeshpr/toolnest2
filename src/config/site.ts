export const SITE = {
  name: 'ToolNest',
  // Set VITE_SITE_URL in .env / your host's environment settings.
  url: ((import.meta.env.VITE_SITE_URL as string | undefined) || 'https://www.example.com').replace(/\/$/, ''),
  tagline: 'Free Online Tools That Make Everyday Tasks Easier',
  description:
    'Free online calculators, converters, text and image tools. No sign-up needed, and most tools run entirely in your browser.',
  // TODO: replace placeholders before launch.
  contactEmail: 'hello@example.com',
  legalName: 'ToolNest (replace with your legal/business name)',
  lastUpdated: '1 October 2026',
};

/** Feature flags for monetization. Flip on when ready; nothing is faked while these are false. */
export const FEATURES = {
  ads: false, // true => <AdPlaceholder /> renders a reserved container for your ad network's code
  premium: false, // reserved for a future no-ads / bulk-tools plan
  affiliate: false, // reserved for affiliate link components
};
