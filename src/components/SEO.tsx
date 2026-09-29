import { useEffect } from 'react';
import { SITE } from '../config/site';
import { absUrl } from '../lib/seo';

interface Props {
  title?: string; // page title; site name is appended unless it already contains it
  description?: string;
  path: string; // canonical path, e.g. /tools/age-calculator
  type?: 'website' | 'article';
  jsonLd?: object[];
  noindex?: boolean;
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/** Lightweight head manager (no dependency). Reusable on every page and tool. */
export function SEO({ title, description = SITE.description, path, type = 'website', jsonLd, noindex }: Props) {
  const fullTitle = !title ? `${SITE.name} – ${SITE.tagline}` : title.includes(SITE.name) ? title : `${title} | ${SITE.name}`;
  const url = absUrl(path);
  const ld = jsonLd ? JSON.stringify(jsonLd) : '';

  useEffect(() => {
    document.title = fullTitle;
    setMeta('name', 'description', description);
    setMeta('name', 'robots', noindex ? 'noindex,follow' : 'index,follow');
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:site_name', SITE.name);
    setMeta('name', 'twitter:card', 'summary');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);

    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = url;

    let script: HTMLScriptElement | null = null;
    if (ld) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = ld;
      document.head.appendChild(script);
    }
    return () => { script?.remove(); };
  }, [fullTitle, description, url, type, noindex, ld]);

  return null;
}
