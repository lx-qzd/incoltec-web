// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import vercel from "@astrojs/vercel";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: 'https://incoltec.com',
  redirects: {
    '/en/color-solutions': '/color-solutions',
    '/soluciones-de-color': '/es/color-solutions',
    '/about-incoltec': '/our-company#about',
    '/en/about-incoltec': '/our-company#about',
    '/laboratory-and-production': '/our-company#laboratory',
    '/en/laboratory-and-production': '/our-company#laboratory',
    '/quality-commitment': '/our-company#quality',
    '/en/quality-commitment': '/our-company#quality',
    '/organization': '/our-company#organization',
    '/en/organization': '/our-company#organization',
    '/sobre-incoltec': '/es/our-company#about',
    '/es/sobre-incoltec': '/es/our-company#about',
    '/laboratorio-y-produccion': '/es/our-company#laboratory',
    '/es/laboratorio-y-produccion': '/es/our-company#laboratory',
    '/compromiso-de-calidad': '/es/our-company#quality',
    '/es/compromiso-de-calidad': '/es/our-company#quality',
    '/organizacion': '/es/our-company#organization',
    '/es/organizacion': '/es/our-company#organization',
    // Former pages named after creative slogans (now sections / clear menu labels)
    '/vibrant-life': '/our-company#quality',
    '/es/vibrant-life': '/es/our-company#quality',
    '/taste-colors': '/products',
    '/es/taste-colors': '/es/products',
    '/perfecting-food': '/color-solutions',
    '/es/perfecting-food': '/es/color-solutions',
    '/es/soluciones-de-color': '/es/color-solutions',
    // Old incoltec.com URLs
    '/contacto': '/es/contact',
    '/aviso-legal': '/es/legal-notice',
    '/politica-de-proteccion-de-datos': '/es/privacy-policy',
    '/politica-de-cookies': '/es/cookie-policy',
  },
  i18n: {
    defaultLocale: "en",
    locales: ["en", "es"],
    routing: {
      prefixDefaultLocale: false
    }
  },

  integrations: [
    sitemap({
      // Only real pages; API routes and redirects are excluded automatically.
      i18n: { defaultLocale: 'en', locales: { en: 'en', es: 'es' } },
      filter: (page) => !page.includes('/api/'),
    }),
  ],

  vite: {
    plugins: [tailwindcss()]
  },

  adapter: vercel()
});