/**
 * Analytics abstraction. The app only ever calls `analytics.pageview()` / `analytics.event()`.
 * To use another provider (Plausible, Umami, ...), implement `AnalyticsProvider` and call
 * `setAnalyticsProvider()` in initAnalytics(). No tracking happens unless an ID is configured.
 */
export interface AnalyticsProvider {
  pageview(path: string): void;
  event(name: string, params?: Record<string, string | number | boolean>): void;
}

const noop: AnalyticsProvider = { pageview() {}, event() {} };
let provider: AnalyticsProvider = noop;

export function setAnalyticsProvider(p: AnalyticsProvider) {
  provider = p;
}

export const analytics = {
  pageview: (path: string) => provider.pageview(path),
  event: (name: string, params?: Record<string, string | number | boolean>) => provider.event(name, params),
};

type GtagWindow = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };

function googleAnalytics(id: string): AnalyticsProvider {
  const w = window as GtagWindow;
  w.dataLayer = w.dataLayer || [];
  w.gtag = function () {
    // gtag requires the `arguments` object, not an array
    w.dataLayer!.push(arguments);
  };
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(s);
  w.gtag?.('js', new Date());
  w.gtag?.('config', id, { send_page_view: false });
  return {
    pageview: (path) => w.gtag?.('event', 'page_view', { page_path: path }),
    event: (name, params) => w.gtag?.('event', name, params),
  };
}

export function initAnalytics() {
  const id = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;
  if (id) setAnalyticsProvider(googleAnalytics(id));
  // If you need cookie consent, gate the call above behind your consent logic.
}
