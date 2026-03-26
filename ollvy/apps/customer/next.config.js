/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
      // Old learn pages redirected to tools
      {
        source: '/learn/gst-filing-penalty',
        destination: '/tools/penalty-calculator/gst-late-filing',
        permanent: true,
      },
      // Old learn page slugs redirected to new slugs
      {
        source: '/learn/how-to-register-gst-india',
        destination: '/learn/do-i-need-gst-registration',
        permanent: true,
      },
      {
        source: '/learn/startup-india-dpiit-recognition',
        destination: '/learn/should-i-get-dpiit-startup-recognition',
        permanent: true,
      },
    ];
  },
}

module.exports = nextConfig
