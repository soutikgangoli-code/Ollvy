'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { getClient, getEdgeFunctionUrl } from '@/lib/supabase'
import { useAuthStore } from '@/lib/stores/auth-store'
import { formatDate, formatPaisa, cn } from '@/lib/utils'
import {
  Building2,
  Lock,
  Crown,
  Check,
  FileText,
  Download,
  TrendingUp,
  AlertTriangle,
  Calendar,
  MapPin,
  Briefcase,
  ArrowRight,
} from 'lucide-react'

interface Invoice {
  id: string
  order_id?: string
  invoice_number: string
  total_paisa: number
  created_at: string
  order?: {
    service_package?: {
      name: string
    }[]
  }[]
}

export default function BusinessPage() {
  const { user, session } = useAuthStore()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const isPro = user?.subscription_tier === 'pro'
  const healthScore = user?.compliance_health_score || 0
  const profileScore = user?.profile_completeness_score || 0

  useEffect(() => {
    if (user?.id && isPro) {
      fetchInvoices()
    } else {
      setIsLoading(false)
    }
  }, [user?.id, isPro])

  const fetchInvoices = async () => {
    if (!user?.id) return

    setIsLoading(true)

    try {
      const supabase = getClient()

      const { data, error } = await supabase
        .from('invoices')
        .select(`
          id,
          invoice_number,
          total_paisa,
          created_at,
          order:orders(
            service_package:service_packages(name)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) throw error

      setInvoices(data || [])
    } catch (err) {
      console.error('Failed to fetch invoices:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadInvoice = async (invoiceId: string) => {
    try {
      const response = await fetch(getEdgeFunctionUrl('get-invoice-url'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ invoiceId }),
      })

      const { url } = await response.json()
      if (url) {
        window.open(url, '_blank')
      }
    } catch (err) {
      console.error('Failed to get invoice URL:', err)
    }
  }

  const getHealthColor = () => {
    if (healthScore >= 80) return 'text-white'
    if (healthScore >= 60) return 'text-white/80'
    if (healthScore >= 40) return 'text-white/60'
    return 'text-white/50'
  }

  const getHealthLabel = () => {
    if (healthScore >= 80) return 'Excellent'
    if (healthScore >= 60) return 'Good'
    if (healthScore >= 40) return 'Needs Attention'
    return 'Critical'
  }

  // Gate for non-Pro users
  if (!isPro) {
    return (
      <div className="container py-12 max-w-2xl">
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
            <Lock className="h-10 w-10 text-white/20" />
          </div>
          <h1 className="text-2xl font-semibold text-white mb-3">
            My Business
          </h1>
          <p className="text-white/50 max-w-md mx-auto mb-8">
            Get a complete overview of your business compliance health, access your invoice vault, and track your compliance history.
          </p>
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 max-w-sm mx-auto mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Crown className="h-5 w-5 text-white/60" />
              <span className="font-medium text-white">Ollvy Pro Feature</span>
            </div>
            <ul className="space-y-3 text-sm text-white/50 text-left">
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-white/40 mt-0.5" />
                Business health score
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-white/40 mt-0.5" />
                Invoice vault
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-white/40 mt-0.5" />
                Compliance history
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-white/40 mt-0.5" />
                Shareable business card
              </li>
            </ul>
          </div>
          <Link href="/upgrade">
            <Button size="lg" className="gap-2">
              <Crown className="h-4 w-4" />
              Upgrade to Pro
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="container py-12 max-w-3xl">
        <div className="flex items-center gap-3 mb-8">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
        <Skeleton className="h-64 rounded-2xl mt-6" />
      </div>
    )
  }

  return (
    <div className="container py-12 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
            <Building2 className="h-5 w-5 text-white/60" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white">My Business</h1>
            <p className="text-sm text-white/40">
              {user?.business_name || 'Your business overview'}
            </p>
          </div>
        </div>
        <Badge className="bg-white/10 text-white gap-1">
          <Crown className="h-3 w-3" />
          Pro
        </Badge>
      </div>

      {/* Health Score & Profile */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Health Score */}
        <Card className="border-white/10 bg-white/[0.02]">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="h-5 w-5 text-white/50" />
              <span className="text-sm font-medium text-white/50">Compliance Health</span>
            </div>
            <div className="text-center">
              <div className={cn('text-5xl font-bold mb-2', getHealthColor())}>
                {healthScore}
              </div>
              <div className="text-white/40 text-sm mb-4">{getHealthLabel()}</div>
              <div className="h-2 bg-white/10 rounded-full">
                <div
                  className="h-full bg-white/40 rounded-full transition-all"
                  style={{ width: `${healthScore}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Card */}
        <Card className="border-white/10 bg-white/[0.02]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-white/50">Business Details</span>
              <Link href="/profile">
                <Button variant="ghost" size="xs">Edit</Button>
              </Link>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Building2 className="h-4 w-4 text-white/30" />
                <span className="text-white">{user?.business_name || 'Not set'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Briefcase className="h-4 w-4 text-white/30" />
                <span className="text-white/70 capitalize">
                  {user?.business_type?.replace('_', ' ') || 'Not set'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-white/30" />
                <span className="text-white/70">
                  {user?.city ? `${user.city}, ${user.state}` : user?.state || 'Not set'}
                </span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/[0.06]">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/40">Profile completion</span>
                <span className="text-white">{profileScore}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoice Vault */}
      <Card className="border-white/10 bg-white/[0.02]">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-white/40" />
            Invoice Vault
          </CardTitle>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-10 w-10 text-white/10 mx-auto mb-3" />
              <p className="text-sm text-white/40">No invoices yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-white/30" />
                    </div>
                    <div>
                      <p className="font-medium text-white">
                        {invoice.invoice_number}
                      </p>
                      <p className="text-sm text-white/40">
                        {invoice.order?.[0]?.service_package?.[0]?.name || 'Service'} • {formatDate(invoice.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-white">
                      {formatPaisa(invoice.total_paisa)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleDownloadInvoice(invoice.id)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
