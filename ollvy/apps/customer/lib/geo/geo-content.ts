// lib/geo/geo-content.ts
// City-specific content for geo pages

import type { CityConfig } from '@/lib/geo'

export interface GeoContent {
  citySpecificNotes: string[];           // 2-3 sentences specific to this city
  additionalFaqs: Array<{q: string, a: string}>;  // 2-3 city-specific FAQs
  jurisdictionNote: string;              // one paragraph about local jurisdiction
}

export const GEO_CONTENT: Record<string, GeoContent> = {

  'gst-registration__delhi': {
    jurisdictionNote: `Delhi falls under CGST jurisdiction. Depending on your business address, you may be assigned to Delhi North, Delhi West, Delhi South, or Delhi Central CGST Commissionerate. All applications are filed electronically through the GSTN portal - the commissionerate only matters if you receive an officer query, in which case Ollvy CA handles the response directly with that commissionerate's officers.`,
    citySpecificNotes: [
      `Delhi has no separate state GST - it uses the Central GST framework directly. Unlike states like Maharashtra or Karnataka where SGST and CGST are separate administrations, Delhi's GST is administered entirely by CGST officers.`,
      `The GSTN Seva Kendra for Delhi is at SCOPE Complex, Core 8, 7 Institutional Area, Lodhi Road, New Delhi - 110 003. Walk-in queries are handled there, though almost all issues can be resolved online or through Ollvy CA.`,
    ],
    additionalFaqs: [
      {
        q: 'Can I use my co-working space address in Delhi for GST registration?',
        a: `Yes. Co-working space addresses are accepted for GST registration in Delhi. You need an NOC from the co-working space operator on their letterhead, specifying your name, company, and designated workspace (desk number, cabin, or floor). WeWork, 91Springboard, Awfis, Smartworks, and most other major Delhi co-working spaces provide this routinely. The letter should state that you have a right to use the address as your business address.`,
      },
      {
        q: 'Which CGST commissionerate covers South Delhi?',
        a: `South Delhi falls under the Delhi South CGST Commissionerate. Your GSTIN will have "07" as the state code (Delhi's GST state code). The commissionerate is relevant only for officer queries - Ollvy CA handles any interactions with them.`,
      },
    ],
  },

  'pvt-ltd-incorporation__bangalore': {
    jurisdictionNote: `Bangalore falls under the jurisdiction of the Registrar of Companies, Karnataka (RoC Karnataka), located at Kendriya Sadana, 2nd Floor, Sultan Bazar, Bangalore - 560 020. All SPICe+ filings go to this RoC. Name availability is checked against the MCA21 national database - not just Karnataka companies - so conflicting names across India can block your reservation.`,
    citySpecificNotes: [
      `Karnataka has Professional Tax (PT). Once your company is registered, you need to register for PT within 30 days if you have any salaried employees or if the directors draw remuneration. PT for directors is ₹2,500/year. Ollvy handles PT registration separately (₹1,999).`,
      `BBMP trade licence is required for commercial premises in Bruhat Bengaluru Mahanagara Palike jurisdiction. If your registered address is a co-working space, the co-working operator typically holds the BBMP trade licence - you don't need a separate one unless you have independent premises.`,
    ],
    additionalFaqs: [
      {
        q: 'Can I use an HSR Layout or Koramangala co-working address for incorporation?',
        a: `Yes. Co-working space addresses are accepted as registered office addresses for Pvt Ltd companies in Bangalore. You need an NOC from the space operator and the utility bill of the premises (in the operator's name). Most major Bangalore co-working spaces (WeWork, 91Springboard, Bhive, IndiQube, CoWrks) provide standard NOC letters. Your CS will review the document before filing.`,
      },
      {
        q: 'Does Karnataka have any state-specific requirements for company registration?',
        a: `The incorporation process is federal - SPICe+ is filed with the central MCA, not with Karnataka specifically. The state-specific obligations that come after incorporation are: Karnataka PT registration (if you have salaried employees), BBMP trade licence (for commercial premises), and Karnataka Shops and Commercial Establishments Act registration (for premises with employees). Ollvy handles all post-incorporation registrations.`,
      },
    ],
  },

  'gst-registration__mumbai': {
    jurisdictionNote: `Mumbai falls under CGST jurisdiction. The city is divided across multiple CGST commissionerates - Mumbai South, Mumbai Central, Mumbai East, and Thane (for businesses in Thane and extended Mumbai). Your commissionerate is determined by your business address pin code. All GST applications are electronic, so this doesn't affect the filing process - it only matters if there's an officer query.`,
    citySpecificNotes: [
      `Maharashtra levies SGST separately from CGST. For a Mumbai business, your GSTIN will show "27" as the state code (Maharashtra). CGST and SGST are administered separately - CGST by central officers, SGST by Maharashtra state tax officers.`,
      `BMC (Brihanmumbai Municipal Corporation) trade licence is required for commercial addresses in Mumbai. If you're using a co-working space, the operator holds the trade licence. For your own commercial premises, this needs to be obtained separately - Ollvy handles this as an add-on.`,
    ],
    additionalFaqs: [
      {
        q: 'Can I register for GST with a co-working space address in BKC or Lower Parel?',
        a: `Yes. GST registration with co-working space addresses is standard in Mumbai. You need the NOC from the space operator (on their letterhead, with your name, company, and workspace details) and a utility bill for the premises in the operator's name. Ollvy CA verifies both before filing. BKC, Lower Parel, Andheri, and other major business hubs have established co-working operators who provide these routinely.`,
      },
    ],
  },

  'gst-registration__bangalore': {
    jurisdictionNote: `Bangalore falls under Karnataka SGST jurisdiction. The Karnataka GST Commissionerate handles all state GST matters. Your GSTIN will have "29" as the state code (Karnataka). For most businesses, the relevant commissionerate is Karnataka-1 (Bangalore City).`,
    citySpecificNotes: [
      `Karnataka Professional Tax applies once you have GST registration and start employing people. PT registration is a separate process handled by the Karnataka Commercial Taxes Department.`,
      `BBMP trade licence is required for commercial premises in Bangalore. If using a co-working space, ensure they provide both NOC and their trade licence copy for your records.`,
    ],
    additionalFaqs: [
      {
        q: 'What documents do I need for GST registration with a Bangalore address?',
        a: `For GST registration in Bangalore, you need: PAN and Aadhaar of the applicant, address proof (rental agreement/NOC for co-working + utility bill), bank account statement, and business incorporation documents (if company). Co-working spaces in areas like Koramangala, Indiranagar, HSR Layout, and Whitefield commonly provide GST registration support.`,
      },
    ],
  },

  'pvt-ltd-incorporation__delhi': {
    jurisdictionNote: `Delhi companies are registered with the Registrar of Companies, Delhi & Haryana, located at Yadav Bhavan, CGO Complex, Lodhi Road, New Delhi - 110 003. All SPICe+ filings are processed through this office. The RoC Delhi office handles both Delhi and Haryana registrations.`,
    citySpecificNotes: [
      `Delhi does not have Professional Tax (PT). Unlike Karnataka, Maharashtra, or Telangana, there's no PT registration required after incorporation. This reduces one compliance step for Delhi-based companies.`,
      `The Delhi Shops and Establishments Act applies to all commercial establishments. Registration is required within 30 days of commencing business. Ollvy handles this as a separate service.`,
    ],
    additionalFaqs: [
      {
        q: 'Can I incorporate a company with a co-working address in Connaught Place or Aerocity?',
        a: `Yes. Co-working space addresses are accepted for company incorporation in Delhi. You need an NOC from the space operator and a utility bill in their name. Popular co-working locations like Connaught Place, Aerocity, Saket, and Nehru Place all have operators who routinely provide these documents.`,
      },
      {
        q: 'How long does Pvt Ltd incorporation take in Delhi?',
        a: `Standard timeline is 10-15 working days. This includes DSC issuance (1-2 days), name approval (1-2 days), SPICe+ filing and approval (5-7 days), and PAN/TAN issuance (2-3 days). If all documents are in order and there are no name objections, the process is usually completed within 12 days.`,
      },
    ],
  },

  'pvt-ltd-incorporation__mumbai': {
    jurisdictionNote: `Mumbai companies are registered with the Registrar of Companies, Maharashtra, located at Everest Building, 100 Marine Lines, Mumbai - 400 002. This is one of the busiest RoC offices in India. SPICe+ applications are processed centrally through MCA21, so the physical location doesn't affect processing time.`,
    citySpecificNotes: [
      `Maharashtra has Professional Tax. Directors drawing remuneration and all salaried employees must be registered under PT within 30 days of incorporation. Ollvy handles PT registration as a separate service (₹1,999).`,
      `BMC Gumasta License (trade licence) is required for business premises in Mumbai. This is separate from company incorporation and needs to be obtained after the company is registered.`,
    ],
    additionalFaqs: [
      {
        q: 'What is the typical timeline for company incorporation in Mumbai?',
        a: `12-15 working days is standard for Mumbai incorporations. The process is federal (MCA21) so it doesn't depend on the Mumbai RoC specifically. DSC takes 1-2 days, name approval 1-2 days, SPICe+ approval 5-7 days, and PAN/TAN 2-3 days.`,
      },
    ],
  },

  'gst-registration__hyderabad': {
    jurisdictionNote: `Hyderabad falls under Telangana SGST jurisdiction. Your GSTIN will have "36" as the state code (Telangana). The Telangana Commercial Taxes Department handles GST registration and compliance for the state.`,
    citySpecificNotes: [
      `Telangana has Professional Tax applicable to both employers and employees. Once you register for GST and start employing people, PT registration is mandatory.`,
      `GHMC (Greater Hyderabad Municipal Corporation) trade licence is required for commercial premises. Co-working spaces typically hold their own trade licences.`,
    ],
    additionalFaqs: [
      {
        q: 'Can I use a HITEC City co-working address for GST registration?',
        a: `Yes. HITEC City, Gachibowli, Madhapur, and other Hyderabad tech hubs have numerous co-working spaces that provide NOC letters for GST registration. You need the NOC and a utility bill in the operator's name.`,
      },
    ],
  },

  'gst-registration__chennai': {
    jurisdictionNote: `Chennai falls under Tamil Nadu SGST jurisdiction. Your GSTIN will have "33" as the state code (Tamil Nadu). The Tamil Nadu Commercial Taxes Department administers GST in the state.`,
    citySpecificNotes: [
      `Tamil Nadu has Professional Tax applicable after GST registration and employee hiring. PT registration is mandatory once you cross the threshold.`,
      `Chennai Corporation trade licence is required for commercial establishments. Most co-working spaces hold their own licences.`,
    ],
    additionalFaqs: [
      {
        q: 'What areas in Chennai are common for business registration?',
        a: `T. Nagar, Anna Nagar, Guindy, OMR (Old Mahabalipuram Road), and Perungudi are common business hubs with co-working spaces that support GST registration. All areas within Chennai use the same state code (33) for GSTIN.`,
      },
    ],
  },

  'trademark-registration__delhi': {
    jurisdictionNote: `Trademark applications for Delhi-based businesses are filed with the Trade Marks Registry, IP Bhawan, Sector-5, Dwarka, New Delhi - 110 075. All applications are filed online through the IP India portal. The registry covers Delhi, Haryana, Chandigarh, and several other northern states.`,
    citySpecificNotes: [
      `Delhi has a high volume of trademark filings. Examination timelines are typically 1-2 months for the initial examination report. Registration takes 6-12 months if there are no objections.`,
      `The IP India portal (ipindia.gov.in) handles all online filings. Physical hearings, if required, are conducted at the Dwarka office.`,
    ],
    additionalFaqs: [
      {
        q: 'How long does trademark registration take in Delhi?',
        a: `Timeline is 6-12 months. Initial examination report comes in 1-2 months. If there are no objections, the trademark is published in the journal for 4 months. After the publication period, registration certificate is issued. If there are objections, a hearing may be required, which adds 2-4 months.`,
      },
    ],
  },

  'director-kyc__delhi': {
    jurisdictionNote: `Director KYC (DIR-3 KYC Web) is a federal filing through the MCA21 portal. There is no Delhi-specific process - all directors of companies registered anywhere in India file through the same portal. Filing is now triennial (every 3 years). Next due date is June 30, 2028.`,
    citySpecificNotes: [
      `Director KYC uses OTP verification linked to your mobile number and email registered with MCA. Ensure these are up to date before filing.`,
      `If you're a director in multiple companies, you only need to file DIR-3 KYC once per financial year. The filing is linked to your DIN, not to individual companies.`,
    ],
    additionalFaqs: [
      {
        q: 'What happens if I miss the Director KYC deadline?',
        a: `If DIR-3 KYC is not filed by the triennial due date, your DIN is marked as deactivated. The company cannot file annual returns or other forms requiring director approval until the DIN is reactivated. Reactivation requires filing DIR-3 KYC Web with a penalty of Rs 5,000.`,
      },
    ],
  },

  'director-kyc__bangalore': {
    jurisdictionNote: `Director KYC is filed through the central MCA21 portal. There's no Karnataka-specific filing. All directors of Indian companies file through the same process regardless of where the company is registered.`,
    citySpecificNotes: [
      `Many Bangalore startup founders have DINs across multiple companies. Remember that DIR-3 KYC is once per DIN per year, not once per company.`,
      `The triennial deadline applies regardless of the company's financial year or registration date. Even if your company follows a different financial year, DIR-3 KYC is due by the common triennial date (currently June 30, 2028).`,
    ],
    additionalFaqs: [
      {
        q: 'I have a DIN from my previous company. Do I need to file DIR-3 KYC?',
        a: `Yes. DIR-3 KYC must be filed for all active DINs, even if you've resigned from all directorships. If you want to use your DIN in the future (for a new company or advisory role), keep it active by filing before each triennial deadline.`,
      },
    ],
  },

  'msme-registration__delhi': {
    jurisdictionNote: `MSME (Udyam) registration is done through the central Udyam portal (udyamregistration.gov.in). There's no state-specific registration process. Your Udyam certificate shows your business address state, but the registration itself is federal.`,
    citySpecificNotes: [
      `Delhi-based MSMEs can access several state-specific benefits in addition to central MSME schemes. The Delhi government offers additional subsidies for technology adoption and skill development.`,
      `Udyam registration is linked to your Aadhaar and PAN. Ensure both are up to date before applying.`,
    ],
    additionalFaqs: [
      {
        q: 'What are the benefits of MSME registration for a Delhi business?',
        a: `Benefits include: priority lending from banks at lower interest rates, protection against delayed payments (MSMED Act provisions), government tender preference, reduced electricity bills (state-specific), and access to central MSME schemes like Credit Guarantee Fund and technology support.`,
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// Generated content for service×city combos without hand-written entries
// ---------------------------------------------------------------------------

function buildIncorporationContent(city: CityConfig, type: 'pvt-ltd' | 'llp'): GeoContent {
  const entityName = type === 'pvt-ltd' ? 'Private Limited Company' : 'LLP'
  const formName = type === 'pvt-ltd' ? 'SPICe+' : 'FiLLiP'
  const ptNote = city.ptApplicable
    ? `${city.state} has Professional Tax (PT). Once your ${entityName.toLowerCase()} is registered, you must register for PT within 30 days if directors draw remuneration or you have salaried employees. Ollvy handles PT registration separately.`
    : `${city.state} does not levy Professional Tax. This is one fewer post-incorporation compliance step compared to states like Maharashtra or Karnataka.`

  const notes: string[] = [ptNote]
  if (city.shopEstActName) {
    notes.push(`The ${city.shopEstActName} applies to commercial establishments in ${city.name}. Registration under this Act is required within 30 days of commencing business.`)
  }
  if (city.coworkingNote) {
    notes.push(city.coworkingNote)
  }

  return {
    jurisdictionNote: `${entityName} incorporation in ${city.name} is filed with ${city.mcaRoc}. All ${formName} applications go through the MCA21 portal. Name availability is checked against the national MCA database - not just ${city.state} entities - so conflicting names anywhere in India can block your reservation.`,
    citySpecificNotes: notes,
    additionalFaqs: [
      {
        q: `Can I use a co-working space address in ${city.name} for ${entityName.toLowerCase()} incorporation?`,
        a: `Yes. Co-working space addresses are accepted as registered office addresses in ${city.name}. You need an NOC from the space operator on their letterhead and a utility bill for the premises in the operator's name. Ollvy CS reviews the documents before filing to avoid address rejection - the #1 cause of incorporation delays.`,
      },
      {
        q: `What is the typical timeline for ${entityName.toLowerCase()} incorporation in ${city.name}?`,
        a: `Standard timeline is 10-15 working days. This includes DSC issuance (1-2 days), name approval (1-2 days), ${formName} filing and approval (5-7 days), and PAN/TAN issuance (2-3 days). If all documents are in order and there are no name objections, the process is usually completed within 12 days.`,
      },
    ],
  }
}

function buildGstContent(city: CityConfig): GeoContent {
  const ptNote = city.ptApplicable
    ? `${city.state} has Professional Tax. Once you register for GST and start employing people, PT registration is mandatory under ${city.state} state rules.`
    : `${city.state} does not levy Professional Tax, so there is no separate PT registration required after GST registration.`

  const notes: string[] = [ptNote]
  if (city.coworkingNote) {
    notes.push(city.coworkingNote)
  }

  return {
    jurisdictionNote: `${city.name} falls under ${city.gstJurisdiction} All GST applications are filed electronically through the GSTN portal. Your commissionerate assignment is based on your business address pin code and only matters if you receive an officer query - Ollvy CA handles any interactions directly.`,
    citySpecificNotes: notes,
    additionalFaqs: [
      {
        q: `Can I use a co-working space address in ${city.name} for GST registration?`,
        a: `Yes. Co-working space addresses are accepted for GST registration in ${city.name}. You need an NOC from the space operator on their letterhead (with your name, company, and designated workspace) and a utility bill for the premises in the operator's name. Ollvy CA verifies both before filing.`,
      },
      {
        q: `What documents are needed for GST registration in ${city.name}?`,
        a: `For GST registration in ${city.name}: PAN and Aadhaar of the applicant, address proof (rental agreement or co-working NOC plus utility bill), bank account statement or cancelled cheque, and business incorporation documents if you're a company or LLP. Ollvy CA reviews all documents before filing to prevent rejection.`,
      },
    ],
  }
}

function buildTrademarkContent(city: CityConfig): GeoContent {
  return {
    jurisdictionNote: `Trademark applications for ${city.name}-based businesses are filed online through the IP India portal (ipindia.gov.in). The filing is federal - the same Trade Marks Registry processes applications regardless of where your business is located. Examination and hearings are handled by the registry office assigned based on your application, not your city.`,
    citySpecificNotes: [
      `Trademark registration is the same process across India. Your ${city.state} business address appears on the application but does not affect which registry processes it or the timeline.`,
      `Ollvy searches both the company registry (MCA) and trademark database (IP India) before filing to identify conflicts early. A conflicting name in either database can block your trademark.`,
    ],
    additionalFaqs: [
      {
        q: `How long does trademark registration take for a ${city.name} business?`,
        a: `6-12 months. Initial examination report comes in 1-2 months. If no objections, the trademark is published in the journal for 4 months. After the publication period, the registration certificate is issued. Objections or oppositions add 2-4 months. The timeline is the same regardless of city.`,
      },
    ],
  }
}

function buildItrContent(city: CityConfig): GeoContent {
  const ptNote = city.ptApplicable
    ? `${city.state} has Professional Tax, which is deductible as a business expense in your ITR. Ensure PT payments are accounted for when filing.`
    : `${city.state} does not levy Professional Tax, so this deduction is not applicable to your filing.`

  return {
    jurisdictionNote: `Income tax returns for ${city.name} businesses are processed by CPC Bangalore regardless of business location. The filing is federal through the Income Tax e-filing portal. Your jurisdictional Assessing Officer (AO) is assigned based on your PAN and business address in ${city.state}, but filing and processing is entirely online.`,
    citySpecificNotes: [
      ptNote,
      `${city.state} businesses must also ensure GST reconciliation (GSTR-9 vs books) and TDS compliance are up to date before filing ITR. Mismatches between GST returns and ITR are a common trigger for notices.`,
    ],
    additionalFaqs: [
      {
        q: `What is the ITR filing deadline for businesses in ${city.name}?`,
        a: `October 31 for businesses requiring audit (turnover above Rs 1 crore, or Rs 10 crore with 95% digital transactions). July 31 for non-audit cases. Missing the deadline means you cannot carry forward business losses and face interest under Section 234A (1% per month on tax due).`,
      },
    ],
  }
}

/**
 * Get geo content for a service×city combination.
 * Returns hand-written content where available, otherwise generates
 * content from the city's jurisdiction data.
 */
export function getGeoContent(serviceSlug: string, city: CityConfig): GeoContent {
  // Check for hand-written content first
  const key = `${serviceSlug}__${city.slug}`
  if (GEO_CONTENT[key]) {
    return GEO_CONTENT[key]
  }

  // Generate from city config based on service type
  if (serviceSlug === 'pvt-ltd-incorporation') return buildIncorporationContent(city, 'pvt-ltd')
  if (serviceSlug === 'llp-incorporation') return buildIncorporationContent(city, 'llp')
  if (serviceSlug === 'gst-registration') return buildGstContent(city)
  if (serviceSlug === 'trademark-registration') return buildTrademarkContent(city)
  if (serviceSlug === 'business-itr') return buildItrContent(city)

  // Fallback (shouldn't reach here for the 5 geo-enabled services)
  return buildIncorporationContent(city, 'pvt-ltd')
}
