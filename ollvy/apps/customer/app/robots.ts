import { MetadataRoute } from 'next'

/**
 * Robots.txt for Ollvy - per SEO mandate Section 3.10
 * Allows all crawlers including AI bots, blocks admin/api/private routes
 *
 * AI Search Visibility:
 * - Explicitly allows AI crawlers (GPTBot, ClaudeBot, PerplexityBot, etc.)
 * - Points to /llms.txt and /llms-full.txt for AI-specific documentation
 */

// Routes blocked for all crawlers (private/authenticated areas)
const DISALLOWED_ROUTES = [
  '/admin',
  '/pro',
  '/api/',
  '/order/',
  '/orders/',
  '/profile',
  '/dashboard',
  '/checkout/',
  '/quote/',
  '/retainers/',
  '/compliance',
  '/settings',
  '/notifications',
  '/upgrade',
  '/login',
  '/verify',
  '/business',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default rule for all crawlers
      {
        userAgent: '*',
        allow: '/',
        disallow: DISALLOWED_ROUTES,
      },
      // OpenAI crawlers
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: DISALLOWED_ROUTES,
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
        disallow: DISALLOWED_ROUTES,
      },
      {
        userAgent: 'OAI-SearchBot',
        allow: '/',
        disallow: DISALLOWED_ROUTES,
      },
      // Anthropic crawlers
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: DISALLOWED_ROUTES,
      },
      {
        userAgent: 'Claude-User',
        allow: '/',
        disallow: DISALLOWED_ROUTES,
      },
      {
        userAgent: 'Claude-SearchBot',
        allow: '/',
        disallow: DISALLOWED_ROUTES,
      },
      // Perplexity crawler
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: DISALLOWED_ROUTES,
      },
      // Google AI crawler
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: DISALLOWED_ROUTES,
      },
      // Other AI crawlers
      {
        userAgent: 'Amazonbot',
        allow: '/',
        disallow: DISALLOWED_ROUTES,
      },
      {
        userAgent: 'CCBot',
        allow: '/',
        disallow: DISALLOWED_ROUTES,
      },
      {
        userAgent: 'anthropic-ai',
        allow: '/',
        disallow: DISALLOWED_ROUTES,
      },
      {
        userAgent: 'cohere-ai',
        allow: '/',
        disallow: DISALLOWED_ROUTES,
      },
    ],
    sitemap: 'https://www.ollvy.com/sitemap.xml',
  }
}
