'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { useToast } from '@/lib/hooks/use-toast'
import { formatDateTime } from '@/lib/utils'
import { REJECTION_REASONS, getRejectionLabel } from '@/lib/constants/rejection-reasons'
import {
  verifyWorkDocument,
  rejectWorkDocument,
  skipWorkDocument,
  undoVerification,
  undoRejection,
} from '@/app/(admin)/admin/orders/[orderId]/actions'
import type { OrderWorkDocument } from '@/lib/types'
import { DocumentViewButton } from './DocumentViewButton'

export function AdminLinkedDocumentCard({
  downloadDoc,
  uploadDoc,
  orderId,
}: {
  downloadDoc: OrderWorkDocument & { internal_note?: string; internal_note_at?: string }
  uploadDoc: OrderWorkDocument & { internal_note?: string; internal_note_at?: string }
  orderId: string
}) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [skipDialogOpen, setSkipDialogOpen] = useState(false)
  const [selectedReason, setSelectedReason] = useState<string>('')
  const [skipReason, setSkipReason] = useState('')
  const [internalNote, setInternalNote] = useState('')

  const isUploaded = uploadDoc.status === 'uploaded' || uploadDoc.status === 'verified'
  const isVerified = uploadDoc.status === 'verified'
  const isRejected = uploadDoc.status === 'rejected'
  const isSkipped = !!uploadDoc.skipped_at

  const handleVerify = async () => {
    setLoading(true)
    try {
      await verifyWorkDocument(uploadDoc.id, orderId, uploadDoc.document_label, internalNote.trim() || undefined)
      toast({ title: 'Document verified' })
      setVerifyDialogOpen(false)
      setInternalNote('')
    } catch (err) {
      toast({ title: 'Error', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async () => {
    if (!selectedReason) return
    setLoading(true)
    try {
      await rejectWorkDocument(uploadDoc.id, orderId, uploadDoc.document_label, selectedReason, internalNote.trim() || undefined)
      toast({ title: 'Document rejected' })
      setRejectDialogOpen(false)
      setInternalNote('')
    } catch (err) {
      toast({ title: 'Error', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const handleSkip = async () => {
    if (!skipReason.trim()) return
    setLoading(true)
    try {
      await skipWorkDocument(uploadDoc.id, orderId, uploadDoc.document_label, skipReason.trim())
      toast({ title: 'Document skipped' })
      setSkipDialogOpen(false)
    } catch (err) {
      toast({ title: 'Error', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`border rounded-lg overflow-hidden ${
      isVerified
        ? 'border-green-500/50 bg-green-500/5'
        : isRejected
        ? 'border-destructive bg-destructive/5'
        : isSkipped
        ? 'border-muted bg-muted/30'
        : 'border-border'
    }`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-border/50 bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">{downloadDoc.document_label}</p>
            <Badge variant="secondary" className="text-xs">For Signing</Badge>
            {isVerified && <Badge className="text-xs bg-green-600">Verified</Badge>}
            {isRejected && <Badge variant="destructive" className="text-xs">Rejected</Badge>}
            {isSkipped && <Badge variant="outline" className="text-xs">Skipped</Badge>}
          </div>
        </div>
        {downloadDoc.description && (
          <p className="text-xs text-muted-foreground mt-1">{downloadDoc.description}</p>
        )}
      </div>

      {/* Rejection reason banner */}
      {isRejected && uploadDoc.rejection_reason && (
        <div className="px-4 py-2 bg-destructive/10">
          <p className="text-sm text-destructive">{getRejectionLabel(uploadDoc.rejection_reason)}</p>
        </div>
      )}

      {/* Split Content: Sent to Customer | Received from Customer */}
      <div className="grid grid-cols-2 divide-x divide-border/50">
        {/* Left: Document sent to customer */}
        <div className="p-4">
          <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wide">Sent to Customer</p>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
              <svg className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{downloadDoc.file_name || 'Document'}</p>
              <p className="text-xs text-muted-foreground">
                {downloadDoc.uploaded_at ? formatDateTime(downloadDoc.uploaded_at) : ''}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {downloadDoc.file_url && (
              <>
                <DocumentViewButton
                  fileUrl={downloadDoc.file_url}
                  bucket="work-documents"
                  label="View"
                />
                <DocumentViewButton
                  fileUrl={downloadDoc.file_url}
                  bucket="work-documents"
                  label="Download"
                  download
                  fileName={downloadDoc.file_name || downloadDoc.document_label}
                />
              </>
            )}
          </div>
        </div>

        {/* Right: Document received from customer (signed) */}
        <div className="p-4">
          <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wide">Received (Signed)</p>
          {isUploaded || isRejected ? (
            <>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isVerified ? 'bg-green-500/10' : isRejected ? 'bg-destructive/10' : 'bg-amber-500/10'
                }`}>
                  <svg className={`h-5 w-5 ${
                    isVerified ? 'text-green-600' : isRejected ? 'text-destructive' : 'text-amber-600'
                  }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{uploadDoc.file_name || uploadDoc.document_label}</p>
                  <p className="text-xs text-muted-foreground">
                    {uploadDoc.uploaded_at ? formatDateTime(uploadDoc.uploaded_at) : 'Uploaded'}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 flex-wrap">
                {uploadDoc.file_url && (
                  <>
                    <DocumentViewButton
                      fileUrl={uploadDoc.file_url}
                      bucket="work-documents"
                      label="View"
                    />
                    <DocumentViewButton
                      fileUrl={uploadDoc.file_url}
                      bucket="work-documents"
                      label="Download"
                      download
                      fileName={uploadDoc.file_name || uploadDoc.document_label}
                    />
                  </>
                )}

                {uploadDoc.status === 'uploaded' && !isSkipped && (
                  <>
                    <Button size="sm" onClick={() => setVerifyDialogOpen(true)} disabled={loading}>
                      Verify
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setRejectDialogOpen(true)} disabled={loading}>
                      Reject
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setSkipDialogOpen(true)} disabled={loading}>
                      Skip
                    </Button>
                  </>
                )}

                {isVerified && (
                  <button
                    onClick={() => undoVerification(uploadDoc.id, orderId, 'work')}
                    className="text-xs text-muted-foreground hover:underline"
                  >
                    Undo
                  </button>
                )}

                {isRejected && (
                  <button
                    onClick={() => undoRejection(uploadDoc.id, orderId, 'work')}
                    className="text-xs text-muted-foreground hover:underline"
                  >
                    Undo
                  </button>
                )}
              </div>
            </>
          ) : isSkipped ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                <svg className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground">Skipped</p>
                {uploadDoc.skip_reason && (
                  <p className="text-xs text-muted-foreground/70">{uploadDoc.skip_reason}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 h-full">
              <div className="w-10 h-10 rounded-lg bg-muted/50 border-2 border-dashed border-border flex items-center justify-center flex-shrink-0">
                <svg className="h-5 w-5 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground">Awaiting upload</p>
                <p className="text-xs text-muted-foreground/70">Customer has not uploaded yet</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Internal notes */}
      {(downloadDoc.internal_note || uploadDoc.internal_note) && (
        <div className="px-4 py-2 border-t border-border/50 bg-muted/20">
          {downloadDoc.internal_note && (
            <p className="text-xs text-muted-foreground">
              <span className="font-medium">Sent doc note:</span> {downloadDoc.internal_note}
            </p>
          )}
          {uploadDoc.internal_note && (
            <p className="text-xs text-muted-foreground mt-1">
              <span className="font-medium">Upload note:</span> {uploadDoc.internal_note}
            </p>
          )}
        </div>
      )}

      {/* Verify Dialog */}
      <Dialog open={verifyDialogOpen} onOpenChange={setVerifyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Verify {uploadDoc.document_label}</p>
            <div>
              <Label className="text-xs text-muted-foreground">
                Internal note (optional)
              </Label>
              <Textarea
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                placeholder="Add context for your team..."
                rows={2}
                className="mt-1 text-sm resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setVerifyDialogOpen(false); setInternalNote('') }}>Cancel</Button>
            <Button onClick={handleVerify} disabled={loading}>Verify</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Select value={selectedReason} onValueChange={setSelectedReason}>
              <SelectTrigger>
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent>
                {REJECTION_REASONS.map(r => (
                  <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div>
              <Label className="text-xs text-muted-foreground">
                Internal note (optional)
              </Label>
              <Textarea
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                placeholder="Add context for your team..."
                rows={2}
                className="mt-1 text-sm resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setRejectDialogOpen(false); setInternalNote('') }}>Cancel</Button>
            <Button onClick={handleReject} disabled={loading || !selectedReason}>Reject</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Skip Dialog */}
      <Dialog open={skipDialogOpen} onOpenChange={setSkipDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Skip Document</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Reason for skipping..."
            value={skipReason}
            onChange={(e) => setSkipReason(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setSkipDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSkip} disabled={loading || !skipReason.trim()}>Skip</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
