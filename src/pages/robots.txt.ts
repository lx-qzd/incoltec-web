import type { APIRoute } from 'astro';

// Mirrors the noindex logic in Layout.astro: only a build with
// SITE_INDEXABLE=true (production on incoltec.com) may be crawled.
export const GET: APIRoute = ({ site }) => {
  const indexable = (process.env.SITE_INDEXABLE ?? import.meta.env.SITE_INDEXABLE) === 'true';
  const base = (site?.toString() ?? 'https://incoltec.com/').replace(/\/$/, '');
  const body = indexable
    ? `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${base}/sitemap-index.xml\n`
    : `User-agent: *\nDisallow: /\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
