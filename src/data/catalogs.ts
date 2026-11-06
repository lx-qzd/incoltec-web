import fs from 'node:fs';
import path from 'node:path';
import type { Lang } from '../i18n/routes';

/**
 * Catalogue PDFs. Drop the files in /public/downloads/ and set `file` to the
 * public path (e.g. "/downloads/incoltec-horeca-catalogue-2026-es.pdf").
 * Version the file name when a new edition is published.
 *
 * While `file` is null the page shows a "Request catalogue" button that opens
 * the contact form with the catalogue preselected, instead of a dead link.
 */
export interface Catalog {
  id: 'horeca' | 'industrial';
  file: Record<Lang, string | null>;
}

export const catalogs: Catalog[] = [
  { id: 'horeca', file: { en: null, es: null } },
  { id: 'industrial', file: { en: null, es: null } },
];

/** Build-time check: a configured catalogue must exist, be a PDF and be non-empty. */
export function resolveCatalogFile(file: string | null): { href: string; sizeKb: number } | null {
  if (!file) return null;
  const abs = path.join(process.cwd(), 'public', file);
  if (!fs.existsSync(abs)) throw new Error(`Catalogue PDF not found: public${file}`);
  const buf = fs.readFileSync(abs);
  if (buf.length === 0 || buf.subarray(0, 5).toString() !== '%PDF-') {
    throw new Error(`Catalogue file is empty or not a PDF: public${file}`);
  }
  return { href: file, sizeKb: Math.round(buf.length / 1024) };
}
