import { pvtLtdIncorporation, llpIncorporation } from './services-1-2'
import { gstRegistration, gstMonthlyFiling, businessItr } from './services-3-5'
import { trademarkRegistration, mcaAnnualFiling, tdsMonthlyCompliance, msmeRegistration } from './services-6-9'
import { gstCancellation, gstRevocation, dinReactivation, companyNameChange, cloudKitchenSetup } from './services-10-14'
import type { ServicePageConfig } from '../types'

export const allServices: ServicePageConfig[] = [
  pvtLtdIncorporation, llpIncorporation,
  gstRegistration, gstMonthlyFiling, businessItr,
  trademarkRegistration, mcaAnnualFiling, tdsMonthlyCompliance, msmeRegistration,
  gstCancellation, gstRevocation, dinReactivation, companyNameChange, cloudKitchenSetup,
]

export const servicesBySlug = Object.fromEntries(
  allServices.map(s => [s.slug, s])
)
