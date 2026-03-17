'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ChatWindow } from '@/components/chat/ChatWindow'
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge'
import { getClient } from '@/lib/supabase'
import type { Order } from '@/lib/types'
import { ArrowLeft, User } from 'lucide-react'

export default function OrderChatPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string

  const [order, setOrder] = useState<Order | null>(null)
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

      const { data, error: fetchError } = await supabase
        .from('orders')
        .select(`
          *,
          service_package:service_packages(name, slug),
          professional:professionals(id, full_name, professional_type, avatar_url)
        `)
        .eq('id', orderId)
        .single()

      if (fetchError) throw fetchError

      if (!data.chat_conversation_id) {
        setError('Chat not available for this order')
        setIsLoading(false)
        return
      }

      setOrder(data)
    } catch (err) {
      console.error('Failed to fetch order:', err)
      setError('Order not found')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-80px)] flex flex-col">
        {/* Header skeleton */}
        <div className="flex-shrink-0 border-b border-white/[0.06] px-4 py-3">
          <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <div className="flex-1">
              <Skeleton className="h-5 w-48 mb-1" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>
        {/* Messages skeleton */}
        <div className="flex-1 p-4 space-y-4">
          <div className="flex justify-start">
            <Skeleton className="h-16 w-48 rounded-2xl" />
          </div>
          <div className="flex justify-end">
            <Skeleton className="h-12 w-40 rounded-2xl" />
          </div>
        </div>
        {/* Input skeleton */}
        <div className="border-t border-white/[0.06] p-4">
          <Skeleton className="h-11 rounded-xl" />
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-2">
            {error || 'Chat not available'}
          </h2>
          <p className="text-white/40 mb-6">
            This order doesn't have an active chat.
          </p>
          <Link href={`/orders/${orderId}`}>
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Order
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col">
      {/* Chat Header */}
      <div className="flex-shrink-0 border-b border-white/[0.06] px-4 py-3 bg-[#0D0D0D]">
        <div className="flex items-center gap-4">
          <Link href={`/orders/${orderId}`}>
            <Button variant="ghost" size="icon-sm" className="text-white/50 hover:text-white">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>

          {order.professional ? (
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-medium flex-shrink-0">
                {order.professional.full_name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="font-medium text-white truncate">
                    {order.professional.full_name.split(' ')[0]}, Ollvy Compliance Team
                  </h2>
                </div>
                <p className="text-sm text-white/40 truncate">
                  {order.service_package?.name}
                </p>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>
          ) : (
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <User className="h-5 w-5 text-white/40" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-medium text-white truncate">
                  Ollvy Compliance Team
                </h2>
                <p className="text-sm text-white/40 truncate">
                  {order.service_package?.name}
                </p>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>
          )}
        </div>
      </div>

      {/* Chat Window */}
      {order.chat_conversation_id && (
        <ChatWindow
          conversationId={order.chat_conversation_id}
          professionalName={order.professional?.full_name}
        />
      )}
    </div>
  )
}
