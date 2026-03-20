'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { QuestionnaireWizard } from '@/components/questionnaire'
import { getClient } from '@/lib/supabase'
import { useAuthStore } from '@/lib/stores/auth-store'
import { ArrowLeft, ClipboardList, HelpCircle, MessageCircle } from 'lucide-react'

interface OrderData {
  id: string
  order_number: string
  questionnaire_completed_at: string | null
  service_package: {
    name: string
    slug: string
  }
}

export default function QuestionnairePage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = params.id as string
  const forceEdit = searchParams.get('edit') === 'true'
  const { user, isHydrated } = useAuthStore()

  const [order, setOrder] = useState<OrderData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isHydrated) return

    if (!user) {
      router.push('/login')
      return
    }

    fetchOrder()
  }, [orderId, user, isHydrated, router])

  const fetchOrder = async () => {
    if (!orderId) return

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
      await supabase.auth.setSession({
        access_token: currentSession.access_token,
        refresh_token: currentSession.refresh_token,
      })

      // Use RPC function for reliable order fetching (bypasses RLS chain issues)
      const { data: orderData, error: fetchError } = await supabase
        .rpc('get_user_order', { p_order_id: orderId })

      if (fetchError) {
        console.error('Order fetch error:', fetchError)
        throw fetchError
      }

      // RPC returns null if order doesn't exist or user doesn't own it
      if (!orderData) {
        console.error('Order not found or access denied for order:', orderId)
        throw new Error('Order not found')
      }

      setOrder({
        id: orderData.id,
        order_number: orderData.order_number,
        questionnaire_completed_at: orderData.questionnaire_completed_at,
        service_package: orderData.service_package,
      })
    } catch (err) {
      console.error('Failed to fetch order:', err)
      setError('Order not found')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isHydrated || isLoading) {
    return (
      <div className="container py-12 max-w-2xl">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64 mb-8" />
        <Skeleton className="h-16 w-full mb-6" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground mb-4">Order not found</p>
        <Link href="/orders">
          <Button>View All Orders</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container py-12 max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <Link href={`/orders/${order.id}`}>
          <Button
            variant="ghost"
            className="gap-2 text-muted-foreground hover:text-foreground -ml-4 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Order
          </Button>
        </Link>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <ClipboardList className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground mb-1">
              Complete Setup
            </h1>
            <p className="text-muted-foreground">
              Order #{order.order_number} - {order.service_package?.name}
            </p>
          </div>
        </div>
      </div>

      {/* Questionnaire Wizard */}
      <QuestionnaireWizard orderId={orderId} forceEdit={forceEdit} />

      {/* Help Section */}
      <div className="mt-8 p-5 bg-muted/30 rounded-xl">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
            <HelpCircle className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-medium text-foreground mb-1">
              Need help?
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              If you're unsure about any question, our team is here to help.
            </p>
            <a
              href={`https://wa.me/919876543210?text=Hi, I need help with setup for order ${order.order_number}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm" className="gap-2">
                <MessageCircle className="h-4 w-4" />
                WhatsApp Us
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
