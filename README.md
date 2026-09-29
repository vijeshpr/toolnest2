# ToolNest

Free online tools site: React + Vite + TypeScript + Tailwind CSS + lucide-react.

## Commands
```bash
npm install
npm run dev        # local dev server
npm run typecheck  # tsc --noEmit
npm run build      # sitemap + typecheck + production build -> dist/
npm run preview    # serve dist/ locally
```

## Configure before launch
1. Copy `.env.example` to `.env`; set `VITE_SITE_URL` (canonical URLs, Open Graph, sitemap) and optionally `VITE_GA_MEASUREMENT_ID`.
2. `src/config/site.ts`: `contactEmail`, `legalName`, `lastUpdated`.
3. Search the code for `[REPLACE:` (About, Contact, Privacy, Terms) and fill in real details; have the legal pages reviewed.
4. Ads: set `FEATURES.ads = true` in `src/config/site.ts` and mount your ad network code in `src/components/AdPlaceholder.tsx`.
5. Add a real Open Graph image (`og:image`) once you have one.

## Add a tool
1. Create `src/tools/MyTool.tsx` with a default-exported component (see `WordCounter.tsx`).
2. Add one entry to `tools` in `src/data/tools.ts` (name, slug, category, icon, keywords, SEO text, FAQs).
Routing, search, category pages, sitemap, meta tags and JSON-LD update automatically.
To add a category, edit `src/data/categories.ts`.

## Deploy (static hosting)
Build command `npm run build`, output directory `dist`.
- Netlify / Cloudflare Pages: `public/_redirects` already provides the SPA fallback.
- Vercel: `vercel.json` provides the rewrite.
- Set `VITE_SITE_URL` in the host's environment variables.
- Submit `https://your-domain/sitemap.xml` in Google Search Console.

## SEO note
Titles, descriptions, canonicals and JSON-LD are set in the browser per route. Googlebot renders JavaScript, but many social/link-preview crawlers do not. For best results, add build-time prerendering later (for example a prerender plugin) without changing the components.
