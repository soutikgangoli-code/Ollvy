// Single source of truth for how a document's review state is shown to the
// customer, so the same state reads identically across every surface: the order
// page banners, the right-hand WorkDocumentsSection, and the Documents tab.
//
// "uploaded" means the file has been received and is awaiting admin/CA review.
// "verified" means the admin/CA has approved it (which also locks it from edits).
export type DocReviewStatus = 'pending' | 'uploaded' | 'verified' | 'rejected'

export const DOC_STATUS_META: Record<DocReviewStatus, { label: string; className: string }> = {
  pending: {
    label: 'Pending',
    className: 'border-border text-muted-foreground',
  },
  uploaded: {
    label: 'Under review',
    className: 'border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/5',
  },
  verified: {
    label: 'Verified',
    className: 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5',
  },
  rejected: {
    label: 'Rejected',
    className: 'border-red-500/30 text-red-600 dark:text-red-400 bg-red-500/5',
  },
}

// Initial order_documents have no status column — derive it from the timestamps/fields.
export function initialDocStatus(doc: {
  rejection_reason?: string
  verified_at?: string
  file_url?: string
}): DocReviewStatus {
  if (doc.rejection_reason) return 'rejected'
  if (doc.verified_at) return 'verified'
  if (doc.file_url) return 'uploaded'
  return 'pending'
}

// Normalise a work-document status string to a known review status.
export function workDocStatus(status?: string | null): DocReviewStatus {
  if (status === 'verified' || status === 'uploaded' || status === 'rejected') return status
  return 'pending'
}
