/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for landing pages
  // Note: ISR pages (/b/[id]) require server, exclude from static export
  // For fully static: uncomment output: 'export' and use SSR-only deployment for ISR routes
  // output: 'export',

  images: {
    unoptimized: true,
  },
  // Trailing slashes for cleaner URLs
  trailingSlash: true,
  // Allow environment variables
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
};

module.exports = nextConfig;
