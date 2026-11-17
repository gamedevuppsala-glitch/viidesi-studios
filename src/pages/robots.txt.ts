import type { APIRoute } from 'astro';
import { abs } from '../site.config';

// Every search engine and AI crawler is welcome: the whole point is to be found and quoted.
const bots = [
  'Googlebot', 'Google-Extended', 'Bingbot', 'DuckDuckBot', 'YandexBot', 'Applebot', 'Applebot-Extended',
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-User', 'Claude-SearchBot', 'anthropic-ai',
  'PerplexityBot', 'Perplexity-User', 'CCBot', 'Meta-ExternalAgent', 'Amazonbot', 'cohere-ai', 'Bytespider', 'MistralAI-User',
];

export const GET: APIRoute = () =>
  new Response(
    [
      ...bots.flatMap((b) => [`User-agent: ${b}`, 'Allow: /', '']),
      'User-agent: *',
      'Allow: /',
      'Disallow: /404/',
      '',
      `Sitemap: ${abs('sitemap-index.xml')}`,
      `# Plain-text summaries for AI answer engines: ${abs('llms.txt')} and ${abs('llms-full.txt')}`,
      '',
    ].join('\n'),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
