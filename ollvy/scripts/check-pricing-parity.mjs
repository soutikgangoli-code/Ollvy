// Drift guard for dynamic govt-fee pricing.
//
// The slab logic lives in TWO hand-mirrored copies because they run in different
// runtimes and can't share a module:
//   - CLIENT: apps/customer/lib/pricing/calculate-price.ts  (resolveGovtFeePaisa)
//   - SERVER: supabase/functions/create-razorpay-order/index.ts  (computeGovtFeeOverride)
// The server one sets what Razorpay actually charges; the client one drives the
// displayed price. If they diverge, the customer is shown one number and charged
// another. This script extracts the slab tables + discount list + key rate literals
// from both and fails (exit 1) if they don't match.
//
//   node scripts/check-pricing-parity.mjs

import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const CLIENT = join(ROOT, 'apps/customer/lib/pricing/calculate-price.ts')
const SERVER = join(ROOT, 'supabase/functions/create-razorpay-order/index.ts')

// Pull just the pricing function out of each file so we don't pick up unrelated numbers.
function pricingRegion(src, startMarker, endMarker) {
  const start = src.indexOf(startMarker)
  if (start === -1) throw new Error(`marker not found: ${startMarker}`)
  const end = src.indexOf(endMarker, start)
  return src.slice(start, end === -1 ? undefined : end)
}

// Normalised signature of the pricing logic: every "'<key>': <value>" slab pair,
// the discount-eligible applicant list, and the rate/DSC literals — all sorted so
// formatting/order/comments don't matter, only the numbers.
function signature(region) {
  const slabs = [...region.matchAll(/'(\d+)':\s*(\d+)/g)].map((m) => `${m[1]}=${m[2]}`).sort()
  const discountMatch = region.match(/isDiscountEligible\s*=\s*\[([^\]]+)\]/)
  const discount = discountMatch
    ? discountMatch[1].split(',').map((s) => s.trim().replace(/['"]/g, '')).filter(Boolean).sort()
    : []
  // Rate / DSC / fallback literals that must also match.
  const literals = [...region.matchAll(/\b(450000|900000|120000|799900|500000)\b/g)]
    .map((m) => m[1])
  const literalSet = [...new Set(literals)].sort()
  return JSON.stringify({ slabs, discount, literalSet })
}

const clientRegion = pricingRegion(
  readFileSync(CLIENT, 'utf8'),
  'export function resolveGovtFeePaisa',
  'export function calculateServicePrice',
)
const serverRegion = pricingRegion(
  readFileSync(SERVER, 'utf8'),
  'function computeGovtFeeOverride',
  'interface ServicePackage',
)

const clientSig = signature(clientRegion)
const serverSig = signature(serverRegion)

if (clientSig !== serverSig) {
  console.error('[check-pricing-parity] CLIENT and SERVER govt-fee logic have DRIFTED.\n')
  console.error('  client:', clientSig)
  console.error('  server:', serverSig)
  console.error('\nUpdate both resolveGovtFeePaisa (client) and computeGovtFeeOverride (server) to match.')
  process.exit(1)
}

console.log('[check-pricing-parity] client and server govt-fee logic are in sync.')
