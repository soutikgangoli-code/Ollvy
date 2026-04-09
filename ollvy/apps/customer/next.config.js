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
    ];
  },
}

module.exports = withBundleAnalyzer(nextConfig)
