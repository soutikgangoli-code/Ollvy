'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { getClient } from '@/lib/supabase'
import { useAuthStore } from '@/lib/stores/auth-store'
import {
  User,
  Building2,
  Phone,
  MapPin,
  Gift,
  Copy,
  Check,
  Loader2,
  Crown,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh',
]

function ProfileContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isSetup = searchParams.get('setup') === 'true'
  const { user, refreshSession } = useAuthStore()

  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [copied, setCopied] = useState(false)

  // Form state
  const [businessName, setBusinessName] = useState('')
  const [state, setState] = useState('')
  const [city, setCity] = useState('')
  const [gstin, setGstin] = useState('')

  useEffect(() => {
    if (!user) {
      router.push('/login?returnUrl=/profile')
      return
    }

    // Populate form with existing data
    setBusinessName(user.business_name || '')
    setState(user.state || '')
    setCity(user.city || '')
    setGstin(user.gstin || '')
  }, [user, router])

  const handleSave = async () => {
    if (!user) return

    setIsSaving(true)

    try {
      const supabase = getClient()

      const { error } = await supabase
        .from('users')
        .update({
          business_name: businessName,
          state,
          city,
          gstin,
        })
        .eq('id', user.id)

      if (error) throw error

      await refreshSession()

      if (isSetup) {
        router.push('/')
      }
    } catch (err) {
      console.error('Failed to save profile:', err)
    } finally {
      setIsSaving(false)
    }
  }

  const copyReferralCode = () => {
    if (!user?.referral_code) return
    navigator.clipboard.writeText(user.referral_code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!user) {
    return (
      <div className="container py-12 max-w-2xl">
        <Skeleton className="h-10 w-48 mb-8" />
        <Skeleton className="h-64 rounded-2xl mb-6" />
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="container py-12 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-1">
            {isSetup ? 'Complete Your Profile' : 'Profile'}
          </h1>
          <p className="text-white/40">
            {isSetup ? 'Tell us about your business to get started' : 'Manage your account settings'}
          </p>
        </div>
        {user.subscription_tier === 'pro' && (
          <Badge variant="default" className="gap-1.5">
            <Crown className="h-3 w-3" />
            Pro
          </Badge>
        )}
      </div>

      {/* Account Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <User className="h-5 w-5 text-white/40" />
            Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
              <span className="text-2xl font-semibold text-white">
                {businessName?.charAt(0) || user.phone?.charAt(0) || 'U'}
              </span>
            </div>
            <div>
              <p className="font-medium text-white">{businessName || 'Business Name'}</p>
              <div className="flex items-center gap-1.5 text-sm text-white/40">
                <Phone className="h-3.5 w-3.5" />
                +91 {user.phone}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-white/40" />
            Business Details
          </CardTitle>
          <CardDescription className="text-white/40">
            This information helps us provide accurate pricing and services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Business Name */}
          <div className="space-y-2">
            <Label htmlFor="businessName" className="text-white/70">Business Name</Label>
            <Input
              id="businessName"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Enter your business name"
            />
          </div>

          {/* State */}
          <div className="space-y-2">
            <Label htmlFor="state" className="text-white/70">State</Label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
              <select
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="flex h-11 w-full rounded-lg border border-white/10 bg-white/5 pl-11 pr-4 py-2 text-sm text-white placeholder:text-white/30 transition-all duration-200 focus:outline-none focus:border-white/25 focus:bg-white/[0.07] appearance-none"
              >
                <option value="" className="bg-[#1a1a1a]">Select your state</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s} className="bg-[#1a1a1a]">
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* City */}
          <div className="space-y-2">
            <Label htmlFor="city" className="text-white/70">City</Label>
            <Input
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter your city"
            />
          </div>

          {/* GSTIN */}
          <div className="space-y-2">
            <Label htmlFor="gstin" className="text-white/70">GSTIN (Optional)</Label>
            <Input
              id="gstin"
              value={gstin}
              onChange={(e) => setGstin(e.target.value.toUpperCase())}
              placeholder="22AAAAA0000A1Z5"
              maxLength={15}
            />
            <p className="text-xs text-white/30">
              For businesses registered under GST
            </p>
          </div>

          <Button onClick={handleSave} disabled={isSaving} className="w-full">
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Referral */}
      {user.referral_code && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Gift className="h-5 w-5 text-white/40" />
              Referral Program
            </CardTitle>
            <CardDescription className="text-white/40">
              Share your code and earn credits when friends sign up
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-white/5 rounded-lg px-4 py-3 font-mono text-lg text-white">
                {user.referral_code}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={copyReferralCode}
                className="h-12 w-12"
              >
                {copied ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <Copy className="h-5 w-5" />
                )}
              </Button>
            </div>
            {user.referral_credit_paisa > 0 && (
              <p className="text-sm text-white/50 mt-4">
                Current balance: <span className="text-white font-medium">{(user.referral_credit_paisa / 100).toFixed(2)}</span>
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="container py-12 max-w-2xl">
        <Skeleton className="h-10 w-48 mb-8" />
        <Skeleton className="h-64 rounded-2xl mb-6" />
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    }>
      <ProfileContent />
    </Suspense>
  )
}
