# Viidesi Studios website: plan

**Kind:** gaming (a studio launching its first game). **Main action:** Get Chhatpat on Google Play.
**Who buys:** Indian phone players 13+, diaspora players who miss the mohalla, press and creators,
brands who want billboards inside the game's city.

## Stack

- **Astro 5** (Node build, static output): every word is in the HTML, so Google and AI crawlers read
  the full page without running JavaScript. Zero JS by default, islands only where things move.
- **Three.js** for the 3D hero: a blocky rooftop city at dusk in the game's own look, a blocky runner
  hopping roof to roof, kites in the sky. Tap or Space makes the runner jump: a playable 20-second
  taste of the game right in the hero.
- **GSAP + ScrollTrigger** for the heading reveals and the one pinned chapter; **Lenis** smooth
  scroll. All motion stops under `prefers-reduced-motion`.
- **astro:assets + sharp**: the Unity screenshots become AVIF/WebP at several sizes.
- **ffmpeg**: the 87 MB Play Store showreel becomes a 720p web trailer and a short muted hero loop.
- **GitHub Actions** builds and deploys to GitHub Pages on every push to `main`.

## Pages (six kinds, not a maze)

| URL | Job |
|---|---|
| `/` | Landing: Chhatpat first, Viidesi around it. Hero 3D runner, trailer, the city, 10 heroes, friends + ghar, moves, festivals, studio slate, FAQ, close |
| `/chhatpat/` | The deep game page and press kit: every feature, all 10 stories, landmarks, fact sheet, downloadable screenshots and icon |
| `/studio/` | Viidesi Studios: who we are, what we make next, brands in the city (in-game billboards), contact |
| `/devlog/` + 3 posts | Long-form posts on how the game is made (procedural Indian city, the heroes, offline Wi-Fi multiplayer). Real search traffic lives here |
| `/hi/` | Hindi landing page for Hindi searches |
| `/privacy/` | The game's privacy policy (Play Console needs a URL) |

Plus `robots.txt` (welcomes GPTBot, ClaudeBot, PerplexityBot, Google-Extended...), `sitemap-index.xml`,
`llms.txt` and `llms-full.txt` (the whole fact sheet for AI answer engines), `app-ads.txt` (AdMob
needs it on the developer site), `site.webmanifest`, `humans.txt`, a 404.

## SEO layer

- JSON-LD on every page: `Organization`, `WebSite`, `VideoGame` + `MobileApplication` (genre,
  platform, price 0, content rating, languages, screenshots, trailer `VideoObject`, characters),
  `FAQPage`, `BreadcrumbList`, `BlogPosting` on posts.
- Unique title + description per page, canonical, Open Graph + Twitter cards with a 1200x630 image,
  `hreflang` en/hi/x-default, theme colour, real alt text on every picture.
- Search intent covered in plain visible copy (never hidden text, which Google penalises): "Indian
  mobile game", "desi game", "parkour game Android", "offline game India", "Subway Surfers-style
  Indian runner", "Made in India game", "Hinglish game", "multiplayer game same Wi-Fi", festival
  searches (Diwali, Makar Sankranti kite game), landmarks (Red Fort, Qutub Minar, Agrasen ki Baoli).
- Fast: static HTML, fonts self-hosted, images AVIF, 3D loads after first paint behind a still poster.

## Look

Taken from the game's own icon and store art: deep indigo night (#0B1640), marigold (#FF8A1F),
saffron (#FFC23D), teal (#19B3A3), rani pink (#E8457A), cream (#FFF4E2). Dark premium grounds,
painted marigolds as the one ornament. Type: Bricolage Grotesque (display, heavy), Instrument Sans
(body), Yatra One for the few Devanagari words.

## Fun bits

- Playable hero runner (tap / Space to jump the gully).
- **English | Desi** switch in the nav: the page flips into Hinglish, like the game's own Desi mode.
- Hero cards turn over to the game's own intro line ("YEH HAI PAPPU. 300 WEDDINGS. ONE DHOL.").
- Landmarks marquee, hover zoom on screenshots, magnetic Play button, kite cursor trail on desktop.

## Still to come from you

- Domain (viidesi.com? viidesistudios.com?) or the GitHub Pages address; set once in `site.config.mjs`.
- A public contact email for the studio (privacy policy currently lists the personal Gmail).
- Whether Chhatpat is live on Play yet (the button links to `com.viidesi.chatpat`).
