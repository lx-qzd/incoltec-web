import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const productsCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/products" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    applications: z.array(z.string()),
    color: z.string().optional(),
    solubility: z.string().optional(),
    phRange: z.string().optional(),
    pdfLink: z.string().optional(),
    image: z.string().optional(),
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
  'blog': blogCollection,
};
