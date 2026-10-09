// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import node from "@astrojs/node";

import vercel from "@astrojs/vercel";

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
  },
  i18n: {
    defaultLocale: "en",
    locales: ["en", "es"],
    routing: {
      prefixDefaultLocale: false
    }
  },

  vite: {
    plugins: [tailwindcss()]
  },

  adapter: vercel()
});