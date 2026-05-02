const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  transpilePackages: ['@ollvy/shared'],
  experimental: {
    // Cache dynamic pages client-side for 30s so back-navigation is instant
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wsuleaypyjazcmmntcru.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  async redirects() {
    return [
      // Learn to Guides redirects (URL restructure)
      {
        source: '/learn',
        destination: '/guides',
        permanent: true,
      },
      {
        source: '/learn/:slug',
        destination: '/guides/:slug',
        permanent: true,
      },
      // Old learn pages redirected to tools
      {
        source: '/learn/gst-filing-penalty',
        destination: '/tools/penalty-calculator/gst-late-filing',
        permanent: true,
      },
      // Old service slug redirects (renamed services)
      {
        source: '/services/msme-udyam',
        destination: '/services/msme-registration',
        permanent: true,
      },
      {
        source: '/services/gst-monthly-filing',
        destination: '/services/gst-monthly',
        permanent: true,
      },
      {
        source: '/services/gst-monthly-50l',
        destination: '/services/gst-monthly',
        permanent: true,
      },
      // Services that redirect to related services
      {
        source: '/services/llp-annual-filing',
        destination: '/services/mca-annual-filing',
        permanent: true,
      },
      {
        source: '/services/trademark-renewal',
        destination: '/services/trademark-registration',
        permanent: true,
      },
      // Orphan service slugs referenced by deadline pages — no standalone
      // /services/[slug] exists, route to the closest real service.
      {
        source: '/services/gst-annual',
        destination: '/services/gst-monthly',
        permanent: true,
      },
      {
        source: '/services/tds-return',
        destination: '/services/tds-monthly-compliance',
        permanent: true,
      },
      // Killed geo/city pages (2026-04-24) — 5 explicit service-scoped redirects.
      // NOT a /:service/:city wildcard — that would match /services/:slug and break prod.
      {
        source: '/pvt-ltd-incorporation/:city',
        destination: '/services/pvt-ltd-incorporation',
        permanent: true,
      },
      {
        source: '/llp-incorporation/:city',
        destination: '/services/llp-incorporation',
        permanent: true,
      },
      {
        source: '/gst-registration/:city',
        destination: '/services/gst-registration',
        permanent: true,
      },
      {
        source: '/trademark-registration/:city',
        destination: '/services/trademark-registration',
        permanent: true,
      },
      {
        source: '/business-itr/:city',
        destination: '/services/business-itr',
        permanent: true,
      },
      // /join (CA recruitment landing) deleted — was orphaned and supply-side.
      // 301 to homepage so any cached SERP entries / external links don't 404.
      {
        source: '/join',
        destination: '/',
        permanent: true,
      },
    ];
  },
}

module.exports = withBundleAnalyzer(nextConfig)
