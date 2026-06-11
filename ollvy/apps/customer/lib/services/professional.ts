// Which professional fronts a given service, for copy like "Verified ___".
// Trademark and copyright are legal/IP work done by a lawyer; everything else
// is a CA. Deliberately tiny — not a per-service badging system, just the right word.
const LAWYER_SLUGS = new Set(['trademark-registration', 'copyright-registration'])

export function serviceProfessional(slug: string): string {
  return LAWYER_SLUGS.has(slug) ? 'lawyer' : 'CA'
}
