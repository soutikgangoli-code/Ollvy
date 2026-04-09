const origin = Deno.env.get('ENVIRONMENT') === 'development'
  ? 'http://localhost:3000'
  : (Deno.env.get('ALLOWED_ORIGIN') || 'https://www.ollvy.com')

export const corsHeaders = {
  'Access-Control-Allow-Origin': origin,
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
