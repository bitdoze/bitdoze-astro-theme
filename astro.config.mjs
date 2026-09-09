// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';

/** @param {string} page */
const sitemapFilter = (page) =>
  !page.includes('/page/') &&
  !page.includes('/search') &&
  !page.includes('/tags/') &&
  !page.includes('/404');

// https://astro.build/config
export default defineConfig({
  // Set the site URL for production
  site: process.env.SITE_URL || 'https://www.bitdoze.com',
  base: process.env.BASE_PATH || '/',
  
  // Configure Vite plugins and server settings
  vite: {
    plugins: [
      tailwindcss() // Reverted to simpler form, configPath removed
    ],
  },
  
  // Configure Astro integrations
  integrations: [
    mdx(),
    icon(),
    sitemap({
      filter: sitemapFilter,
      changefreq: 'weekly',
      priority: 0.7,
    }),
  ],
  
  // Prefetch links on hover for faster navigation
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
});
