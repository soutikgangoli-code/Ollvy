'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge'
import { DocumentPreview } from '@/components/documents'
import { getClient } from '@/lib/supabase'
import { formatPaisa, formatDate, cn } from '@/lib/utils'
import { useAuthStore } from '@/lib/stores/auth-store'
import type { Order, OrderStageHistory } from '@/lib/types'
import {
  ArrowLeft,
  MessageSquare,
  Download,
  FileText,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Upload,
  Eye,
  RefreshCw,
  Shield,
  AlertCircle,
  ChevronRight,
  Receipt,
  Check,
  Circle,
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

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string
  const { user, isHydrated } = useAuthStore()

  const [order, setOrder] = useState<Order | null>(null)
  const [stageHistory, setStageHistory] = useState<OrderStageHistory[]>([])
  const [documents, setDocuments] = useState<OrderDocument[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Preview modal state
  const [previewDoc, setPreviewDoc] = useState<{
    label: string
    url: string
    name?: string
  } | null>(null)

  useEffect(() => {
    if (orderId && isHydrated) {
      fetchOrder()
    }
  }, [orderId, isHydrated])

  const fetchOrder = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const supabase = getClient()
      const { data: { session: currentSession } } = await supabase.auth.getSession()

      if (!currentSession) {
        setError('Please log in to view this order')
        setIsLoading(false)
        return
      }

      await supabase.auth.setSession({
        access_token: currentSession.access_token,
        refresh_token: currentSession.refresh_token,
      })

      const { data: orderData, error: orderError } = await supabase
        .rpc('get_user_order', { p_order_id: orderId })

      if (orderError) throw orderError
      if (!orderData) throw new Error('Order not found')

      setOrder(orderData)

      const { data: historyData } = await supabase
        .from('order_stage_history')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: true })

      setStageHistory(historyData || [])

      // Use RPC for documents
      const { data: docsData } = await supabase
        .rpc('initialize_order_documents', { p_order_id: orderId })

      setDocuments(docsData || [])
    } catch (err) {
      console.error('Failed to fetch order:', err)
      setError('Order not found')
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate progress stats based on documents
  const stats = useMemo(() => {
    const totalDocs = documents.length
    const uploadedDocs = documents.filter(d => d.uploaded_at).length
    const verifiedDocs = documents.filter(d => d.verified_at).length
    const rejectedDocs = documents.filter(d => d.rejection_reason).length

    // Progress based on uploaded documents
    const docProgress = totalDocs > 0 ? Math.round((uploadedDocs / totalDocs) * 100) : 0

    // Calculate estimated completion
    const slaDays = order?.service_package?.sla_working_days || 7
    const createdAt = order?.created_at ? new Date(order.created_at) : new Date()
    const estimatedCompletion = new Date(createdAt)
    estimatedCompletion.setDate(estimatedCompletion.getDate() + slaDays)

    const today = new Date()
    const daysRemaining = Math.max(0, Math.ceil((estimatedCompletion.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))

    return {
      totalDocs,
      uploadedDocs,
      verifiedDocs,
      rejectedDocs,
      docProgress,
      estimatedCompletion,
      daysRemaining,
      slaDays,
    }
  }, [order, documents])

  // Build timeline stages based on actual progress
  const timelineStages = useMemo(() => {
    const workflowStages = order?.service_package?.workflow_stages || []
    const questionnaireCompleted = !!order?.questionnaire_completed_at
    const allDocsUploaded = stats.uploadedDocs === stats.totalDocs && stats.totalDocs > 0

    return workflowStages.map((stage, index) => {
      // Determine completion status based on stage
      let isCompleted = false
      let isCurrent = false

      // Stage 1: Answer questions
      if (index === 0) {
        isCompleted = questionnaireCompleted
        isCurrent = !questionnaireCompleted
      }
      // Stage 2: Upload documents
      else if (index === 1) {
        isCompleted = allDocsUploaded
        isCurrent = questionnaireCompleted && !allDocsUploaded
      }
      // Stage 3+: Check stage history
      else {
        const historyForStage = stageHistory.find(h =>
          h.stage_key === stage.title.toLowerCase().replace(/\s+/g, '_')
        )
        isCompleted = !!historyForStage?.completed_at
        isCurrent = !isCompleted && workflowStages.slice(0, index).every((_, i) => {
          if (i === 0) return questionnaireCompleted
          if (i === 1) return allDocsUploaded
          return !!stageHistory.find(h =>
            h.stage_key === workflowStages[i].title.toLowerCase().replace(/\s+/g, '_')
          )?.completed_at
        })
      }

      return { ...stage, isCompleted, isCurrent }
    })
  }, [order, stats, stageHistory])

  const completedStagesCount = timelineStages.filter(s => s.isCompleted).length

  const handleDownloadInvoice = () => {
    console.log('Download invoice')
  }

  const handlePreviewDocument = (doc: OrderDocument) => {
    if (doc.file_url) {
      setPreviewDoc({
        label: doc.document_label,
        url: doc.file_url,
        name: doc.file_name,
      })
    }
  }

  if (isLoading || !isHydrated) {
    return (
      <div className="py-24">
        <div className="container max-w-4xl">
          <Skeleton className="h-6 w-32 mb-12" />
          <div className="text-center mb-12">
            <Skeleton className="h-4 w-24 mx-auto mb-3" />
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-5 w-48 mx-auto" />
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            <Skeleton className="h-80 rounded-2xl" />
            <Skeleton className="h-80 rounded-2xl" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="py-24">
        <div className="container max-w-4xl text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-foreground mb-4">Order Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The order you're looking for doesn't exist or you don't have access to it.
          </p>
          <Link href="/orders">
            <Button>Back to Orders</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="py-24">
      <div className="container max-w-4xl">
        {/* Back Button */}
        <Link href="/orders">
          <Button variant="ghost" className="mb-12 gap-2 text-muted-foreground hover:text-foreground -ml-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Button>
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
            ORDER #{order.order_number}
          </p>
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="text-3xl md:text-4xl font-semibold text-foreground">
              {order.service_package?.name || 'Order'}
            </h1>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="text-muted-foreground">
            {formatDate(order.created_at)}
          </p>
        </div>

        {/* Progress Card */}
        <Card className="p-8 mb-8 bg-primary/5 border-primary/20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm font-medium text-foreground">Submission Progress</p>
              <p className="text-xs text-muted-foreground font-mono">
                {stats.uploadedDocs} of {stats.totalDocs} documents uploaded
              </p>
            </div>
            <span className="text-4xl font-bold font-mono text-foreground">
              {stats.docProgress}%
            </span>
          </div>
          <Progress value={stats.docProgress} className="h-2" />

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-border">
            {!order.questionnaire_completed_at ? (
              <Link href={`/orders/${order.id}/questionnaire`}>
                <Button className="gap-2">
                  Complete Setup
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : stats.uploadedDocs < stats.totalDocs ? (
              <Link href={`/orders/${order.id}/documents`}>
                <Button className="gap-2">
                  Upload Documents
                  <Upload className="h-4 w-4" />
                </Button>
              </Link>
            ) : null}

            <a
              href={`https://wa.me/919876543210?text=Hi, I need help with order ${order.order_number}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                WhatsApp Us
              </Button>
            </a>
          </div>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Timeline */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                Progress Timeline
              </h2>
              <span className="text-sm text-muted-foreground font-mono">
                {completedStagesCount}/{timelineStages.length}
              </span>
            </div>

            <div className="space-y-0">
              {timelineStages.map((stage, index) => (
                <div key={stage.step} className="flex gap-4">
                  {/* Icon Column */}
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors',
                        stage.isCompleted
                          ? 'bg-[hsl(var(--ollvy-green))] text-background'
                          : stage.isCurrent
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {stage.isCompleted ? (
                        <Check className="h-5 w-5" />
                      ) : stage.isCurrent ? (
                        <Clock className="h-5 w-5" />
                      ) : (
                        <Circle className="h-5 w-5" />
                      )}
                    </div>
                    {index < timelineStages.length - 1 && (
                      <div
                        className={cn(
                          'w-0.5 flex-1 my-2 min-h-[24px]',
                          stage.isCompleted ? 'bg-[hsl(var(--ollvy-green))]' : 'bg-border'
                        )}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-6">
                    <h4
                      className={cn(
                        'font-medium',
                        stage.isCompleted
                          ? 'text-foreground'
                          : stage.isCurrent
                          ? 'text-foreground'
                          : 'text-muted-foreground'
                      )}
                    >
                      {stage.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {stage.isCompleted ? (
                        <span className="text-[hsl(var(--ollvy-green))]">Completed</span>
                      ) : stage.isCurrent ? (
                        <span className="text-primary">In progress</span>
                      ) : (
                        stage.timeline
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Order Summary */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-6">
              <Receipt className="h-5 w-5 text-muted-foreground" />
              Order Summary
            </h2>

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
                <div className="flex justify-between text-[hsl(var(--ollvy-green))]">
                  <span>Pro Discount</span>
                  <span className="font-mono">-{formatPaisa(order.pro_discount_paisa_snapshot)}</span>
                </div>
              )}
              {order.promo_discount_paisa_snapshot > 0 && (
                <div className="flex justify-between text-[hsl(var(--ollvy-green))]">
                  <span>Promo Discount</span>
                  <span className="font-mono">-{formatPaisa(order.promo_discount_paisa_snapshot)}</span>
                </div>
              )}
              <div className="border-t border-border pt-3 mt-3">
                <div className="flex justify-between font-semibold">
                  <span className="text-foreground">Total Paid</span>
                  <span className="text-foreground text-xl font-mono">
                    {formatPaisa(order.total_paisa_snapshot)}
                  </span>
                </div>
              </div>
            </div>

            {/* Key Dates */}
            <div className="space-y-2 mt-6 pt-6 border-t border-border">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Key Dates</p>
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

            {/* Trust Signals */}
            <div className="space-y-2 mt-6 pt-6 border-t border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-[hsl(var(--ollvy-green))]" />
                <span>100% Money Back Guarantee</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-[hsl(var(--ollvy-green))]" />
                <span>Verified Professionals Only</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Documents Section */}
        {documents.length > 0 && (
          <Card className="p-6 mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                Documents
                {stats.rejectedDocs > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs bg-destructive/20 text-destructive rounded-full">
                    {stats.rejectedDocs} needs attention
                  </span>
                )}
              </h2>
              <Link href={`/orders/${order.id}/documents`}>
                <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                  Manage
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl border transition-colors",
                    doc.rejection_reason
                      ? "bg-destructive/5 border-destructive/20"
                      : doc.verified_at
                      ? "bg-[hsl(var(--ollvy-green))]/5 border-[hsl(var(--ollvy-green))]/20"
                      : doc.uploaded_at
                      ? "bg-muted/50 border-border"
                      : "bg-background border-border"
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {doc.rejection_reason ? (
                      <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0">
                        <XCircle className="h-5 w-5 text-destructive" />
                      </div>
                    ) : doc.verified_at ? (
                      <div className="w-10 h-10 rounded-full bg-[hsl(var(--ollvy-green))]/20 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="h-5 w-5 text-[hsl(var(--ollvy-green))]" />
                      </div>
                    ) : doc.uploaded_at ? (
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <Clock className="h-5 w-5 text-blue-500" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <Upload className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">{doc.document_label}</p>
                      <p className="text-xs text-muted-foreground">
                        {doc.rejection_reason ? (
                          <span className="text-destructive">{doc.rejection_reason}</span>
                        ) : doc.verified_at ? (
                          "Verified"
                        ) : doc.uploaded_at ? (
                          "Under review"
                        ) : doc.is_required ? (
                          "Required"
                        ) : (
                          "Optional"
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    {doc.file_url && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => handlePreviewDocument(doc)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    {(doc.rejection_reason || !doc.uploaded_at) && (
                      <Link href={`/orders/${order.id}/documents`}>
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                          {doc.rejection_reason ? <RefreshCw className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Downloads */}
        {order.razorpay_payment_id && (
          <Card className="p-6 mt-8">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-6">
              <Download className="h-5 w-5 text-muted-foreground" />
              Downloads
            </h2>

            <button
              onClick={handleDownloadInvoice}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors border border-border"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Receipt className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">Tax Invoice</p>
                  <p className="text-xs text-muted-foreground">GST compliant invoice</p>
                </div>
              </div>
              <Download className="h-4 w-4 text-muted-foreground" />
            </button>
          </Card>
        )}

        {/* WhatsApp Support */}
        <div className="text-center mt-12 pt-8 border-t border-border">
          <p className="text-muted-foreground mb-4">
            Need help with your order?
          </p>
          <a
            href={`https://wa.me/919876543210?text=Hi, I need help with order ${order.order_number}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              WhatsApp Us
            </Button>
          </a>
        </div>
      </div>

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
