// One place for every fact the site repeats. Change the domain, the email or the store link here.
export const SITE = {
  studio: 'Viidesi Studios',
  studioShort: 'Viidesi',
  url: new URL(import.meta.env.SITE as string).origin, // set by SITE_URL in astro.config.mjs
  // Public studio inbox. The privacy policy already lists this address; swap for a studio domain mail when you have one.
  email: 'gamedevuppsala@gmail.com',
  locale: 'en_IN',
  twitter: '',
  github: 'https://github.com/gamedevuppsala-glitch',
  founded: '2026',
  country: 'IN',
};

export const GAME = {
  name: 'Chhatpat!',
  plain: 'Chhatpat',
  tagline: 'Desi Rooftop Run',
  slug: 'chhatpat',
  packageId: 'com.viidesi.chatpat',
  play: 'https://play.google.com/store/apps/details?id=com.viidesi.chatpat',
  version: '0.34.0',
  genre: ['Action', 'Parkour', 'Endless runner', 'Open city', 'Casual'],
  platforms: ['Android'],
  languages: ['English', 'Hinglish (Desi)'],
  short:
    'Run the rooftops of a desi city, build your ghar, race friends on the same Wi-Fi.',
  description:
    'Chhatpat! is a free rooftop parkour game for Android, made in India for India. Every run builds a brand-new Indian city of havelis, chawls, bazaars, temples and stepwells. Sprint from chhat to chhat, fly a patang, gulp chai, dodge Uncle Ji, and race up to 4 friends on the same Wi-Fi with no internet.',
};

const BASE = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : import.meta.env.BASE_URL + '/';
/** Site-relative link that respects the base path. u('chhatpat/') -> '/chhatpat/' or '/repo/chhatpat/'. */
export const u = (p = '') => BASE + p.replace(/^\//, '');
/** Absolute URL for canonical, OG and JSON-LD. */
export const abs = (p = '') => SITE.url + u(p);
