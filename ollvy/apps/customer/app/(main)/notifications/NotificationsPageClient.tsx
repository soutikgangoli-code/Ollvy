'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getClient } from '@/lib/supabase'
import { useAuthStore } from '@/lib/stores/auth-store'
import { formatRelativeTime, cn } from '@/lib/utils'
import {
  Bell,
  CheckCheck,
  FileText,
  CreditCard,
  MessageSquare,
  AlertTriangle,
  Calendar,
  User,
} from 'lucide-react'

interface Notification {
  id: string
  user_id: string
  title: string
  body: string
  type: string
  data?: Record<string, any>
  read_at: string | null
  created_at: string
}

const notificationIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  order: FileText,
  payment: CreditCard,
  chat: MessageSquare,
  alert: AlertTriangle,
  reminder: Calendar,
  profile: User,
  default: Bell,
}

export function NotificationsPageClient() {
  const { user } = useAuthStore()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isMarkingAll, setIsMarkingAll] = useState(false)

  useEffect(() => {
    if (user?.id) {
      fetchNotifications()
    }
  }, [user?.id])

  const fetchNotifications = async () => {
    if (!user?.id) return

    setIsLoading(true)

    try {
      const supabase = getClient()

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error

      setNotifications(data || [])
    } catch (err) {
      console.error('Failed to fetch notifications:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const supabase = getClient()

      await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('id', notificationId)

      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, read_at: new Date().toISOString() } : n
        )
      )
    } catch (err) {
      console.error('Failed to mark notification as read:', err)
    }
  }

  const markAllAsRead = async () => {
    if (!user?.id) return

    setIsMarkingAll(true)

    try {
      const supabase = getClient()

      const unreadIds = notifications.filter(n => !n.read_at).map(n => n.id)

      if (unreadIds.length > 0) {
        await supabase
          .from('notifications')
          .update({ read_at: new Date().toISOString() })
          .in('id', unreadIds)

        setNotifications(prev =>
          prev.map(n => ({ ...n, read_at: n.read_at || new Date().toISOString() }))
        )
      }
    } catch (err) {
      console.error('Failed to mark all as read:', err)
    } finally {
      setIsMarkingAll(false)
    }
  }

  const unreadCount = notifications.filter(n => !n.read_at).length

  if (isLoading) {
    return (
      <div className="container py-12 max-w-2xl">
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container py-12 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
            <Bell className="h-5 w-5 text-white/60" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-white/40">{unreadCount} unread</p>
            )}
          </div>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            disabled={isMarkingAll}
            className="gap-2"
          >
            {isMarkingAll ? (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <CheckCheck className="h-4 w-4" />
            )}
            Mark all read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <Card className="border-white/10 bg-white/[0.02]">
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Bell className="h-8 w-8 text-white/20" />
            </div>
            <h3 className="font-medium text-white mb-2">No Notifications</h3>
            <p className="text-sm text-white/40">
              You'll see updates about your orders and services here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => {
            const Icon = notificationIcons[notification.type] || notificationIcons.default
            const isUnread = !notification.read_at

            return (
              <Card
                key={notification.id}
                className={cn(
                  'border-white/10 transition-all duration-200 cursor-pointer',
                  isUnread
                    ? 'bg-white/[0.04] hover:bg-white/[0.06]'
                    : 'bg-white/[0.02] hover:bg-white/[0.03]'
                )}
                onClick={() => !notification.read_at && markAsRead(notification.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                      isUnread ? 'bg-white/10' : 'bg-white/5'
                    )}>
                      <Icon className={cn('h-5 w-5', isUnread ? 'text-white/70' : 'text-white/40')} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className={cn(
                          'font-medium truncate',
                          isUnread ? 'text-white' : 'text-white/70'
                        )}>
                          {notification.title}
                        </h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {isUnread && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                          <span className="text-xs text-white/30">
                            {formatRelativeTime(notification.created_at)}
                          </span>
                        </div>
                      </div>
                      <p className={cn(
                        'text-sm mt-1 line-clamp-2',
                        isUnread ? 'text-white/60' : 'text-white/40'
                      )}>
                        {notification.body}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
