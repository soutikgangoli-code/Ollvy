import { cloudKitchenPack, CloudKitchenPack } from './packs/cloud-kitchen'

export type { CloudKitchenPack }
export { cloudKitchenPack }

export async function getPackBySlug(slug: string): Promise<CloudKitchenPack | null> {
  const packs: Record<string, CloudKitchenPack> = {
    'cloud-kitchen-setup': cloudKitchenPack,
  }
  return packs[slug] ?? null
}

export async function getAllPackSlugs(): Promise<string[]> {
  return ['cloud-kitchen-setup']
}

// Price helpers - all prices in paisa, never floats
export function formatPaisa(paisa: number): string {
  return `₹${(paisa / 100).toLocaleString('en-IN')}`
}

export function calculatePackTotal(
  services: Array<{ price: number }>,
  selectedIds: string[],
  discountPercent: number,
  serviceIds: string[]
): {
  subtotal: number
  discountAmount: number
  total: number
  savings: number
  applyDiscount: boolean
} {
  const selected = services.filter((_, i) => selectedIds.includes(serviceIds[i]))
  const subtotal = selected.reduce((sum, s) => sum + s.price, 0)
  const applyDiscount = selectedIds.length >= 2
  const discountAmount = applyDiscount ? Math.round(subtotal * (discountPercent / 100)) : 0
  const total = subtotal - discountAmount
  return { subtotal, discountAmount, total, savings: discountAmount, applyDiscount }
}
