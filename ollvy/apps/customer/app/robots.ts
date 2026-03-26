import { MetadataRoute } from 'next'

/**
 * Robots.txt for Ollvy - per SEO mandate Section 3.10
 * Allows all crawlers, blocks admin/api/private routes
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
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
      ],
    },
    sitemap: 'https://www.ollvy.com/sitemap.xml',
  }
}
