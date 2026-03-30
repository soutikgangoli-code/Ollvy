import { getNavbarServices } from '@/lib/data/services'
import { Navbar } from './Navbar'

/**
 * Server component wrapper for Navbar
 * Pre-fetches services on the server to avoid client-side Supabase SDK bundle
 */
export async function NavbarServer() {
  const services = await getNavbarServices()
  return <Navbar services={services} />
}
