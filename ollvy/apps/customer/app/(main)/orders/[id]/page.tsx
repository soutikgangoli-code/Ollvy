'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge'
import { OrderTimeline } from '@/components/orders/OrderTimeline'
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
  User,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Upload,
  Eye,
  RefreshCw,
  Shield,
  Phone,
  Mail,
  AlertCircle,
  ChevronRight,
  Sparkles,
  Receipt,
  Building2,
  Target,
  TrendingUp,
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
    // Wait for auth hydration before fetching
    if (orderId && isHydrated) {
      fetchOrder()
    }
  }, [orderId, isHydrated])

  const fetchOrder = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const supabase = getClient()

      // Get current session first
      const { data: { session: currentSession } } = await supabase.auth.getSession()

      if (!currentSession) {
        setError('Please log in to view this order')
        setIsLoading(false)
        return
      }

      // Explicitly set the session to ensure auth headers are included
      // This is important for RLS to work correctly
      await supabase.auth.setSession({
        access_token: currentSession.access_token,
        refresh_token: currentSession.refresh_token,
      })

      console.log('Fetching order with user auth_id:', currentSession.user.id)

      // Use RPC function for reliable order fetching (bypasses RLS chain issues)
      const { data: orderData, error: orderError } = await supabase
        .rpc('get_user_order', { p_order_id: orderId })

      if (orderError) {
        console.error('Order fetch error:', orderError.code, orderError.message, orderError.details)
        throw orderError
      }

      // RPC returns null if order doesn't exist or user doesn't own it
      if (!orderData) {
        console.error('Order not found or access denied for order:', orderId)
        throw new Error('Order not found')
      }

      setOrder(orderData)

      // Fetch stage history
      const { data: historyData } = await supabase
        .from('order_stage_history')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: true })

      setStageHistory(historyData || [])

      // Fetch documents
      const { data: docsData } = await supabase
        .from('order_documents')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: true })

      setDocuments(docsData || [])
    } catch (err) {
      console.error('Failed to fetch order:', err)
      setError('Order not found')
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate progress stats
  const stats = useMemo(() => {
    const workflowStages = order?.service_package?.workflow_stages || []
    const totalStages = workflowStages.length
    const completedStages = stageHistory.filter(h => h.completed_at).length

    const totalDocs = documents.length
    const uploadedDocs = documents.filter(d => d.uploaded_at).length
    const verifiedDocs = documents.filter(d => d.verified_at).length
    const rejectedDocs = documents.filter(d => d.rejection_reason).length

    const stageProgress = totalStages > 0 ? Math.round((completedStages / totalStages) * 100) : 0
    const docProgress = totalDocs > 0 ? Math.round((verifiedDocs / totalDocs) * 100) : 0

    // Calculate estimated completion
    const slaDays = order?.service_package?.sla_working_days || 7
    const createdAt = order?.created_at ? new Date(order.created_at) : new Date()
    const estimatedCompletion = new Date(createdAt)
    estimatedCompletion.setDate(estimatedCompletion.getDate() + slaDays)

    // Days remaining
    const today = new Date()
    const daysRemaining = Math.max(0, Math.ceil((estimatedCompletion.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))

    return {
      totalStages,
      completedStages,
      stageProgress,
      totalDocs,
      uploadedDocs,
      verifiedDocs,
      rejectedDocs,
      docProgress,
      estimatedCompletion,
      daysRemaining,
      slaDays,
    }
  }, [order, stageHistory, documents])

  const handleDownloadInvoice = () => {
    // TODO: Implement invoice download
    console.log('Download invoice')
  }

  const handleDownloadEngagementLetter = () => {
    // TODO: Implement engagement letter download
    console.log('Download engagement letter')
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

  const workflowStages = order.service_package?.workflow_stages || []

  return (
    <div className="container py-12 max-w-5xl">
      {/* Back Button */}
      <Link href="/orders">
        <Button variant="ghost" className="mb-8 gap-2 text-muted-foreground hover:text-foreground -ml-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Button>
      </Link>

      {/* Header with Stats */}
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

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            {order.chat_conversation_id && (
              <Link href={`/orders/${order.id}/chat`}>
                <Button variant="outline" size="sm" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Chat
                </Button>
              </Link>
            )}
            <Link href={`/orders/${order.id}/documents`}>
              <Button size="sm" className="gap-2">
                <Upload className="h-4 w-4" />
                Upload Documents
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {/* Progress */}
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[hsl(var(--ollvy-green))]/20 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-[hsl(var(--ollvy-green))]" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground font-mono">{stats.stageProgress}%</p>
                  <p className="text-xs text-muted-foreground">Progress</p>
                </div>
              </div>
              <Progress value={stats.stageProgress} className="h-1.5" />
            </CardContent>
          </Card>

          {/* Documents */}
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground font-mono">{stats.uploadedDocs}/{stats.totalDocs}</p>
                  <p className="text-xs text-muted-foreground">Documents</p>
                </div>
              </div>
              <Progress value={stats.docProgress} className="h-1.5" />
            </CardContent>
          </Card>

          {/* Days Remaining */}
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground font-mono">{stats.daysRemaining}</p>
                  <p className="text-xs text-muted-foreground">Days Left (Est.)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SLA */}
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Target className="h-5 w-5 text-purple-500" />
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
          {/* Professional Info - Enhanced */}
          {order.professional ? (
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-[hsl(var(--ollvy-green))]/10 to-transparent p-6">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="relative">
                    {order.professional.avatar_url ? (
                      <img
                        src={order.professional.avatar_url}
                        alt={order.professional.full_name}
                        className="w-16 h-16 rounded-full object-cover ring-2 ring-background"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-[hsl(var(--ollvy-green))]/20 flex items-center justify-center text-[hsl(var(--ollvy-green))] text-xl font-semibold ring-2 ring-background">
                        {order.professional.full_name.charAt(0)}
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[hsl(var(--ollvy-green))] rounded-full flex items-center justify-center ring-2 ring-background">
                      <CheckCircle2 className="h-3 w-3 text-background" />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground text-lg">{order.professional.full_name}</h3>
                      <Shield className="h-4 w-4 text-[hsl(var(--ollvy-green))]" />
                    </div>
                    <p className="text-sm text-muted-foreground capitalize mb-3">
                      {order.professional.professional_type.replace('_', ' ')}
                    </p>

                    {/* Contact Buttons */}
                    <div className="flex flex-wrap gap-2">
                      {order.professional.phone && (
                        <a href={`tel:${order.professional.phone}`}>
                          <Button variant="outline" size="sm" className="gap-2 h-8">
                            <Phone className="h-3.5 w-3.5" />
                            Call
                          </Button>
                        </a>
                      )}
                      {order.professional.email && (
                        <a href={`mailto:${order.professional.email}`}>
                          <Button variant="outline" size="sm" className="gap-2 h-8">
                            <Mail className="h-3.5 w-3.5" />
                            Email
                          </Button>
                        </a>
                      )}
                      {order.chat_conversation_id && (
                        <Link href={`/orders/${order.id}/chat`}>
                          <Button size="sm" className="gap-2 h-8">
                            <MessageSquare className="h-3.5 w-3.5" />
                            Chat Now
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                {order.professional.bio && (
                  <p className="text-sm text-muted-foreground mt-4 pl-20">
                    {order.professional.bio}
                  </p>
                )}
              </div>
            </Card>
          ) : (
            /* Waitlisted Notice - Enhanced */
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500/10 to-transparent p-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-7 w-7 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-lg mb-1">Finding Your Expert</h3>
                    <p className="text-muted-foreground mb-4">
                      We're matching you with the best professional for your needs. You'll receive a notification once assigned.
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <Sparkles className="h-4 w-4 text-amber-500" />
                      <span className="text-muted-foreground">Usually within 24 hours</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Documents Section - Enhanced */}
          {documents.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  Documents
                  {stats.rejectedDocs > 0 && (
                    <span className="ml-2 px-2 py-0.5 text-xs bg-destructive/20 text-destructive rounded-full">
                      {stats.rejectedDocs} needs attention
                    </span>
                  )}
                </CardTitle>
                <Link href={`/orders/${order.id}/documents`}>
                  <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                    Manage All
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {documents.slice(0, 5).map((doc) => (
                    <div
                      key={doc.id}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg",
                        doc.rejection_reason
                          ? "bg-destructive/10 border border-destructive/20"
                          : doc.verified_at
                          ? "bg-[hsl(var(--ollvy-green))]/5 border border-[hsl(var(--ollvy-green))]/20"
                          : doc.uploaded_at
                          ? "bg-muted/50"
                          : "bg-muted/30"
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Status Icon */}
                        {doc.rejection_reason ? (
                          <div className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0">
                            <XCircle className="h-4 w-4 text-destructive" />
                          </div>
                        ) : doc.verified_at ? (
                          <div className="w-8 h-8 rounded-full bg-[hsl(var(--ollvy-green))]/20 flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 className="h-4 w-4 text-[hsl(var(--ollvy-green))]" />
                          </div>
                        ) : doc.uploaded_at ? (
                          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                            <Clock className="h-4 w-4 text-blue-500" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                            <Upload className="h-4 w-4 text-muted-foreground" />
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

                      {/* Actions */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {doc.file_url && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handlePreviewDocument(doc)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        {(doc.rejection_reason || !doc.uploaded_at) && (
                          <Link href={`/orders/${order.id}/documents`}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              {doc.rejection_reason ? <RefreshCw className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}

                  {documents.length > 5 && (
                    <Link href={`/orders/${order.id}/documents`}>
                      <Button variant="ghost" className="w-full mt-2 text-muted-foreground">
                        View All {documents.length} Documents
                      </Button>
                    </Link>
                  )}

                  {documents.length === 0 && (
                    <div className="text-center py-8">
                      <FileText className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
                      <p className="text-muted-foreground">No documents required yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timeline - Enhanced */}
          {workflowStages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  Progress Timeline
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    {stats.completedStages} of {stats.totalStages} complete
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <OrderTimeline
                  stages={workflowStages}
                  stageHistory={stageHistory}
                />
              </CardContent>
            </Card>
          )}

          {/* Downloads */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5 text-muted-foreground" />
                Downloads
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {/* Invoice */}
              {order.razorpay_payment_id && (
                <button
                  onClick={handleDownloadInvoice}
                  className="w-full flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
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
              )}

              {/* Engagement Letter */}
              {order.status !== 'pending_assignment' && order.status !== 'waitlisted' && (
                <button
                  onClick={handleDownloadEngagementLetter}
                  className="w-full flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-foreground">Engagement Letter</p>
                      <p className="text-xs text-muted-foreground">Service agreement</p>
                    </div>
                  </div>
                  <Download className="h-4 w-4 text-muted-foreground" />
                </button>
              )}

              {/* Placeholder */}
              {!order.razorpay_payment_id &&
                (order.status === 'pending_assignment' || order.status === 'waitlisted') && (
                  <div className="text-center py-8">
                    <Download className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
                    <p className="text-muted-foreground">Documents will appear here once your order is processed</p>
                  </div>
                )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary - Enhanced */}
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
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
                    <span className="text-foreground text-lg font-mono">
                      {formatPaisa(order.total_paisa_snapshot)}
                    </span>
                  </div>
                </div>
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

              {/* Trust Signals */}
              <div className="space-y-2 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Shield className="h-3.5 w-3.5 text-[hsl(var(--ollvy-green))]" />
                  <span>100% Money Back Guarantee</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[hsl(var(--ollvy-green))]" />
                  <span>Verified Professionals Only</span>
                </div>
              </div>

              {/* Help */}
              <div className="pt-4 border-t border-border">
                <a
                  href={`https://wa.me/919876543210?text=Hi, I need help with order ${order.order_number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button variant="outline" className="w-full gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Need Help?
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
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
