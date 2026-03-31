import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Determine cookie domain based on environment
  const isProduction = typeof window !== 'undefined' &&
    window.location.hostname.includes('ollvy.com')

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    isProduction ? {
      cookieOptions: {
        domain: '.ollvy.com',
        path: '/',
        sameSite: 'lax',
        secure: true,
      },
    } : undefined
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
