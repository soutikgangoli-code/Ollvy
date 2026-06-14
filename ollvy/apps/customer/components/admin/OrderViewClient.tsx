'use client'

import { useState, useMemo, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { formatPaisa, formatDate, formatDateTime } from '@/lib/utils'
import { deriveAnswerLabel } from '@/lib/questionnaire/answer-label'
import { shouldShowQuestion } from '@/lib/questionnaire/types'
import { useToast } from '@/lib/hooks/use-toast'
import { getClient, getEdgeFunctionUrl } from '@/lib/supabase'
import {
  updateOrderStatus,
  assignProfessional,
  createAdminNote,
  deleteAdminNote,
  resolveDisputeRefund,
  resolveDisputeContinue,
  resolveDisputeClose,
  insertCompletionNotification,
  cancelOrderWithReason,
  adminGetSignedUrls,
  approveSetup,
  unlockSetup,
} from '@/app/(admin)/admin/orders/[orderId]/actions'
import type { AdminUser } from '@/lib/admin/get-admin-user'
import type { OrderRound, OrderDocument, OrderAdminNote, OrderActivityLog as ActivityLogEntry } from '@/lib/types'
import { AdminChatWindow } from '@/components/chat/AdminChatWindow'
import { OrderActivityLog } from '@/components/admin/OrderActivityLog'
import { InitialDocumentCard } from './order-view/InitialDocumentCard'

// Code-split heavy dialogs/cards. Each chunk only loads when needed.
// - AddRound/QuickUpload: ssr:false because they're inert until clicked.
// - RoundCard: skeleton while the chunk loads (transitively pulls in
//   WorkDocumentCard + AdminLinkedDocumentCard).
const AddRoundDialog = dynamic(
  () => import('./order-view/AddRoundDialog').then(m => ({ default: m.AddRoundDialog })),
  { ssr: false }
)
const QuickUploadDialog = dynamic(
  () => import('./order-view/QuickUploadDialog').then(m => ({ default: m.QuickUploadDialog })),
  { ssr: false }
)
const RoundCard = dynamic(
  () => import('./order-view/RoundCard').then(m => ({ default: m.RoundCard })),
  { loading: () => <div className="h-32 bg-muted/40 rounded animate-pulse" /> }
)

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
    validation?: { required?: boolean } | null
    depends_on?: { question_key: string; value?: string; values?: string[]; contains?: string } | null
    is_pre_payment?: boolean
    is_active?: boolean
  }>
  adminNotes: Array<OrderAdminNote & { admin_users?: { name: string } }>
  professionals: Array<{ id: string; full_name: string; display_name?: string; email: string; professional_type: string }>
  adminNamesMap: Record<string, string>
  assignedAdmin: { id: string; name: string; email: string } | null
  initialActivityLog?: ActivityLogEntry[]
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
  initialActivityLog,
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
  const [overrideLockOpen, setOverrideLockOpen] = useState(false)
  const [cancellationReason, setCancellationReason] = useState('')
  const [cancellationDetail, setCancellationDetail] = useState('')
  const [cancellationMessage, setCancellationMessage] = useState('')

  // Note state
  const [newNote, setNewNote] = useState('')
  const [quickUploadOpen, setQuickUploadOpen] = useState(false)

  // Chat conversation state (with polling fallback)
  const [chatConversationId, setChatConversationId] = useState<string | null>(
    order.chat_conversation_id
  )

  // Realtime state for documents and questionnaire
  const [documents, setDocuments] = useState<OrderDocument[]>(initialDocs)
  const [answers, setAnswers] = useState<Array<{ question_key: string; response_value: any }>>(questionnaireAnswers)

  // Fallback polling for chat_conversation_id
  // Ensures chat appears even if realtime has issues or page loaded before webhook completed
  useEffect(() => {
    // Only poll if chat_conversation_id is missing
    if (chatConversationId || !order.id) return

    // Don't poll for waitlisted orders (they don't have chat yet)
    if (order.status === 'waitlisted') return

    const supabase = getClient()

    const pollForChat = async () => {
      const { data } = await supabase
        .from('orders')
        .select('chat_conversation_id')
        .eq('id', order.id)
        .single()

      if (data?.chat_conversation_id) {
        setChatConversationId(data.chat_conversation_id)
      }
    }

    // Poll every 3 seconds until chat_conversation_id is set
    const interval = setInterval(pollForChat, 3000)

    // Also poll immediately on mount
    pollForChat()

    return () => clearInterval(interval)
  }, [order.id, order.status, chatConversationId])

  // Realtime subscriptions for documents and questionnaire responses
  useEffect(() => {
    const supabase = getClient()
    const orderId = order.id

    // Subscribe to order_documents changes
    const docsChannel = supabase
      .channel(`admin-order-docs-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'order_documents',
          filter: `order_id=eq.${orderId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            setDocuments(prev => {
              const newDoc = payload.new as OrderDocument
              const filtered = prev.filter(d => d.id !== newDoc.id)
              return [...filtered, newDoc].sort((a, b) =>
                new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
              )
            })
          } else if (payload.eventType === 'DELETE') {
            setDocuments(prev => prev.filter(d => d.id !== (payload.old as OrderDocument).id))
          }
        }
      )
      .subscribe()

    // Subscribe to order_questionnaire_responses changes
    const answersChannel = supabase
      .channel(`admin-order-answers-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'order_questionnaire_responses',
          filter: `order_id=eq.${orderId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const newAnswer = payload.new as { question_key: string; response_value: any }
            setAnswers(prev => {
              const filtered = prev.filter(a => a.question_key !== newAnswer.question_key)
              return [...filtered, newAnswer]
            })
          } else if (payload.eventType === 'DELETE') {
            const oldAnswer = payload.old as { question_key: string }
            setAnswers(prev => prev.filter(a => a.question_key !== oldAnswer.question_key))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(docsChannel)
      supabase.removeChannel(answersChannel)
    }
  }, [order.id])

  // Check if final output exists
  const hasFinalOutput = rounds.some(r =>
    r.order_work_documents?.some(d => d.tag === 'final_output')
  )

  // Check if Round 1 exists
  const hasRound1 = rounds.some(r => r.round_number === 1)

  // Merged questionnaire data — DB-defined questions plus any "orphan" answers
  // (saved responses with no DB question, e.g. injected per-class trademark fields)
  // so the admin always sees everything the customer submitted.
  const mergedAnswers = useMemo(() => {
    const knownKeys = new Set(questionnaireQuestions.map(q => q.question_key))
    const known = questionnaireQuestions.map(q => ({
      ...q,
      response_value: answers.find(a => a.question_key === q.question_key)?.response_value ?? null,
    }))
    const orphans = answers
      .filter(a => !knownKeys.has(a.question_key) && a.response_value != null && a.response_value !== '')
      .map((a, i) => ({
        question_key: a.question_key,
        question_label: deriveAnswerLabel(a.question_key),
        question_type: 'text',
        options: undefined as Array<{ value: string; label: string }> | undefined,
        display_order: 1000 + i,
        response_value: a.response_value,
      }))
    return [...known, ...orphans]
  }, [questionnaireQuestions, answers])

  // Setup-completeness gate for the "Approve & lock" action. The admin can only
  // lock cleanly once every REQUIRED + APPLICABLE post-payment question is
  // answered and every REQUIRED doc is verified — otherwise they must Override.
  // (Conditional questions are only counted when their depends_on is satisfied.)
  const answersByKey = useMemo(
    () => Object.fromEntries(answers.map(a => [a.question_key, a.response_value])),
    [answers],
  )
  const isAnswered = (v: unknown) =>
    v != null && v !== '' && !(Array.isArray(v) && v.length === 0)
  const missingAnswers = useMemo(
    () =>
      questionnaireQuestions.filter(
        q =>
          q.is_pre_payment === false &&
          q.is_active !== false &&
          q.validation?.required === true &&
          shouldShowQuestion({ depends_on: q.depends_on ?? undefined }, answersByKey) &&
          !isAnswered(answersByKey[q.question_key]),
      ),
    [questionnaireQuestions, answersByKey],
  )
  const missingDocs = useMemo(
    () => documents.filter(d => d.is_required && !d.verified_at),
    [documents],
  )
  const setupComplete = missingAnswers.length === 0 && missingDocs.length === 0

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

  // Approve the customer setup (locks answers + documents), or reopen it.
  const handleSetupApproval = async () => {
    setLoading(true)
    try {
      if (order.setup_locked_at) {
        await unlockSetup(order.id)
        toast({ title: 'Setup reopened for editing' })
      } else {
        await approveSetup(order.id)
        toast({ title: 'Setup approved — answers and documents locked' })
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to update setup lock', variant: 'destructive' })
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
      documents.forEach(doc => {
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

      // Issue #9: Track failed downloads
      const failedDownloads: string[] = []
      let successCount = 0

      // Fetch all files in PARALLEL for better performance
      const fetchResults = await Promise.all(
        allDocs.map(async (doc) => {
          try {
            const signedUrl = signedUrlMap.get(doc.url)
            if (!signedUrl) {
              console.error(`No signed URL for ${doc.name}`)
              return { success: false, doc, error: 'No signed URL' }
            }
            const response = await fetch(signedUrl)
            if (!response.ok) {
              console.error(`Failed to fetch ${doc.name}: ${response.status}`)
              return { success: false, doc, error: `HTTP ${response.status}` }
            }
            const blob = await response.blob()
            return { success: true, doc, blob }
          } catch (e) {
            console.error(`Failed to fetch ${doc.name}:`, e)
            return { success: false, doc, error: String(e) }
          }
        })
      )

      // Process results and add to zip
      for (const result of fetchResults) {
        if (result.success && result.blob) {
          zip.folder(result.doc.folder)?.file(result.doc.name, result.blob)
          successCount++
        } else {
          failedDownloads.push(result.doc.name)
        }
      }

      // Generate and download (even if some files failed)
      if (successCount > 0) {
        const content = await zip.generateAsync({ type: 'blob' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(content)
        link.download = `${order.order_number}-documents.zip`
        link.click()
        URL.revokeObjectURL(link.href)
      }

      // Issue #9: Show appropriate feedback based on results
      if (failedDownloads.length === 0) {
        toast({ title: `Downloaded ${successCount} documents` })
      } else if (successCount === 0) {
        toast({
          title: 'Download failed',
          description: `Failed to download all ${failedDownloads.length} documents. Please try again.`,
          variant: 'destructive',
        })
      } else {
        toast({
          title: `Downloaded ${successCount} of ${allDocs.length} documents`,
          description: `${failedDownloads.length} file(s) failed: ${failedDownloads.slice(0, 3).join(', ')}${failedDownloads.length > 3 ? '...' : ''}`,
          variant: 'destructive',
        })
      }
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
                {order.users?.business_name} - {order.users?.email || order.users?.phone || 'No contact'}
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

            <div className="flex items-center gap-2 flex-wrap">
              <Label className="text-sm">Setup:</Label>
              {order.setup_locked_at ? (
                <>
                  <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400">
                    Approved &amp; locked
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={handleSetupApproval} disabled={loading} className="text-xs h-6">
                    Reopen
                  </Button>
                </>
              ) : setupComplete ? (
                <Button variant="outline" size="sm" onClick={handleSetupApproval} disabled={loading}>
                  Approve &amp; lock
                </Button>
              ) : (
                <>
                  <span className="text-xs text-amber-600 dark:text-amber-400">
                    {[
                      missingAnswers.length > 0 && `${missingAnswers.length} answer${missingAnswers.length === 1 ? '' : 's'}`,
                      missingDocs.length > 0 && `${missingDocs.length} doc${missingDocs.length === 1 ? '' : 's'}`,
                    ].filter(Boolean).join(' + ')} pending
                  </span>
                  <Button variant="outline" size="sm" onClick={() => setOverrideLockOpen(true)} disabled={loading} className="text-xs h-6 border-amber-500/40 text-amber-600 dark:text-amber-400">
                    Override &amp; lock
                  </Button>
                </>
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

        {/* Questionnaire & Initial Documents - Collapsible sections */}
        <Card id="questionnaire-section">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span>Questionnaire & Initial Documents</span>
              <Badge variant="outline">Customer Submission</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Accordion type="multiple" className="space-y-2">
              {/* Questionnaire Answers - Collapsed by default */}
              <AccordionItem value="questionnaire" className="border rounded-lg px-4">
                <AccordionTrigger className="py-3 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Questionnaire Answers</span>
                    <Badge variant="secondary" className="font-normal text-xs">
                      {mergedAnswers.filter(q => q.response_value != null).length}/{mergedAnswers.length} answered
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
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
                </AccordionContent>
              </AccordionItem>

              {/* Initial Documents - Collapsed by default */}
              <AccordionItem value="documents" className="border rounded-lg px-4">
                <AccordionTrigger className="py-3 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Initial Documents</span>
                    <Badge variant="secondary" className="font-normal text-xs">
                      {documents.filter(d => d.verified_at).length}/{documents.length} verified
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  {documents.length > 0 ? (
                    <div className="space-y-3">
                      {documents.map(doc => (
                        <InitialDocumentCard key={doc.id} doc={doc} orderId={order.id} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      No initial documents required for this service.
                    </p>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
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
        <OrderActivityLog orderId={order.id} initialEntries={initialActivityLog} />
      </div>

      {/* RIGHT PANEL - 40% Chat */}
      <div className="w-[40%] flex flex-col h-full">
        {chatConversationId ? (
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
              <span className="font-medium text-sm">Order Chat</span>
              <Badge variant="destructive" className="text-xs">User can see this</Badge>
            </div>
            <AdminChatWindow
              conversationId={chatConversationId}
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
        initialDocs={documents}
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

      {/* Override lock confirmation — lets the admin lock despite an incomplete setup */}
      <Dialog open={overrideLockOpen} onOpenChange={setOverrideLockOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lock setup despite gaps?</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <p className="text-muted-foreground">
              This setup isn&apos;t complete. Locking now makes the answers and documents read-only for the customer, so they won&apos;t be able to finish:
            </p>
            {missingAnswers.length > 0 && (
              <div>
                <p className="font-medium mb-1">Unanswered required questions</p>
                <ul className="list-disc pl-5 text-muted-foreground space-y-0.5">
                  {missingAnswers.map(q => (
                    <li key={q.question_key}>{q.question_label}</li>
                  ))}
                </ul>
              </div>
            )}
            {missingDocs.length > 0 && (
              <div>
                <p className="font-medium mb-1">Unverified required documents</p>
                <ul className="list-disc pl-5 text-muted-foreground space-y-0.5">
                  {missingDocs.map(d => (
                    <li key={d.id}>{d.document_label}{!d.file_url ? ' (not uploaded)' : ' (uploaded, not verified)'}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOverrideLockOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button
              onClick={async () => { setOverrideLockOpen(false); await handleSetupApproval() }}
              disabled={loading}
              className="border-amber-500/40"
            >
              Override &amp; lock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

