'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { sendOtp, verifyOtp } from '@/lib/api'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resendTimer, setResendTimer] = useState(0)
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  // Auto-submit OTP when all 6 digits are entered
  useEffect(() => {
    const otpString = otp.join('')
    if (otpString.length === 6 && step === 'otp') {
      handleVerifyOtp()
    }
  }, [otp])

  const handleSendOtp = async () => {
    setError(null)
    setIsLoading(true)

    // Validate phone
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError('Please enter a valid 10-digit mobile number')
      setIsLoading(false)
      return
    }

    const { data, error: apiError } = await sendOtp(phone)

    setIsLoading(false)

    if (apiError) {
      setError(apiError)
      return
    }

    setStep('otp')
    setResendTimer(30)
    // Focus first OTP input
    setTimeout(() => otpInputRefs.current[0]?.focus(), 100)
  }

  const handleVerifyOtp = async () => {
    const otpString = otp.join('')

    if (otpString.length !== 6) {
      setError('Please enter the 6-digit OTP')
      return
    }

    setError(null)
    setIsLoading(true)

    const { data, error: apiError } = await verifyOtp(phone, otpString)

    if (apiError) {
      setError(apiError)
      setIsLoading(false)
      return
    }

    if (data?.session) {
      // Set the session in Supabase client
      const supabase = createClient()
      await supabase.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      })

      // Check if user is a professional
      const { data: professional } = await supabase
        .from('professionals')
        .select('id, status, onboarding_step')
        .eq('auth_user_id', data.session.user.id)
        .single()

      if (!professional) {
        // Create a new professional record
        const { data: newProfessional, error: createError } = await supabase
          .from('professionals')
          .insert({
            auth_user_id: data.session.user.id,
            phone,
            status: 'pending',
            onboarding_step: 0,
            strike_count: 0,
            is_available: true,
            max_concurrent_orders: 5,
          })
          .select('id')
          .single()

        if (createError) {
          setError('Failed to create professional account')
          setIsLoading(false)
          return
        }

        router.push('/onboarding/basics')
        return
      }

      // Redirect based on status
      if (professional.status === 'pending' || professional.status === 'pending_review') {
        if (professional.onboarding_step < 1) {
          router.push('/onboarding/basics')
        } else if (professional.onboarding_step < 2) {
          router.push('/onboarding/services')
        } else if (professional.onboarding_step < 3) {
          router.push('/onboarding/certifications')
        } else {
          router.push('/onboarding/pending')
        }
      } else if (professional.status === 'approved') {
        router.push('/dashboard')
      } else if (professional.status === 'rejected') {
        router.push('/onboarding/pending')
      } else {
        router.push('/dashboard')
      }
    }

    setIsLoading(false)
  }

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const newOtp = [...otp]
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i]
    }
    setOtp(newOtp)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-navy">Ollvy</h1>
          <p className="text-muted-text mt-1">Professional Panel</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {step === 'phone' ? (
            <>
              <h2 className="text-xl font-semibold text-body-text mb-6">
                Welcome back
              </h2>
              <p className="text-muted-text mb-6">
                Enter your mobile number to sign in
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-body-text mb-2">
                  Mobile Number
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-border bg-gray-50 text-muted-text">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="Enter 10-digit number"
                    className="flex-1 rounded-r-lg border border-border px-4 py-3 text-body-text"
                    maxLength={10}
                    autoFocus
                  />
                </div>
              </div>

              {error && (
                <p className="text-red text-sm mb-4">{error}</p>
              )}

              <button
                onClick={handleSendOtp}
                disabled={isLoading || phone.length !== 10}
                className={`w-full py-3 rounded-lg font-medium transition-colors ${
                  isLoading || phone.length !== 10
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-navy text-white hover:bg-navy-light'
                }`}
              >
                {isLoading ? 'Sending...' : 'Send OTP'}
              </button>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-body-text mb-2">
                Verify OTP
              </h2>
              <p className="text-muted-text mb-6">
                Enter the 6-digit code sent to +91 {phone}
              </p>

              <button
                onClick={() => {
                  setStep('phone')
                  setOtp(['', '', '', '', '', ''])
                  setError(null)
                }}
                className="text-navy text-sm mb-6 hover:underline"
              >
                Change number
              </button>

              <div className="flex justify-center gap-2 mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { otpInputRefs.current[index] = el }}
                    type="text"
                    inputMode="numeric"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={handleOtpPaste}
                    className="w-12 h-14 text-center text-xl font-semibold border border-border rounded-lg focus:border-navy focus:ring-2 focus:ring-navy/20"
                    maxLength={1}
                  />
                ))}
              </div>

              {error && (
                <p className="text-red text-sm mb-4 text-center">{error}</p>
              )}

              <button
                onClick={handleVerifyOtp}
                disabled={isLoading || otp.join('').length !== 6}
                className={`w-full py-3 rounded-lg font-medium transition-colors ${
                  isLoading || otp.join('').length !== 6
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-navy text-white hover:bg-navy-light'
                }`}
              >
                {isLoading ? 'Verifying...' : 'Verify & Sign In'}
              </button>

              <div className="mt-4 text-center">
                {resendTimer > 0 ? (
                  <p className="text-muted-text text-sm">
                    Resend OTP in {resendTimer}s
                  </p>
                ) : (
                  <button
                    onClick={handleSendOtp}
                    className="text-navy text-sm hover:underline"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {/* Dev bypass hint */}
        {process.env.NODE_ENV === 'development' && (
          <p className="text-center text-muted-text text-xs mt-4">
            Dev mode: Use phone ending in 0000 and OTP 000000
          </p>
        )}
      </div>
    </div>
  )
}
