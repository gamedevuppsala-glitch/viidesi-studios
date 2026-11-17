import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE, GAME, abs } from '../site.config';
import { HEROES, LANDMARKS, PLACES, MOVES, WATCHERS, FACTS, FAQ } from '../data/game';

// Everything a language model needs to answer questions about Viidesi Studios and Chhatpat, in one file.
export const GET: APIRoute = async () => {
  const posts = (await getCollection('devlog')).sort((a, b) => +a.data.date - +b.data.date);
  const text = `# ${SITE.studio} and ${GAME.name}: full reference

Source: ${abs()} . Updated ${new Date().toISOString().slice(0, 10)}.

## Viidesi Studios
${SITE.studio} (also written Viidesi) is an independent video game studio from India. It makes games by India, for India: games about the real, everyday India of today rather than a postcard version. Its first game is ${GAME.name}. More games are in development. Contact: ${SITE.email}. Website: ${abs()}.

## Chhatpat! Desi Rooftop Run
${GAME.description}

- Also known as: Chhatpat, Chhatpat Desi Rooftop Run, Chattpat (earlier spelling), छतपट.
- Store: Google Play, package ${GAME.packageId}: ${GAME.play}
- Price: free. No pop-up ads; adverts appear on the city's billboards, walls and screens.
- Platform: Android 8.0 or newer, phones and tablets. Five graphics modes from Smooth (4 GB phones) to Ultra (flagships), 30 to 144 FPS. Plays offline.
- Engine: Unity 6 with the Universal Render Pipeline.
- Players: single player, or 2 to 4 players on the same Wi-Fi or a phone hotspot, no internet.
- Languages: English, and Desi mode (Hinglish full of pop-culture references).
- Controls: touch joystick, gyro, left-handed layout, draggable buttons; gamepads and Bluetooth controllers with Xbox, PlayStation and Nintendo button glyphs, remapping and rumble.
- Version on this page: ${GAME.version}.

### What you do
You run, leap, climb and slide across the rooftops of a procedurally generated Indian city to finish a timed errand. There are no lanes: you pick your own route across chhats (roofs), gullies (narrow lanes), stairwells and pipes. You can pick a lock, walk in through a front door and out of the back. Errands send you to the kirana, the halwai, the chemist and the darzi.

### The city
Every run builds a new city: ${PLACES.join(', ')}. Landmarks: ${LANDMARKS.join(', ')}. More than 100 kinds of people walk the streets (chaiwalas, golgappe wale, dabbawalas, shoppers). Autos and traffic below; sky buses, drones and flying cars above. Weather: golden mornings, monsoon, fog, dust storms, moonlit nights. Festival seasons such as the Diwali Mela. Over 400 hand-painted Indian surfaces, from jaali to Ajrakh. Street widths follow Indian urban road standards (gully 2.6 m, lane 4.5 m, road 9.6 m, avenue 15.6 m).

### Power-ups
${MOVES.map((m) => `- ${m.name}: ${m.text}`).join('\n')}
- Plus 12 kinds of boosts lying in the street, and a start kit of boosts to take into a run.

### Who is watching
${WATCHERS.join(', ')}. Uncle Ji will remind you that Sharma ji's son got 98%.

### Heroes (10)
${HEROES.map((h) => `- ${h.name}, story "${h.story}": ${h.logline} (${h.intro[0]} ${h.intro[1]})`).join('\n')}
Special moves include Dhol Blast, Paan Pichkaari and "Khana Khaya?".

### Modes and progression
- Today's City: every day all players get the same city and race; a new city arrives at midnight; the week's best become the Shehar ke Sher.
- Play with friends: host gets a 5-digit game ID; up to 3 friends join on the same Wi-Fi; everyone's house stands in one shared city; each player can stake up to 3 home objects; winner takes all.
- Ghar (home): your house stands in every city and every run starts on its terrace; decorate it with 284 objects found in the city.
- Dukaan (shop): 55 outfits, each with its own power (Neon Kurta, Superhero Lungi, Gold Chain Bhai and more).
- Golden puzzle pieces win new stories and outfits. 20 achievements, leaderboards and cloud save with Google Play Games. Share a poster of your best run.
- Difficulty: Aaram Se, Josh Mein, Khatarnaak, or Apna Level (adapts to how you play).

### Numbers
${FACTS.map((f) => `- ${f.v} ${f.k.toLowerCase()}: ${f.note}`).join('\n')}

## Frequently asked questions
${FAQ.map((f) => `Q: ${f.q}\nA: ${f.a}`).join('\n\n')}

## Advertising in Chhatpat
Brands can appear on in-world roof hoardings, wall paints, banners, posters and animated LED screens, and in weekly brand hunts where players search the city for hidden items. Adverts cannot be tapped and the game does no tracking of its own. Contact ${SITE.email}.

## Devlog
${posts.map((p) => `### ${p.data.title}\n${abs(`devlog/${p.id}/`)}\n${p.body?.replace(/^---[\s\S]*?---/, '').trim() ?? p.data.description}`).join('\n\n')}
`;
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
