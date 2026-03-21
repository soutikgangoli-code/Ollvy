'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { getClient } from '@/lib/supabase'
import { useAuthStore } from '@/lib/stores/auth-store'
import { formatPaisa, formatDate } from '@/lib/utils'
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  FileText,
  Loader2,
  AlertCircle,
  Check,
  Timer,
} from 'lucide-react'

interface QuoteRequest {
  id: string
  status: 'pending' | 'quoted' | 'accepted' | 'expired' | 'rejected'
  state: string
  business_name: string
  additional_info: string
  quoted_price_paisa: number | null
  quoted_govt_fees_paisa: number | null
  quote_expires_at: string | null
  created_at: string
  service_package: {
    id: string
    name: string
    slug: string
    short_description: string
    sla_working_days: number
    price_gst_rate: number
  }
}

export default function QuoteDetailPage() {
  const params = useParams()
  const router = useRouter()
  const quoteId = params.id as string
  const { user, isHydrated, openAuthModal, isAuthModalOpen } = useAuthStore()

  const [quote, setQuote] = useState<QuoteRequest | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAccepting, setIsAccepting] = useState(false)
  const [timeLeft, setTimeLeft] = useState<string | null>(null)

  useEffect(() => {
    // Wait for auth to hydrate before checking user
    if (!isHydrated) return

    if (!user) {
      // Open auth modal instead of redirecting
      if (!isAuthModalOpen) {
        openAuthModal()
      }
      return
    }
    fetchQuote()
  }, [quoteId, user, isHydrated, openAuthModal, isAuthModalOpen])

  useEffect(() => {
    if (!quote?.quote_expires_at) return

    const updateTimer = () => {
      const expiry = new Date(quote.quote_expires_at!).getTime()
      const now = Date.now()
      const diff = expiry - now

      if (diff <= 0) {
        setTimeLeft('Expired')
        return
      }

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

      if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m left`)
      } else {
        setTimeLeft(`${minutes}m left`)
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 60000)
    return () => clearInterval(interval)
  }, [quote?.quote_expires_at])

  const fetchQuote = async () => {
    if (!quoteId) return

    setIsLoading(true)
    setError(null)

    try {
      const supabase = getClient()

      const { data, error: fetchError } = await supabase
        .from('quote_requests')
        .select(`
          *,
          service_package:service_packages(id, name, slug, short_description, sla_working_days, price_gst_rate)
        `)
        .eq('id', quoteId)
        .single()

      if (fetchError) throw fetchError

      setQuote(data)
    } catch (err) {
      console.error('Failed to fetch quote:', err)
      setError('Quote not found')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAcceptQuote = async () => {
    if (!quote || !user) return

    setIsAccepting(true)
    setError(null)

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/confirm-quote`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            quote_request_id: quote.id,
            user_id: user.id,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to accept quote')
      }

      // Redirect to checkout or order
      if (data.order_id) {
        router.push(`/orders/${data.order_id}`)
      } else {
        // Go through eligibility which handles redirect to checkout if no questions
        router.push(`/checkout/${quote.service_package.id}/eligibility?quote=${quote.id}`)
      }
    } catch (err: any) {
      console.error('Accept quote error:', err)
      setError(err.message || 'Failed to accept quote')
    } finally {
      setIsAccepting(false)
    }
  }

  const calculateTotal = () => {
    if (!quote?.quoted_price_paisa) return null

    const base = quote.quoted_price_paisa
    const govtFees = quote.quoted_govt_fees_paisa || 0
    const gstRate = quote.service_package.price_gst_rate || 18
    const gst = Math.round(base * (gstRate / 100))
    const total = base + govtFees + gst

    return { base, govtFees, gst, gstRate, total }
  }

  if (isLoading) {
    return (
      <div className="container py-12 max-w-2xl">
        <Skeleton className="h-9 w-32 mb-8" />
        <Skeleton className="h-8 w-64 mb-3" />
        <Skeleton className="h-5 w-full mb-8" />
        <Skeleton className="h-64 rounded-2xl mb-6" />
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    )
  }

  if (error || !quote) {
    return (
      <div className="container py-20 text-center">
        <AlertCircle className="h-12 w-12 text-white/30 mx-auto mb-4" />
        <h1 className="text-2xl font-semibold text-white mb-4">Quote Not Found</h1>
        <p className="text-white/40 mb-8">{error || 'The quote you\'re looking for doesn\'t exist.'}</p>
        <Link href="/services">
          <Button>Browse Services</Button>
        </Link>
      </div>
    )
  }

  const pricing = calculateTotal()
  const isQuoted = quote.status === 'quoted' && pricing
  const isExpired = quote.status === 'expired' || (quote.quote_expires_at && new Date(quote.quote_expires_at) < new Date())
  const isPending = quote.status === 'pending'

  const getStatusBadge = () => {
    switch (quote.status) {
      case 'pending':
        return <Badge variant="pending">Awaiting Quote</Badge>
      case 'quoted':
        return isExpired ? <Badge variant="secondary">Expired</Badge> : <Badge variant="active">Quote Ready</Badge>
      case 'accepted':
        return <Badge variant="completed">Accepted</Badge>
      case 'expired':
        return <Badge variant="secondary">Expired</Badge>
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return null
    }
  }

  return (
    <div className="container py-12 max-w-2xl">
      {/* Back Button */}
      <Link href="/services">
        <Button variant="ghost" className="mb-8 gap-2 text-white/50 hover:text-white -ml-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Services
        </Button>
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-2">Quote Request</h1>
          <p className="text-white/40">
            Submitted {formatDate(quote.created_at)}
          </p>
        </div>
        {getStatusBadge()}
      </div>

      {/* Service Info */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
              <FileText className="h-6 w-6 text-white/40" />
            </div>
            <div>
              <h3 className="font-medium text-white mb-1">{quote.service_package.name}</h3>
              <p className="text-sm text-white/40 mb-3">{quote.service_package.short_description}</p>
              <div className="flex items-center gap-4 text-sm text-white/50">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {quote.service_package.sla_working_days} working days
                </span>
                <span>State: {quote.state}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending State */}
      {isPending && (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6">
              <Loader2 className="h-8 w-8 text-white/30 animate-spin" />
            </div>
            <h3 className="font-medium text-white mb-2">Preparing Your Quote</h3>
            <p className="text-sm text-white/40 max-w-sm mx-auto">
              Our team is calculating exact pricing based on your state. You'll receive your quote within 2 hours.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Quoted State */}
      {isQuoted && !isExpired && pricing && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Your Quote</CardTitle>
              {timeLeft && (
                <div className="flex items-center gap-1.5 text-sm text-white/50">
                  <Timer className="h-4 w-4" />
                  {timeLeft}
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-white/50">Professional Fee</span>
                <span className="text-white">{formatPaisa(pricing.base)}</span>
              </div>
              {pricing.govtFees > 0 && (
                <div className="flex justify-between">
                  <span className="text-white/50">Government Fees ({quote.state})</span>
                  <span className="text-white">{formatPaisa(pricing.govtFees)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-white/50">GST ({pricing.gstRate}%)</span>
                <span className="text-white">{formatPaisa(pricing.gst)}</span>
              </div>
              <div className="border-t border-white/[0.06] pt-3 mt-3">
                <div className="flex justify-between font-semibold">
                  <span className="text-white">Total</span>
                  <span className="text-white text-xl">{formatPaisa(pricing.total)}</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white/70">
                {error}
              </div>
            )}

            <Button
              className="w-full"
              size="lg"
              onClick={handleAcceptQuote}
              disabled={isAccepting}
            >
              {isAccepting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Accept & Pay {formatPaisa(pricing.total)}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            <p className="text-xs text-white/30 text-center">
              This quote is valid for 48 hours from receipt
            </p>
          </CardContent>
        </Card>
      )}

      {/* Expired State */}
      {isExpired && (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-8 w-8 text-white/30" />
            </div>
            <h3 className="font-medium text-white mb-2">Quote Expired</h3>
            <p className="text-sm text-white/40 max-w-sm mx-auto mb-6">
              This quote has expired. Please request a new quote to get updated pricing.
            </p>
            <Link href={`/quote/request/${quote.service_package.id}`}>
              <Button>Request New Quote</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Accepted State */}
      {quote.status === 'accepted' && (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-6">
              <Check className="h-8 w-8 text-white" />
            </div>
            <h3 className="font-medium text-white mb-2">Quote Accepted</h3>
            <p className="text-sm text-white/40 max-w-sm mx-auto mb-6">
              You've accepted this quote. Check your orders for the status.
            </p>
            <Link href="/orders">
              <Button>View Orders</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
