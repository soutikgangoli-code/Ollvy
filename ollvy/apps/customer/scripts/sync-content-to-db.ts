/**
 * One-time script: Sync corrected static config content into Supabase DB.
 *
 * The content audit fixed static .ts files but service pages render from DB.
 * This script pushes those corrections into the service_packages table.
 *
 * Run: npx tsx scripts/sync-content-to-db.ts
 */

import { createClient } from '@supabase/supabase-js'

// Static configs with corrected content
import { directorKyc } from '../lib/services/director-kyc'
import { pvtLtdIncorporation } from '../lib/services/pvt-ltd-incorporation'
import { mcaAnnualFiling } from '../lib/services/mca-annual-filing'
import { dinReactivation } from '../lib/services/din-reactivation'
import { tdsMonthlyCompliance } from '../lib/services/tds-monthly-compliance'
import { businessItr } from '../lib/services/business-itr'
import { gstRegistration } from '../lib/services/gst-registration'

// New-style data configs for seoTitle and content
import { pvtLtdIncorporation as pvtData, llpIncorporation as llpData } from '../lib/services/data/services-1-2'
import { businessItr as bizItrData } from '../lib/services/data/services-3-5'
import { msmeRegistration as msmeData } from '../lib/services/data/services-6-9'
import { gstCancellation as gstCancelData, dinReactivation as dinData, cloudKitchenSetup as ckData } from '../lib/services/data/services-10-14'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function update(slug: string, fields: Record<string, any>) {
  const { error } = await supabase.from('service_packages').update(fields).eq('slug', slug)
  if (error) {
    console.error(`FAILED ${slug}:`, error.message)
  } else {
    console.log(`✓ ${slug}: ${Object.keys(fields).join(', ')}`)
  }
}

async function main() {
  console.log('Syncing corrected content to DB...\n')

  // ─── A. director-kyc: Full rewrite (triennial + penalty + KYC Web) ───
  await update('director-kyc', {
    tagline: directorKyc.tagline,
    seo_title: 'Director KYC 2026 | DIR-3 KYC Web Filing | ₹499 | Ollvy', // Keep DB price ₹499
    seo_description: 'Director KYC now triennial. Next due Jun 30, 2028. Missed the last deadline? Rs 5,000 penalty per director. Ollvy files DIR-3 KYC Web in 2 working days. Rs 499 per director.',
    service_type: directorKyc.serviceType,
    penalty_for_missing: directorKyc.penaltyForMissing,
    service_risks: directorKyc.serviceRisks,
    faqs: directorKyc.faqs,
    whats_included: directorKyc.whatsIncluded,
    workflow_stages: directorKyc.processSteps,
    profile_personas: directorKyc.profilePersonas,
  })

  // ─── B. mca-annual-filing: Fix director-kyc unlock text ───
  await update('mca-annual-filing', {
    unlocks: [
      {
        name: 'Director KYC (DIR-3 KYC Web)',
        slug: 'director-kyc',
        type: 'required',
        price: '₹499',
        explanation: 'Triennial filing. Next due Jun 30, 2028. Rs 5,000 penalty if missed.',
      },
      {
        name: 'Business ITR',
        slug: 'business-itr',
        type: 'required',
        price: '₹4,999',
        explanation: 'ITR-6 due Oct 31 every year.',
      },
    ],
  })

  // ─── C. din-reactivation: Fix unlock price + text + tagline ───
  await update('din-reactivation', {
    tagline: 'DIN deactivated? All pending DIR-3 KYC filed. DIN active in 1-2 working days.',
    penalty_for_missing: dinReactivation.penaltyForMissing,
    unlocks: [
      {
        name: 'Director KYC (DIR-3 KYC Web)',
        slug: 'director-kyc',
        type: 'required',
        price: '₹499',
        explanation: 'Triennial filing. Next due Jun 30, 2028.',
      },
    ],
  })

  // ─── D. pvt-ltd-incorporation: Fix KYC refs + unlocks ───
  // Keep existing unlocks but fix any KYC text in included/faqs
  await update('pvt-ltd-incorporation', {
    // Push corrected included (has triennial KYC calendar ref)
    whats_included: pvtData.included,
    // Push corrected faqs (has triennial KYC in "after incorporation" FAQ)
    faqs: pvtData.faqs,
    // Unlocks: keep existing ones (gst-reg, trademark, startup-india are all valid slugs)
    // startup-india exists as a service slug — keep it
  })

  // ─── E. llp-incorporation: Fix KYC refs in included ───
  await update('llp-incorporation', {
    whats_included: llpData.included,
  })

  // ─── F. business-itr: seo_title 2025→2026 + remove broken unlock ───
  await update('business-itr', {
    seo_title: 'Business ITR Filing 2026 | ITR-6, ITR-5 | ₹4,999 | Ollvy',
    seo_description: 'File your company ITR (ITR-6 for Pvt Ltd, ITR-5 for LLP) before Oct 31. Fixed price Rs 4,999. Ollvy CA assigned within 24 hours. Includes P&L review and depreciation.',
    unlocks: [], // Remove statutory-audit (doesn't exist)
  })

  // ─── G. business-pan: seo_title 2025→2026 + fix unlock prices ───
  await update('business-pan', {
    seo_title: 'Business PAN Registration for Company, LLP and Firm (2026) | Ollvy',
    unlocks: [
      {
        name: 'Open Company Bank Account',
        slug: '',
        type: 'required',
        price: 'Free',
        explanation: 'Banks require PAN to open a current account. Use acknowledgement letter while PAN processes.',
      },
      {
        name: 'GST Registration',
        slug: 'gst-registration',
        type: 'required',
        price: '₹1,499', // Correct DB price
        explanation: 'GST portal requires company PAN. Apply for GST once PAN is received.',
      },
      {
        name: 'Business ITR Filing',
        slug: 'business-itr',
        type: 'required',
        price: '₹4,999',
        explanation: 'Company must file ITR every year using company PAN. First ITR due by October 31.',
      },
      {
        name: 'TDS Monthly Compliance',
        slug: 'tds-monthly-compliance',
        type: 'beneficial',
        price: '₹999/month', // Correct DB price
        explanation: 'TDS deductions are linked to company PAN. Required once you start paying salaries or vendor invoices.',
      },
    ],
  })

  // ─── H. gst-registration: Fix broken unlock slugs + prices ───
  await update('gst-registration', {
    unlocks: [
      {
        name: 'GST Monthly Filing',
        slug: 'gst-monthly', // Fixed from gst-monthly-50l
        type: 'required',
        price: 'From ₹2,999/month', // Correct DB price
        explanation: 'GSTR-1 by 11th, GSTR-3B by 20th. Every month. Mandatory.',
      },
      // Removed gst-annual-return (doesn't exist as a service)
    ],
  })

  // ─── I. gst-monthly: Remove broken unlock ───
  await update('gst-monthly', {
    unlocks: [], // Removed gst-annual-return (doesn't exist)
  })

  // ─── J. cloud-kitchen-setup: Fix broken slugs + prices ───
  await update('cloud-kitchen-setup', {
    unlocks: [
      {
        name: 'List on Swiggy and Zomato',
        slug: '',
        type: 'required',
        price: 'Free',
        explanation: 'Both platforms require FSSAI number during onboarding. Submit immediately after certificate is issued.',
      },
      {
        name: 'GST Monthly Filing',
        slug: 'gst-monthly', // Fixed from gst-monthly-filing
        type: 'required',
        price: '₹2,999/month',
        explanation: 'Once GST is registered, monthly returns are due by the 20th. Missing one means TCS deducted by Swiggy stays stuck.',
      },
      {
        name: 'Trademark Registration',
        slug: 'trademark-registration', // Fixed from trademark-word-mark
        price: '₹7,499', // Fixed from ₹14,999
        type: 'beneficial',
        explanation: 'Competitors can register your cloud kitchen brand name on Swiggy once you scale. File early.',
      },
      // Removed fssai-annual-return (doesn't exist)
    ],
  })

  // ─── K. gst-cancellation: Remove broken unlock ───
  await update('gst-cancellation', {
    unlocks: [], // Removed company-closure (doesn't exist)
  })

  // ─── L. trademark-registration: Remove broken unlocks ───
  await update('trademark-registration', {
    unlocks: [], // Removed trademark-renewal + copyright-registration (don't exist)
  })

  // ─── M. tds-monthly-compliance: Remove broken unlock ───
  await update('tds-monthly-compliance', {
    unlocks: [], // Removed payroll-management (doesn't exist yet)
  })

  // ─── N. msme-registration: Fix wrong unlock prices ───
  await update('msme-registration', {
    unlocks: [
      {
        name: 'GST Registration',
        slug: 'gst-registration',
        type: 'required',
        price: '₹1,499', // Fixed from ₹8,999
        explanation: 'Required for billing.',
      },
      {
        name: 'Startup India',
        slug: 'startup-india',
        type: 'beneficial',
        price: '₹1,999', // Fixed from ₹7,999
        explanation: 'Additional benefits if innovation-based.',
      },
      {
        name: 'Trademark Registration',
        slug: 'trademark-registration',
        type: 'beneficial',
        price: '₹7,499', // Fixed from ₹12,499
        explanation: 'MSME discount on govt fees.',
      },
    ],
  })

  console.log('\nDone! Run the audit script to verify.')

  // Invalidate the `service-packages` cache tag so live pages pick up the
  // new content without waiting for any TTL. Requires REVALIDATE_SECRET set
  // and REVALIDATE_URL pointed at the deployed host (e.g. https://www.ollvy.com).
  const revalidateUrl = process.env.REVALIDATE_URL
  const revalidateSecret = process.env.REVALIDATE_SECRET
  if (revalidateUrl && revalidateSecret) {
    try {
      const res = await fetch(`${revalidateUrl}/api/revalidate-services`, {
        method: 'POST',
        headers: { authorization: `Bearer ${revalidateSecret}` },
      })
      if (res.ok) {
        console.log('✓ Cache tag service-packages revalidated')
      } else {
        console.warn(`Cache revalidate failed: ${res.status} ${await res.text()}`)
      }
    } catch (err) {
      console.warn('Cache revalidate request threw:', err)
    }
  } else {
    console.log('(Set REVALIDATE_URL + REVALIDATE_SECRET to auto-invalidate the cache)')
  }
}

main().catch(console.error)
