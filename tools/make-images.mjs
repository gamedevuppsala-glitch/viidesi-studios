// Builds derived images from the game's own art: hero portraits, icons, favicon, share cards.
import sharp from 'sharp';
import fs from 'node:fs';
const shot = 'src/assets/shots/screenshot-08-heroes.jpg';
const cards = { aarav: [397, 1], raju: [601, 1], golu: [805, 1], bunty: [1009, 1], dadi: [1213, 1], pappu: [1417, 1], sweety: [397, 2] };
for (const [id, [x, row]] of Object.entries(cards)) {
  const top = row === 1 ? 420 : 646;
  await sharp(shot).extract({ left: x + 2, top, width: 170, height: 136 }).resize(340, 272, { kernel: 'nearest' }).png().toFile(`src/assets/heroes/${id}.png`);
}
const icon = 'src/assets/brand/icon-full.png';
for (const s of [192, 512]) await sharp(icon).resize(s, s).png().toFile(`public/brand/icon-${s}.png`);
await sharp(icon).resize(180, 180).png().toFile('public/brand/apple-touch-icon.png');
await sharp(icon).resize(512, 512).png().toFile('public/brand/viidesi-mark.png');
await sharp(icon).resize(1024, 1024).png().toFile('public/brand/chhatpat-icon-1024.png');
await sharp(icon).resize(48, 48).png().toFile('public/favicon.png');
// favicon.ico: a single 32px PNG wrapped in an ICO header
const png = await sharp(icon).resize(32, 32).png().toBuffer();
const h = Buffer.alloc(22); h.writeUInt16LE(0, 0); h.writeUInt16LE(1, 2); h.writeUInt16LE(1, 4);
h.writeUInt8(32, 6); h.writeUInt8(32, 7); h.writeUInt8(0, 8); h.writeUInt8(0, 9); h.writeUInt16LE(1, 10); h.writeUInt16LE(32, 12); h.writeUInt32LE(png.length, 14); h.writeUInt32LE(22, 18);
fs.writeFileSync('public/favicon.ico', Buffer.concat([h, png]));
// share cards 1200x630
const og = async (src, out, title, sub) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
    <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0.35" stop-color="#070d26" stop-opacity="0"/><stop offset="1" stop-color="#070d26" stop-opacity="0.92"/></linearGradient></defs>
    <rect width="1200" height="630" fill="url(#g)"/>
    <text x="60" y="520" font-family="Arial Black, Arial" font-weight="900" font-size="96" fill="#ffc23d" letter-spacing="-3">${title}</text>
    <text x="64" y="575" font-family="Arial" font-weight="700" font-size="32" fill="#fff4e2">${sub}</text></svg>`;
  await sharp(src).resize(1200, 630, { fit: 'cover', position: 'centre' }).composite([{ input: Buffer.from(svg) }]).jpeg({ quality: 84, mozjpeg: true }).toFile(out);
};
await og('public/media/chhatpat-trailer-poster-clean.jpg', 'public/og/home.jpg', 'CHHATPAT!', 'A desi rooftop run · Free on Android · Viidesi Studios');
await og('src/assets/shots/screenshot-05-city.jpg', 'public/og/chhatpat.jpg', 'CHHATPAT!', 'A new Indian city every run · Play with friends offline');
await og('src/assets/shots/pan-diwali.jpg', 'public/og/studio.jpg', 'VIIDESI STUDIOS', 'Games by India, for India');
await og('src/assets/shots/screenshot-03-kite.jpg', 'public/og/devlog.jpg', 'DEVLOG', 'How Chhatpat! is made · Viidesi Studios');
console.log('done');
