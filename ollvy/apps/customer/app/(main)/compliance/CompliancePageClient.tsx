'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { getClient } from '@/lib/supabase'
import { useAuthStore } from '@/lib/stores/auth-store'
import { formatDate, cn } from '@/lib/utils'
import {
  Calendar,
  Clock,
  AlertTriangle,
  Check,
  ArrowRight,
  Bell,
} from 'lucide-react'

interface ComplianceObligation {
  id: string
  user_id: string
  obligation_type: string
  title: string
  description?: string
  due_date: string
  status: 'pending' | 'completed' | 'overdue' | 'snoozed'
  linked_service_id?: string
  created_at: string
}

const statusConfig = {
  pending: { label: 'Due', className: 'bg-white/10 text-white', icon: Clock },
  overdue: { label: 'Overdue', className: 'bg-white/10 text-white', icon: AlertTriangle },
  completed: { label: 'Done', className: 'bg-white/10 text-white/60', icon: Check },
  snoozed: { label: 'Snoozed', className: 'bg-white/10 text-white/50', icon: Bell },
}

export function CompliancePageClient() {
  const { user } = useAuthStore()
  const [obligations, setObligations] = useState<ComplianceObligation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasSeeded, setHasSeeded] = useState(false)

  useEffect(() => {
    if (user?.id) {
      seedAndFetchObligations()
    }
  }, [user?.id])

  const seedAndFetchObligations = async () => {
    if (!user?.id) return

    setIsLoading(true)

    try {
      const supabase = getClient()

      // Seed compliance obligations for this user (idempotent - won't duplicate)
      if (!hasSeeded) {
        await supabase.functions.invoke('seed-compliance-obligations')
        setHasSeeded(true)
      }

      // Fetch obligations
      const { data, error } = await supabase
        .from('compliance_obligations')
        .select('*')
        .eq('user_id', user.id)
        .order('due_date', { ascending: true })

      if (error) throw error

      setObligations(data || [])
    } catch (err) {
      console.error('Failed to fetch obligations:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="container py-12 max-w-2xl">
        <div className="flex items-center gap-3 mb-8">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  const pendingObligations = obligations.filter(o => o.status === 'pending' || o.status === 'overdue')
  const completedObligations = obligations.filter(o => o.status === 'completed')

  return (
    <div className="container py-12 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
          <Calendar className="h-5 w-5 text-white/60" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-white">Compliance Calendar</h1>
          <p className="text-sm text-white/40">
            {pendingObligations.length} upcoming deadlines
          </p>
        </div>
      </div>

      {/* Obligations List */}
      {obligations.length === 0 ? (
        <Card className="border-white/10 bg-white/[0.02]">
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-white/20" />
            </div>
            <h3 className="font-medium text-white mb-2">No Obligations Yet</h3>
            <p className="text-sm text-white/40 max-w-sm mx-auto">
              Complete your profile with business details to generate your compliance calendar.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Upcoming */}
          {pendingObligations.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-4">
                Upcoming
              </h2>
              <div className="space-y-3">
                {pendingObligations.map((obligation) => {
                  const config = statusConfig[obligation.status]
                  const StatusIcon = config.icon
                  const dueDate = new Date(obligation.due_date)
                  const isOverdue = obligation.status === 'overdue'

                  return (
                    <Card
                      key={obligation.id}
                      className={cn(
                        'border-white/10 transition-all duration-200',
                        isOverdue ? 'bg-white/[0.04]' : 'bg-white/[0.02]'
                      )}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className={cn(
                            'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                            isOverdue ? 'bg-white/10' : 'bg-white/5'
                          )}>
                            <StatusIcon className="h-5 w-5 text-white/50" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-medium text-white">
                                {obligation.title}
                              </h3>
                              <Badge className={config.className}>
                                {config.label}
                              </Badge>
                            </div>
                            {obligation.description && (
                              <p className="text-sm text-white/50 mt-1">
                                {obligation.description}
                              </p>
                            )}
                            <div className="flex items-center gap-4 mt-3">
                              <span className={cn(
                                'text-sm',
                                isOverdue ? 'text-white/70' : 'text-white/40'
                              )}>
                                Due: {formatDate(dueDate)}
                              </span>
                              {obligation.linked_service_id && (
                                <Link href={`/services/${obligation.linked_service_id}`}>
                                  <Button variant="outline" size="xs" className="gap-1">
                                    Book Now
                                    <ArrowRight className="h-3 w-3" />
                                  </Button>
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {/* Completed */}
          {completedObligations.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-4">
                Completed
              </h2>
              <div className="space-y-2">
                {completedObligations.map((obligation) => (
                  <Card
                    key={obligation.id}
                    className="border-white/10 bg-white/[0.01]"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                          <Check className="h-4 w-4 text-white/30" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white/50">{obligation.title}</h3>
                        </div>
                        <span className="text-xs text-white/30">
                          {formatDate(obligation.due_date)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
