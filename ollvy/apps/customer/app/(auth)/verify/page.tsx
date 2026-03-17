'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/lib/stores/auth-store'
import { Loader2, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function VerifyPage() {
  const router = useRouter()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [phone, setPhone] = useState('')
  const [returnUrl, setReturnUrl] = useState('/')
  const [resendTimer, setResendTimer] = useState(30)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const { verifyOtp, sendOtp, isLoading, lastOtpError, isNewUser, clearOtpError } = useAuthStore()

  useEffect(() => {
    const storedPhone = sessionStorage.getItem('auth_phone')
    const storedReturnUrl = sessionStorage.getItem('auth_returnUrl')

    if (!storedPhone) {
      router.push('/login')
      return
    }

    setPhone(storedPhone)
    if (storedReturnUrl) setReturnUrl(storedReturnUrl)

    inputRefs.current[0]?.focus()
  }, [router])

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    clearOtpError()

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    if (newOtp.every(d => d) && newOtp.join('').length === 6) {
      handleVerify(newOtp.join(''))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)

    if (pastedData.length === 6) {
      const newOtp = pastedData.split('')
      setOtp(newOtp)
      inputRefs.current[5]?.focus()
      handleVerify(pastedData)
    }
  }

  const handleVerify = async (code: string) => {
    const result = await verifyOtp(phone, code)

    if (result.session) {
      sessionStorage.removeItem('auth_phone')
      sessionStorage.removeItem('auth_returnUrl')

      if (result.isNewUser) {
        // Redirect new users to onboarding flow
        router.push('/situations')
      } else {
        router.push(returnUrl)
      }
    }
  }

  const handleResend = async () => {
    if (resendTimer > 0) return

    const result = await sendOtp(phone)
    if (result.sent) {
      setResendTimer(30)
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    }
  }

  const maskedPhone = phone ? `${phone.slice(0, 2)}****${phone.slice(-4)}` : ''

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
            <CardTitle className="text-2xl font-semibold text-white">Verify your phone</CardTitle>
            <CardDescription className="text-white/40 mt-2">
              We sent a 6-digit code to +91 {maskedPhone}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-8">
              {/* OTP Input */}
              <div className="flex justify-center gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className={cn(
                      "w-12 h-14 text-center text-xl font-semibold rounded-xl",
                      "bg-white/5 border border-white/10 text-white",
                      "focus:outline-none focus:border-white/30 focus:bg-white/[0.08]",
                      "transition-all duration-200",
                      "disabled:opacity-40"
                    )}
                    disabled={isLoading}
                  />
                ))}
              </div>

              {lastOtpError && (
                <div className="text-sm text-white/70 bg-white/5 border border-white/10 px-4 py-3 rounded-lg text-center">
                  {lastOtpError}
                </div>
              )}

              {isLoading && (
                <div className="flex justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-white/50" />
                </div>
              )}

              {/* Resend */}
              <div className="text-center">
                {resendTimer > 0 ? (
                  <span className="text-sm text-white/40">
                    Resend code in {resendTimer}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                    disabled={isLoading}
                  >
                    Resend code
                  </button>
                )}
              </div>

              {/* Back to login */}
              <Button
                variant="ghost"
                className="w-full text-white/50 hover:text-white"
                onClick={() => {
                  sessionStorage.removeItem('auth_phone')
                  router.push('/login')
                }}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Change phone number
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
