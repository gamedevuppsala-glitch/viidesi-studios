import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// SITE_URL: the live address (custom domain or https://<user>.github.io).
// BASE_PATH: "/" for a custom domain or a <user>.github.io repo, "/<repo>/" for a project page.
const site = process.env.SITE_URL || 'https://viidesi.studio';
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  image: { responsiveStyles: false },
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en-IN', hi: 'hi-IN' } },
      changefreq: 'weekly',
      serialize(item) {
        const path = new URL(item.url).pathname;
        if (path === base) item.priority = 1.0;
        else if (item.url.includes('/chhatpat/')) item.priority = 0.9;
        else item.priority = 0.7;
        item.lastmod = new Date().toISOString();
        return item;
      },
    }),
  ],
  vite: { build: { assetsInlineLimit: 2048 } },
});
