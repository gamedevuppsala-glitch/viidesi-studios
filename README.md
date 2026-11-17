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

## Publishing

Live at **https://gamedevuppsala-glitch.github.io/viidesi-studios/**, served by GitHub Pages from the
`gh-pages` branch.

```bash
npm run deploy    # builds with the Pages base path and pushes dist-pages/ to gh-pages
```

Push source changes to `main` as usual. The live site only changes when you run `npm run deploy`.

- **Custom domain later:** run `SITE_URL=https://yourdomain.com BASE_PATH=/ CNAME=yourdomain.com npm run deploy`,
  then add the domain under the repo's Settings > Pages and point its DNS at GitHub.
- **Auto-deploy on every push (optional):** run `gh auth refresh -s workflow`, move
  `tools/github-actions-deploy.yml` to `.github/workflows/deploy.yml`, and set Settings > Pages > Source to
  GitHub Actions with the repo variables `SITE_URL` and `BASE_PATH`.

After it is live: add the site to Google Search Console and Bing Webmaster Tools, submit
`sitemap-index.xml`, and put the site URL in the Play Console listing (Store settings > Website), which
also makes `app-ads.txt` count for AdMob.
