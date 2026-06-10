'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getClient } from '@/lib/supabase'
import { useAuthStore } from '@/lib/stores/auth-store'
import { formatPaisa } from '@/lib/utils'
import {
  CheckCircle,
  FileUp,
  UserCheck,
  FileCheck,
  ArrowRight,
  Sparkles,
  MessageCircle,
  ClipboardList,
} from 'lucide-react'
import { getCompletionEstimate } from '@/lib/dates'
import { cn } from '@/lib/utils'
import { getWhatsAppLink } from '@/lib/constants'

interface OrderData {
  id: string
  order_number: string
  status: string
  total_paisa_snapshot: number
  questionnaire_completed_at: string | null
  service_package: {
    id: string
    name: string
    slug: string
    sla_working_days: number
    workflow_stages: Array<{
      stage_key: string
      stage_name: string
    }>
    // Completion estimate fields for govt processing awareness
    has_govt_processing?: boolean
    completion_max_days?: number | null
    completion_range_text?: string | null
  }
  documents_count?: number
  documents_uploaded?: number
  has_questionnaire?: boolean
}

export default function PaymentSuccessPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string
  const { user } = useAuthStore()

  const [order, setOrder] = useState<OrderData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    fetchOrder()
    // Hide confetti after animation
    const timer = setTimeout(() => setShowConfetti(false), 3000)
    return () => clearTimeout(timer)
  }, [orderId, user])

  const fetchOrder = async (retryCount = 0) => {
    if (!orderId) return

    try {
      const supabase = getClient()

      // Fetch order with service details
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          status,
          total_paisa_snapshot,
          questionnaire_completed_at,
          service_package:service_packages(
            id,
            name,
            slug,
            sla_working_days,
            workflow_stages,
            has_govt_processing,
            completion_max_days,
            completion_range_text
          )
        `)
        .eq('id', orderId)
        .single()

      if (orderError) {
        // Retry up to 3 times with exponential backoff (handles RLS race condition after payment)
        if (retryCount < 3) {
          console.log(`Order not found, retrying... (attempt ${retryCount + 1})`)
          const delay = 200 * Math.pow(2, retryCount) // 200ms, 400ms, 800ms
          await new Promise(resolve => setTimeout(resolve, delay))
          return fetchOrder(retryCount + 1)
        }
        throw orderError
      }

      const servicePackage = (orderData.service_package as unknown) as { id: string; name: string; slug: string; sla_working_days: number; workflow_stages: unknown[]; has_govt_processing?: boolean; completion_max_days?: number | null; completion_range_text?: string | null }

      // Fetch document counts and questionnaire count in parallel
      const [docsResult, questionResult] = await Promise.all([
        supabase
          .from('order_documents')
          .select('id, uploaded_at')
          .eq('order_id', orderId),
        supabase
          .from('service_questionnaires')
          .select('id', { count: 'exact', head: true })
          .eq('service_package_id', servicePackage.id)
          .eq('is_active', true)
      ])

      const docsData = docsResult.data
      const questionCount = questionResult.count

      const documentsCount = docsData?.length || 0
      const documentsUploaded = docsData?.filter(d => d.uploaded_at)?.length || 0

      setOrder({
        ...orderData,
        service_package: servicePackage as any,
        documents_count: documentsCount,
        documents_uploaded: documentsUploaded,
        has_questionnaire: (questionCount || 0) > 0,
      })
    } catch (err) {
      console.error('Failed to fetch order:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container py-20 max-w-2xl">
        <div className="text-center">
          <Skeleton className="h-20 w-20 rounded-full mx-auto mb-6" />
          <Skeleton className="h-8 w-64 mx-auto mb-4" />
          <Skeleton className="h-4 w-48 mx-auto" />
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground">Order not found</p>
        <Link href="/orders">
          <Button className="mt-4">View All Orders</Button>
        </Link>
      </div>
    )
  }

  const hasDocuments = (order.documents_count ?? 0) > 0
  const hasQuestionnaire = order.has_questionnaire && !order.questionnaire_completed_at
  const questionnaireCompleted = order.questionnaire_completed_at !== null

  // Determine next step URL
  const nextStepUrl = hasQuestionnaire
    ? `/orders/${order.id}/questionnaire`
    : `/orders/${order.id}/documents`

  return (
    <div className="container py-12 max-w-2xl">
      {/* Confetti Animation (CSS-based) */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <Sparkles
                className="h-4 w-4"
                style={{
                  color: ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899'][Math.floor(Math.random() * 4)],
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Success Header */}
      <div className="text-center mb-10">
        <div className="relative inline-block mb-6">
          <div className="w-20 h-20 rounded-full bg-[hsl(var(--ollvy-green))]/20 flex items-center justify-center animate-scale-in">
            <CheckCircle className="h-10 w-10 text-[hsl(var(--ollvy-green))]" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-[hsl(var(--ollvy-green))] rounded-full flex items-center justify-center animate-bounce-in">
            <Sparkles className="h-3 w-3 text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-foreground mb-2">
          Payment Successful!
        </h1>
        <p className="text-muted-foreground">
          Order <span className="font-mono">#{order.order_number}</span>
        </p>
      </div>

      {/* Order Summary Card */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-medium text-foreground">{order.service_package?.name}</h3>
              <p className="text-sm text-muted-foreground">Booked successfully</p>
            </div>
            <p className="font-mono text-lg font-semibold text-foreground">
              {formatPaisa(order.total_paisa_snapshot)}
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>A GST-compliant invoice has been sent to your email.</p>
          </div>
        </CardContent>
      </Card>

      {/* Next Step - Questionnaire or Document Upload */}
      {hasQuestionnaire ? (
        <Card className="mb-6 border-[hsl(var(--ollvy-green))] bg-[hsl(var(--ollvy-green))]/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[hsl(var(--ollvy-green))]/20 flex items-center justify-center flex-shrink-0">
                <ClipboardList className="h-6 w-6 text-[hsl(var(--ollvy-green))]" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground mb-1">
                  Next Step: Complete Setup
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Answer a few questions to help us prepare your {order.service_package?.name}.
                </p>
                <div className="flex gap-3">
                  <Link href={`/orders/${order.id}/questionnaire`}>
                    <Button className="gap-2">
                      <ClipboardList className="h-4 w-4" />
                      Start Setup
                    </Button>
                  </Link>
                  <Link href={`/orders/${order.id}`}>
                    <Button variant="outline">Do Later</Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : hasDocuments ? (
        <Card className="mb-6 border-[hsl(var(--ollvy-green))] bg-[hsl(var(--ollvy-green))]/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[hsl(var(--ollvy-green))]/20 flex items-center justify-center flex-shrink-0">
                <FileUp className="h-6 w-6 text-[hsl(var(--ollvy-green))]" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground mb-1">
                  Next Step: Upload Documents
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  We need {order.documents_count} documents to get started on your {order.service_package?.name}.
                </p>
                <div className="flex gap-3">
                  <Link href={`/orders/${order.id}/documents`}>
                    <Button className="gap-2">
                      <FileUp className="h-4 w-4" />
                      Upload Documents
                    </Button>
                  </Link>
                  <Link href={`/orders/${order.id}`}>
                    <Button variant="outline">Do Later</Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* What Happens Next */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-foreground mb-4">What happens next?</h2>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <UserCheck className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">Professional Assigned</p>
              <p className="text-sm text-muted-foreground">
                A verified professional will be assigned within 24 hours
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <FileCheck className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">Document Review</p>
              <p className="text-sm text-muted-foreground">
                Your documents will be reviewed within 1-2 working days
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">Guaranteed Completion</p>
              <p className="text-sm text-muted-foreground">
                {(() => {
                  const estimate = getCompletionEstimate(
                    order.service_package?.sla_working_days ?? 0,
                    order.service_package?.has_govt_processing ?? false,
                    order.service_package?.completion_max_days,
                    order.service_package?.completion_range_text
                  )
                  return estimate?.guaranteedDate
                    ? `Delivery by ${estimate.guaranteedDate}`
                    : `Your ${order.service_package?.name} will be completed in ${order.service_package?.sla_working_days} working days`
                })()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href={`/orders/${order.id}`} className="flex-1">
          <Button variant="outline" className="w-full gap-2">
            View Order Details
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <a
          href={getWhatsAppLink(`Hi, I just booked ${order.service_package?.name || 'a service'}. Order: ${order.order_number}`)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1"
        >
          <Button variant="outline" className="w-full gap-2">
            <MessageCircle className="h-4 w-4" />
            WhatsApp Us
          </Button>
        </a>
      </div>

      {/* Animation Styles */}
      <style jsx global>{`
        @keyframes confetti {
          0% {
            transform: translateY(-100%) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti linear forwards;
        }
        @keyframes scale-in {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.5s ease-out forwards;
        }
        @keyframes bounce-in {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.3);
          }
          100% {
            transform: scale(1);
          }
        }
        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out 0.3s forwards;
          transform: scale(0);
        }
      `}</style>
    </div>
  )
}
