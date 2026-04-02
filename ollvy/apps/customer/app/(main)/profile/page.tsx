import { redirect } from 'next/navigation'
import { getUser } from '@/lib/supabase-server'
import { ProfilePageClient } from './ProfilePageClient'

interface PageProps {
  searchParams: Promise<{ setup?: string }>
}

export default async function ProfilePage({ searchParams }: PageProps) {
  const params = await searchParams
  const isSetup = params.setup === 'true'

  const user = await getUser()

  if (!user) {
    redirect('/login?returnUrl=/profile')
  }

  // Don't call RPC here - auth.uid() doesn't work server-side
  // Pass user to client component which will fetch data client-side
  return (
    <ProfilePageClient
      userData={user}
      isSetup={isSetup}
    />
  )
}
