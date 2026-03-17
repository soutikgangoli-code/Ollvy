/**
 * Geo Configuration
 * Per §23 Connection Point 8: Geo Pages Pricing
 *
 * Major Indian cities mapped to their states for geo pages.
 */

export interface CityConfig {
  slug: string
  name: string
  state: string
}

// Major cities for SEO geo pages
export const CITIES: CityConfig[] = [
  // Maharashtra
  { slug: 'mumbai', name: 'Mumbai', state: 'Maharashtra' },
  { slug: 'pune', name: 'Pune', state: 'Maharashtra' },
  { slug: 'nagpur', name: 'Nagpur', state: 'Maharashtra' },
  // Karnataka
  { slug: 'bangalore', name: 'Bangalore', state: 'Karnataka' },
  { slug: 'bengaluru', name: 'Bengaluru', state: 'Karnataka' },
  // Tamil Nadu
  { slug: 'chennai', name: 'Chennai', state: 'Tamil Nadu' },
  { slug: 'coimbatore', name: 'Coimbatore', state: 'Tamil Nadu' },
  // Delhi NCR
  { slug: 'delhi', name: 'Delhi', state: 'Delhi' },
  { slug: 'new-delhi', name: 'New Delhi', state: 'Delhi' },
  { slug: 'gurgaon', name: 'Gurgaon', state: 'Haryana' },
  { slug: 'noida', name: 'Noida', state: 'Uttar Pradesh' },
  // Gujarat
  { slug: 'ahmedabad', name: 'Ahmedabad', state: 'Gujarat' },
  { slug: 'surat', name: 'Surat', state: 'Gujarat' },
  // Telangana
  { slug: 'hyderabad', name: 'Hyderabad', state: 'Telangana' },
  // West Bengal
  { slug: 'kolkata', name: 'Kolkata', state: 'West Bengal' },
  // Rajasthan
  { slug: 'jaipur', name: 'Jaipur', state: 'Rajasthan' },
  // Kerala
  { slug: 'kochi', name: 'Kochi', state: 'Kerala' },
  { slug: 'thiruvananthapuram', name: 'Thiruvananthapuram', state: 'Kerala' },
  // Uttar Pradesh
  { slug: 'lucknow', name: 'Lucknow', state: 'Uttar Pradesh' },
  // Madhya Pradesh
  { slug: 'indore', name: 'Indore', state: 'Madhya Pradesh' },
  { slug: 'bhopal', name: 'Bhopal', state: 'Madhya Pradesh' },
  // Punjab
  { slug: 'chandigarh', name: 'Chandigarh', state: 'Chandigarh' },
  // Andhra Pradesh
  { slug: 'visakhapatnam', name: 'Visakhapatnam', state: 'Andhra Pradesh' },
]

export function getCityBySlug(slug: string): CityConfig | undefined {
  return CITIES.find((c) => c.slug === slug)
}

export function getCitiesByState(state: string): CityConfig[] {
  return CITIES.filter((c) => c.state === state)
}

// Services that have geo pages (services with state-specific pricing or location relevance)
export const GEO_ENABLED_SERVICES = [
  'pvt-ltd-incorporation',
  'llp-incorporation',
  'gst-registration',
  'trademark-registration',
  'fssai-license',
  'business-itr',
]
