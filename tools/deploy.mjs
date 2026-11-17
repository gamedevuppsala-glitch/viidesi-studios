// Build for GitHub Pages and push dist/ to the gh-pages branch.
// Usage: npm run deploy   (SITE_URL / BASE_PATH below, or override with env vars)
import { execSync } from 'node:child_process';
import fs from 'node:fs';
const SITE_URL = process.env.SITE_URL || 'https://gamedevuppsala-glitch.github.io';
const BASE_PATH = process.env.BASE_PATH || '/viidesi-studios/';
const run = (c, o = {}) => execSync(c, { stdio: 'inherit', ...o });
const remote = execSync('git remote get-url origin').toString().trim();
run('npx astro build', { env: { ...process.env, SITE_URL, BASE_PATH } });
fs.writeFileSync('dist/.nojekyll', '');
if (process.env.CNAME) fs.writeFileSync('dist/CNAME', process.env.CNAME);
const d = { cwd: 'dist' };
fs.rmSync('dist/.git', { recursive: true, force: true });
run('git init -q -b gh-pages', d);
run('git add -A', d);
run(`git -c user.name="${execSync('git config user.name').toString().trim()}" -c user.email="${execSync('git config user.email').toString().trim()}" commit -q -m "Deploy ${new Date().toISOString()}"`, d);
run(`git push -f ${remote} gh-pages`, d);
fs.rmSync('dist/.git', { recursive: true, force: true });
console.log(`Deployed: ${SITE_URL}${BASE_PATH}`);
