/**
 * Geo Configuration
 * Per §23 Connection Point 8: Geo Pages Pricing
 *
 * Major Indian cities mapped to their states for geo pages,
 * with jurisdiction-specific compliance data for unique city content.
 */

export interface CityConfig {
  slug: string
  name: string
  state: string
  mcaRoc: string            // Registrar of Companies jurisdiction
  gstJurisdiction: string   // GST commissionerate info
  ptApplicable: boolean     // Professional Tax applicable in this state?
  shopEstActName?: string   // State-specific Shops & Establishments Act
  coworkingNote?: string    // City-specific address guidance
}

// Major cities for SEO geo pages
export const CITIES: CityConfig[] = [
  // Maharashtra
  {
    slug: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    mcaRoc: 'RoC Maharashtra (Mumbai)',
    gstJurisdiction: 'CGST jurisdiction. Multiple Mumbai commissionerates by area.',
    ptApplicable: true,
    shopEstActName: 'Maharashtra Shops and Establishments (Regulation of Employment and Conditions of Service) Act, 2017',
    coworkingNote: 'Mumbai co-working NOC is standard. BMC trade licence required for physical business addresses.',
  },
  {
    slug: 'pune',
    name: 'Pune',
    state: 'Maharashtra',
    mcaRoc: 'RoC Maharashtra (Pune)',
    gstJurisdiction: 'CGST jurisdiction - Pune Commissionerate.',
    ptApplicable: true,
    shopEstActName: 'Maharashtra Shops and Establishments Act, 2017',
  },
  {
    slug: 'nagpur',
    name: 'Nagpur',
    state: 'Maharashtra',
    mcaRoc: 'RoC Maharashtra (Mumbai)',
    gstJurisdiction: 'CGST jurisdiction - Nagpur Commissionerate.',
    ptApplicable: true,
    shopEstActName: 'Maharashtra Shops and Establishments Act, 2017',
  },
  // Karnataka
  {
    slug: 'bangalore',
    name: 'Bangalore',
    state: 'Karnataka',
    mcaRoc: 'RoC Karnataka (Bangalore)',
    gstJurisdiction: 'SGST jurisdiction - Karnataka GST Commissionerate.',
    ptApplicable: true,
    shopEstActName: 'Karnataka Shops and Commercial Establishments Act, 1961',
    coworkingNote: 'Karnataka requires BBMP trade license for commercial premises. Co-working NOC is accepted for GST address proof.',
  },
  // Tamil Nadu
  {
    slug: 'chennai',
    name: 'Chennai',
    state: 'Tamil Nadu',
    mcaRoc: 'RoC Tamil Nadu (Chennai)',
    gstJurisdiction: 'SGST jurisdiction - Tamil Nadu GST.',
    ptApplicable: true,
    shopEstActName: 'Tamil Nadu Shops and Establishments Act, 1947',
  },
  {
    slug: 'coimbatore',
    name: 'Coimbatore',
    state: 'Tamil Nadu',
    mcaRoc: 'RoC Tamil Nadu (Chennai)',
    gstJurisdiction: 'SGST jurisdiction - Tamil Nadu GST, Coimbatore division.',
    ptApplicable: true,
    shopEstActName: 'Tamil Nadu Shops and Establishments Act, 1947',
  },
  // Delhi NCR
  {
    slug: 'delhi',
    name: 'Delhi',
    state: 'Delhi',
    mcaRoc: 'RoC Delhi & Haryana (New Delhi)',
    gstJurisdiction: 'CGST jurisdiction. Delhi North, Delhi West, Delhi South, Delhi Central commissionerates.',
    ptApplicable: false,
    shopEstActName: 'Delhi Shops and Establishments Act, 1954',
    coworkingNote: 'Co-working spaces in Delhi (WeWork, 91Springboard, Awfis, Smartworks) provide NOC letters. Must be on letterhead with your designated workspace number.',
  },
  {
    slug: 'gurgaon',
    name: 'Gurgaon',
    state: 'Haryana',
    mcaRoc: 'RoC Delhi & Haryana',
    gstJurisdiction: 'SGST jurisdiction - Haryana GST.',
    ptApplicable: false,
    shopEstActName: 'Haryana Shops and Commercial Establishments Act, 1958',
    coworkingNote: 'Gurgaon has a high concentration of co-working spaces. NOC is standard. Cyber City and Golf Course Road are common business address areas.',
  },
  {
    slug: 'noida',
    name: 'Noida',
    state: 'Uttar Pradesh',
    mcaRoc: 'RoC Uttar Pradesh & Uttarakhand',
    gstJurisdiction: 'SGST jurisdiction - UP GST.',
    ptApplicable: false,
    shopEstActName: 'Uttar Pradesh Shops and Commercial Establishments Act, 1962',
    coworkingNote: 'Noida co-working spaces provide standard NOC. Sector 62 and Sector 125 are common startup hubs.',
  },
  // Gujarat
  {
    slug: 'ahmedabad',
    name: 'Ahmedabad',
    state: 'Gujarat',
    mcaRoc: 'RoC Gujarat (Ahmedabad)',
    gstJurisdiction: 'SGST jurisdiction - Gujarat GST.',
    ptApplicable: true,
    shopEstActName: 'Gujarat Shops and Establishments Act, 2019',
  },
  {
    slug: 'surat',
    name: 'Surat',
    state: 'Gujarat',
    mcaRoc: 'RoC Gujarat (Ahmedabad)',
    gstJurisdiction: 'SGST jurisdiction - Gujarat GST, Surat division.',
    ptApplicable: true,
    shopEstActName: 'Gujarat Shops and Establishments Act, 2019',
  },
  // Telangana
  {
    slug: 'hyderabad',
    name: 'Hyderabad',
    state: 'Telangana',
    mcaRoc: 'RoC Hyderabad (Telangana & Andhra Pradesh)',
    gstJurisdiction: 'SGST jurisdiction - Telangana State Tax.',
    ptApplicable: true,
    shopEstActName: 'Telangana Shops and Establishments Act, 1988',
  },
  // West Bengal
  {
    slug: 'kolkata',
    name: 'Kolkata',
    state: 'West Bengal',
    mcaRoc: 'RoC West Bengal (Kolkata)',
    gstJurisdiction: 'SGST jurisdiction - West Bengal GST.',
    ptApplicable: true,
    shopEstActName: 'West Bengal Shops and Establishments Act, 1963',
  },
  // Rajasthan
  {
    slug: 'jaipur',
    name: 'Jaipur',
    state: 'Rajasthan',
    mcaRoc: 'RoC Rajasthan (Jaipur)',
    gstJurisdiction: 'SGST jurisdiction - Rajasthan GST.',
    ptApplicable: false,
    shopEstActName: 'Rajasthan Shops and Commercial Establishments Act, 1958',
  },
  // Kerala
  {
    slug: 'kochi',
    name: 'Kochi',
    state: 'Kerala',
    mcaRoc: 'RoC Kerala (Kochi)',
    gstJurisdiction: 'SGST jurisdiction - Kerala GST.',
    ptApplicable: false,
    shopEstActName: 'Kerala Shops and Commercial Establishments Act, 1960',
  },
  {
    slug: 'thiruvananthapuram',
    name: 'Thiruvananthapuram',
    state: 'Kerala',
    mcaRoc: 'RoC Kerala (Kochi)',
    gstJurisdiction: 'SGST jurisdiction - Kerala GST.',
    ptApplicable: false,
    shopEstActName: 'Kerala Shops and Commercial Establishments Act, 1960',
  },
  // Uttar Pradesh
  {
    slug: 'lucknow',
    name: 'Lucknow',
    state: 'Uttar Pradesh',
    mcaRoc: 'RoC Uttar Pradesh & Uttarakhand',
    gstJurisdiction: 'SGST jurisdiction - UP GST.',
    ptApplicable: false,
    shopEstActName: 'Uttar Pradesh Shops and Commercial Establishments Act, 1962',
  },
  // Madhya Pradesh
  {
    slug: 'indore',
    name: 'Indore',
    state: 'Madhya Pradesh',
    mcaRoc: 'RoC Madhya Pradesh & Chhattisgarh (Gwalior)',
    gstJurisdiction: 'SGST jurisdiction - MP GST.',
    ptApplicable: true,
    shopEstActName: 'Madhya Pradesh Shops and Establishments Act, 1958',
  },
  {
    slug: 'bhopal',
    name: 'Bhopal',
    state: 'Madhya Pradesh',
    mcaRoc: 'RoC Madhya Pradesh & Chhattisgarh (Gwalior)',
    gstJurisdiction: 'SGST jurisdiction - MP GST.',
    ptApplicable: true,
    shopEstActName: 'Madhya Pradesh Shops and Establishments Act, 1958',
  },
  // Punjab / UT
  {
    slug: 'chandigarh',
    name: 'Chandigarh',
    state: 'Chandigarh',
    mcaRoc: 'RoC Punjab & Chandigarh',
    gstJurisdiction: 'CGST jurisdiction - Chandigarh.',
    ptApplicable: false,
    shopEstActName: 'Punjab Shops and Commercial Establishments Act, 1958',
  },
  // Andhra Pradesh
  {
    slug: 'visakhapatnam',
    name: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    mcaRoc: 'RoC Hyderabad (Telangana & Andhra Pradesh)',
    gstJurisdiction: 'SGST jurisdiction - Andhra Pradesh GST.',
    ptApplicable: true,
    shopEstActName: 'Andhra Pradesh Shops and Establishments Act, 1988',
  },
]

export function getCityBySlug(slug: string): CityConfig | undefined {
  return CITIES.find((c) => c.slug === slug)
}

export function getCitiesByState(state: string): CityConfig[] {
  return CITIES.filter((c) => c.state === state)
}

/**
 * Format city + state, avoiding "Delhi, Delhi" for union territories.
 */
export function formatCityState(city: CityConfig): string {
  return city.name === city.state ? city.name : `${city.name}, ${city.state}`
}

// Services that have geo pages (services with state-specific pricing or location relevance)
export const GEO_ENABLED_SERVICES = [
  'pvt-ltd-incorporation',
  'llp-incorporation',
  'gst-registration',
  'trademark-registration',
  'business-itr',
]
