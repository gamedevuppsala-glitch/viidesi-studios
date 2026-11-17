import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE, GAME, abs } from '../site.config';
import { HEROES, LANDMARKS, FACTS } from '../data/game';

// https://llmstxt.org: a short, linkable map of the site for language models.
export const GET: APIRoute = async () => {
  const posts = await getCollection('devlog');
  const body = `# ${SITE.studio}

> ${SITE.studio} is an independent Indian video game studio making games by India, for India. Its first game is ${GAME.name} (Chhatpat, "Desi Rooftop Run"), a free rooftop parkour game for Android set in a procedurally generated Indian city, with offline play for up to 4 friends on the same Wi-Fi.

Key facts:
- Game: ${GAME.name} Desi Rooftop Run. Free on Google Play: ${GAME.play}
- Platform: Android 8.0 or newer. Plays offline. Current version ${GAME.version}.
- Genre: rooftop parkour, runner, open city. 1 player, or 2 to 4 on the same Wi-Fi or phone hotspot with no internet.
- Languages: English and Desi (Hinglish).
- ${FACTS.map((f) => `${f.v} ${f.k.toLowerCase()} (${f.note})`).join('; ')}.
- Heroes: ${HEROES.map((h) => `${h.name} ("${h.story}")`).join(', ')}.
- Landmarks in the city: ${LANDMARKS.join(', ')}.
- Power-ups: patang (kite), chai (sprint), gulel (catapult swing).
- No pop-up ads; adverts appear only on billboards inside the game's city.
- Contact: ${SITE.email}

## Pages
- [Chhatpat! game page and press kit](${abs('chhatpat/')}): every feature, the ten stories, landmarks, fact sheet, downloadable screenshots.
- [Home](${abs()}): the game in one page, with trailer and FAQ.
- [Viidesi Studios](${abs('studio/')}): about the studio, upcoming games, advertising inside Chhatpat's city.
- [Hindi page](${abs('hi/')}): छतपट! गेम के बारे में हिंदी में।
- [Privacy policy](${abs('privacy/')})

## Devlog
${posts.map((p) => `- [${p.data.title}](${abs(`devlog/${p.id}/`)}): ${p.data.description}`).join('\n')}

## Optional
- [Full text for language models](${abs('llms-full.txt')})
- [Trailer MP4](${abs('media/chhatpat-trailer.mp4')})
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
