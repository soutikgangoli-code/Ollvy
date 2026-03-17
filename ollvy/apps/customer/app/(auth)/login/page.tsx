'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/lib/stores/auth-store'
import { Loader2, ArrowRight } from 'lucide-react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnUrl = searchParams.get('returnUrl') || '/'

  const [phone, setPhone] = useState('')
  const { sendOtp, isLoading, lastOtpError, retryAfter, clearOtpError } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const cleanPhone = phone.replace(/\D/g, '')
    if (cleanPhone.length !== 10) {
      return
    }

    const result = await sendOtp(cleanPhone)

    if (result.sent) {
      sessionStorage.setItem('auth_phone', cleanPhone)
      sessionStorage.setItem('auth_returnUrl', returnUrl)
      router.push('/verify')
    }
  }

  const formatPhoneInput = (value: string) => {
    const digits = value.replace(/\D/g, '')
    return digits.slice(0, 10)
  }

  const isValidPhone = phone.replace(/\D/g, '').length === 10

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-[400px]">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <span className="text-3xl font-bold text-white">ollvy</span>
          </Link>
        </div>

        <Card className="border-white/[0.08]">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-semibold text-white">Welcome back</CardTitle>
            <CardDescription className="text-white/40 mt-2">
              Enter your phone number to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white/70 text-sm">Phone Number</Label>
                <div className="flex gap-3">
                  <div className="flex items-center justify-center w-16 bg-white/5 rounded-lg border border-white/10 text-sm font-medium text-white/50">
                    +91
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter 10-digit number"
                    value={phone}
                    onChange={(e) => {
                      setPhone(formatPhoneInput(e.target.value))
                      clearOtpError()
                    }}
                    className="flex-1"
                    disabled={isLoading}
                    autoComplete="tel"
                    autoFocus
                  />
                </div>
              </div>

              {lastOtpError && (
                <div className="text-sm text-white/70 bg-white/5 border border-white/10 px-4 py-3 rounded-lg">
                  {lastOtpError}
                  {retryAfter && (
                    <span className="block text-xs text-white/40 mt-1">
                      Try again in {retryAfter}s
                    </span>
                  )}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={!isValidPhone || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <p className="mt-8 text-center text-xs text-white/30 leading-relaxed">
              By continuing, you agree to our{' '}
              <Link href="/terms" className="text-white/50 hover:text-white/70 underline underline-offset-2">
                Terms
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-white/50 hover:text-white/70 underline underline-offset-2">
                Privacy Policy
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function LoginSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-10">
          <span className="text-3xl font-bold text-white">ollvy</span>
        </div>
        <Card className="border-white/[0.08]">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-semibold text-white">Welcome back</CardTitle>
            <CardDescription className="text-white/40 mt-2">Loading...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginForm />
    </Suspense>
  )
}
