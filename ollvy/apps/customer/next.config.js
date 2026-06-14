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
    // Tree-shake big barrel libs so only what's used ships. (Next 15 already
    // does this for lucide-react by default; date-fns is the real add — listing
    // both is explicit and harmless.)
    optimizePackageImports: ['lucide-react', 'date-fns'],
  },
  images: {
    // Serve modern formats to browsers that accept them (smaller than JPEG/PNG).
    formats: ['image/avif', 'image/webp'],
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
      // Deadline → Guide migration (May 2026). 20 deadline pages converted to
      // LearnPageConfig and moved under /guides/[slug]. Old top-level URLs 301
      // to preserve SEO and inbound links.
      { source: '/itr-2026', destination: '/guides/itr-2026', permanent: true },
      { source: '/itr-2027', destination: '/guides/itr-2027', permanent: true },
      { source: '/gst-annual-2026', destination: '/guides/gst-annual-2026', permanent: true },
      { source: '/gst-annual-2027', destination: '/guides/gst-annual-2027', permanent: true },
      { source: '/director-kyc-2026', destination: '/guides/director-kyc-2026', permanent: true },
      { source: '/tds-return-q1-2027', destination: '/guides/tds-return-q1-2027', permanent: true },
      { source: '/salaried-itr-2026', destination: '/guides/salaried-itr-2026', permanent: true },
      { source: '/business-itr-2026', destination: '/guides/business-itr-2026', permanent: true },
      { source: '/mgt-7-2026', destination: '/guides/mgt-7-2026', permanent: true },
      { source: '/llp-form-8-2026', destination: '/guides/llp-form-8-2026', permanent: true },
      { source: '/adt-1-2026', destination: '/guides/adt-1-2026', permanent: true },
      { source: '/dpt-3-2026', destination: '/guides/dpt-3-2026', permanent: true },
      { source: '/advance-tax-q1-2026', destination: '/guides/advance-tax-q1-2026', permanent: true },
      { source: '/advance-tax-q2-2026', destination: '/guides/advance-tax-q2-2026', permanent: true },
      { source: '/advance-tax-q3-2026', destination: '/guides/advance-tax-q3-2026', permanent: true },
      { source: '/advance-tax-q4-2027', destination: '/guides/advance-tax-q4-2027', permanent: true },
      { source: '/tds-return-q3-fy2026-27', destination: '/guides/tds-return-q3-fy2026-27', permanent: true },
      { source: '/tds-return-q4-fy2026-27', destination: '/guides/tds-return-q4-fy2026-27', permanent: true },
      { source: '/msme-form-1-h1-2026', destination: '/guides/msme-form-1-h1-2026', permanent: true },
      { source: '/msme-form-1-h2-2027', destination: '/guides/msme-form-1-h2-2027', permanent: true },
    ];
  },
}

module.exports = withBundleAnalyzer(nextConfig)
