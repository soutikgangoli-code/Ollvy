/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  transpilePackages: ['@ollvy/shared'],
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
    ];
  },
}

module.exports = nextConfig
