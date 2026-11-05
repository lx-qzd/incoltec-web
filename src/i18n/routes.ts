/**
 * Central EN/ES route map.
 *
 * Every public page exists in both languages under the same path, with the
 * Spanish one prefixed by `/es`. The only exception today is blog articles,
 * which are published in English only: their Spanish alternate falls back to
 * the Spanish blog index, and `translated` is false so the layout does not emit
 * a misleading hreflang pair.
 */

export type Lang = 'en' | 'es';

export const SITE_URL = 'https://incoltec.com';

/** Paths (without /es prefix) that only exist in English. */
const EN_ONLY_PATTERNS: RegExp[] = [/^\/blog\/.+/];

export function normalizePath(pathname: string): string {
  if (!pathname) return '/';
  const p = pathname.replace(/\/index\.html$/, '').replace(/\.html$/, '');
  return p.length > 1 && p.endsWith('/') ? p.slice(0, -1) : p;
}

export function getLang(pathname: string): Lang {
  return /^\/es(\/|$)/.test(pathname) ? 'es' : 'en';
}

/** Path without the language prefix, always starting with "/". */
export function basePath(pathname: string): string {
  const p = normalizePath(pathname);
  return normalizePath(p.replace(/^\/es(?=\/|$)/, '') || '/');
}

export function localizePath(path: string, lang: Lang): string {
  const base = basePath(path);
  if (lang === 'en') return base;
  return base === '/' ? '/es' : `/es${base}`;
}

export interface Alternates {
  en: string;
  es: string;
  /** false when one of the two languages is a fallback rather than a translation. */
  translated: boolean;
}

export function getAlternates(pathname: string): Alternates {
  const base = basePath(pathname);
  const enOnly = EN_ONLY_PATTERNS.some((re) => re.test(base));
  if (enOnly) {
    const section = '/' + base.split('/')[1];
    return { en: base, es: localizePath(section, 'es'), translated: false };
  }
  return { en: localizePath(base, 'en'), es: localizePath(base, 'es'), translated: true };
}

/** Link to the contact page with optional product/reason context. */
export function contactUrl(lang: Lang, params: { product?: string; reason?: string } = {}): string {
  const url = localizePath('/contact', lang);
  const q = new URLSearchParams();
  if (params.reason) q.set('reason', params.reason);
  if (params.product) q.set('product', params.product);
  const qs = q.toString();
  return qs ? `${url}?${qs}` : url;
}
