'use client'
import { useEffect, useState } from 'react'
import { getClient } from '@/lib/supabase'
import type { RoundNotification } from '@/lib/types'

interface RoundNotificationBannerProps {
  orderId: string
}

export function RoundNotificationBanner({ orderId }: RoundNotificationBannerProps) {
  const [notification, setNotification] = useState<RoundNotification | null>(null)
  const supabase = getClient()

  const fetchNotification = async () => {
    const { data } = await supabase
      .from('round_notifications')
      .select('*')
      .eq('order_id', orderId)
      .eq('is_dismissed', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    setNotification(data)
  }

  useEffect(() => {
    fetchNotification()
    const channel = supabase
      .channel(`round-notif-${orderId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'round_notifications',
        filter: `order_id=eq.${orderId}`,
      }, fetchNotification)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [orderId])

  if (!notification) return null

  const handleDismiss = async () => {
    await supabase
      .from('round_notifications')
      .update({ is_dismissed: true, dismissed_at: new Date().toISOString() })
      .eq('id', notification.id)
    fetchNotification() // refetch to surface next undismissed notification
  }

  return (
    <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4 flex justify-between items-start">
      <p className="text-blue-800 dark:text-blue-200 text-sm font-medium">{notification.message}</p>
      <button onClick={handleDismiss} className="text-blue-500 text-xs underline ml-4 shrink-0">
        Got it
      </button>
    </div>
  )
}
