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
      // Wildcard covers all crawlers including AI bots (GPTBot, ClaudeBot, PerplexityBot, etc.)
      // Add bot-specific blocks here only if you need DIFFERENT rules for a specific crawler.
      {
        userAgent: '*',
        allow: '/',
        disallow: DISALLOWED_ROUTES,
      },
    ],
    sitemap: 'https://www.ollvy.com/sitemap.xml',
  }
}
