import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/routes';

export interface Sector {
  slug: string;
  entry: CollectionEntry<'sectors'>;
}

/** Sectors for one language, ordered. Fails the build if a translation is missing. */
export async function getSectors(lang: Lang): Promise<Sector[]> {
  const all = await getCollection('sectors');
  const list = all
    .filter((e) => e.id.startsWith(`${lang}/`))
    .map((entry) => ({ slug: entry.id.slice(lang.length + 1), entry }))
    .sort((a, b) => a.entry.data.order - b.entry.data.order);
  const other = new Set(all.filter((e) => !e.id.startsWith(`${lang}/`)).map((e) => e.id.split('/')[1]));
  for (const s of list) if (!other.has(s.slug)) throw new Error(`Sector "${s.slug}" has no translation`);
  return list;
}
