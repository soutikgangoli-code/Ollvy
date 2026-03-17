// lib/geo/cities.ts
// City configurations for programmatic geo pages

export interface CityConfig {
  slug: string;
  name: string;                    // "Delhi"
  displayName: string;             // "Delhi NCR" for display
  state: string;                   // "Delhi"
  gstJurisdiction: string;         // "Central GST — Delhi Commissionerate"
  mcaRoc: string;                  // "RoC Delhi & Haryana"
  ptApplicable: boolean;           // Professional Tax applicable?
  shopEstActName?: string;         // State-specific name of Act
  coworkingNote?: string;          // City-specific note for address
}

export const CITIES: CityConfig[] = [
  {
    slug: 'delhi',
    name: 'Delhi',
    displayName: 'Delhi NCR',
    state: 'Delhi',
    gstJurisdiction: 'CGST jurisdiction. Delhi South, Delhi West, Delhi North commissionerates.',
    mcaRoc: 'RoC Delhi & Haryana (based in Delhi)',
    ptApplicable: false,
    shopEstActName: 'Delhi Shops and Establishments Act, 1954',
    coworkingNote: 'Co-working spaces in Delhi (WeWork, 91Springboard, Awfis, Smartworks) provide NOC letters. Must be on letterhead with your designated workspace number.',
  },
  {
    slug: 'bangalore',
    name: 'Bangalore',
    displayName: 'Bangalore',
    state: 'Karnataka',
    gstJurisdiction: 'SGST jurisdiction — Karnataka GST Commissionerate.',
    mcaRoc: 'RoC Karnataka (based in Bangalore)',
    ptApplicable: true,
    shopEstActName: 'Karnataka Shops and Commercial Establishments Act, 1961',
    coworkingNote: 'Karnataka requires BBMP trade license for commercial premises. Co-working NOC is accepted for GST address proof.',
  },
  {
    slug: 'mumbai',
    name: 'Mumbai',
    displayName: 'Mumbai',
    state: 'Maharashtra',
    gstJurisdiction: 'CGST jurisdiction. Multiple Mumbai commissionerates by area.',
    mcaRoc: 'RoC Maharashtra (Mumbai)',
    ptApplicable: true,
    shopEstActName: 'Maharashtra Shops and Establishments (Regulation of Employment and Conditions of Service) Act, 2017',
    coworkingNote: 'Mumbai co-working NOC is standard. BMC trade licence required for physical business addresses.',
  },
  {
    slug: 'hyderabad',
    name: 'Hyderabad',
    displayName: 'Hyderabad',
    state: 'Telangana',
    gstJurisdiction: 'SGST jurisdiction — Telangana State Tax.',
    mcaRoc: 'RoC Telangana & Andhra Pradesh',
    ptApplicable: true,
    shopEstActName: 'Telangana Shops and Establishments Act, 1988',
  },
  {
    slug: 'chennai',
    name: 'Chennai',
    displayName: 'Chennai',
    state: 'Tamil Nadu',
    gstJurisdiction: 'SGST jurisdiction — Tamil Nadu GST.',
    mcaRoc: 'RoC Tamil Nadu (Chennai)',
    ptApplicable: true,
    shopEstActName: 'Tamil Nadu Shops and Establishments Act, 1947',
  },
  {
    slug: 'pune',
    name: 'Pune',
    displayName: 'Pune',
    state: 'Maharashtra',
    gstJurisdiction: 'CGST jurisdiction — Pune Commissionerate.',
    mcaRoc: 'RoC Maharashtra (Pune)',
    ptApplicable: true,
    shopEstActName: 'Maharashtra Shops and Establishments Act, 2017',
  },
  {
    slug: 'kolkata',
    name: 'Kolkata',
    displayName: 'Kolkata',
    state: 'West Bengal',
    gstJurisdiction: 'SGST jurisdiction — West Bengal GST.',
    mcaRoc: 'RoC West Bengal (Kolkata)',
    ptApplicable: true,
    shopEstActName: 'West Bengal Shops and Establishments Act, 1963',
  },
  {
    slug: 'ahmedabad',
    name: 'Ahmedabad',
    displayName: 'Ahmedabad',
    state: 'Gujarat',
    gstJurisdiction: 'SGST jurisdiction — Gujarat GST.',
    mcaRoc: 'RoC Gujarat (Ahmedabad)',
    ptApplicable: true,
    shopEstActName: 'Gujarat Shops and Establishments Act, 2019',
  },
  {
    slug: 'jaipur',
    name: 'Jaipur',
    displayName: 'Jaipur',
    state: 'Rajasthan',
    gstJurisdiction: 'SGST jurisdiction — Rajasthan GST.',
    mcaRoc: 'RoC Rajasthan (Jaipur)',
    ptApplicable: false,
    shopEstActName: 'Rajasthan Shops and Commercial Establishments Act, 1958',
  },
  {
    slug: 'lucknow',
    name: 'Lucknow',
    displayName: 'Lucknow',
    state: 'Uttar Pradesh',
    gstJurisdiction: 'SGST jurisdiction — UP GST.',
    mcaRoc: 'RoC Uttar Pradesh & Uttarakhand',
    ptApplicable: false,
    shopEstActName: 'Uttar Pradesh Shops and Commercial Establishments Act, 1962',
  },
  {
    slug: 'chandigarh',
    name: 'Chandigarh',
    displayName: 'Chandigarh',
    state: 'Chandigarh',
    gstJurisdiction: 'CGST jurisdiction — Chandigarh.',
    mcaRoc: 'RoC Punjab & Chandigarh',
    ptApplicable: false,
    shopEstActName: 'Punjab Shops and Commercial Establishments Act, 1958',
  },
  {
    slug: 'kochi',
    name: 'Kochi',
    displayName: 'Kochi',
    state: 'Kerala',
    gstJurisdiction: 'SGST jurisdiction — Kerala GST.',
    mcaRoc: 'RoC Kerala (Kochi)',
    ptApplicable: false,
    shopEstActName: 'Kerala Shops and Commercial Establishments Act, 1960',
  },
  {
    slug: 'indore',
    name: 'Indore',
    displayName: 'Indore',
    state: 'Madhya Pradesh',
    gstJurisdiction: 'SGST jurisdiction — MP GST.',
    mcaRoc: 'RoC Madhya Pradesh & Chhattisgarh',
    ptApplicable: true,
    shopEstActName: 'Madhya Pradesh Shops and Establishments Act, 1958',
  },
  {
    slug: 'gurgaon',
    name: 'Gurgaon',
    displayName: 'Gurgaon (Gurugram)',
    state: 'Haryana',
    gstJurisdiction: 'SGST jurisdiction — Haryana GST.',
    mcaRoc: 'RoC Delhi & Haryana',
    ptApplicable: false,
    shopEstActName: 'Haryana Shops and Commercial Establishments Act, 1958',
    coworkingNote: 'Gurgaon has a high concentration of co-working spaces. NOC is standard. Cyber City and Golf Course Road are common business address areas.',
  },
  {
    slug: 'noida',
    name: 'Noida',
    displayName: 'Noida',
    state: 'Uttar Pradesh',
    gstJurisdiction: 'SGST jurisdiction — UP GST.',
    mcaRoc: 'RoC Uttar Pradesh & Uttarakhand',
    ptApplicable: false,
    shopEstActName: 'Uttar Pradesh Shops and Commercial Establishments Act, 1962',
    coworkingNote: 'Noida co-working spaces provide standard NOC. Sector 62 and Sector 125 are common startup hubs.',
  },
];

export function getCityBySlug(slug: string): CityConfig | undefined {
  return CITIES.find(c => c.slug === slug);
}

export function getCitiesByState(state: string): CityConfig[] {
  return CITIES.filter(c => c.state === state);
}
