'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge'
import { OrderTimeline } from '@/components/orders/OrderTimeline'
import { getClient } from '@/lib/supabase'
import { formatPaisa, formatDate } from '@/lib/utils'
import type { Order, OrderStageHistory } from '@/lib/types'
import {
  ArrowLeft,
  MessageSquare,
  Download,
  FileText,
  User,
  Calendar,
  Clock,
} from 'lucide-react'

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string

  const [order, setOrder] = useState<Order | null>(null)
  const [stageHistory, setStageHistory] = useState<OrderStageHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (orderId) {
      fetchOrder()
    }
  }, [orderId])

  const fetchOrder = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const supabase = getClient()

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select(`
          *,
          service_package:service_packages(*),
          professional:professionals(id, full_name, phone, email, professional_type, avatar_url, bio)
        `)
        .eq('id', orderId)
        .single()

      if (orderError) throw orderError

      setOrder(orderData)

      const { data: historyData } = await supabase
        .from('order_stage_history')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: true })

      setStageHistory(historyData || [])
    } catch (err) {
      console.error('Failed to fetch order:', err)
      setError('Order not found')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadInvoice = () => {
    // TODO: Implement invoice download
    console.log('Download invoice')
  }

  const handleDownloadEngagementLetter = () => {
    // TODO: Implement engagement letter download
    console.log('Download engagement letter')
  }

  const handleReportIssue = () => {
    // TODO: Implement report issue
    console.log('Report issue')
  }

  if (isLoading) {
    return (
      <div className="container py-12 max-w-4xl">
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
        <h1 className="text-2xl font-semibold text-white mb-4">Order Not Found</h1>
        <p className="text-white/40 mb-8">
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
    <div className="container py-12 max-w-4xl">
      {/* Back Button */}
      <Link href="/orders">
        <Button variant="ghost" className="mb-8 gap-2 text-white/50 hover:text-white -ml-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Button>
      </Link>

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-start gap-4 flex-wrap mb-3">
          <h1 className="text-2xl font-semibold text-white">
            {order.service_package?.name || 'Order'}
          </h1>
          <OrderStatusBadge status={order.status} />
        </div>
        <p className="text-white/40">
          Order #{order.order_number} <span className="mx-2 text-white/20">|</span> {formatDate(order.created_at)}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Professional Info */}
          {order.professional && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <User className="h-5 w-5 text-white/40" />
                  Your Professional
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white font-medium">
                    {order.professional.full_name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-white">{order.professional.full_name}</h3>
                    <p className="text-sm text-white/40 capitalize">
                      {order.professional.professional_type.replace('_', ' ')}
                    </p>
                    {order.professional.bio && (
                      <p className="text-sm text-white/50 mt-2">
                        {order.professional.bio}
                      </p>
                    )}
                  </div>
                  {order.chat_conversation_id && (
                    <Link href={`/orders/${order.id}/chat`}>
                      <Button variant="outline" size="sm" className="gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Chat
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Waitlisted Notice */}
          {order.status === 'waitlisted' && (
            <Card className="border-white/10 bg-white/[0.02]">
              <CardContent className="py-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-white/50" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-1">Finding Your Expert</h4>
                    <p className="text-sm text-white/40">
                      We're matching you with the best professional for your needs.
                      You'll be notified once assigned.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timeline */}
          {workflowStages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-white/40" />
                  Progress
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

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-white/40" />
                Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {/* Invoice */}
                {order.razorpay_payment_id && (
                  <div className="flex items-center justify-between py-3 border-b border-white/[0.06]">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-white/30" />
                      <span className="text-white/80">Invoice</span>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-2 text-white/50" onClick={handleDownloadInvoice}>
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                )}

                {/* Engagement Letter */}
                {order.status !== 'pending_assignment' &&
                  order.status !== 'waitlisted' && (
                    <div className="flex items-center justify-between py-3 border-b border-white/[0.06]">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-white/30" />
                        <span className="text-white/80">Engagement Letter</span>
                      </div>
                      <Button variant="ghost" size="sm" className="gap-2 text-white/50" onClick={handleDownloadEngagementLetter}>
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  )}

                {/* Placeholder if no documents */}
                {!order.razorpay_payment_id &&
                  (order.status === 'pending_assignment' ||
                    order.status === 'waitlisted') && (
                    <p className="text-sm text-white/30 py-6 text-center">
                      Documents will appear here once your order is processed.
                    </p>
                  )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Order Summary */}
        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/50">Professional Fee</span>
                  <span className="text-white">{formatPaisa(order.price_base_paisa_snapshot)}</span>
                </div>
                {order.price_govt_fees_paisa_snapshot > 0 && (
                  <div className="flex justify-between">
                    <span className="text-white/50">Government Fees</span>
                    <span className="text-white">{formatPaisa(order.price_govt_fees_paisa_snapshot)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-white/50">GST</span>
                  <span className="text-white">{formatPaisa(order.price_gst_paisa_snapshot)}</span>
                </div>
                {order.pro_discount_paisa_snapshot > 0 && (
                  <div className="flex justify-between text-white/60">
                    <span>Pro Discount</span>
                    <span>-{formatPaisa(order.pro_discount_paisa_snapshot)}</span>
                  </div>
                )}
                {order.promo_discount_paisa_snapshot > 0 && (
                  <div className="flex justify-between text-white/60">
                    <span>Promo Discount</span>
                    <span>-{formatPaisa(order.promo_discount_paisa_snapshot)}</span>
                  </div>
                )}
                <div className="border-t border-white/[0.06] pt-3 mt-3">
                  <div className="flex justify-between font-semibold">
                    <span className="text-white">Total Paid</span>
                    <span className="text-white text-lg">
                      {formatPaisa(order.total_paisa_snapshot)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Promo Code Used */}
              {order.promo_code_used && (
                <div className="text-sm bg-white/5 rounded-lg px-3 py-2">
                  <span className="text-white/40">Promo Code: </span>
                  <span className="font-medium text-white">{order.promo_code_used}</span>
                </div>
              )}

              {/* Action Buttons */}
              {order.status === 'in_progress' && order.chat_conversation_id && (
                <Link href={`/orders/${order.id}/chat`} className="block">
                  <Button className="w-full gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Open Chat
                  </Button>
                </Link>
              )}

              {order.status === 'in_progress' && (
                <Button variant="outline" className="w-full gap-2" onClick={handleReportIssue}>
                  Report Issue
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
