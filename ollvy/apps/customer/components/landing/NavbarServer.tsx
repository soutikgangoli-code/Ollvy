import { unstable_cache } from 'next/cache'
import { getNavbarServices } from '@/lib/data/services'
import { Navbar } from './Navbar'

const getCachedNavbarServices = unstable_cache(getNavbarServices, ['navbar-services'], { revalidate: 3600 })

/**
 * Server component wrapper for Navbar
 * Pre-fetches services on the server to avoid client-side Supabase SDK bundle
 */
export async function NavbarServer() {
  const services = await getCachedNavbarServices()
  return <Navbar services={services} />
}
