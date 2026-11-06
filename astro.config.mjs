// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import vercel from "@astrojs/vercel";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: 'https://incoltec.com',
  // One canonical form for every URL (/es/contact, never /es/contact/).
  // Vercel answers the slash variant with a permanent redirect.
  trailingSlash: 'never',
  // Prefetch internal links on hover for faster navigation.
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },

  // Self-hosted fonts (Astro Fonts API): downloaded at build time and served
  // from our own domain. No request to Google at runtime (privacy + speed),
  // with metric-matched fallbacks to reduce layout shift.
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Golden Hills',
      cssVariable: '--font-golden-hills',
      fallbacks: ['cursive'],
      options: {
        variants: [{ src: ['./src/assets/fonts/GoldenHillsDEMO.woff2'], weight: '100 900', style: 'normal' }],
      },
    },
    {
      provider: fontProviders.google(),
      name: 'Inter',
      cssVariable: '--font-inter',
      weights: ['300 700'],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Playfair Display',
      cssVariable: '--font-playfair',
      weights: ['400 700'],
      styles: ['normal', 'italic'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Great Vibes',
      cssVariable: '--font-great-vibes',
      weights: [400],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['cursive'],
    },
  ],
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
    '/sectors': '/color-solutions',
    '/es/sectors': '/es/color-solutions',
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
      filter: (page) => !page.includes('/api/') && !/\/(404|newsletter)$/.test(page),
      // Only the namespaces we use (hreflang alternates) to keep the XML small.
      namespaces: { news: false, video: false, image: false },
    }),
  ],

  vite: {
    plugins: [tailwindcss()]
  },

  adapter: vercel()
});