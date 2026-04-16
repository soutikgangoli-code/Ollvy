import { pvtLtdIncorporation, llpIncorporation } from './services-1-2'
import { gstRegistration, gstMonthlyFiling, businessItr } from './services-3-5'
import { trademarkRegistration, mcaAnnualFiling, tdsMonthlyCompliance, msmeRegistration } from './services-6-9'
import { gstCancellation, gstRevocation, dinReactivation, companyNameChange, cloudKitchenSetup } from './services-10-14'
import { iepfConsultation } from './services-iepf'
import { esopStructuring } from './services-esop'
import type { ServicePageConfig } from '../types'

export const allServices: ServicePageConfig[] = [
  pvtLtdIncorporation, llpIncorporation,
  gstRegistration, gstMonthlyFiling, businessItr,
  trademarkRegistration, mcaAnnualFiling, tdsMonthlyCompliance, msmeRegistration,
  gstCancellation, gstRevocation, dinReactivation, companyNameChange, cloudKitchenSetup,
  iepfConsultation,
  esopStructuring as ServicePageConfig,
]

export const servicesBySlug = Object.fromEntries(
  allServices.map(s => [s.slug, s])
)
