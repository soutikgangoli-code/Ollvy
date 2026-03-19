'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/lib/stores/auth-store'
import { Loader2, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

export function AuthModal() {
  const {
    isAuthModalOpen,
    authModalStep,
    authModalPhone,
    closeAuthModal,
    setAuthModalStep,
    setAuthModalPhone,
    sendOtp,
    verifyOtp,
    isLoading,
    lastOtpError,
    clearOtpError,
  } = useAuthStore()

  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [resendTimer, setResendTimer] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const phoneInputRef = useRef<HTMLInputElement>(null)

  // Focus phone input when modal opens
  useEffect(() => {
    if (isAuthModalOpen && authModalStep === 'phone') {
      setTimeout(() => phoneInputRef.current?.focus(), 100)
    }
  }, [isAuthModalOpen, authModalStep])

  // Focus first OTP input when switching to OTP step
  useEffect(() => {
    if (authModalStep === 'otp') {
      setTimeout(() => inputRefs.current[0]?.focus(), 100)
    }
  }, [authModalStep])

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  // Reset state when modal closes
  useEffect(() => {
    if (!isAuthModalOpen) {
      setPhone('')
      setOtp(['', '', '', '', '', ''])
      setResendTimer(0)
    }
  }, [isAuthModalOpen])

  const handleSendOtp = async () => {
    const cleanPhone = phone.replace(/\D/g, '')
    if (cleanPhone.length !== 10) return

    // Send just the 10-digit number (edge function expects no +91 prefix)
    const result = await sendOtp(cleanPhone)

    if (result.sent) {
      setAuthModalPhone(cleanPhone)
      setAuthModalStep('otp')
      setResendTimer(30)
    }
  }

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
    if (!authModalPhone) return

    const result = await verifyOtp(authModalPhone, code)

    if (result.session) {
      closeAuthModal()
    }
  }

  const handleResend = async () => {
    if (resendTimer > 0 || !authModalPhone) return

    const result = await sendOtp(authModalPhone)
    if (result.sent) {
      setResendTimer(30)
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    }
  }

  const handleBack = () => {
    setAuthModalStep('phone')
    setOtp(['', '', '', '', '', ''])
    clearOtpError()
  }

  // authModalPhone is now just 10 digits (no +91 prefix)
  const maskedPhone = authModalPhone ? `${authModalPhone.slice(0, 2)}****${authModalPhone.slice(-4)}` : ''

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={(open) => !open && closeAuthModal()}>
      <DialogContent className="max-w-[400px] p-0 gap-0 overflow-hidden">
        {authModalStep === 'phone' ? (
          // Phone Step
          <>
            <DialogHeader className="p-6 pb-4">
              <DialogTitle className="text-xl font-semibold text-foreground">
                Sign in to continue
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Enter your phone number to receive an OTP
              </DialogDescription>
            </DialogHeader>
            <div className="px-6 pb-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Phone Number</label>
                <div className="flex gap-2">
                  <div className="flex items-center justify-center px-3 rounded-md border border-input bg-muted text-muted-foreground text-sm font-medium">
                    +91
                  </div>
                  <Input
                    ref={phoneInputRef}
                    type="tel"
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10)
                      setPhone(value)
                      clearOtpError()
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && phone.length === 10) {
                        handleSendOtp()
                      }
                    }}
                    className="flex-1"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {lastOtpError && (
                <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 px-4 py-3 rounded-lg">
                  {lastOtpError}
                </div>
              )}

              <Button
                onClick={handleSendOtp}
                disabled={phone.length !== 10 || isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  'Continue'
                )}
              </Button>
            </div>
          </>
        ) : (
          // OTP Step
          <>
            <DialogHeader className="p-6 pb-4">
              <DialogTitle className="text-xl font-semibold text-foreground">
                Verify your phone
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                We sent a 6-digit code to +91 {maskedPhone}
              </DialogDescription>
            </DialogHeader>
            <div className="px-6 pb-6 space-y-6">
              {/* OTP Input */}
              <div className="flex justify-center gap-2">
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
                      "w-11 h-12 text-center text-lg font-semibold rounded-lg",
                      "bg-muted border border-input text-foreground",
                      "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
                      "transition-all duration-200",
                      "disabled:opacity-40"
                    )}
                    disabled={isLoading}
                  />
                ))}
              </div>

              {lastOtpError && (
                <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 px-4 py-3 rounded-lg text-center">
                  {lastOtpError}
                </div>
              )}

              {isLoading && (
                <div className="flex justify-center">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              )}

              {/* Resend */}
              <div className="text-center">
                {resendTimer > 0 ? (
                  <span className="text-sm text-muted-foreground">
                    Resend code in {resendTimer}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    disabled={isLoading}
                  >
                    Resend code
                  </button>
                )}
              </div>

              {/* Back button */}
              <Button
                variant="ghost"
                className="w-full text-muted-foreground hover:text-foreground"
                onClick={handleBack}
                disabled={isLoading}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Change phone number
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
