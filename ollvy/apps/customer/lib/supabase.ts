import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        flowType: 'pkce',
        detectSessionInUrl: false, // Session is established via /auth/callback exchange
        persistSession: true,
        autoRefreshToken: true,
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
