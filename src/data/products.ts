import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';
import type { Lang } from '../i18n/routes';

export type FamilyKey = 'natural-colours' | 'colouring-foods' | 'vitamins-premixes';

export const families: Record<FamilyKey, { en: string; es: string }> = {
  'natural-colours': { en: 'Natural colours', es: 'Colorantes naturales' },
  'colouring-foods': { en: 'Colouring foods (LINICOL)', es: 'Alimentos colorantes (LINICOL)' },
  'vitamins-premixes': { en: 'Vitamins and premixes', es: 'Vitaminas y premixes' },
};

const categoryToFamily: Record<string, FamilyKey> = {
  'Colorantes Naturales': 'natural-colours',
  'Alimentos Colorantes': 'colouring-foods',
  'Vitaminas y Premixes': 'vitamins-premixes',
};

export function familyOf(category: string): FamilyKey {
  const key = categoryToFamily[category];
  if (!key) throw new Error(`Unknown product category "${category}". Add it to src/data/products.ts`);
  return key;
}

export interface LocalizedProduct {
  id: string;
  family: FamilyKey;
  familyLabel: string;
  title: string;
  description: string;
  applications: string[];
  color?: string;
  solubility?: string;
  phRange?: string;
  image?: ImageMetadata;
  /** The entry whose markdown body should be rendered. */
  entry: CollectionEntry<'products'> | CollectionEntry<'products-en'>;
}

export async function localizeProduct(
  product: CollectionEntry<'products'>,
  lang: Lang,
): Promise<LocalizedProduct> {
  const family = familyOf(product.data.category);
  const en = lang === 'en' ? await getEntry('products-en', product.id) : undefined;
  if (lang === 'en' && !en) {
    throw new Error(`Missing English translation for product "${product.id}" (src/content/products-en/${product.id}.md)`);
  }
  const src = en ? en.data : product.data;
  return {
    id: product.id,
    family,
    familyLabel: families[family][lang],
    title: src.title,
    description: src.description,
    applications: src.applications,
    color: src.color,
    solubility: src.solubility,
    phRange: product.data.phRange,
    image: product.data.image,
    entry: en ?? product,
  };
}

export async function getLocalizedProducts(lang: Lang): Promise<LocalizedProduct[]> {
  const all = await getCollection('products');
  const order: FamilyKey[] = ['natural-colours', 'colouring-foods', 'vitamins-premixes'];
  const items = await Promise.all(all.map((p) => localizeProduct(p, lang)));
  return items.sort(
    (a, b) => order.indexOf(a.family) - order.indexOf(b.family) || a.title.localeCompare(b.title, lang),
  );
}

/** Swatch colour for the product's shade label (works for EN and ES labels). */
export function swatch(color = ''): string {
  const c = color.toLowerCase();
  if (/(amarill|yellow|dorad|golden)/.test(c)) return '#FBBF24';
  if (/(naranja|orange)/.test(c)) return '#F97316';
  if (/(rojo|red|rubí|ruby|magenta|granate|garnet|escarlata|scarlet|rosa|pink)/.test(c)) return '#EF4444';
  if (/(verde|green)/.test(c)) return '#10B981';
  if (/(azul|blue|índigo|indigo|celeste)/.test(c)) return '#3B82F6';
  if (/(violeta|violet|púrpura|purple)/.test(c)) return '#7C3AED';
  if (/(negro|black)/.test(c)) return '#111827';
  if (/(blanco|white|marfil|ivory|crema|cream)/.test(c)) return '#FFFFFF';
  return '#CCCCCC';
}
