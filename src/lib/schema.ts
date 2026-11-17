// JSON-LD builders. Every page ships the Organization + WebSite graph; pages add their own nodes.
import { SITE, GAME, abs } from '../site.config';
import { HEROES, FAQ, LANDMARKS } from '../data/game';

export const ORG_ID = abs('#organization');
export const SITE_ID = abs('#website');
export const GAME_ID = abs('chhatpat/#game');

export const organization = () => ({
  '@type': 'Organization',
  '@id': ORG_ID,
  name: SITE.studio,
  alternateName: ['Viidesi', 'Viidesi Games', 'Viidesi Studio'],
  url: abs(),
  logo: { '@type': 'ImageObject', url: abs('brand/viidesi-mark.png'), width: 512, height: 512 },
  image: abs('og/home.jpg'),
  email: `mailto:${SITE.email}`,
  foundingDate: SITE.founded,
  description:
    'Viidesi Studios is an independent Indian video game studio making games by India, for India. Its first game is Chhatpat!, a desi rooftop parkour runner for Android.',
  knowsAbout: ['video game development', 'mobile games', 'Indian culture in games', 'procedural city generation', 'Unity', 'parkour games', 'local multiplayer'],
  areaServed: ['IN', 'Worldwide'],
  sameAs: [SITE.github, GAME.play].filter(Boolean),
  contactPoint: [{ '@type': 'ContactPoint', contactType: 'customer support', email: SITE.email, availableLanguage: ['English', 'Hindi'] }, { '@type': 'ContactPoint', contactType: 'advertising', email: SITE.email, availableLanguage: ['English', 'Hindi'] }],
  makesOffer: { '@type': 'Offer', itemOffered: { '@id': GAME_ID } },
});

export const website = () => ({
  '@type': 'WebSite',
  '@id': SITE_ID,
  url: abs(),
  name: `${SITE.studio}`,
  alternateName: 'Chhatpat! official site',
  publisher: { '@id': ORG_ID },
  inLanguage: ['en-IN', 'hi-IN'],
});

export const game = (shots: string[], trailer: { url: string; poster: string }) => ({
  '@type': ['VideoGame', 'MobileApplication'],
  '@id': GAME_ID,
  name: GAME.name,
  alternateName: ['Chhatpat', 'Chhatpat Desi Rooftop Run', 'Chattpat', 'Chhatpat Rooftop Run', 'छतपट'],
  url: abs('chhatpat/'),
  description: GAME.description,
  author: { '@id': ORG_ID },
  publisher: { '@id': ORG_ID },
  creator: { '@id': ORG_ID },
  genre: GAME.genre,
  gamePlatform: ['Android', 'Mobile phone', 'Android tablet'],
  operatingSystem: 'Android 8.0 or newer',
  applicationCategory: 'GameApplication',
  applicationSubCategory: 'Action game',
  playMode: ['SinglePlayer', 'MultiPlayer'],
  numberOfPlayers: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 4 },
  inLanguage: ['en', 'hi'],
  countryOfOrigin: { '@type': 'Country', name: 'India' },
  locationCreated: { '@type': 'Country', name: 'India' },
  softwareVersion: GAME.version,
  installUrl: GAME.play,
  downloadUrl: GAME.play,
  isAccessibleForFree: true,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR', availability: 'https://schema.org/InStock', url: GAME.play },
  image: shots.map((s) => abs(s)),
  screenshot: shots.map((s) => abs(s)),
  keywords:
    'Indian game, desi game, Made in India game, rooftop runner, parkour game Android, offline game, local multiplayer Wi-Fi game, Hinglish game, kite game, Diwali game, Indian city game, endless runner India',
  gameItem: ['Patang (kite)', 'Chai', 'Gulel (catapult)', '55 outfits', 'Golden puzzle pieces', 'Home objects'],
  gameLocation: [
    { '@type': 'Place', name: 'A procedurally generated Indian city' },
    ...LANDMARKS.map((n) => ({ '@type': 'Place', name: n })),
  ],
  character: HEROES.map((h) => ({ '@type': 'Person', name: h.name, description: `${h.intro[1]} Story: ${h.story}. ${h.logline}` })),
  trailer: {
    '@type': 'VideoObject',
    name: 'Chhatpat! trailer: Desi Rooftop Run',
    description: 'A 36-second look at Chhatpat!: rooftop parkour, kites, Diwali Mela and play with friends in a desi city.',
    thumbnailUrl: abs(trailer.poster),
    contentUrl: abs(trailer.url),
    uploadDate: '2026-11-12',
    duration: 'PT36S',
  },
});

export const faqPage = (items = FAQ) => ({
  '@type': 'FAQPage',
  mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});

export const breadcrumbs = (trail: { name: string; path: string }[]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.name, item: abs(t.path) })),
});

export const graph = (...nodes: object[]) => ({ '@context': 'https://schema.org', '@graph': [organization(), website(), ...nodes] });
