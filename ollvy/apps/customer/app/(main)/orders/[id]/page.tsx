'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
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
import { getClient, getEdgeFunctionUrl } from '@/lib/supabase'
import { formatPaisa, formatDate, cn } from '@/lib/utils'
import { useAuthStore } from '@/lib/stores/auth-store'
import type { Order, OrderStageHistory, OrderWorkDocument } from '@/lib/types'
import { WorkDocumentsSection } from '@/components/orders/WorkDocumentsSection'
import { RoundNotificationBanner } from '@/components/orders/RoundNotificationBanner'
import { FinalOutputBanner } from '@/components/orders/FinalOutputBanner'
import { RoundsTimeline } from '@/components/orders/RoundsTimeline'
import { ChatWindow } from '@/components/chat/ChatWindow'
import {
  ArrowLeft,
  MessageSquare,
  Download,
  FileText,
  Calendar,
  Clock,
  CheckCircle2,
  Shield,
  AlertCircle,
  ChevronRight,
  ChevronDown,
  Receipt,
  Building2,
  Target,
  TrendingUp,
  Check,
  Circle,
  Upload,
  User,
  Star,
  FolderOpen,
  Info,
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
}

interface QuestionnaireResponse {
  question_key: string
  question_label: string
  response_value: string | string[]
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string
  const { user, isHydrated } = useAuthStore()

  const [order, setOrder] = useState<Order | null>(null)
  const [stageHistory, setStageHistory] = useState<OrderStageHistory[]>([])
  const [documents, setDocuments] = useState<OrderDocument[]>([])
  const [workDocuments, setWorkDocuments] = useState<OrderWorkDocument[]>([])
  const [questionnaireResponses, setQuestionnaireResponses] = useState<QuestionnaireResponse[]>([])
  const [invoiceId, setInvoiceId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  useEffect(() => {
    if (orderId && isHydrated) {
      fetchOrder()
    }
  }, [orderId, isHydrated])

  // Real-time subscription for document updates (Issue #6)
  useEffect(() => {
    if (!orderId || !isHydrated) return

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
        () => {
          // Refresh documents when any change happens
          fetchOrder()
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
        () => {
          // Refresh work documents when any change happens
          fetchOrder()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(docsChannel)
      supabase.removeChannel(workDocsChannel)
    }
  }, [orderId, isHydrated])

  const fetchOrder = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const supabase = getClient()

      // First fetch the order (needed to get service_package_id for subsequent queries)
      const { data: orderData, error: orderError } = await supabase
        .rpc('get_user_order', { p_order_id: orderId })

      if (orderError) throw orderError
      if (!orderData) throw new Error('Order not found')

      setOrder(orderData)

      const servicePackage = orderData.service_package as { id: string }

      // Fetch all other data in PARALLEL
      const [
        historyResult,
        docsResult,
        workDocsResult,
        responsesResult,
        questionsResult,
        invoiceResult
      ] = await Promise.all([
        // Stage history
        supabase
          .from('order_stage_history')
          .select('*')
          .eq('order_id', orderId)
          .order('created_at', { ascending: true }),
        // Documents
        supabase.rpc('initialize_order_documents', { p_order_id: orderId }),
        // Work documents
        supabase
          .from('order_work_documents')
          .select('*')
          .eq('order_id', orderId)
          .is('round_id', null)
          .order('created_at', { ascending: false }),
        // Questionnaire responses
        supabase
          .from('order_questionnaire_responses')
          .select('question_key, response_value')
          .eq('order_id', orderId),
        // Question labels (only if we have a service package)
        servicePackage?.id
          ? supabase
              .from('service_questionnaires')
              .select('question_key, question_label')
              .eq('service_package_id', servicePackage.id)
          : Promise.resolve({ data: null, error: null }),
        // Invoice
        supabase
          .from('invoices')
          .select('id')
          .eq('order_id', orderId)
          .single()
      ])

      setStageHistory(historyResult.data || [])
      setDocuments(docsResult.data || [])
      setWorkDocuments(workDocsResult.data || [])

      // Process questionnaire responses with labels
      if (responsesResult.data && responsesResult.data.length > 0) {
        const questionLabels = new Map(
          questionsResult.data?.map(q => [q.question_key, q.question_label]) || []
        )

        const formattedResponses = responsesResult.data.map(r => ({
          question_key: r.question_key,
          question_label: questionLabels.get(r.question_key) || r.question_key,
          response_value: r.response_value,
        }))

        setQuestionnaireResponses(formattedResponses)
      }

      if (invoiceResult.data) {
        setInvoiceId(invoiceResult.data.id)
      }
    } catch (err) {
      console.error('Failed to fetch order:', err)
      setError('Order not found')
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate progress stats
  const stats = useMemo(() => {
    const totalDocs = documents.length
    const uploadedDocs = documents.filter(d => d.uploaded_at).length
    const verifiedDocs = documents.filter(d => d.verified_at).length
    const pendingDocs = documents.filter(d => !d.uploaded_at)

    // Progress based on documents uploaded
    const docProgress = totalDocs > 0 ? Math.round((uploadedDocs / totalDocs) * 100) : 0

    // Calculate estimated completion
    const slaDays = order?.service_package?.sla_working_days || 7
    const createdAt = order?.created_at ? new Date(order.created_at) : new Date()

    // Check if customer has completed their part (questionnaire + documents)
    const hasQuestionnaireAnswers = questionnaireResponses.length > 0
    const questionnaireComplete = !!order?.questionnaire_completed_at && hasQuestionnaireAnswers
    const allDocsUploaded = uploadedDocs === totalDocs && totalDocs > 0
    const customerSetupComplete = questionnaireComplete && allDocsUploaded

    // SLA starts from when customer completes setup, not from order creation
    // If setup not complete, use TODAY as base (dates keep extending)
    // If setup complete, use the later of questionnaire completion or last doc upload
    let slaStartDate: Date
    if (customerSetupComplete) {
      // Find the latest completion date
      const questionnaireDate = order?.questionnaire_completed_at ? new Date(order.questionnaire_completed_at) : new Date()
      const lastDocUpload = documents
        .filter(d => d.uploaded_at)
        .sort((a, b) => new Date(b.uploaded_at!).getTime() - new Date(a.uploaded_at!).getTime())[0]
      const lastDocDate = lastDocUpload?.uploaded_at ? new Date(lastDocUpload.uploaded_at) : new Date()
      slaStartDate = questionnaireDate > lastDocDate ? questionnaireDate : lastDocDate
    } else {
      // Setup not complete - SLA starts from today (keeps extending)
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
  }, [order, documents, questionnaireResponses])

  // Calculate dynamic dates for each stage
  // Uses slaStartDate which extends until customer completes setup
  const calculateStageDate = (stageIndex: number, isStart: boolean = true) => {
    const baseDate = stats.slaStartDate
    const workflowStages = order?.service_package?.workflow_stages || []

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
  const timelineStages = useMemo(() => {
    const workflowStages = order?.service_package?.workflow_stages || []
    // Questionnaire is only truly complete if there are actual answers saved
    const hasQuestionnaireAnswers = questionnaireResponses.length > 0
    const questionnaireCompleted = !!order?.questionnaire_completed_at && hasQuestionnaireAnswers
    const allDocsUploaded = stats.uploadedDocs === stats.totalDocs && stats.totalDocs > 0

    return workflowStages.map((stage, index) => {
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
        isCurrent = !isCompleted && workflowStages.slice(0, index).every((_, i) => {
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
  }, [order, stats, stageHistory, documents, questionnaireResponses])

  const completedStagesCount = timelineStages.filter(s => s.isCompleted).length

  // Calculate active stage key for work documents filtering
  const activeStageKey = useMemo(() => {
    const workflowStages = order?.service_package?.workflow_stages || []
    // Find the current stage index (first incomplete stage, or last stage if all complete)
    const currentStageIndex = Math.min(completedStagesCount, workflowStages.length - 1)
    const currentStage = workflowStages[currentStageIndex]
    // Return the stage_key if it exists (added by Step 1d migration)
    return currentStage?.stage_key || null
  }, [order?.service_package?.workflow_stages, completedStagesCount])

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
        // PDF is being generated, show a message to the user
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

  if (isLoading || !isHydrated) {
    return (
      <div className="container py-12 max-w-5xl">
        <Skeleton className="h-9 w-32 mb-8" />
        <Skeleton className="h-8 w-64 mb-3" />
        <Skeleton className="h-5 w-48 mb-10" />
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-64 rounded-2xl" />
          </div>
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="container py-20 text-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-2xl font-semibold text-foreground mb-4">Order Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The order you're looking for doesn't exist or you don't have access to it.
        </p>
        <Link href="/orders">
          <Button>Back to Orders</Button>
        </Link>
      </div>
    )
  }

  const pendingDocsCount = stats.totalDocs - stats.uploadedDocs

  // Calculate pending work documents from professional
  const pendingWorkDocs = workDocuments.filter(d => d.direction === 'from_customer' && d.status === 'pending')
  const newDeliverables = workDocuments.filter(d => d.direction === 'to_customer')

  // Get work documents grouped by stage
  const getWorkDocsForStage = (stageKey: string) => {
    return workDocuments.filter(d => d.stage_key === stageKey)
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

      {/* Final Output Banner - absolute top */}
      <FinalOutputBanner orderId={orderId} />

      {/* Round Notification Banner */}
      <RoundNotificationBanner orderId={orderId} />

      {/* Notification Banner - Pending Work Documents */}
      {pendingWorkDocs.length > 0 && (
        <div className="mb-6 p-4 rounded-xl border border-amber-500/30 bg-amber-500/10">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <FileText className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground">
                Your CA has requested {pendingWorkDocs.length} document{pendingWorkDocs.length !== 1 ? 's' : ''}
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {pendingWorkDocs.map(d => d.document_label).join(', ')}
              </p>
            </div>
            <Button
              size="sm"
              className="flex-shrink-0 gap-1"
              onClick={() => {
                const workDocsSection = document.getElementById('work-documents-section')
                workDocsSection?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              <Upload className="h-4 w-4" />
              Upload Now
            </Button>
          </div>
        </div>
      )}

      {/* Notification Banner - New Deliverables */}
      {newDeliverables.length > 0 && pendingWorkDocs.length === 0 && (
        <div className="mb-6 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <Download className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground">
                Your CA has shared {newDeliverables.length} document{newDeliverables.length !== 1 ? 's' : ''}
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {newDeliverables.map(d => d.document_label).join(', ')}
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="flex-shrink-0 gap-1"
              onClick={() => {
                const workDocsSection = document.getElementById('work-documents-section')
                workDocsSection?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              <Download className="h-4 w-4" />
              View Documents
            </Button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-semibold text-foreground">
                {order.service_package?.name || 'Order'}
              </h1>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="text-muted-foreground">
              Order #{order.order_number} <span className="mx-2 text-muted-foreground/50">|</span> {formatDate(order.created_at)}
            </p>
          </div>

          {/* Continue Setup Button - shown until both questionnaire AND documents are complete */}
          {(() => {
            // Check if questionnaire has actual answers (not just a timestamp)
            const hasQuestionnaireAnswers = questionnaireResponses.length > 0
            const questionnaireComplete = !!order.questionnaire_completed_at && hasQuestionnaireAnswers
            const allDocsUploaded = stats.uploadedDocs === stats.totalDocs && stats.totalDocs > 0

            // Don't show if everything is done
            if (questionnaireComplete && allDocsUploaded) return null

            // Determine where to go and what context to show
            const needsQuestionnaire = !questionnaireComplete
            const needsDocs = !allDocsUploaded

            const targetPath = needsQuestionnaire
              ? `/orders/${order.id}/questionnaire`
              : `/orders/${order.id}/documents`

            // Determine the context label
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

        {/* Stats Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {/* Progress */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground font-mono">{stats.docProgress}%</p>
                  <p className="text-xs text-muted-foreground">Progress</p>
                </div>
              </div>
              <Progress value={stats.docProgress} className="h-1.5" />
            </CardContent>
          </Card>

          {/* Documents - Clickable */}
          <Card
            className="cursor-pointer hover:bg-muted/30 transition-colors"
            onClick={() => {
              if (stats.uploadedDocs === stats.totalDocs && stats.totalDocs > 0) {
                setDocumentsModalIndex(0)
                setShowDocumentsModal(true)
              } else {
                router.push(`/orders/${orderId}/documents`)
              }
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground font-mono">{stats.uploadedDocs}/{stats.totalDocs}</p>
                  <p className="text-xs text-muted-foreground">Documents</p>
                </div>
              </div>
              <Progress value={stats.totalDocs > 0 ? (stats.uploadedDocs / stats.totalDocs) * 100 : 0} className="h-1.5" />
            </CardContent>
          </Card>

          {/* Days Remaining */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground font-mono">
                    {stats.customerSetupComplete ? stats.daysRemaining : stats.slaDays}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs text-muted-foreground">
                      Days Left - {stats.estimatedCompletion.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
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
            </CardContent>
          </Card>

          {/* SLA */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Target className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground font-mono">{stats.slaDays}</p>
                  <p className="text-xs text-muted-foreground">Day SLA</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Overview Card */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                {order.service_package?.name || 'Order'}
              </h2>

              {/* Progress Bar Segments */}
              <div className="flex gap-1 mb-3">
                {timelineStages.map((stage, index) => (
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
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                  Stage {completedStagesCount + (timelineStages.some(s => s.isCurrent) ? 1 : 0)} of {timelineStages.length}
                </p>
                <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  {order.status === 'completed' ? 'Completed' : 'In Progress'}
                </span>
              </div>

              {/* Expected Completion */}
              <div className="pt-3 border-t border-border">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">
                    Expected completion: {stats.estimatedCompletion.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
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
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                Progress Timeline
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  {completedStagesCount} of {timelineStages.length} complete
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                {timelineStages.map((stage, index) => {
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
                            {/* Change title for questions stage based on completion and answers */}
                            {isQuestionsStage && stage.isCompleted
                              ? 'Answered the questionnaire'
                              : isQuestionsStage && stage.isCurrent
                              ? 'Answer the questionnaire'
                              : stage.title}
                          </h4>

                          {/* Show "View answers" badge when responses loaded */}
                          {isQuestionsStage && stage.isCompleted && questionnaireResponses.length > 0 && (
                            <button
                              onClick={() => setShowAnswersModal(true)}
                              className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground hover:bg-muted/80 transition-colors cursor-pointer"
                            >
                              {questionnaireResponses.length} answers
                            </button>
                          )}

                          {/* Always show "Edit answers" for completed questions stage */}
                          {isQuestionsStage && stage.isCompleted && (
                            <Link href={`/orders/${order.id}/questionnaire?edit=true`}>
                              <button className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground hover:bg-muted/80 transition-colors cursor-pointer">
                                Edit answers
                              </button>
                            </Link>
                          )}

                          {/* Show badge for in-progress questionnaire */}
                          {isQuestionsStage && stage.isCurrent && !stage.isCompleted && (
                            <Link href={`/orders/${order.id}/questionnaire`}>
                              <button className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground hover:bg-muted/80 transition-colors cursor-pointer">
                                {questionnaireResponses.length > 0 ? 'Continue where you left off' : 'Get started'}
                              </button>
                            </Link>
                          )}

                          {/* Show pending docs count for documents stage */}
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

                          {/* Upload/Change documents button beside the title */}
                          {isDocumentsStage && (stage.isCurrent || stage.isCompleted) && (
                            <Link href={`/orders/${order.id}/documents`}>
                              <button className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground hover:bg-muted/80 transition-colors cursor-pointer">
                                {stage.isCompleted ? 'Change documents' : 'Upload documents'}
                              </button>
                            </Link>
                          )}

                          {/* Work documents button for stages beyond initial docs (index > 1) */}
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
            </CardContent>
          </Card>

          {/* Rounds Timeline - admin-created rounds for additional info/docs */}
          {order.service_package?.id && (
            <RoundsTimeline orderId={orderId} servicePackageId={order.service_package.id} />
          )}

        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Assigned Professional */}
          {order.professional_id && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Assigned Professional
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
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
              </CardContent>
            </Card>
          )}

          {/* Order Summary - Collapsible */}
          <Card>
            <Collapsible open={summaryOpen} onOpenChange={setSummaryOpen}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                      Order Summary
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-mono">{formatPaisa(order.total_paisa_snapshot)}</span>
                      <ChevronDown className={cn(
                        'h-4 w-4 text-muted-foreground transition-transform',
                        summaryOpen && 'rotate-180'
                      )} />
                    </div>
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>

              {/* Quick Action: Work Documents (below Order Summary header) */}
              {order.professional_id && workDocuments.length > 0 && (
                <div className="px-6 pb-3 border-b border-border">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      const workDocsSection = document.getElementById('work-documents-section')
                      workDocsSection?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
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
                <CardContent className="space-y-6 pt-0">
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

                  {/* Key Dates */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Key Dates</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ordered</span>
                        <span className="text-foreground">{formatDate(order.created_at)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Est. Completion</span>
                        <span className="text-foreground font-medium">
                          {formatDate(stats.estimatedCompletion.toISOString())}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Submitted Work Documents */}
                  {workDocuments.filter(d => d.direction === 'from_customer' && d.file_url).length > 0 && (
                    <div className="space-y-2 pt-4 border-t border-border">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
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
                    <div className="space-y-2 pt-4 border-t border-border">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Received Deliverables
                      </p>
                      <div className="space-y-2">
                        {workDocuments
                          .filter(d => d.direction === 'to_customer')
                          .map(doc => (
                            <a
                              key={doc.id}
                              href={doc.file_url || '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors"
                            >
                              <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                              <span className="text-sm font-medium text-foreground truncate flex-1">
                                {doc.document_label}
                              </span>
                              <Download className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                            </a>
                          ))}
                      </div>
                    </div>
                  )}

                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Downloads */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Download className="h-4 w-4 text-muted-foreground" />
                Downloads
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
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
            </CardContent>
          </Card>

          {/* Work Documents Section */}
          <div id="work-documents-section">
            <WorkDocumentsSection
              orderId={orderId}
              workDocuments={workDocuments}
              onDocumentsUpdated={fetchOrder}
              hasProfessional={!!order.professional_id}
              activeStageKey={activeStageKey || undefined}
            />
          </div>

          {/* Chat with CA */}
          {order.chat_conversation_id ? (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  Chat with your CA
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[400px]">
                  <ChatWindow
                    conversationId={order.chat_conversation_id}
                    professionalName={(order.professional as { display_name?: string; full_name?: string })?.display_name || (order.professional as { full_name?: string })?.full_name || 'Your CA'}
                  />
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-6 text-center text-sm text-muted-foreground">
                Chat will be available once your order is assigned.
              </CardContent>
            </Card>
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
                  {isImage && currentDoc.file_url ? (
                    <Image
                      src={currentDoc.file_url}
                      alt={currentDoc.document_label}
                      width={600}
                      height={400}
                      className="max-h-[400px] w-auto object-contain"
                      unoptimized
                    />
                  ) : (
                    <div className="text-center p-8">
                      <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">PDF Document</p>
                      {currentDoc.file_url && (
                        <a
                          href={currentDoc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm mt-2 inline-block"
                        >
                          Open in new tab
                        </a>
                      )}
                    </div>
                  )}
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
