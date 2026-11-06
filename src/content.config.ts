import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const productsCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/products" }),
  // `image` is a path relative to the .md file so Astro optimises it (WebP, srcset, dimensions).
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    applications: z.array(z.string()),
    color: z.string().optional(),
    solubility: z.string().optional(),
    phRange: z.string().optional(),
    pdfLink: z.string().optional(),
    image: image().optional(),
  }),
});

// English translations of the product sheets. Same file name (id) as the
// Spanish entry in ./products; technical fields not listed here are shared.
const productsEnCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/products-en" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    applications: z.array(z.string()),
    color: z.string().optional(),
    solubility: z.string().optional(),
  }),
});

// SEO landing pages by food sector. One file per language: sectors/{es,en}/<slug>.md
const sectorsCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/sectors" }),
  schema: z.object({
    title: z.string(),
    metaTitle: z.string(),
    description: z.string(),
    eyebrow: z.string(),
    order: z.number(),
    products: z.array(z.string()),
  }),
});

const blogCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    author: z.string().default('INCOLTEC'),
    image: z.string().optional(),
    summary: z.string(),
  }),
});

export const collections = {
  'products': productsCollection,
  'products-en': productsEnCollection,
  'sectors': sectorsCollection,
  'blog': blogCollection,
};
