# Viidesi Studios website

The studio site and Chhatpat! landing page. Astro 7 (static build), Three.js hero, GSAP + Lenis motion.

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # static site in dist/
```

## Where things live

| What | File |
|---|---|
| Domain, email, Play Store link, version | `src/site.config.ts` |
| Heroes, landmarks, FAQ, numbers | `src/data/game.ts` |
| SEO head, nav, footer, English/Desi switch | `src/layouts/Base.astro` |
| JSON-LD (Organization, VideoGame, FAQ...) | `src/lib/schema.ts` |
| 3D rooftop runner in the hero | `src/scripts/hero3d.ts` |
| Scroll, reveals, videos, trailer dialog | `src/scripts/motion.ts` |
| Devlog posts (Markdown) | `src/content/devlog/*.md` |
| robots.txt, llms.txt, llms-full.txt | `src/pages/*.txt.ts` |
| Trailer, gameplay clips | `public/media/` |
| Press kit downloads | `public/press/` |
| Icons, favicon, share images (regenerate) | `node tools/make-images.mjs` |

Any element with `data-desi-text="..."` swaps to that text when a visitor picks **Desi** in the nav.

## Going live on GitHub Pages

1. Create a GitHub repository and push this folder to `main`.
2. Repository **Settings > Pages > Source: GitHub Actions**.
3. **Settings > Secrets and variables > Actions > Variables**:
   - with a custom domain: `SITE_URL=https://yourdomain.com`, `BASE_PATH=/`, and add the domain under Settings > Pages (put a `CNAME` file in `public/` with the domain);
   - without one: `SITE_URL=https://<user>.github.io`, `BASE_PATH=/<repo>/`.
4. Every push to `main` builds and deploys (`.github/workflows/deploy.yml`).

After it is live: add the site to Google Search Console and Bing Webmaster Tools, submit
`sitemap-index.xml`, and put the site URL in the Play Console listing (Store settings > Website), which
also makes `app-ads.txt` count for AdMob.
