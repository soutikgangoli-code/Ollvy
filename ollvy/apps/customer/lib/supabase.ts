import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        // Set domain to allow cookies across ollvy.com and www.ollvy.com
        domain: typeof window !== 'undefined' && window.location.hostname.includes('ollvy.com')
          ? '.ollvy.com'
          : undefined,
        path: '/',
        sameSite: 'lax',
        secure: typeof window !== 'undefined' && window.location.protocol === 'https:',
      },
    }
  )
}

export function getEdgeFunctionUrl(functionName: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  return `${supabaseUrl}/functions/v1/${functionName}`
}

// Singleton instance for client-side
let clientInstance: ReturnType<typeof createClient> | null = null

export function getClient() {
  if (typeof window === 'undefined') {
    // Server-side: always create new client
    return createClient()
  }

  // Client-side: use singleton
  if (!clientInstance) {
    clientInstance = createClient()
  }
  return clientInstance
}
