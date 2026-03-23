export const REJECTION_REASONS = [
  { value: 'blurry_or_unclear', label: 'Document is blurry or unclear' },
  { value: 'wrong_document', label: 'Wrong document uploaded' },
  { value: 'document_expired', label: 'Document is expired' },
  { value: 'signature_missing', label: 'Signature missing' },
  { value: 'name_mismatch', label: 'Name does not match order details' },
  { value: 'incomplete_document', label: 'Document is incomplete or partial' },
  { value: 'poor_lighting', label: 'Poor lighting or low resolution' },
  { value: 'unsupported_format', label: 'File format not supported' },
  { value: 'other', label: 'Other' },
] as const

export type RejectionReasonValue = typeof REJECTION_REASONS[number]['value']

export function getRejectionLabel(value: RejectionReasonValue | string): string {
  return REJECTION_REASONS.find(r => r.value === value)?.label ?? value
}

export function buildRejectionMessage(
  documentLabel: string,
  reason: RejectionReasonValue | string,
  reasonOther?: string
): string {
  const detail = reason === 'other' && reasonOther ? reasonOther : getRejectionLabel(reason)
  return `Your ${documentLabel} was rejected because: ${detail}. Please re-upload.`
}
