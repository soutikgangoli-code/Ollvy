/**
 * Database Types - matches actual Supabase schema
 */

export interface ServiceCardData {
  id: string
  slug: string
  name: string
  category: string
  description: string
  ollvyFee: number
  govtFee: number
  slaDays: number
  isRetainer: boolean
  avgRating: number | null
  totalRatings: number
}

export interface ServicePricingData {
  id: string
  ollvyFee: number
  govtFee: number
  slaDays: number
  isRetainer: boolean
  avgRating: number | null
  totalRatings: number
  scopeIncluded: string[]
  scopeExcluded: string[]
  priceVariesByState: boolean
}
