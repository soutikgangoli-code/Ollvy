'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getEdgeFunctionUrl } from '@/lib/supabase'
import { useAuthStore } from '@/lib/stores/auth-store'
import { cn } from '@/lib/utils'
import {
  Crown,
  Check,
  X,
  ArrowRight,
  Calendar,
  Shield,
  Zap,
  Percent,
  Clock,
  FileText,
  Building2,
} from 'lucide-react'

declare global {
  interface Window {
    Razorpay: any
  }
}

const features = [
  {
    icon: Calendar,
    title: 'Compliance Calendar',
    description: 'Never miss a deadline with automated tracking',
    free: false,
    pro: true,
  },
  {
    icon: Building2,
    title: 'Business Health Score',
    description: 'Real-time compliance health monitoring',
    free: false,
    pro: true,
  },
  {
    icon: FileText,
    title: 'Invoice Vault',
    description: 'Access all your invoices in one place',
    free: false,
    pro: true,
  },
  {
    icon: Zap,
    title: 'Priority Assignment',
    description: 'Get assigned to professionals faster',
    free: false,
    pro: true,
  },
  {
    icon: Percent,
    title: '5% Discount',
    description: 'On all one-time service orders',
    free: false,
    pro: true,
  },
  {
    icon: Clock,
    title: 'First Retainer Free',
    description: 'First month free on your first retainer',
    free: false,
    pro: true,
  },
  {
    icon: Shield,
    title: 'Basic Support',
    description: 'Email and chat support',
    free: true,
    pro: true,
  },
]

export default function UpgradePage() {
  const router = useRouter()
  const { user, session, refreshSession } = useAuthStore()
  const [isProcessing, setIsProcessing] = useState(false)

  const isPro = user?.subscription_tier === 'pro'

  const handleUpgrade = async () => {
    if (!session?.access_token) {
      router.push('/login?returnUrl=/upgrade')
      return
    }

    setIsProcessing(true)

    try {
      // Create Razorpay subscription
      const response = await fetch(getEdgeFunctionUrl('create-razorpay-subscription'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          type: 'pro',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create subscription')
      }

      // Load Razorpay
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.async = true
      document.body.appendChild(script)

      script.onload = () => {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          subscription_id: data.subscriptionId,
          name: 'Ollvy',
          description: 'Pro Subscription',
          handler: async (response: any) => {
            // Verify payment
            await fetch(getEdgeFunctionUrl('verify-pro-subscription'), {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`,
              },
              body: JSON.stringify({
                razorpay_subscription_id: response.razorpay_subscription_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            })

            // Refresh user data
            await refreshSession()
            router.push('/compliance')
          },
          prefill: {
            contact: user?.phone,
          },
          theme: {
            color: '#10B981',
          },
        }

        const razorpay = new window.Razorpay(options)
        razorpay.open()
      }
    } catch (err) {
      console.error('Failed to start upgrade:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  if (isPro) {
    return (
      <div className="container py-12 max-w-lg">
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
            <Crown className="h-10 w-10 text-white/60" />
          </div>
          <h1 className="text-2xl font-semibold text-white mb-3">
            You're on Pro!
          </h1>
          <p className="text-white/50 mb-8">
            You already have access to all Pro features.
          </p>
          <div className="space-y-3">
            <Link href="/compliance">
              <Button className="gap-2">
                View Compliance Calendar
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/business" className="block">
              <Button variant="outline" className="gap-2">
                View Business Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-12 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-12">
        <Badge className="bg-white/10 text-white gap-1 mb-4">
          <Crown className="h-3 w-3" />
          Ollvy Pro
        </Badge>
        <h1 className="text-3xl font-semibold text-white mb-3">
          Upgrade to Pro
        </h1>
        <p className="text-lg text-white/50 max-w-xl mx-auto">
          Get complete visibility into your business compliance with automated tracking, reminders, and priority support.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {/* Free Plan */}
        <Card className="border-white/10 bg-white/[0.02]">
          <CardContent className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-1">Free</h3>
              <p className="text-sm text-white/40">Basic access to services</p>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold text-white">₹0</span>
              <span className="text-white/40">/month</span>
            </div>
            <ul className="space-y-3">
              {features.map((feature) => (
                <li key={feature.title} className="flex items-center gap-3">
                  {feature.free ? (
                    <Check className="h-4 w-4 text-white/50" />
                  ) : (
                    <X className="h-4 w-4 text-white/20" />
                  )}
                  <span className={cn(
                    'text-sm',
                    feature.free ? 'text-white/70' : 'text-white/30'
                  )}>
                    {feature.title}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Pro Plan */}
        <Card className="border-white/20 bg-white/[0.04] relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-white/10 px-3 py-1 text-xs font-medium text-white rounded-bl-lg">
            Popular
          </div>
          <CardContent className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
                <Crown className="h-4 w-4" />
                Pro
              </h3>
              <p className="text-sm text-white/40">Complete compliance management</p>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold text-white">₹999</span>
              <span className="text-white/40">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              {features.map((feature) => (
                <li key={feature.title} className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-white/60" />
                  <span className="text-sm text-white/70">{feature.title}</span>
                </li>
              ))}
            </ul>
            <Button
              className="w-full"
              size="lg"
              onClick={handleUpgrade}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Upgrade Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Feature Details */}
      <div className="grid md:grid-cols-3 gap-6">
        {features.filter(f => f.pro && !f.free).map((feature) => {
          const Icon = feature.icon
          return (
            <Card key={feature.title} className="border-white/10 bg-white/[0.02]">
              <CardContent className="p-5">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5 text-white/50" />
                </div>
                <h4 className="font-medium text-white mb-1">{feature.title}</h4>
                <p className="text-sm text-white/40">{feature.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
