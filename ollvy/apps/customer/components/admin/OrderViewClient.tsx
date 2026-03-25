'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { formatPaisa, formatDate, formatDateTime } from '@/lib/utils'
import { useToast } from '@/lib/hooks/use-toast'
import { getClient, getEdgeFunctionUrl } from '@/lib/supabase'
import { REJECTION_REASONS, getRejectionLabel, type RejectionReasonValue } from '@/lib/constants/rejection-reasons'
import {
  updateOrderStatus,
  assignProfessional,
  verifyInitialDocument,
  rejectInitialDocument,
  verifyWorkDocument,
  rejectWorkDocument,
  skipWorkDocument,
  undoVerification,
  undoRejection,
  updateRoundTitle,
  markRoundComplete,
  addQuestionToRound,
  createAdminNote,
  deleteAdminNote,
  resolveDisputeRefund,
  resolveDisputeContinue,
  resolveDisputeClose,
  insertCompletionNotification,
  uploadAdminDocument,
  deleteWorkDocument,
  createRound,
  cancelOrderWithReason,
  adminUploadFile,
  adminGetSignedUrls,
} from '@/app/(admin)/admin/orders/[orderId]/actions'
import type { AdminUser } from '@/lib/admin/get-admin-user'
import type { OrderRound, OrderWorkDocument, OrderDocument, OrderAdminNote } from '@/lib/types'
import { AdminChatWindow } from '@/components/chat/AdminChatWindow'
import { OrderActivityLog } from '@/components/admin/OrderActivityLog'

// Types
interface OrderViewClientProps {
  order: any
  rounds: OrderRound[]
  adminUser: AdminUser
  initialDocs: OrderDocument[]
  questionnaireAnswers: Array<{ question_key: string; response_value: any }>
  questionnaireQuestions: Array<{
    question_key: string
    question_label: string
    question_type: string
    options?: Array<{ value: string; label: string }>
    display_order: number
  }>
  adminNotes: Array<OrderAdminNote & { admin_users?: { name: string } }>
  professionals: Array<{ id: string; full_name: string; display_name?: string; email: string; professional_type: string }>
  adminNamesMap: Record<string, string>
  assignedAdmin: { id: string; name: string; email: string } | null
}

const ORDER_STATUSES = [
  'pending_assignment',
  'waitlisted',
  'in_progress',
  'completed',
  'disputed',
  'cancelled',
]

// Helper to render response values
function renderResponseValue(
  responseValue: string | number | string[] | null,
  questionType: string,
  options?: Array<{ value: string; label: string }>
): string {
  if (responseValue == null) return 'Not answered'
  if (questionType === 'multiselect' && Array.isArray(responseValue)) {
    return responseValue
      .map(v => options?.find(o => o.value === v)?.label ?? v)
      .join(', ')
  }
  if ((questionType === 'select' || questionType === 'radio') && options) {
    return options.find(o => o.value === String(responseValue))?.label ?? String(responseValue)
  }
  return String(responseValue)
}

export function OrderViewClient({
  order,
  rounds,
  adminUser,
  initialDocs,
  questionnaireAnswers,
  questionnaireQuestions,
  adminNotes,
  professionals,
  adminNamesMap,
  assignedAdmin,
}: OrderViewClientProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [downloadLoading, setDownloadLoading] = useState(false)

  // Dialog states
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string>('')
  const [disputeAction, setDisputeAction] = useState<'refund' | 'continue' | 'close' | null>(null)
  const [addRoundOpen, setAddRoundOpen] = useState(false)
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [cancellationReason, setCancellationReason] = useState('')
  const [cancellationDetail, setCancellationDetail] = useState('')
  const [cancellationMessage, setCancellationMessage] = useState('')

  // Note state
  const [newNote, setNewNote] = useState('')
  const [quickUploadOpen, setQuickUploadOpen] = useState(false)

  // Check if final output exists
  const hasFinalOutput = rounds.some(r =>
    r.order_work_documents?.some(d => d.tag === 'final_output')
  )

  // Check if Round 1 exists
  const hasRound1 = rounds.some(r => r.round_number === 1)

  // Merged questionnaire data
  const mergedAnswers = useMemo(() => {
    return questionnaireQuestions.map(q => {
      const answer = questionnaireAnswers.find(a => a.question_key === q.question_key)
      return {
        ...q,
        response_value: answer?.response_value ?? null,
      }
    })
  }, [questionnaireQuestions, questionnaireAnswers])

  // Handle status change
  const handleStatusChange = async (newStatus: string) => {
    // Intercept cancellation to show dialog
    if (newStatus === 'cancelled') {
      setCancelDialogOpen(true)
      return
    }
    setLoading(true)
    try {
      await updateOrderStatus(order.id, newStatus)
      toast({ title: 'Status updated' })
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  // Handle order cancellation with reason
  const handleCancelOrder = async () => {
    if (!cancellationReason) return
    setLoading(true)
    try {
      const message = cancellationMessage.trim() ||
        `Your order has been cancelled. Reason: ${CANCELLATION_REASONS.find(r => r.value === cancellationReason)?.label || cancellationReason}`
      await cancelOrderWithReason(order.id, cancellationReason, cancellationDetail.trim() || null, message)
      toast({ title: 'Order cancelled' })
      setCancelDialogOpen(false)
      setCancellationReason('')
      setCancellationDetail('')
      setCancellationMessage('')
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to cancel order', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const CANCELLATION_REASONS = [
    { value: 'user_requested', label: 'User requested cancellation' },
    { value: 'user_unresponsive', label: 'User unresponsive for 7+ days' },
    { value: 'duplicate_order', label: 'Duplicate order' },
    { value: 'service_unavailable', label: 'Service not available in region' },
    { value: 'payment_issue', label: 'Payment issue' },
    { value: 'internal_error', label: 'Internal error' },
    { value: 'other', label: 'Other' },
  ]

  // Handle assign professional
  const handleAssignProfessional = async () => {
    if (!selectedProfessionalId) return
    setLoading(true)
    try {
      await assignProfessional(order.id, selectedProfessionalId, order.status)
      toast({ title: 'Professional assigned' })
      setAssignDialogOpen(false)
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to assign professional', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  // Handle dispute resolution
  const handleDisputeResolve = async () => {
    if (!disputeAction) return
    setLoading(true)
    try {
      if (disputeAction === 'refund') {
        await resolveDisputeRefund(order.id)
      } else if (disputeAction === 'continue') {
        await resolveDisputeContinue(order.id)
      } else {
        await resolveDisputeClose(order.id)
      }
      toast({ title: 'Dispute resolved' })
      setDisputeAction(null)
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to resolve dispute', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  // Handle mark order complete
  const handleMarkComplete = async () => {
    setLoading(true)
    try {
      const supabase = getClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast({ title: 'Session expired', variant: 'destructive', description: 'Please log in again.' })
        return
      }

      const res = await fetch(getEdgeFunctionUrl('admin-advance-stage'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ order_id: order.id }),
      })

      if (!res.ok) {
        const err = await res.json()
        toast({ title: 'Error', variant: 'destructive', description: err.error })
        return
      }

      // Insert completion notification
      await insertCompletionNotification(order.id)
      toast({ title: 'Order completed', description: 'The user has been notified.' })
      setCompleteDialogOpen(false)
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to complete order', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  // Handle add note
  const handleAddNote = async () => {
    if (!newNote.trim()) return
    setLoading(true)
    try {
      await createAdminNote(order.id, newNote.trim())
      setNewNote('')
      toast({ title: 'Note saved' })
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to save note', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  // Handle download all documents
  const handleDownloadAll = async () => {
    setDownloadLoading(true)
    try {
      const JSZip = (await import('jszip')).default
      const zip = new JSZip()

      // Collect all documents with file URLs and their bucket info
      const allDocs: Array<{ url: string; name: string; folder: string; bucket: 'order-documents' | 'work-documents' }> = []

      // Initial documents (order-documents bucket)
      initialDocs.forEach(doc => {
        if (doc.file_url && doc.file_name) {
          allDocs.push({ url: doc.file_url, name: doc.file_name, folder: '00-Initial', bucket: 'order-documents' })
        }
      })

      // Work documents from rounds (work-documents bucket)
      rounds.forEach(round => {
        const folder = `R${round.round_number}-${round.title.replace(/[^a-zA-Z0-9]/g, '_')}`
        round.order_work_documents?.forEach(doc => {
          if (doc.file_url && doc.file_name) {
            const prefix = doc.direction === 'to_customer' ? 'to-user' : 'from-user'
            allDocs.push({ url: doc.file_url, name: `${prefix}-${doc.file_name}`, folder, bucket: 'work-documents' })
          }
        })
      })

      if (allDocs.length === 0) {
        toast({ title: 'No documents to download' })
        setDownloadLoading(false)
        return
      }

      // Get signed URLs for admin access (bypasses RLS on private buckets)
      const signedUrlResults = await adminGetSignedUrls(
        allDocs.map(d => ({ url: d.url, bucket: d.bucket }))
      )
      const signedUrlMap = new Map(
        signedUrlResults.map(r => [r.originalUrl, r.signedUrl])
      )

      // Fetch and add all files to zip using signed URLs
      for (const doc of allDocs) {
        try {
          const signedUrl = signedUrlMap.get(doc.url)
          if (!signedUrl) {
            console.error(`No signed URL for ${doc.name}`)
            continue
          }
          const response = await fetch(signedUrl)
          if (!response.ok) {
            console.error(`Failed to fetch ${doc.name}: ${response.status}`)
            continue
          }
          const blob = await response.blob()
          zip.folder(doc.folder)?.file(doc.name, blob)
        } catch (e) {
          console.error(`Failed to fetch ${doc.name}:`, e)
        }
      }

      // Generate and download
      const content = await zip.generateAsync({ type: 'blob' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(content)
      link.download = `${order.order_number}-documents.zip`
      link.click()
      URL.revokeObjectURL(link.href)

      toast({ title: `Downloaded ${allDocs.length} documents` })
    } catch (err) {
      toast({ title: 'Failed to download', variant: 'destructive' })
    } finally {
      setDownloadLoading(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] -mx-4 -mt-6">
      {/* LEFT PANEL - 60% */}
      <div className="w-[60%] overflow-y-auto border-r border-border p-6 space-y-6">
        {/* Back button */}
        <Link href="/admin/queue" className="text-sm text-muted-foreground hover:text-foreground">
          &larr; Back to Queue
        </Link>

        {/* Header Strip */}
        <div className="sticky top-0 bg-background z-10 pb-4 border-b border-border">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-xl font-semibold">{order.service_packages?.name}</h1>
              <p className="text-sm text-muted-foreground">
                {order.users?.business_name} - {order.users?.phone}
              </p>
              <p className="font-mono text-sm">{order.order_number}</p>
            </div>
            <div className="text-right flex flex-col items-end gap-1">
              <Popover>
                <PopoverTrigger asChild>
                  <button className="font-semibold text-lg hover:underline cursor-pointer">
                    {formatPaisa(order.total_paisa_snapshot)}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-64" align="end">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Base price</span>
                      <span>{formatPaisa(order.price_base_paisa_snapshot)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Govt fees</span>
                      <span>{formatPaisa(order.price_govt_fees_paisa_snapshot)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">GST</span>
                      <span>{formatPaisa(order.price_gst_paisa_snapshot)}</span>
                    </div>
                    {(order.pro_discount_paisa_snapshot > 0 || order.promo_discount_paisa_snapshot > 0) && (
                      <>
                        {order.pro_discount_paisa_snapshot > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Pro discount</span>
                            <span>-{formatPaisa(order.pro_discount_paisa_snapshot)}</span>
                          </div>
                        )}
                        {order.promo_discount_paisa_snapshot > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Promo discount</span>
                            <span>-{formatPaisa(order.promo_discount_paisa_snapshot)}</span>
                          </div>
                        )}
                      </>
                    )}
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>{formatPaisa(order.total_paisa_snapshot)}</span>
                    </div>
                    {order.promo_code_used && (
                      <p className="text-xs text-muted-foreground">
                        Promo code: {order.promo_code_used}
                      </p>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
              <div className="text-sm text-muted-foreground">Paid {formatDate(order.paid_at)}</div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs"
                onClick={handleDownloadAll}
                disabled={downloadLoading}
              >
                {downloadLoading ? 'Downloading...' : 'Download all docs'}
              </Button>
            </div>
          </div>

          {/* Status and Professional */}
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <Label className="text-sm">Status:</Label>
              <Select value={order.status} onValueChange={handleStatusChange} disabled={loading}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ORDER_STATUSES.map(s => (
                    <SelectItem key={s} value={s}>{s.replace('_', ' ')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-sm">Professional:</Label>
              {order.professionals ? (
                <>
                  <span className="text-sm">{order.professionals.full_name || order.professionals.display_name}</span>
                  <Button variant="ghost" size="sm" onClick={() => setAssignDialogOpen(true)} className="text-xs h-6">
                    Reassign
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setAssignDialogOpen(true)}>
                  Assign
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-sm">Assigned to:</Label>
              {assignedAdmin ? (
                <span className="text-sm">{assignedAdmin.name}</span>
              ) : (
                <span className="text-sm text-muted-foreground">Unassigned</span>
              )}
            </div>

            {order.expected_completion_date && (
              <div className="flex items-center gap-2">
                <Label className="text-sm">Due:</Label>
                <span className={`text-sm ${new Date(order.expected_completion_date) < new Date() ? 'text-red-500 font-medium' : ''}`}>
                  {formatDate(order.expected_completion_date)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Dispute Banner */}
        {order.status === 'disputed' && (
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <h3 className="font-medium text-red-800 dark:text-red-200 mb-2">Dispute Active</h3>
            <p className="text-sm text-red-700 dark:text-red-300 mb-4">
              This order has an active dispute. Choose how to resolve it:
            </p>
            <div className="flex gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setDisputeAction('refund')}
              >
                Refund
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDisputeAction('continue')}
              >
                Continue Order
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDisputeAction('close')}
              >
                Close
              </Button>
            </div>
          </div>
        )}

        {/* Questionnaire & Initial Documents - Always visible */}
        <Card id="questionnaire-section">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span>Questionnaire & Initial Documents</span>
              <Badge variant="outline">Customer Submission</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Questionnaire Answers */}
            <div>
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                Questionnaire Answers
                <Badge variant="secondary" className="font-normal text-xs">
                  {mergedAnswers.filter(q => q.response_value != null).length}/{mergedAnswers.length} answered
                </Badge>
              </h4>
              {mergedAnswers.length > 0 ? (
                <div className="space-y-2">
                  {mergedAnswers.map(q => (
                    <div key={q.question_key} className="flex justify-between py-2 border-b border-border last:border-0">
                      <span className="text-sm text-muted-foreground">{q.question_label}</span>
                      <span className={`text-sm font-medium ${q.response_value == null ? 'text-amber-600 dark:text-amber-400' : ''}`}>
                        {renderResponseValue(q.response_value, q.question_type, q.options)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No questionnaire configured for this service.
                </p>
              )}
            </div>

            {/* Initial Documents */}
            <div>
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                Initial Documents
                <Badge variant="secondary" className="font-normal text-xs">
                  {initialDocs.filter(d => d.verified_at).length}/{initialDocs.length} verified
                </Badge>
              </h4>
              {initialDocs.length > 0 ? (
                <div className="space-y-3">
                  {initialDocs.map(doc => (
                    <InitialDocumentCard key={doc.id} doc={doc} orderId={order.id} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No initial documents required for this service.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Process Timeline Stepper - Only show rounds after Round 0 */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-muted-foreground">Rounds:</span>
          {rounds.filter(r => r.round_number > 0).map(round => (
            <a
              key={round.id}
              href={`#round-${round.round_number}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border hover:bg-muted transition-colors"
            >
              <span className={`w-2 h-2 rounded-full ${
                round.status === 'completed' ? 'bg-green-500' :
                round.status === 'awaiting_user' ? 'bg-yellow-500' :
                round.status === 'active' ? 'bg-blue-500' :
                'bg-gray-400'
              }`} />
              <span className="text-sm">Round {round.round_number}</span>
            </a>
          ))}
          <Button variant="outline" size="sm" onClick={() => setAddRoundOpen(true)}>
            + Add Round
          </Button>
          <Button variant="outline" size="sm" onClick={() => setQuickUploadOpen(true)}>
            Upload Document
          </Button>
        </div>

        {/* Rounds - Only show rounds after Round 0 */}
        {rounds.filter(r => r.round_number > 0).map(round => (
          <RoundCard
            key={round.id}
            round={round}
            orderId={order.id}
            adminNamesMap={adminNamesMap}
          />
        ))}

        {/* Decision Strip - show when no Round 1 and no professional */}
        {!hasRound1 && !order.professionals && (
          <div className="flex gap-4 p-4 bg-muted rounded-lg border border-dashed mt-4">
            <div className="flex-1 text-center space-y-2">
              <p className="text-xs text-muted-foreground">Initial docs need follow-up?</p>
              <Button variant="outline" size="sm" onClick={() => setAddRoundOpen(true)}>
                Create Round 1
              </Button>
            </div>
            <Separator orientation="vertical" />
            <div className="flex-1 text-center space-y-2">
              <p className="text-xs text-muted-foreground">Ready to begin work?</p>
              <Button variant="outline" size="sm" onClick={() => setAssignDialogOpen(true)}>
                Assign professional
              </Button>
            </div>
          </div>
        )}

        {/* Mark Order Complete */}
        {order.status !== 'completed' && order.status !== 'cancelled' && hasFinalOutput && (
          <div className="border-t border-border pt-6">
            <Button
              onClick={() => setCompleteDialogOpen(true)}
              disabled={order.status !== 'in_progress'}
            >
              Mark order complete
            </Button>
            {order.status !== 'in_progress' && (
              <p className="text-xs text-muted-foreground mt-1">
                Order must be in progress. Current status: {order.status}
              </p>
            )}
          </div>
        )}

        {/* Internal Admin Notes */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <span>Internal Notes</span>
              <Badge variant="outline" className="font-normal">Only visible to admin team</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {adminNotes.map(note => (
              <div key={note.id} className="border-b border-border pb-3 last:border-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{note.admin_users?.name || 'Admin'}</span>
                  <span className="text-xs text-muted-foreground">{formatDateTime(note.created_at)}</span>
                </div>
                <p className="text-sm text-muted-foreground">{note.content}</p>
                {note.admin_id === adminUser.id && (
                  <button
                    onClick={() => deleteAdminNote(note.id, order.id)}
                    className="text-xs text-red-500 hover:underline mt-1"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}

            <div className="space-y-2">
              <Textarea
                placeholder="Add a note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              />
              <Button size="sm" onClick={handleAddNote} disabled={loading || !newNote.trim()}>
                Save Note
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Activity Log */}
        <OrderActivityLog orderId={order.id} />
      </div>

      {/* RIGHT PANEL - 40% Chat */}
      <div className="w-[40%] flex flex-col h-full">
        {order.chat_conversation_id ? (
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
              <span className="font-medium text-sm">Order Chat</span>
              <Badge variant="destructive" className="text-xs">User can see this</Badge>
            </div>
            <AdminChatWindow
              conversationId={order.chat_conversation_id}
              adminUser={{
                id: adminUser.id,
                auth_user_id: adminUser.auth_user_id,
                name: adminUser.name,
              }}
            />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Chat unavailable. Payment webhook may not have completed for this order.
            </p>
          </div>
        )}
      </div>

      {/* Assign Professional Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Professional</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Select value={selectedProfessionalId} onValueChange={setSelectedProfessionalId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a professional" />
              </SelectTrigger>
              <SelectContent>
                {professionals.map(p => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.full_name} - {p.professional_type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAssignProfessional} disabled={loading || !selectedProfessionalId}>
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dispute Resolution Dialog */}
      <Dialog open={!!disputeAction} onOpenChange={() => setDisputeAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm {disputeAction}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            {disputeAction === 'refund' && 'This will cancel the order and mark it for refund.'}
            {disputeAction === 'continue' && 'This will resolve the dispute and continue the order.'}
            {disputeAction === 'close' && 'This will cancel the order without refund.'}
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDisputeAction(null)}>Cancel</Button>
            <Button onClick={handleDisputeResolve} disabled={loading}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mark Complete Dialog */}
      <Dialog open={completeDialogOpen} onOpenChange={setCompleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark Order Complete</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will mark the order as completed and notify the user. A payout will be created for the professional.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCompleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleMarkComplete} disabled={loading}>
              Complete Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Round Dialog */}
      <AddRoundDialog
        open={addRoundOpen}
        onOpenChange={setAddRoundOpen}
        orderId={order.id}
        initialDocs={initialDocs}
        rounds={rounds}
      />

      {/* Quick Upload Dialog */}
      <QuickUploadDialog
        open={quickUploadOpen}
        onOpenChange={setQuickUploadOpen}
        orderId={order.id}
        rounds={rounds}
      />

      {/* Cancel Order Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm">Cancellation Reason *</Label>
              <Select value={cancellationReason} onValueChange={setCancellationReason}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  {CANCELLATION_REASONS.map(r => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {cancellationReason === 'other' && (
              <div>
                <Label className="text-sm">Details</Label>
                <Input
                  className="mt-1"
                  value={cancellationDetail}
                  onChange={(e) => setCancellationDetail(e.target.value)}
                  placeholder="Provide details..."
                />
              </div>
            )}
            <div>
              <Label className="text-sm">Message to user (optional)</Label>
              <Textarea
                className="mt-1"
                value={cancellationMessage}
                onChange={(e) => setCancellationMessage(e.target.value)}
                placeholder="Custom message for the user banner..."
                rows={2}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Leave blank for default message.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={handleCancelOrder}
              disabled={loading || !cancellationReason}
            >
              Cancel Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Round Card Component (for rounds 1+)
function RoundCard({
  round,
  orderId,
  adminNamesMap,
}: {
  round: OrderRound
  orderId: string
  adminNamesMap: Record<string, string>
}) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [editingTitle, setEditingTitle] = useState(false)
  const [titleValue, setTitleValue] = useState(round.title)

  const questions = round.round_question_requests || []
  const fromCustomerDocs = round.order_work_documents?.filter(d => d.direction === 'from_customer') || []
  const toCustomerDocs = round.order_work_documents?.filter(d => d.direction === 'to_customer') || []

  // Find linked document pairs (to_customer doc with linked_request_id -> from_customer doc)
  // Backend convention: to_customer.linked_request_id points to from_customer.id
  const linkedPairs = useMemo(() => {
    const pairs: Array<{
      downloadDoc: OrderWorkDocument
      uploadDoc: OrderWorkDocument
    }> = []
    const usedIds = new Set<string>()

    toCustomerDocs.forEach(downloadDoc => {
      if (downloadDoc.linked_request_id) {
        const uploadDoc = fromCustomerDocs.find(d => d.id === downloadDoc.linked_request_id)
        if (uploadDoc) {
          pairs.push({ downloadDoc, uploadDoc })
          usedIds.add(downloadDoc.id)
          usedIds.add(uploadDoc.id)
        }
      }
    })

    return { pairs, usedIds }
  }, [fromCustomerDocs, toCustomerDocs])

  // Standalone documents (not part of a linked pair)
  const standaloneFromCustomer = fromCustomerDocs.filter(d => !linkedPairs.usedIds.has(d.id))
  const standaloneToCustomer = toCustomerDocs.filter(d => !linkedPairs.usedIds.has(d.id))

  // Check if round can be completed
  const allQuestionsAnswered = questions.every(q => q.answered_at)
  const allDocsProcessed = fromCustomerDocs.every(d =>
    d.status === 'verified' || d.skipped_at
  )
  const canComplete = allQuestionsAnswered && allDocsProcessed && round.status !== 'completed' && round.round_number > 0

  const handleTitleSave = async () => {
    if (titleValue.trim() === round.title) {
      setEditingTitle(false)
      return
    }
    setLoading(true)
    try {
      await updateRoundTitle(round.id, orderId, titleValue.trim())
      setEditingTitle(false)
      toast({ title: 'Title updated' })
    } catch (err) {
      toast({ title: 'Error', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const handleMarkComplete = async () => {
    setLoading(true)
    try {
      await markRoundComplete(round.id, orderId)
      toast({ title: 'Round completed' })
    } catch (err) {
      toast({ title: 'Error', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card id={`round-${round.round_number}`} className="scroll-mt-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {editingTitle ? (
              <Input
                value={titleValue}
                onChange={(e) => setTitleValue(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()}
                className="w-48"
                autoFocus
              />
            ) : (
              <CardTitle
                className="cursor-pointer hover:text-muted-foreground"
                onClick={() => setEditingTitle(true)}
              >
                Round {round.round_number}: {round.title}
              </CardTitle>
            )}
            <Badge variant={
              round.status === 'completed' ? 'default' :
              round.status === 'awaiting_user' ? 'secondary' :
              'outline'
            }>
              {round.status.replace('_', ' ')}
            </Badge>
          </div>
          {canComplete && (
            <Button size="sm" onClick={handleMarkComplete} disabled={loading}>
              Mark Round Complete
            </Button>
          )}
        </div>
        {round.created_by_admin_id && (
          <p className="text-xs text-muted-foreground">
            Created by {adminNamesMap[round.created_by_admin_id] || 'Admin'} on {formatDate(round.created_at)}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Questions */}
        {questions.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-3">Questions</h4>
            <div className="space-y-3">
              {questions.map(q => (
                <div key={q.id} className="p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-1">{q.question_text}</p>
                  {q.answered_at ? (
                    <div>
                      <p className="text-sm text-muted-foreground">{q.answer_text}</p>
                      <p className="text-xs text-muted-foreground mt-1">{formatDateTime(q.answered_at)}</p>
                    </div>
                  ) : (
                    <Badge variant="secondary">Awaiting answer</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Linked Document Pairs (For Signing: Download + Upload in one card) */}
        {linkedPairs.pairs.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-3">Linked Documents (For Signing)</h4>
            <div className="space-y-3">
              {linkedPairs.pairs.map(({ downloadDoc, uploadDoc }) => (
                <AdminLinkedDocumentCard
                  key={downloadDoc.id}
                  downloadDoc={downloadDoc}
                  uploadDoc={uploadDoc}
                  orderId={orderId}
                />
              ))}
            </div>
          </div>
        )}

        {/* Standalone From Customer Docs */}
        {standaloneFromCustomer.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-3">Documents from Customer</h4>
            <div className="space-y-3">
              {standaloneFromCustomer.map(doc => (
                <WorkDocumentCard key={doc.id} doc={doc} orderId={orderId} direction="from_customer" />
              ))}
            </div>
          </div>
        )}

        {/* Standalone To Customer Docs */}
        {standaloneToCustomer.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-3">Documents to Customer</h4>
            <div className="space-y-3">
              {standaloneToCustomer.map(doc => (
                <WorkDocumentCard key={doc.id} doc={doc} orderId={orderId} direction="to_customer" />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Initial Document Card
function InitialDocumentCard({ doc, orderId }: { doc: OrderDocument & { internal_note?: string; internal_note_at?: string }; orderId: string }) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false)
  const [selectedReason, setSelectedReason] = useState<string>('')
  const [internalNote, setInternalNote] = useState('')

  const handleVerify = async () => {
    setLoading(true)
    try {
      await verifyInitialDocument(doc.id, orderId, internalNote.trim() || undefined)
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
      await rejectInitialDocument(doc.id, orderId, selectedReason, internalNote.trim() || undefined)
      toast({ title: 'Document rejected' })
      setRejectDialogOpen(false)
      setInternalNote('')
    } catch (err) {
      toast({ title: 'Error', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const status = doc.verified_at ? 'verified' : doc.rejection_reason ? 'rejected' : doc.file_url ? 'uploaded' : 'pending'

  return (
    <div className="p-3 border border-border rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">{doc.document_label}</p>
          <Badge variant={
            status === 'verified' ? 'default' :
            status === 'rejected' ? 'destructive' :
            status === 'uploaded' ? 'secondary' :
            'outline'
          } className="mt-1">
            {status}
          </Badge>
          {status === 'rejected' && doc.rejection_reason && (
            <p className="text-xs text-red-500 mt-1">{getRejectionLabel(doc.rejection_reason)}</p>
          )}
        </div>
        <div className="flex gap-2">
          {doc.file_url && (
            <Button variant="ghost" size="sm" asChild>
              <a href={doc.file_url} target="_blank" rel="noopener noreferrer">View</a>
            </Button>
          )}
          {status === 'uploaded' && (
            <>
              <Button size="sm" onClick={() => setVerifyDialogOpen(true)} disabled={loading}>Verify</Button>
              <Button variant="outline" size="sm" onClick={() => setRejectDialogOpen(true)} disabled={loading}>
                Reject
              </Button>
            </>
          )}
          {status === 'verified' && (
            <button
              onClick={() => undoVerification(doc.id, orderId, 'initial')}
              className="text-xs text-muted-foreground hover:underline"
            >
              Undo
            </button>
          )}
          {status === 'rejected' && (
            <button
              onClick={() => undoRejection(doc.id, orderId, 'initial')}
              className="text-xs text-muted-foreground hover:underline"
            >
              Undo
            </button>
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
    </div>
  )
}

// Work Document Card
function WorkDocumentCard({ doc, orderId, direction }: { doc: OrderWorkDocument & { internal_note?: string; internal_note_at?: string }; orderId: string; direction: 'from_customer' | 'to_customer' }) {
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
      await verifyWorkDocument(doc.id, orderId, internalNote.trim() || undefined)
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
      await rejectWorkDocument(doc.id, orderId, selectedReason, internalNote.trim() || undefined)
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
      await skipWorkDocument(doc.id, orderId, skipReason.trim())
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
              <Button variant="ghost" size="sm" asChild>
                <a href={doc.file_url} target="_blank" rel="noopener noreferrer">View</a>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href={doc.file_url} download>Download</a>
              </Button>
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

// Admin Linked Document Card (Download + Upload in one card - for signing workflow)
function AdminLinkedDocumentCard({
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
      await verifyWorkDocument(uploadDoc.id, orderId, internalNote.trim() || undefined)
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
      await rejectWorkDocument(uploadDoc.id, orderId, selectedReason, internalNote.trim() || undefined)
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
      await skipWorkDocument(uploadDoc.id, orderId, skipReason.trim())
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
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <a href={downloadDoc.file_url} target="_blank" rel="noopener noreferrer">View</a>
                </Button>
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <a href={downloadDoc.file_url} download>Download</a>
                </Button>
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
                    <Button variant="outline" size="sm" asChild>
                      <a href={uploadDoc.file_url} target="_blank" rel="noopener noreferrer">View</a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href={uploadDoc.file_url} download>Download</a>
                    </Button>
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

// Add Round Dialog
function AddRoundDialog({
  open,
  onOpenChange,
  orderId,
  initialDocs,
  rounds,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  orderId: string
  initialDocs: OrderDocument[]
  rounds: OrderRound[]
}) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const [title, setTitle] = useState('')
  const [includeQuestions, setIncludeQuestions] = useState(false)
  const [includeDocs, setIncludeDocs] = useState(false)
  const [includeUpload, setIncludeUpload] = useState(false)
  const [questions, setQuestions] = useState<string[]>([''])
  const [docRequests, setDocRequests] = useState<Array<{ label: string; description: string; checked: boolean; isReupload?: boolean; reuploadId?: string }>>([])
  const [notificationMessage, setNotificationMessage] = useState('')
  const [isVisibleToUser, setIsVisibleToUser] = useState(true)

  // Admin upload state
  const [uploadTag, setUploadTag] = useState<string>('')
  const [uploadLabel, setUploadLabel] = useState('')
  const [uploadDescription, setUploadDescription] = useState('')
  const [uploadSignLabel, setUploadSignLabel] = useState('')
  const [stagedFile, setStagedFile] = useState<{ fileUrl: string; fileName: string } | null>(null)

  // Get rejected docs for pre-fill
  const rejectedInitialDocs = initialDocs.filter(d => d.rejection_reason)
  const rejectedWorkDocs = rounds.flatMap(r =>
    (r.order_work_documents || []).filter(d => d.direction === 'from_customer' && d.status === 'rejected')
  )

  const handleAddQuestion = () => {
    setQuestions([...questions, ''])
  }

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions]
    newQuestions[index] = value
    setQuestions(newQuestions)
  }

  const handleAddDocRequest = () => {
    setDocRequests([...docRequests, { label: '', description: '', checked: true }])
  }

  const handleDocRequestChange = (index: number, field: 'label' | 'description', value: string) => {
    const newDocRequests = [...docRequests]
    newDocRequests[index][field] = value
    setDocRequests(newDocRequests)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    try {
      // Use server action to upload via service role (bypasses RLS)
      const formData = new FormData()
      formData.append('file', file)
      formData.append('orderId', orderId)

      const { publicUrl, fileName } = await adminUploadFile(formData)
      setStagedFile({ fileUrl: publicUrl, fileName })
      if (!uploadLabel) setUploadLabel(fileName)
    } catch (err) {
      toast({ title: 'Upload failed', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast({ title: 'Title required', variant: 'destructive' })
      return
    }

    setLoading(true)
    try {
      const formData = {
        title: title.trim(),
        questions: includeQuestions ? questions.filter(q => q.trim()) : [],
        docRequests: includeDocs ? docRequests.filter(d => d.checked && d.label.trim()).map(d => ({
          label: d.label.trim(),
          description: d.description.trim() || undefined,
          isReuploadOfWorkDocId: d.reuploadId,
        })) : [],
        adminUpload: includeUpload && stagedFile ? {
          tag: uploadTag,
          label: uploadLabel.trim(),
          description: uploadDescription.trim() || undefined,
          fileUrl: stagedFile.fileUrl,
          fileName: stagedFile.fileName,
          signLabel: uploadTag === 'for_signing' ? uploadSignLabel.trim() : undefined,
        } : undefined,
        notificationMessage: notificationMessage.trim() || undefined,
        isVisibleToUser,
      }

      await createRound(orderId, formData)
      toast({ title: 'Round created' })
      onOpenChange(false)

      // Reset form
      setTitle('')
      setIncludeQuestions(false)
      setIncludeDocs(false)
      setIncludeUpload(false)
      setQuestions([''])
      setDocRequests([])
      setNotificationMessage('')
      setStagedFile(null)
      setUploadTag('')
      setUploadLabel('')
      setUploadDescription('')
      setUploadSignLabel('')
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to create round', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  // Update notification message based on selections
  const getDefaultMessage = () => {
    if (includeQuestions && !includeDocs && !includeUpload) {
      return 'We have some additional questions for you. Please see the latest step in your order.'
    }
    if (includeDocs && !includeQuestions && !includeUpload) {
      return 'We need some additional documents. Please see the latest step in your order.'
    }
    if (uploadTag === 'for_signing') {
      return 'We have shared a document for your signature. Please see the latest step in your order.'
    }
    if (uploadTag === 'government_processing') {
      return 'Your application has been submitted to the government. We will update you when we hear back.'
    }
    if (uploadTag === 'final_output') {
      return 'Your final document is ready. Please download it from your order page.'
    }
    return 'Action required on your order. Please see the latest step in your order.'
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Round</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label>Round Title *</Label>
            <Input
              placeholder="e.g., Additional Information Required"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Checkboxes */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Switch checked={includeQuestions} onCheckedChange={setIncludeQuestions} />
              <Label>Include Questions</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={includeDocs} onCheckedChange={setIncludeDocs} />
              <Label>Include Document Requests</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={includeUpload} onCheckedChange={setIncludeUpload} />
              <Label>Include Admin Upload</Label>
            </div>
          </div>

          {/* Questions */}
          {includeQuestions && (
            <div className="space-y-3">
              <Label>Questions</Label>
              {questions.map((q, i) => (
                <Input
                  key={i}
                  placeholder="Enter question..."
                  value={q}
                  onChange={(e) => handleQuestionChange(i, e.target.value)}
                />
              ))}
              <Button type="button" variant="ghost" size="sm" onClick={handleAddQuestion}>
                + Add another question
              </Button>
            </div>
          )}

          {/* Document Requests */}
          {includeDocs && (
            <div className="space-y-3">
              <Label>Document Requests</Label>

              {/* Pre-fill rejected docs */}
              {rejectedInitialDocs.length > 0 && (
                <div className="text-xs text-muted-foreground mb-2">
                  Rejected initial documents (auto-added):
                </div>
              )}

              {docRequests.map((doc, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    placeholder="Document label"
                    value={doc.label}
                    onChange={(e) => handleDocRequestChange(i, 'label', e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Description (optional)"
                    value={doc.description}
                    onChange={(e) => handleDocRequestChange(i, 'description', e.target.value)}
                    className="flex-1"
                  />
                </div>
              ))}
              <Button type="button" variant="ghost" size="sm" onClick={handleAddDocRequest}>
                + Add document request
              </Button>
            </div>
          )}

          {/* Admin Upload */}
          {includeUpload && (
            <div className="space-y-3">
              <Label>Admin Upload</Label>
              <input type="file" onChange={handleFileUpload} className="text-sm" />
              {stagedFile && (
                <p className="text-xs text-green-600">Uploaded: {stagedFile.fileName}</p>
              )}
              <Select value={uploadTag} onValueChange={setUploadTag}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="for_signing">For Signing</SelectItem>
                  <SelectItem value="government_processing">Government Processing</SelectItem>
                  <SelectItem value="final_output">Final Output</SelectItem>
                  <SelectItem value="informational">Informational</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Document label"
                value={uploadLabel}
                onChange={(e) => setUploadLabel(e.target.value)}
              />
              <Input
                placeholder="Description (optional)"
                value={uploadDescription}
                onChange={(e) => setUploadDescription(e.target.value)}
              />
              {uploadTag === 'for_signing' && (
                <Input
                  placeholder="Label for signed upload request"
                  value={uploadSignLabel}
                  onChange={(e) => setUploadSignLabel(e.target.value)}
                />
              )}
            </div>
          )}

          {/* Notification */}
          <div className="space-y-2">
            <Label>Notification Message</Label>
            <Textarea
              placeholder={getDefaultMessage()}
              value={notificationMessage}
              onChange={(e) => setNotificationMessage(e.target.value)}
            />
          </div>

          {/* Visibility */}
          <div className="flex items-center gap-2">
            <Switch checked={isVisibleToUser} onCheckedChange={setIsVisibleToUser} />
            <Label>Visible to user</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading || !title.trim()}>
            Create Round
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Quick Upload Dialog - simpler way to upload a document without creating a full round
function QuickUploadDialog({
  open,
  onOpenChange,
  orderId,
  rounds,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  orderId: string
  rounds: OrderRound[]
}) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [uploadTag, setUploadTag] = useState<string>('')
  const [uploadLabel, setUploadLabel] = useState('')
  const [uploadDescription, setUploadDescription] = useState('')
  const [signedUploadLabel, setSignedUploadLabel] = useState('') // For "for_signing" - label for customer's signed upload
  const [stagedFile, setStagedFile] = useState<{ fileUrl: string; fileName: string } | null>(null)
  const [selectedRoundId, setSelectedRoundId] = useState<string>('')
  const [notifyUser, setNotifyUser] = useState(true)

  // Get existing rounds (excluding Round 0)
  const existingRounds = rounds.filter(r => r.round_number > 0)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('orderId', orderId)

      const { publicUrl, fileName } = await adminUploadFile(formData)
      setStagedFile({ fileUrl: publicUrl, fileName })
      if (!uploadLabel) setUploadLabel(fileName)
    } catch (err) {
      toast({ title: 'Upload failed', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!stagedFile || !uploadTag || !uploadLabel.trim()) {
      toast({ title: 'Please fill in all required fields', variant: 'destructive' })
      return
    }

    // For signing documents, require the signed upload label
    if (uploadTag === 'for_signing' && !signedUploadLabel.trim()) {
      toast({ title: 'Please provide a label for the signed document upload', variant: 'destructive' })
      return
    }

    setLoading(true)
    try {
      // If no round selected, create a new round for this upload
      if (!selectedRoundId) {
        const formData = {
          title: uploadTag === 'for_signing'
            ? `Sign: ${uploadLabel.trim()}`
            : `Document: ${uploadLabel.trim()}`,
          questions: [],
          docRequests: [],
          adminUpload: {
            tag: uploadTag,
            label: uploadLabel.trim(),
            description: uploadDescription.trim() || undefined,
            fileUrl: stagedFile.fileUrl,
            fileName: stagedFile.fileName,
            signLabel: uploadTag === 'for_signing' ? signedUploadLabel.trim() : undefined,
          },
          notificationMessage: notifyUser ? getNotificationMessage(uploadTag) : undefined,
          isVisibleToUser: true,
        }
        await createRound(orderId, formData)
      } else {
        // Upload to existing round
        await uploadAdminDocument(
          orderId,
          selectedRoundId,
          stagedFile.fileUrl,
          stagedFile.fileName,
          uploadTag,
          uploadLabel.trim(),
          uploadDescription.trim() || null,
          uploadTag === 'for_signing' ? signedUploadLabel.trim() : undefined
        )
      }

      toast({ title: 'Document uploaded successfully' })
      onOpenChange(false)
      resetForm()
    } catch (err) {
      toast({ title: 'Error uploading document', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setUploadTag('')
    setUploadLabel('')
    setUploadDescription('')
    setSignedUploadLabel('')
    setStagedFile(null)
    setSelectedRoundId('')
    setNotifyUser(true)
  }

  const getNotificationMessage = (tag: string) => {
    switch (tag) {
      case 'for_signing':
        return 'We have shared a document for your signature. Please check your order.'
      case 'government_processing':
        return 'Your application has been submitted to the government. We will update you on progress.'
      case 'final_output':
        return 'Your final document is ready! Please download it from your order page.'
      default:
        return 'A new document has been added to your order.'
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) resetForm() }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Upload */}
          <div className="space-y-2">
            <Label>Select File *</Label>
            <input type="file" onChange={handleFileUpload} className="text-sm w-full" />
            {stagedFile && (
              <p className="text-xs text-green-600">Uploaded: {stagedFile.fileName}</p>
            )}
          </div>

          {/* Tag */}
          <div className="space-y-2">
            <Label>Document Type *</Label>
            <Select value={uploadTag} onValueChange={setUploadTag}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="for_signing">For Signing (customer needs to sign)</SelectItem>
                <SelectItem value="government_processing">Government Processing (submitted to govt)</SelectItem>
                <SelectItem value="final_output">Final Output (deliverable)</SelectItem>
                <SelectItem value="informational">Informational (for reference)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Label */}
          <div className="space-y-2">
            <Label>Document Label *</Label>
            <Input
              placeholder="e.g., Certificate of Incorporation"
              value={uploadLabel}
              onChange={(e) => setUploadLabel(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description (optional)</Label>
            <Input
              placeholder="Additional details about this document"
              value={uploadDescription}
              onChange={(e) => setUploadDescription(e.target.value)}
            />
          </div>

          {/* For Signing: Customer upload label */}
          {uploadTag === 'for_signing' && (
            <div className="space-y-2 p-3 bg-muted rounded-lg">
              <Label>Signed Document Upload Label *</Label>
              <Input
                placeholder="e.g., Signed MOA, Stamped Agreement"
                value={signedUploadLabel}
                onChange={(e) => setSignedUploadLabel(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                This creates a document request for the customer to upload the signed version back.
              </p>
            </div>
          )}

          {/* Add to existing round or create new */}
          {existingRounds.length > 0 && (
            <div className="space-y-2">
              <Label>Add to Round (optional)</Label>
              <Select value={selectedRoundId} onValueChange={setSelectedRoundId}>
                <SelectTrigger>
                  <SelectValue placeholder="Create new round" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Create new round</SelectItem>
                  {existingRounds.map(round => (
                    <SelectItem key={round.id} value={round.id}>
                      Round {round.round_number}: {round.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Notify user */}
          {!selectedRoundId && (
            <div className="flex items-center gap-2">
              <Switch checked={notifyUser} onCheckedChange={setNotifyUser} />
              <Label>Notify user about this document</Label>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !stagedFile || !uploadTag || !uploadLabel.trim() || (uploadTag === 'for_signing' && !signedUploadLabel.trim())}
          >
            {loading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
