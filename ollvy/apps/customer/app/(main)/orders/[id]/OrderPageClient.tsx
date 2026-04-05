'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
// Card components removed - using custom styled containers for penalty calculator style
import { Progress } from '@/components/ui/progress'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge'
import { DocumentPreview } from '@/components/documents'
import { getClient } from '@/lib/supabase'
import { useAuthStore } from '@/lib/stores/auth-store'
import { formatPaisa, formatDate, cn } from '@/lib/utils'
import type { Order, OrderStageHistory, OrderWorkDocument, ServicePackage, WorkflowDisplayStage } from '@/lib/types'
import { WorkDocumentsSection } from '@/components/orders/WorkDocumentsSection'
import { RoundNotificationBanner } from '@/components/orders/RoundNotificationBanner'
import { FinalOutputBanner } from '@/components/orders/FinalOutputBanner'
import { RoundsTimeline } from '@/components/orders/RoundsTimeline'
import { ChatWindow } from '@/components/chat/ChatWindow'
import { getEdgeFunctionUrl } from '@/lib/supabase'
import { getSignedUrl, downloadFile } from '@/lib/storage'
import {
  AlertCircle,
  ArrowLeft,
  Download,
  FileText,
  Calendar,
  Clock,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Receipt,
  Check,
  Circle,
  Upload,
  FolderOpen,
  Info,
  Loader2,
  MessageSquare,
} from 'lucide-react'

interface OrderDocument {
  id: string
  document_key: string
  document_label: string
  stage_key?: string
  is_required: boolean
  uploaded_at?: string
  file_url?: string
  file_name?: string
  verified_at?: string
  verified_by?: string
  rejection_reason?: string
  created_at?: string
}

interface QuestionnaireResponse {
  question_key: string
  question_label: string
  response_value: string | string[]
}

interface RoundNotification {
  id: string
  order_id: string
  round_id: string
  round_title: string
  message: string
  is_dismissed: boolean
  created_at: string
}

interface QuestionLabel {
  question_key: string
  question_label: string
}

interface TimelineStage extends WorkflowDisplayStage {
  isCompleted: boolean
  isCurrent: boolean
  completedDate: string | null
  expectedDateRange: string | null
}

interface OrderFullDetails {
  order: Order
  stage_history: OrderStageHistory[]
  documents: OrderDocument[]
  work_documents: OrderWorkDocument[]
  questionnaire_responses: { question_key: string; response_value: string | string[] }[]
  question_labels: QuestionLabel[]
  invoice_id: string | null
  round_notification: RoundNotification | null
}

interface InitialData {
  order: Order
  stageHistory: OrderStageHistory[]
  documents: OrderDocument[]
  workDocuments: OrderWorkDocument[]
  invoiceId: string | null
  roundNotification: RoundNotification | null
  questionnaireResponses: QuestionnaireResponse[]
}

interface OrderPageClientProps {
  orderId: string
  initialData?: InitialData | null
}

export function OrderPageClient({ orderId, initialData }: OrderPageClientProps) {
  const router = useRouter()
  const { isHydrated, isLoading: authLoading } = useAuthStore()

  // Loading and error states - if we have initial data, start as not loading
  const [isLoading, setIsLoading] = useState(!initialData)
  const [error, setError] = useState<string | null>(null)

  // Order data states - initialize with server-side data if available
  const [order, setOrder] = useState<Order | null>(initialData?.order || null)
  const [stageHistory, setStageHistory] = useState<OrderStageHistory[]>(initialData?.stageHistory || [])
  const [documents, setDocuments] = useState<OrderDocument[]>(initialData?.documents || [])
  const [workDocuments, setWorkDocuments] = useState<OrderWorkDocument[]>(initialData?.workDocuments || [])
  const [invoiceId, setInvoiceId] = useState<string | null>(initialData?.invoiceId || null)
  const [roundNotification, setRoundNotification] = useState<RoundNotification | null>(initialData?.roundNotification || null)
  const [questionnaireResponses, setQuestionnaireResponses] = useState<QuestionnaireResponse[]>(initialData?.questionnaireResponses || [])

  // Fetch order data client-side ONLY if no initial data provided
  useEffect(() => {
    // Skip if we already have data from server
    if (initialData) return

    // Wait for auth to fully hydrate before fetching
    if (!isHydrated || authLoading) return

    const fetchOrderData = async () => {
      try {
        const supabase = getClient()

        // Batch 1: Fetch all independent data in parallel
        const [orderResult, stageResult, docsResult, workDocsResult] = await Promise.all([
          // Direct query for single order instead of fetching ALL orders via RPC
          supabase
            .from('orders')
            .select(`
              *,
              service_package:service_packages(*),
              professional:professionals(*)
            `)
            .eq('id', orderId)
            .single(),
          supabase
            .from('order_stage_history')
            .select('*')
            .eq('order_id', orderId)
            .order('started_at', { ascending: true }),
          supabase
            .from('order_documents')
            .select('*')
            .eq('order_id', orderId)
            .order('created_at', { ascending: true }),
          supabase
            .from('order_work_documents')
            .select('*')
            .eq('order_id', orderId)
            .order('created_at', { ascending: false })
        ])

        if (orderResult.error) {
          console.error('Error fetching order:', orderResult.error)
          setError('Order not found or you do not have access to it.')
          return
        }

        const orderData = orderResult.data
        setOrder(orderData as Order)
        setStageHistory(stageResult.data || [])
        setDocuments(docsResult.data || [])
        setWorkDocuments(workDocsResult.data || [])

        // Batch 2: Optional data - use Promise.allSettled to fail silently
        const [invoiceResult, notificationResult, responsesResult] = await Promise.allSettled([
          supabase
            .from('invoices')
            .select('id')
            .eq('order_id', orderId)
            .maybeSingle(),
          supabase
            .from('round_notifications')
            .select('*')
            .eq('order_id', orderId)
            .eq('is_dismissed', false)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle(),
          supabase
            .from('order_questionnaire_responses')
            .select('question_key, response_value')
            .eq('order_id', orderId)
        ])

        // Process optional results
        if (invoiceResult.status === 'fulfilled' && invoiceResult.value.data) {
          setInvoiceId(invoiceResult.value.data.id || null)
        }

        if (notificationResult.status === 'fulfilled') {
          setRoundNotification(notificationResult.value.data)
        }

        if (responsesResult.status === 'fulfilled' && responsesResult.value.data) {
          // Use questionnaire from order's service_package if available
          // Handle array case - Supabase returns service_package as an array
          const rawServicePackage = orderData.service_package
          const servicePackageData = (Array.isArray(rawServicePackage) ? rawServicePackage[0] : rawServicePackage) as { questionnaire?: Array<{ key: string; label: string }> } | undefined
          const questionnaire = servicePackageData?.questionnaire || []
          const questionLabels = new Map(
            questionnaire.map((q: { key: string; label: string }) => [q.key, q.label])
          )

          const responses = (responsesResult.value.data || []).map((r: { question_key: string; response_value: string | string[] }) => ({
            question_key: r.question_key,
            question_label: questionLabels.get(r.question_key) || r.question_key,
            response_value: r.response_value,
          }))
          setQuestionnaireResponses(responses)
        }
      } catch (err) {
        console.error('Failed to fetch order:', err)
        setError('There was an error loading the order details. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrderData()
  }, [orderId, isHydrated, authLoading, initialData])

  // Normalize service_package - Supabase returns it as an array
  const servicePackage = useMemo((): ServicePackage | null => {
    if (!order?.service_package) return null
    return Array.isArray(order.service_package)
      ? order.service_package[0] as ServicePackage
      : order.service_package as ServicePackage
  }, [order?.service_package])

  // Modal states
  const [previewDoc, setPreviewDoc] = useState<{
    label: string
    url: string
    name?: string
  } | null>(null)
  const [showAnswersModal, setShowAnswersModal] = useState(false)
  const [showDocumentsModal, setShowDocumentsModal] = useState(false)
  const [documentsModalIndex, setDocumentsModalIndex] = useState(0)
  const [summaryOpen, setSummaryOpen] = useState(false)

  // Real-time subscription for document updates
  useEffect(() => {
    const supabase = getClient()

    // Subscribe to order_documents changes
    const docsChannel = supabase
      .channel(`order-docs-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'order_documents',
          filter: `order_id=eq.${orderId}`,
        },
        (payload) => {
          // Optimistic update for documents
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

    // Subscribe to order_work_documents changes
    const workDocsChannel = supabase
      .channel(`order-work-docs-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'order_work_documents',
          filter: `order_id=eq.${orderId}`,
        },
        (payload) => {
          // Optimistic update for work documents
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            setWorkDocuments(prev => {
              const newDoc = payload.new as OrderWorkDocument
              const filtered = prev.filter(d => d.id !== newDoc.id)
              return [...filtered, newDoc].sort((a, b) =>
                new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
              )
            })
          } else if (payload.eventType === 'DELETE') {
            setWorkDocuments(prev => prev.filter(d => d.id !== (payload.old as OrderWorkDocument).id))
          }
        }
      )
      .subscribe()

    // Subscribe to order changes
    const orderChannel = supabase
      .channel(`order-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          setOrder(prev => {
            if (!prev) return payload.new as Order
            return {
              ...prev,
              ...payload.new,
              // Preserve chat_conversation_id if realtime update doesn't include it
              chat_conversation_id: (payload.new as Order).chat_conversation_id ?? prev.chat_conversation_id,
            } as Order
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(docsChannel)
      supabase.removeChannel(workDocsChannel)
      supabase.removeChannel(orderChannel)
    }
  }, [orderId])

  // Fallback polling for chat_conversation_id
  // Ensures chat appears even if realtime has issues
  // Limited to 10 attempts (30 seconds max) to prevent indefinite polling
  useEffect(() => {
    // Only poll if order exists but chat_conversation_id is missing
    if (order?.chat_conversation_id || !order?.id) return

    // Don't poll for waitlisted orders (they don't have chat yet)
    if (order.status === 'waitlisted') return

    const supabase = getClient()
    let attemptCount = 0
    const maxAttempts = 10 // 10 attempts * 3 seconds = 30 seconds max

    const pollForChat = async () => {
      attemptCount++

      const { data } = await supabase
        .from('orders')
        .select('chat_conversation_id')
        .eq('id', order.id)
        .single()

      if (data?.chat_conversation_id) {
        setOrder(prev => prev ? { ...prev, chat_conversation_id: data.chat_conversation_id } : prev)
        return true // Signal to stop polling
      }

      return false
    }

    // Poll every 3 seconds until chat_conversation_id is set or max attempts reached
    const interval = setInterval(async () => {
      if (attemptCount >= maxAttempts) {
        clearInterval(interval)
        return
      }
      const found = await pollForChat()
      if (found) {
        clearInterval(interval)
      }
    }, 3000)

    // Also poll immediately on mount
    pollForChat()

    return () => clearInterval(interval)
  }, [order?.id, order?.chat_conversation_id, order?.status])

  // Calculate progress stats
  const stats = useMemo(() => {
    const totalDocs = documents.length
    const uploadedDocs = documents.filter(d => d.uploaded_at).length
    const verifiedDocs = documents.filter(d => d.verified_at).length
    const pendingDocs = documents.filter(d => !d.uploaded_at)

    // Progress based on documents uploaded
    const docProgress = totalDocs > 0 ? Math.round((uploadedDocs / totalDocs) * 100) : 0

    // Calculate estimated completion
    const slaDays = servicePackage?.sla_working_days || 7
    const createdAt = order?.created_at ? new Date(order.created_at) : new Date()

    // Check if customer has completed their part (questionnaire + documents)
    const hasQuestionnaireAnswers = questionnaireResponses.length > 0
    const questionnaireComplete = !!order?.questionnaire_completed_at && hasQuestionnaireAnswers
    const allDocsUploaded = uploadedDocs === totalDocs && totalDocs > 0
    const customerSetupComplete = questionnaireComplete && allDocsUploaded

    // SLA starts from when customer completes setup, not from order creation
    let slaStartDate: Date
    if (customerSetupComplete) {
      const questionnaireDate = order?.questionnaire_completed_at ? new Date(order.questionnaire_completed_at) : new Date()
      const lastDocUpload = documents
        .filter(d => d.uploaded_at)
        .sort((a, b) => new Date(b.uploaded_at!).getTime() - new Date(a.uploaded_at!).getTime())[0]
      const lastDocDate = lastDocUpload?.uploaded_at ? new Date(lastDocUpload.uploaded_at) : new Date()
      slaStartDate = questionnaireDate > lastDocDate ? questionnaireDate : lastDocDate
    } else {
      slaStartDate = new Date()
    }

    const estimatedCompletion = new Date(slaStartDate)
    estimatedCompletion.setDate(estimatedCompletion.getDate() + slaDays)

    const today = new Date()
    const daysRemaining = Math.max(0, Math.ceil((estimatedCompletion.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))

    return {
      totalDocs,
      uploadedDocs,
      verifiedDocs,
      pendingDocs,
      docProgress,
      estimatedCompletion,
      daysRemaining,
      slaDays,
      createdAt,
      slaStartDate,
      customerSetupComplete,
    }
  }, [order, servicePackage, documents, questionnaireResponses])

  // Calculate dynamic dates for each stage
  const calculateStageDate = (stageIndex: number, isStart: boolean = true) => {
    const baseDate = stats.slaStartDate
    const workflowStages = servicePackage?.workflow_stages || []

    const stage = workflowStages[stageIndex]
    if (!stage?.timeline) return null

    const match = stage.timeline.match(/Day\s*(\d+)(?:\s*-\s*(\d+))?/i)
    if (!match) return null

    const startDay = parseInt(match[1])
    const endDay = match[2] ? parseInt(match[2]) : startDay

    const targetDate = new Date(baseDate)
    targetDate.setDate(targetDate.getDate() + (isStart ? startDay : endDay))

    return targetDate
  }

  const formatStageDate = (date: Date | null) => {
    if (!date) return null
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  }

  // Build timeline stages based on actual progress
  const timelineStages = useMemo((): TimelineStage[] => {
    const workflowStages = servicePackage?.workflow_stages || []
    const hasQuestionnaireAnswers = questionnaireResponses.length > 0
    const questionnaireCompleted = !!order?.questionnaire_completed_at && hasQuestionnaireAnswers
    const allDocsUploaded = stats.uploadedDocs === stats.totalDocs && stats.totalDocs > 0

    return workflowStages.map((stage: WorkflowDisplayStage, index: number): TimelineStage => {
      let isCompleted = false
      let isCurrent = false
      let completedDate: string | null = null

      if (index === 0) {
        isCompleted = questionnaireCompleted
        isCurrent = !questionnaireCompleted
        if (isCompleted && order?.questionnaire_completed_at) {
          completedDate = formatDate(order.questionnaire_completed_at)
        }
      } else if (index === 1) {
        isCompleted = allDocsUploaded
        isCurrent = questionnaireCompleted && !allDocsUploaded
        if (isCompleted && documents.length > 0) {
          const latestUpload = documents
            .filter(d => d.uploaded_at)
            .sort((a, b) => new Date(b.uploaded_at!).getTime() - new Date(a.uploaded_at!).getTime())[0]
          if (latestUpload?.uploaded_at) {
            completedDate = formatDate(latestUpload.uploaded_at)
          }
        }
      } else {
        const historyForStage = stageHistory.find(h =>
          h.stage_key === stage.title.toLowerCase().replace(/\s+/g, '_')
        )
        isCompleted = !!historyForStage?.completed_at
        if (isCompleted && historyForStage?.completed_at) {
          completedDate = formatDate(historyForStage.completed_at)
        }
        isCurrent = !isCompleted && workflowStages.slice(0, index).every((_: WorkflowDisplayStage, i: number) => {
          if (i === 0) return questionnaireCompleted
          if (i === 1) return allDocsUploaded
          return !!stageHistory.find(h =>
            h.stage_key === workflowStages[i].title.toLowerCase().replace(/\s+/g, '_')
          )?.completed_at
        })
      }

      const startDate = calculateStageDate(index, true)
      const endDate = calculateStageDate(index, false)
      const expectedDateRange = startDate && endDate
        ? `${formatStageDate(startDate)} - ${formatStageDate(endDate)}`
        : startDate
        ? formatStageDate(startDate)
        : stage.timeline

      return { ...stage, isCompleted, isCurrent, completedDate, expectedDateRange }
    })
  }, [servicePackage, stats, stageHistory, documents, questionnaireResponses])

  const completedStagesCount = timelineStages.filter((s: TimelineStage) => s.isCompleted).length

  // Calculate active stage key for work documents filtering
  const activeStageKey = useMemo(() => {
    const workflowStages = servicePackage?.workflow_stages || []
    const currentStageIndex = Math.min(completedStagesCount, workflowStages.length - 1)
    const currentStage = workflowStages[currentStageIndex]
    return currentStage?.stage_key || null
  }, [servicePackage?.workflow_stages, completedStagesCount])

  const handleDownloadInvoice = async () => {
    if (!invoiceId) return

    try {
      const supabase = getClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) return

      const response = await fetch(getEdgeFunctionUrl('get-invoice-url'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ invoiceId }),
      })

      const { url } = await response.json()
      if (url) {
        window.open(url, '_blank')
      }
    } catch (err) {
      console.error('Failed to download invoice:', err)
    }
  }

  const handleDownloadEngagementLetter = async () => {
    if (!order?.id) return

    try {
      const supabase = getClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) return

      const response = await fetch(getEdgeFunctionUrl('get-engagement-letter-url'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ order_id: order.id }),
      })

      const data = await response.json()

      if (data.ok && data.url) {
        window.open(data.url, '_blank')
      } else if (data.pdf_pending) {
        console.log('Engagement letter is being generated, please try again shortly.')
      } else {
        console.error('Failed to get engagement letter:', data.error)
      }
    } catch (err) {
      console.error('Failed to download engagement letter:', err)
    }
  }

  const formatResponseValue = (value: string | string[]) => {
    if (Array.isArray(value)) {
      return value.join(', ')
    }
    return value || '-'
  }

  const handleRefresh = async () => {
    // Refresh all data in parallel
    try {
      const supabase = getClient()

      // Fetch all data in parallel
      const [orderResult, stageResult, docsResult, workDocsResult, notificationResult] = await Promise.all([
        // Direct query for single order
        supabase
          .from('orders')
          .select(`
            *,
            service_package:service_packages(*),
            professional:professionals(*)
          `)
          .eq('id', orderId)
          .single(),
        supabase
          .from('order_stage_history')
          .select('*')
          .eq('order_id', orderId)
          .order('started_at', { ascending: true }),
        supabase
          .from('order_documents')
          .select('*')
          .eq('order_id', orderId)
          .order('created_at', { ascending: true }),
        supabase
          .from('order_work_documents')
          .select('*')
          .eq('order_id', orderId)
          .order('created_at', { ascending: false }),
        supabase
          .from('round_notifications')
          .select('*')
          .eq('order_id', orderId)
          .eq('is_dismissed', false)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()
      ])

      if (orderResult.data) setOrder(orderResult.data as Order)
      if (stageResult.data) setStageHistory(stageResult.data)
      if (docsResult.data) setDocuments(docsResult.data)
      if (workDocsResult.data) setWorkDocuments(workDocsResult.data)
      setRoundNotification(notificationResult.data)
    } catch (err) {
      console.error('Failed to refresh:', err)
    }
  }

  const pendingDocsCount = stats.totalDocs - stats.uploadedDocs
  const pendingWorkDocs = workDocuments.filter(d => d.direction === 'from_customer' && d.status === 'pending')
  const newDeliverables = workDocuments.filter(d => d.direction === 'to_customer')

  // Loading state
  if (isLoading) {
    return (
      <div className="container py-20 text-center">
        <Loader2 className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-spin" />
        <h1 className="text-xl font-semibold text-foreground mb-2">Loading Order</h1>
        <p className="text-muted-foreground">Please wait...</p>
      </div>
    )
  }

  // Error state
  if (error || !order) {
    return (
      <div className="container py-20 text-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-2xl font-semibold text-foreground mb-4">
          {error?.includes('not found') ? 'Order Not Found' : 'Error Loading Order'}
        </h1>
        <p className="text-muted-foreground mb-8">
          {error || 'There was an error loading the order details. Please try again.'}
        </p>
        <Link href="/orders">
          <Button>Back to Orders</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container py-12 max-w-5xl">
      {/* Back Button */}
      <Link href="/orders">
        <Button variant="ghost" className="mb-8 gap-2 text-muted-foreground hover:text-foreground -ml-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Button>
      </Link>

      {/* Final Output Banner */}
      <FinalOutputBanner
        finalDoc={workDocuments.find(d => d.tag === 'final_output' && d.direction === 'to_customer')}
      />

      {/* Round Notification Banner */}
      <RoundNotificationBanner orderId={orderId} initialNotification={roundNotification} />

      {/* Notification Banner - Pending Work Documents */}
      {pendingWorkDocs.length > 0 && (
        <div className="flex gap-3 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 mb-6">
          <FileText className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-amber-600 dark:text-amber-400 mb-0.5">
              Documents Requested
            </p>
            <p className="text-xs text-amber-700/80 dark:text-amber-300/80">
              {pendingWorkDocs.map(d => d.document_label).join(', ')}
            </p>
          </div>
          <Button
            size="sm"
            className="shrink-0"
            onClick={() => {
              const workDocsSection = document.getElementById('work-documents-section')
              workDocsSection?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            Upload Now
          </Button>
        </div>
      )}

      {/* Notification Banner - New Deliverables */}
      {newDeliverables.length > 0 && pendingWorkDocs.length === 0 && (
        <div className="flex gap-3 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 mb-6">
          <Download className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-0.5">
              Documents Available
            </p>
            <p className="text-xs text-emerald-700/80 dark:text-emerald-300/80">
              {newDeliverables.map(d => d.document_label).join(', ')}
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="shrink-0"
            onClick={() => {
              const workDocsSection = document.getElementById('work-documents-section')
              workDocsSection?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            View Documents
          </Button>
        </div>
      )}

      {/* Header */}
      <div className="mb-12">
        <p className="font-mono text-sm uppercase tracking-[0.3em] text-muted-foreground mb-4">
          Order #{order.order_number}
        </p>
        <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-semibold text-foreground tracking-tight">
                {servicePackage?.name || 'Order'}
              </h1>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="text-muted-foreground">
              {formatDate(order.created_at)}
            </p>
          </div>

          {/* Continue Setup Button */}
          {(() => {
            const hasQuestionnaireAnswers = questionnaireResponses.length > 0
            const questionnaireComplete = !!order.questionnaire_completed_at && hasQuestionnaireAnswers
            const allDocsUploaded = stats.uploadedDocs === stats.totalDocs && stats.totalDocs > 0

            if (questionnaireComplete && allDocsUploaded) return null

            const needsQuestionnaire = !questionnaireComplete
            const needsDocs = !allDocsUploaded

            const targetPath = needsQuestionnaire
              ? `/orders/${order.id}/questionnaire`
              : `/orders/${order.id}/documents`

            let contextLabel = ''
            if (needsQuestionnaire && needsDocs) {
              contextLabel = 'Questionnaire'
            } else if (needsQuestionnaire) {
              contextLabel = 'Questionnaire'
            } else if (needsDocs) {
              contextLabel = 'Documents'
            }

            return (
              <Link href={targetPath}>
                <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
                  Continue where you left off ({contextLabel})
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            )
          })()}
        </div>

        {/* Stats Cards Row - Unified Container */}
        <div className="rounded-xl border border-border bg-card p-6 mt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Progress */}
            <div className="space-y-1">
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                Progress
              </p>
              <p className="text-2xl font-mono font-semibold tracking-tight text-foreground">
                {stats.docProgress}%
              </p>
              <Progress value={stats.docProgress} className="h-1.5 mt-2" />
            </div>

            {/* Documents - Clickable */}
            <div
              className="space-y-1 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => {
                if (stats.uploadedDocs === stats.totalDocs && stats.totalDocs > 0) {
                  setDocumentsModalIndex(0)
                  setShowDocumentsModal(true)
                } else {
                  router.push(`/orders/${orderId}/documents`)
                }
              }}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                Documents
              </p>
              <p className="text-2xl font-mono font-semibold tracking-tight text-foreground">
                {stats.uploadedDocs}/{stats.totalDocs}
              </p>
              <Progress value={stats.totalDocs > 0 ? (stats.uploadedDocs / stats.totalDocs) * 100 : 0} className="h-1.5 mt-2" />
            </div>

            {/* Days Remaining */}
            <div className="space-y-1">
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                Days Left
              </p>
              <p className="text-2xl font-mono font-semibold tracking-tight text-foreground">
                {stats.customerSetupComplete ? stats.daysRemaining : stats.slaDays}
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <p className="text-xs text-muted-foreground">
                  {stats.estimatedCompletion.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </p>
                {!stats.customerSetupComplete && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-[10px] cursor-help">
                          Paused
                          <Info className="h-3 w-3" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="max-w-[200px]">
                        <p className="text-xs">Complete your questionnaire and upload documents to resume progress.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>

            {/* SLA */}
            <div className="space-y-1">
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                SLA
              </p>
              <p className="text-2xl font-mono font-semibold tracking-tight text-foreground">
                {stats.slaDays} days
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Working days
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Overview Card */}
          <div className="rounded-xl border border-border overflow-hidden">
            {/* Header section */}
            <div className="px-6 pt-6 pb-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1">
                Service
              </p>
              <h2 className="text-xl font-semibold text-foreground">
                {servicePackage?.name || 'Order'}
              </h2>
            </div>

            {/* Progress bar section */}
            <div className="px-6 py-4 border-t border-border/30">
              {/* Progress Bar Segments */}
              <div className="flex gap-1 mb-3">
                {timelineStages.map((stage: TimelineStage, index: number) => (
                  <div
                    key={stage.step}
                    className={cn(
                      'h-2 flex-1 rounded-full transition-colors',
                      stage.isCompleted
                        ? 'bg-emerald-500'
                        : stage.isCurrent
                        ? 'bg-emerald-500/50'
                        : 'bg-muted'
                    )}
                  />
                ))}
              </div>

              {/* Stage Info Row */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Stage {completedStagesCount + (timelineStages.some((s: TimelineStage) => s.isCurrent) ? 1 : 0)} of {timelineStages.length}
                </p>
                <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  {order.status === 'completed' ? 'Completed' : 'In Progress'}
                </span>
              </div>
            </div>

            {/* Expected completion section */}
            <div className="px-6 py-4 border-t border-border/30 bg-muted/30">
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  Expected completion: <span className="font-mono font-medium text-foreground">{stats.estimatedCompletion.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </p>
                {!stats.customerSetupComplete && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-[10px] cursor-help">
                          Paused
                          <Info className="h-3 w-3" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="max-w-[200px]">
                        <p className="text-xs">Complete your questionnaire and upload documents to resume progress.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                    Progress Timeline
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {completedStagesCount} of {timelineStages.length}
                </span>
              </div>
            </div>

            {/* Timeline content */}
            <div className="p-6">
              <div className="space-y-0">
                {timelineStages.map((stage: TimelineStage, index: number) => {
                  const isQuestionsStage = index === 0
                  const isDocumentsStage = index === 1

                  return (
                    <div key={stage.step} className="flex gap-4">
                      {/* Icon */}
                      <div className="flex flex-col items-center">
                        <div
                          className={cn(
                            'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors',
                            stage.isCompleted
                              ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                              : stage.isCurrent
                              ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                              : 'bg-muted text-muted-foreground'
                          )}
                        >
                          {stage.isCompleted ? (
                            <Check className="h-4 w-4" />
                          ) : stage.isCurrent ? (
                            <Clock className="h-4 w-4" />
                          ) : (
                            <Circle className="h-4 w-4" />
                          )}
                        </div>
                        {index < timelineStages.length - 1 && (
                          <div
                            className={cn(
                              'w-0.5 flex-1 mt-2 min-h-[24px]',
                              stage.isCompleted ? 'bg-emerald-500/30' : 'bg-border'
                            )}
                          />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-6">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4
                            className={cn(
                              'font-medium',
                              stage.isCompleted || stage.isCurrent
                                ? 'text-foreground'
                                : 'text-muted-foreground'
                            )}
                          >
                            {isQuestionsStage && stage.isCompleted
                              ? 'Answered the questionnaire'
                              : isQuestionsStage && stage.isCurrent
                              ? 'Answer the questionnaire'
                              : stage.title}
                          </h4>

                          {/* View answers badge */}
                          {isQuestionsStage && stage.isCompleted && questionnaireResponses.length > 0 && (
                            <button
                              onClick={() => setShowAnswersModal(true)}
                              className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground hover:bg-muted/80 transition-colors cursor-pointer"
                            >
                              {questionnaireResponses.length} answers
                            </button>
                          )}

                          {/* Edit answers */}
                          {isQuestionsStage && stage.isCompleted && (
                            <Link href={`/orders/${order.id}/questionnaire?edit=true`}>
                              <button className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground hover:bg-muted/80 transition-colors cursor-pointer">
                                Edit answers
                              </button>
                            </Link>
                          )}

                          {/* In-progress questionnaire */}
                          {isQuestionsStage && stage.isCurrent && !stage.isCompleted && (
                            <Link href={`/orders/${order.id}/questionnaire`}>
                              <button className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground hover:bg-muted/80 transition-colors cursor-pointer">
                                {questionnaireResponses.length > 0 ? 'Continue where you left off' : 'Get started'}
                              </button>
                            </Link>
                          )}

                          {/* Pending docs count */}
                          {isDocumentsStage && !stage.isCompleted && pendingDocsCount > 0 && (
                            <Popover>
                              <PopoverTrigger asChild>
                                <button className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground hover:bg-muted/80 transition-colors cursor-pointer">
                                  {pendingDocsCount} pending
                                </button>
                              </PopoverTrigger>
                              <PopoverContent className="w-80 p-0" align="start" side="bottom" sideOffset={4}>
                                <div className="px-4 py-3 border-b border-border bg-muted/50">
                                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
                                    Pending Documents
                                  </p>
                                  <p className="text-sm text-foreground mt-1">Upload these to continue</p>
                                </div>
                                <div className="py-2 max-h-64 overflow-y-auto">
                                  {stats.pendingDocs.map((doc) => (
                                    <div
                                      key={doc.id}
                                      className="flex items-center gap-3 px-4 py-2 hover:bg-muted/50 transition-colors"
                                    >
                                      <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                                        <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                                      </div>
                                      <p className="text-sm text-foreground truncate flex-1">
                                        {doc.document_label}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                                <div className="px-3 py-2 border-t border-border flex justify-center">
                                  <Link href={`/orders/${order.id}/documents`}>
                                    <Button size="xs" className="gap-1 h-7 text-xs px-4">
                                      Upload Documents
                                      <ChevronRight className="h-3 w-3" />
                                    </Button>
                                  </Link>
                                </div>
                              </PopoverContent>
                            </Popover>
                          )}

                          {/* Upload/Change documents button */}
                          {isDocumentsStage && (stage.isCurrent || stage.isCompleted) && (
                            <Link href={`/orders/${order.id}/documents`}>
                              <button className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground hover:bg-muted/80 transition-colors cursor-pointer">
                                {stage.isCompleted ? 'Change documents' : 'Upload documents'}
                              </button>
                            </Link>
                          )}

                          {/* Work documents button for stages beyond initial docs */}
                          {!isQuestionsStage && !isDocumentsStage && (stage.isCurrent || stage.isCompleted) && (() => {
                            const stageKey = stage.title.toLowerCase().replace(/\s+/g, '_')
                            const stageWorkDocs = workDocuments.filter(d => d.stage_key === stageKey)
                            const stagePendingDocs = stageWorkDocs.filter(d => d.direction === 'from_customer' && d.status === 'pending')
                            const stageDeliverables = stageWorkDocs.filter(d => d.direction === 'to_customer')

                            if (stageWorkDocs.length === 0 && !stage.isCurrent) return null

                            return (
                              <>
                                {stagePendingDocs.length > 0 && (
                                  <button
                                    onClick={() => {
                                      const workDocsSection = document.getElementById('work-documents-section')
                                      workDocsSection?.scrollIntoView({ behavior: 'smooth' })
                                    }}
                                    className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 hover:bg-amber-500/30 transition-colors cursor-pointer"
                                  >
                                    {stagePendingDocs.length} to upload
                                  </button>
                                )}
                                {stageDeliverables.length > 0 && (
                                  <button
                                    onClick={() => {
                                      const workDocsSection = document.getElementById('work-documents-section')
                                      workDocsSection?.scrollIntoView({ behavior: 'smooth' })
                                    }}
                                    className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/30 transition-colors cursor-pointer"
                                  >
                                    {stageDeliverables.length} to download
                                  </button>
                                )}
                                {stageWorkDocs.length > 0 && stagePendingDocs.length === 0 && stageDeliverables.length === 0 && (
                                  <button
                                    onClick={() => {
                                      const workDocsSection = document.getElementById('work-documents-section')
                                      workDocsSection?.scrollIntoView({ behavior: 'smooth' })
                                    }}
                                    className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground hover:bg-muted/80 transition-colors cursor-pointer"
                                  >
                                    View documents
                                  </button>
                                )}
                              </>
                            )
                          })()}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {stage.isCompleted ? (
                            <span>
                              Completed{stage.completedDate ? ` on ${stage.completedDate}` : ''}
                            </span>
                          ) : stage.isCurrent ? (
                            <span>In progress</span>
                          ) : (
                            <span>{stage.expectedDateRange}</span>
                          )}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Rounds Timeline */}
          {servicePackage?.id && (
            <RoundsTimeline
              orderId={orderId}
              servicePackageId={servicePackage.id}
              workflowStages={servicePackage.workflow_stages || []}
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Assigned Professional */}
          {order.professional_id && (
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-6 py-4 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                    Assigned Professional
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-semibold text-foreground">
                      {(order.professional as { name?: string })?.name?.charAt(0) || 'P'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {(order.professional as { name?: string })?.name || 'Professional'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {(order.professional as { profession_type?: string })?.profession_type?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'CA'}
                    </p>
                    {(order.professional as { experience_years?: number })?.experience_years && (
                      <p className="text-xs text-muted-foreground">
                        {(order.professional as { experience_years?: number }).experience_years}+ years experience
                      </p>
                    )}
                  </div>
                </div>

                {/* Work Documents Button */}
                {workDocuments.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-4 gap-2"
                    onClick={() => {
                      const workDocsSection = document.getElementById('work-documents-section')
                      workDocsSection?.scrollIntoView({ behavior: 'smooth' })
                    }}
                  >
                    <FolderOpen className="h-4 w-4" />
                    View Work Documents
                    {workDocuments.filter(d => d.direction === 'from_customer' && d.status === 'pending').length > 0 && (
                      <span className="ml-1 px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-mono">
                        {workDocuments.filter(d => d.direction === 'from_customer' && d.status === 'pending').length}
                      </span>
                    )}
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div className="rounded-xl border border-border overflow-hidden">
            <Collapsible open={summaryOpen} onOpenChange={setSummaryOpen}>
              {/* Collapsible header */}
              <CollapsibleTrigger asChild>
                <div className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-2">
                    <Receipt className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                      Order Summary
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-mono font-semibold">{formatPaisa(order.total_paisa_snapshot)}</span>
                    <ChevronDown className={cn(
                      'h-4 w-4 text-muted-foreground transition-transform',
                      summaryOpen && 'rotate-180'
                    )} />
                  </div>
                </div>
              </CollapsibleTrigger>

              {/* Quick Action: Work Documents */}
              {order.professional_id && workDocuments.length > 0 && (
                <div className="px-6 pb-3 border-t border-border/30">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      const workDocsSection = document.getElementById('work-documents-section')
                      workDocsSection?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors mt-3"
                  >
                    <div className="flex items-center gap-3">
                      <FolderOpen className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">Work Documents</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {workDocuments.filter(d => d.direction === 'to_customer').length > 0 && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                          {workDocuments.filter(d => d.direction === 'to_customer').length} download
                        </span>
                      )}
                      {workDocuments.filter(d => d.direction === 'from_customer' && d.status === 'pending').length > 0 && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400">
                          {workDocuments.filter(d => d.direction === 'from_customer' && d.status === 'pending').length} upload
                        </span>
                      )}
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </button>
                </div>
              )}
              <CollapsibleContent>
                {/* Breakdown section */}
                <div className="px-6 py-4 border-t border-border/30 space-y-3">
                  {/* Price Breakdown */}
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Professional Fee</span>
                      <span className="text-foreground font-mono">{formatPaisa(order.price_base_paisa_snapshot)}</span>
                    </div>
                    {order.price_govt_fees_paisa_snapshot > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Government Fees</span>
                        <span className="text-foreground font-mono">{formatPaisa(order.price_govt_fees_paisa_snapshot)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">GST</span>
                      <span className="text-foreground font-mono">{formatPaisa(order.price_gst_paisa_snapshot)}</span>
                    </div>
                    {order.pro_discount_paisa_snapshot > 0 && (
                      <div className="flex justify-between text-foreground">
                        <span>Pro Discount</span>
                        <span className="font-mono">-{formatPaisa(order.pro_discount_paisa_snapshot)}</span>
                      </div>
                    )}
                    {order.promo_discount_paisa_snapshot > 0 && (
                      <div className="flex justify-between text-foreground">
                        <span>Promo Discount</span>
                        <span className="font-mono">-{formatPaisa(order.promo_discount_paisa_snapshot)}</span>
                      </div>
                    )}
                  </div>

                  {/* Promo Code Used */}
                  {order.promo_code_used && (
                    <div className="text-sm bg-muted/50 rounded-lg px-3 py-2">
                      <span className="text-muted-foreground">Promo Code: </span>
                      <span className="font-medium text-foreground">{order.promo_code_used}</span>
                    </div>
                  )}
                </div>

                {/* Key dates section */}
                <div className="px-6 py-4 border-t border-border/30 bg-muted/30">
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-3">
                    Key Dates
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ordered</span>
                      <span className="text-foreground font-mono">{formatDate(order.created_at)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Est. Completion</span>
                      <span className="text-foreground font-mono font-medium">
                        {formatDate(stats.estimatedCompletion.toISOString())}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Submitted Work Documents */}
                {workDocuments.filter(d => d.direction === 'from_customer' && d.file_url).length > 0 && (
                  <div className="px-6 py-4 border-t border-border/30">
                    <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-3">
                      Submitted Documents
                    </p>
                    <div className="space-y-2">
                      {workDocuments
                        .filter(d => d.direction === 'from_customer' && d.file_url)
                        .map(doc => (
                          <div
                            key={doc.id}
                            className="flex items-center gap-3 p-2 rounded-lg bg-muted/30"
                          >
                            <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">
                                {doc.document_label}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {doc.status === 'verified' ? 'Verified' : doc.status === 'uploaded' ? 'Under Review' : doc.status}
                              </p>
                            </div>
                            {doc.status === 'verified' && (
                              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Received Deliverables */}
                {workDocuments.filter(d => d.direction === 'to_customer').length > 0 && (
                  <div className="px-6 py-4 border-t border-border/30">
                    <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-3">
                      Received Deliverables
                    </p>
                    <div className="space-y-2">
                      {workDocuments
                        .filter(d => d.direction === 'to_customer')
                        .map(doc => (
                          <DeliverableDownloadButton key={doc.id} doc={doc} />
                        ))}
                    </div>
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Downloads */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border/50">
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                  Downloads
                </span>
              </div>
            </div>
            <div className="p-4 space-y-2">
              {order.razorpay_payment_id && (
                <button
                  onClick={handleDownloadInvoice}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <Receipt className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Tax Invoice</span>
                  </div>
                  <Download className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              )}

              {order.status !== 'pending_assignment' && order.status !== 'waitlisted' && (
                <button
                  onClick={handleDownloadEngagementLetter}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Engagement Letter</span>
                  </div>
                  <Download className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              )}

              {!order.razorpay_payment_id &&
                (order.status === 'pending_assignment' || order.status === 'waitlisted') && (
                  <p className="text-xs text-muted-foreground text-center py-2">
                    Documents will appear once processed
                  </p>
                )}
            </div>
          </div>

          {/* Work Documents Section */}
          <div id="work-documents-section">
            <WorkDocumentsSection
              orderId={orderId}
              workDocuments={workDocuments}
              onDocumentsUpdated={handleRefresh}
              hasProfessional={!!order.professional_id}
              activeStageKey={activeStageKey || undefined}
            />
          </div>

          {/* Chat with CA */}
          {order.chat_conversation_id ? (
            <div className="rounded-xl border border-border overflow-hidden h-[450px] flex flex-col">
              <div className="px-6 py-4 border-b border-border/50 shrink-0">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                    Chat with your CA
                  </span>
                </div>
              </div>
              <div className="flex-1 min-h-0">
                <ChatWindow
                  conversationId={order.chat_conversation_id}
                  professionalName={(order.professional as { name?: string })?.name || 'Your CA'}
                />
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="py-6 text-center text-sm text-muted-foreground">
                Chat is currently unavailable. Please contact support if this persists.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Questionnaire Answers Modal */}
      <Dialog open={showAnswersModal} onOpenChange={setShowAnswersModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Your Answers</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {questionnaireResponses.map((response) => (
              <div key={response.question_key} className="space-y-1">
                <p className="text-sm text-muted-foreground">{response.question_label}</p>
                <p className="font-medium text-foreground">{formatResponseValue(response.response_value)}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-end pt-4 border-t border-border">
            <Link href={`/orders/${order.id}/questionnaire`}>
              <Button variant="outline" size="sm" onClick={() => setShowAnswersModal(false)}>
                Edit Answers
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>

      {/* Uploaded Documents Modal */}
      <Dialog open={showDocumentsModal} onOpenChange={setShowDocumentsModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Uploaded Documents</span>
              <span className="text-sm font-normal text-muted-foreground">
                {documentsModalIndex + 1} of {documents.filter(d => d.uploaded_at).length}
              </span>
            </DialogTitle>
          </DialogHeader>
          {(() => {
            const uploadedDocs = documents.filter(d => d.uploaded_at)
            const currentDoc = uploadedDocs[documentsModalIndex]
            if (!currentDoc) return null

            const isImage = currentDoc.file_url?.match(/\.(jpg|jpeg|png|gif|webp)$/i)

            return (
              <div className="space-y-4">
                {/* Document Header */}
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{currentDoc.document_label}</p>
                    <p className="text-xs text-muted-foreground">{currentDoc.file_name}</p>
                  </div>
                </div>

                {/* Document Preview */}
                <div className="relative bg-muted/20 rounded-lg overflow-hidden min-h-[300px] flex items-center justify-center">
                  <DocumentModalPreview
                    fileUrl={currentDoc.file_url || ''}
                    fileName={currentDoc.file_name}
                    documentLabel={currentDoc.document_label}
                    isImage={!!isImage}
                  />
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDocumentsModalIndex(Math.max(0, documentsModalIndex - 1))}
                    disabled={documentsModalIndex === 0}
                  >
                    Previous
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      if (documentsModalIndex < uploadedDocs.length - 1) {
                        setDocumentsModalIndex(documentsModalIndex + 1)
                      } else {
                        setShowDocumentsModal(false)
                      }
                    }}
                  >
                    {documentsModalIndex === uploadedDocs.length - 1 ? 'Done' : 'Next'}
                  </Button>
                </div>
              </div>
            )
          })()}
        </DialogContent>
      </Dialog>

      {/* Document Preview Modal */}
      {previewDoc && (
        <DocumentPreview
          isOpen={!!previewDoc}
          onClose={() => setPreviewDoc(null)}
          documentLabel={previewDoc.label}
          fileUrl={previewDoc.url}
          fileName={previewDoc.name}
        />
      )}
    </div>
  )
}

// Helper component for deliverable downloads with signed URLs
function DeliverableDownloadButton({ doc }: { doc: OrderWorkDocument }) {
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    if (!doc.file_url) return
    setLoading(true)
    try {
      await downloadFile(doc.file_url, doc.file_name || doc.document_label)
    } catch (error) {
      console.error('Download failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading || !doc.file_url}
      className="flex items-center gap-3 p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors w-full disabled:opacity-50"
    >
      <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
      <span className="text-sm font-medium text-foreground truncate flex-1 text-left">
        {doc.document_label}
      </span>
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 animate-spin" />
      ) : (
        <Download className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
      )}
    </button>
  )
}

// Helper component for document preview in the modal with signed URLs
function DocumentModalPreview({
  fileUrl,
  fileName,
  documentLabel,
  isImage,
}: {
  fileUrl: string
  fileName?: string
  documentLabel: string
  isImage: boolean
}) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [opening, setOpening] = useState(false)

  useEffect(() => {
    if (fileUrl) {
      setLoading(true)
      getSignedUrl(fileUrl).then((url) => {
        setSignedUrl(url)
        setLoading(false)
      }).catch(() => {
        setLoading(false)
      })
    } else {
      setLoading(false)
    }
  }, [fileUrl])

  const handleOpenInNewTab = async () => {
    if (!fileUrl) return
    setOpening(true)
    try {
      const url = signedUrl || await getSignedUrl(fileUrl)
      if (url) {
        window.open(url, '_blank')
      }
    } catch (error) {
      console.error('Failed to open:', error)
    } finally {
      setOpening(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
      </div>
    )
  }

  if (isImage && signedUrl) {
    return (
      <img
        src={signedUrl}
        alt={documentLabel}
        className="max-h-[400px] w-auto object-contain"
      />
    )
  }

  return (
    <div className="text-center p-8">
      <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
      <p className="text-muted-foreground">PDF Document</p>
      {fileUrl && (
        <button
          onClick={handleOpenInNewTab}
          disabled={opening}
          className="text-primary hover:underline text-sm mt-2 inline-flex items-center gap-1 disabled:opacity-50"
        >
          {opening && <Loader2 className="h-3 w-3 animate-spin" />}
          Open in new tab
        </button>
      )}
    </div>
  )
}
