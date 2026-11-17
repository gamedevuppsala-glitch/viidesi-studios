// Facts taken from the game itself (StoryCatalog.cs, store listing). Nothing here is invented.

export type Hero = {
  id: string; name: string; story: string; logline: string; intro: [string, string];
  colour: string; clip?: string;
};

export const HEROES: Hero[] = [
  { id: 'aarav', name: 'Aarav', story: 'Home Alone', logline: "Riya's parents are out. For now.", intro: ['Yeh hai Aarav.', '22. BA pass (third attempt). Hopeless romantic.'], colour: '#3FAE5A' },
  { id: 'raju', name: 'Raju', story: '10-Minute Delivery', logline: 'One order. One address. One very specific item.', intro: ['Yeh hai Raju.', '4.9 stars. Zero chill. Never checks the package.'], colour: '#E5483B' },
  { id: 'golu', name: 'Golu', story: 'Howzat', logline: 'One six. One window. One very angry Sharma Uncle.', intro: ['Yeh hai Golu.', 'Age 9. Batting average 3. Window average 100%.'], colour: '#E0533A' },
  { id: 'bunty', name: 'Bunty', story: 'Rishta Runner', logline: 'Aunty Ji arranged a rishta. The gully final starts in five.', intro: ['Yeh hai Bunty.', 'Opening batsman. Runaway groom. Still in the sherwani.'], colour: '#D2468F' },
  { id: 'dadi', name: 'Kamla Dadi', story: 'Prime Time', logline: 'Power cut. Her serial starts in minutes. The neighbour has a generator.', intro: ['Yeh hain Kamla Dadi.', '78. Bad knee. Has not missed an episode since 2003.'], colour: '#E39A2B' },
  { id: 'pappu', name: 'Pappu', story: 'Band Baaja Bhaag', logline: "The baraat can't move without its dhol. The dhol is Pappu.", intro: ['Yeh hai Pappu.', '300 weddings. One dhol. Zero days off.'], colour: '#F08A1C' },
  { id: 'sweety', name: 'Sweety', story: 'Golden Hour', logline: 'Golden hour lasts twenty minutes. The brand deal needs one selfie.', intro: ['Yeh hai Sweety.', '1.2M followers. 14 ring lights. Filter on since 2020.'], colour: '#8FB7D9' },
  { id: 'mummy', name: 'Mummy', story: 'Cooker ki Seeti', logline: 'Three seetis done. The fourth one takes the ceiling.', intro: ['Yeh hain Mummy.', 'Kitty party queen. Housie champion. Dal in mortal danger.'], colour: '#C9433F' },
  { id: 'munna', name: 'Munna', story: 'Sulabh Sprint', logline: "Sharma Aunty's rajma. One working toilet. 1.4 km.", intro: ['Yeh hai Munna.', 'Three plates of rajma-chawal. One working toilet.'], colour: '#5D8F3E' },
  { id: 'tinku', name: 'Tinku', story: 'Forwarded Many Times', logline: 'Chacha forwarded a scam to 212 groups. Delete it before Dadi reads it.', intro: ['Yeh hai Tinku.', '19. Family IT department. Unpaid. Unstoppable.'], colour: '#2B8FB3' },
];

export const LANDMARKS = [
  'Red Fort', 'Qutub Minar', 'India Gate', "Humayun's Tomb", 'Jama Masjid', 'Akshardham',
  'Lotus Temple', 'Agrasen ki Baoli',
];

export const PLACES = [
  'havelis', 'chawls', 'bazaars', 'gullies', 'temples', 'masjids', 'gurudwaras', 'stepwells',
  'kirana stores', 'halwai shops', 'darzi workshops', 'cinemas',
];

export const MOVES = [
  { id: 'patang', name: 'Patang', desi: 'Patang udao', text: 'Ride a kite over the roofs and drop in where the route is clear.', clip: 'kite_chase' },
  { id: 'chai', name: 'Chai', desi: 'Chai sutta break', text: 'One gulp and you sprint faster for a while.', clip: 'roofjump_a' },
  { id: 'gulel', name: 'Gulel', desi: 'Gulel chalao', text: 'Fire the catapult and swing up to the highest point ahead.', clip: 'hook_street' },
];

export const WATCHERS = [
  'Uncle Ji', 'chowkidars', 'the havaldar', 'monkeys that steal power-ups', 'chappal-throwing uncles',
  'cows who will not move', 'nosy aunties', 'stray dogs',
];

export const FACTS = [
  { k: 'Heroes', v: '10', note: 'each with a filmi emergency' },
  { k: 'Outfits', v: '55', note: 'each brings its own power' },
  { k: 'Indian surfaces', v: '400+', note: 'hand-painted, jaali to Ajrakh' },
  { k: 'Kinds of people', v: '100+', note: 'with their own walks' },
  { k: 'Friends on one Wi-Fi', v: '4', note: 'no internet needed' },
  { k: 'Achievements', v: '20', note: 'with Google Play Games' },
];

export const FAQ = [
  { q: 'What is Chhatpat?', a: 'Chhatpat! is a free rooftop parkour game for Android phones by Viidesi Studios. You run, leap, climb and slide across the rooftops of a procedurally built Indian city to finish a filmi errand before the clock runs out.' },
  { q: 'Is Chhatpat free?', a: 'Yes. Chhatpat is free to download on Google Play. There are no pop-up ads: adverts only appear on the billboards inside the city.' },
  { q: 'Does Chhatpat work offline?', a: 'Yes. The whole game plays offline. Play with friends also works without internet, over the same Wi-Fi or a phone hotspot.' },
  { q: 'How do I play Chhatpat with friends?', a: 'One phone hosts a game and gets a 5-digit game ID. Up to 3 friends on the same Wi-Fi or hotspot type the ID in. Everyone’s house stands in one shared city and you all race the same errand. Each player can stake up to 3 things from their home, and the winner takes all.' },
  { q: 'Is the Chhatpat city the same every time?', a: 'No. Every run builds a brand-new Indian city with havelis, chawls, bazaars, temples, masjids, gurudwaras and stepwells. Today’s City is the exception: every day all players get the same city and race for the best time before a new one arrives at midnight.' },
  { q: 'Which Indian landmarks are in the game?', a: 'The Red Fort, Qutub Minar, India Gate, Humayun’s Tomb, Jama Masjid, Akshardham, the Lotus Temple and Agrasen ki Baoli rise over the rooftops.' },
  { q: 'Is Chhatpat like Subway Surfers or Temple Run?', a: 'It shares the quick, one-thumb fun of a runner, but Chhatpat is an open rooftop city rather than a three-lane track. You choose your own route across roofs, gullies and stairwells, climb pipes, ride kites and sky buses, and walk in through front doors.' },
  { q: 'Can I play Chhatpat in Hindi or Hinglish?', a: 'You can play in plain English or in Desi mode, which is Hinglish full of pop-culture references.' },
  { q: 'Which phones can run Chhatpat?', a: 'Chhatpat has five graphics modes, from Smooth for 4 GB phones to Ultra for flagships, and runs from 30 to 144 FPS. It needs Android 8.0 or newer.' },
  { q: 'Does Chhatpat support game controllers?', a: 'Yes. Gamepads and Bluetooth controllers work, with button glyphs for Xbox, PlayStation and Nintendo pads, remapping and rumble. On touch you can use a joystick, gyro, a left-handed layout or drag the buttons where you like.' },
  { q: 'Who makes Chhatpat?', a: 'Viidesi Studios, an independent Indian game studio. Chhatpat is its first game, and more games are in the works.' },
  { q: 'Can brands advertise inside Chhatpat?', a: 'Yes. Chhatpat’s city has thousands of in-world billboards, hoardings and LED screens, and weekly brand hunts where players search the city for hidden items. Write to the studio to book a campaign.' },
];
