import { MetadataRoute } from 'next'

/**
 * Sitemap for Ollvy - per SEO mandate Section 3.9
 * Includes homepage and all service pages
 * Excludes: /admin, /pro, /api/*, /order/*, /profile, /dashboard
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://ollvy.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: 'https://ollvy.com/services/llp-incorporation',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://ollvy.com/services/pvt-ltd-incorporation',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://ollvy.com/services/gst-registration',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://ollvy.com/services/trademark-registration',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://ollvy.com/services/fssai-license',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://ollvy.com/services/iec-code',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://ollvy.com/services/business-itr',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://ollvy.com/services/mca-annual-filing',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://ollvy.com/services/gst-monthly-filing',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://ollvy.com/services/tds-compliance',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://ollvy.com/services/payroll-management',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://ollvy.com/services/director-kyc',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ]
}
