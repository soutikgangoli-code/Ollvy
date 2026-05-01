const origin = Deno.env.get('ENVIRONMENT') === 'development'
  ? 'http://localhost:3000'
  : (Deno.env.get('ALLOWED_ORIGIN') || 'https://www.ollvy.com')

export const corsHeaders = {
  'Access-Control-Allow-Origin': origin,
  // Explicit Allow-Methods is required so browsers will permit non-simple
  // requests (POST with Authorization, custom headers, etc). Without it some
  // browsers fall back to GET/HEAD only and block legitimate POSTs.
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  // x-warmup added so the checkout warmup ping (POST with X-Warmup: 1) passes
  // the browser's CORS preflight check. The function's X-Warmup short-circuit
  // returns 204 before doing any auth/DB work.
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-warmup',
};
