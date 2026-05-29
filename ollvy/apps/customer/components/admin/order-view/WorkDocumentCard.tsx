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
  deleteWorkDocument,
} from '@/app/(admin)/admin/orders/[orderId]/actions'
import type { OrderWorkDocument } from '@/lib/types'
import { DocumentViewButton } from './DocumentViewButton'

export function WorkDocumentCard({ doc, orderId, direction }: { doc: OrderWorkDocument & { internal_note?: string; internal_note_at?: string }; orderId: string; direction: 'from_customer' | 'to_customer' }) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false)
  const [skipDialogOpen, setSkipDialogOpen] = useState(false)
  const [selectedReason, setSelectedReason] = useState<string>('')
  const [skipReason, setSkipReason] = useState('')
  const [internalNote, setInternalNote] = useState('')

  const handleVerify = async () => {
    setLoading(true)
    try {
      await verifyWorkDocument(doc.id, orderId, doc.document_label, internalNote.trim() || undefined)
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
      await rejectWorkDocument(doc.id, orderId, doc.document_label, selectedReason, internalNote.trim() || undefined)
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
      await skipWorkDocument(doc.id, orderId, doc.document_label, skipReason.trim())
      toast({ title: 'Document skipped' })
      setSkipDialogOpen(false)
    } catch (err) {
      toast({ title: 'Error', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setLoading(true)
    try {
      await deleteWorkDocument(doc.id, orderId)
      toast({ title: 'Document deleted' })
    } catch (err) {
      toast({ title: 'Error', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-3 border border-border rounded-lg">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium">{doc.document_label}</p>
          {doc.description && (
            <p className="text-xs text-muted-foreground mt-0.5">{doc.description}</p>
          )}
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={
              doc.status === 'verified' ? 'default' :
              doc.status === 'rejected' ? 'destructive' :
              doc.status === 'uploaded' ? 'secondary' :
              'outline'
            }>
              {doc.skipped_at ? 'Skipped' : doc.status}
            </Badge>
            {doc.tag && (
              <Badge variant="outline" className="text-xs">
                {doc.tag.replace('_', ' ')}
              </Badge>
            )}
          </div>
          {doc.linked_request_id && (
            <p className="text-xs text-yellow-600 mt-1">Re-upload requested</p>
          )}
          {doc.rejection_reason && (
            <p className="text-xs text-red-500 mt-1">{getRejectionLabel(doc.rejection_reason)}</p>
          )}
          {doc.file_name && doc.uploaded_at && (
            <p className="text-xs text-muted-foreground mt-1">
              {doc.file_name} - {formatDateTime(doc.uploaded_at)}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {doc.file_url && (
            <>
              <DocumentViewButton
                fileUrl={doc.file_url}
                bucket="work-documents"
                label="View"
              />
              <DocumentViewButton
                fileUrl={doc.file_url}
                bucket="work-documents"
                label="Download"
                download
                fileName={doc.file_name || doc.document_label}
              />
            </>
          )}

          {direction === 'from_customer' && doc.status === 'uploaded' && !doc.skipped_at && (
            <>
              <Button size="sm" onClick={() => setVerifyDialogOpen(true)} disabled={loading}>Verify</Button>
              <Button variant="outline" size="sm" onClick={() => setRejectDialogOpen(true)} disabled={loading}>
                Reject
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setSkipDialogOpen(true)} disabled={loading}>
                Skip
              </Button>
            </>
          )}

          {direction === 'from_customer' && doc.status === 'verified' && (
            <button
              onClick={() => undoVerification(doc.id, orderId, 'work')}
              className="text-xs text-muted-foreground hover:underline"
            >
              Undo
            </button>
          )}

          {direction === 'from_customer' && doc.status === 'rejected' && (
            <button
              onClick={() => undoRejection(doc.id, orderId, 'work')}
              className="text-xs text-muted-foreground hover:underline"
            >
              Undo
            </button>
          )}

          {direction === 'to_customer' && (
            <Button variant="ghost" size="sm" onClick={handleDelete} disabled={loading}>
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* Internal note display */}
      {doc.internal_note && (
        <div className="mt-2 bg-muted rounded px-2 py-1.5 text-xs text-muted-foreground">
          <span className="font-medium">Note:</span> {doc.internal_note}
          {doc.internal_note_at && (
            <span className="ml-2 opacity-60">- {formatDateTime(doc.internal_note_at)}</span>
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
            <p className="text-sm text-muted-foreground">Verify {doc.document_label}</p>
            <div>
              <Label className="text-xs text-muted-foreground">
                Internal note (optional - only you and your team can see this)
              </Label>
              <Textarea
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                placeholder="Add context about this document for your team..."
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
                Internal note (optional - only you and your team can see this)
              </Label>
              <Textarea
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                placeholder="Add context about this document for your team..."
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
