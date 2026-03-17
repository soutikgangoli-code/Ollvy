'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { callFunction } from '@/lib/api'
import type { ProfessionalBankAccount } from '@/lib/types'

// IFSC lookup (simplified - in production, use a proper API)
const lookupIFSC = async (ifsc: string): Promise<{ bank_name: string; branch: string } | null> => {
  // Validate format: 4 letters + 0 + 6 alphanumeric
  if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc.toUpperCase())) {
    return null
  }

  // Common bank codes
  const bankCodes: Record<string, string> = {
    'HDFC': 'HDFC Bank',
    'ICIC': 'ICICI Bank',
    'SBIN': 'State Bank of India',
    'KKBK': 'Kotak Mahindra Bank',
    'UTIB': 'Axis Bank',
    'PUNB': 'Punjab National Bank',
    'BARB': 'Bank of Baroda',
    'CNRB': 'Canara Bank',
    'IOBA': 'Indian Overseas Bank',
    'IDIB': 'Indian Bank',
    'UBIN': 'Union Bank of India',
    'BKID': 'Bank of India',
  }

  const bankCode = ifsc.substring(0, 4).toUpperCase()
  const bankName = bankCodes[bankCode] || 'Bank'

  return {
    bank_name: bankName,
    branch: 'Branch',
  }
}

export default function BankDetailsPage() {
  const [bankAccount, setBankAccount] = useState<ProfessionalBankAccount | null>(null)
  const [isFetching, setIsFetching] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showAccountNumber, setShowAccountNumber] = useState(false)

  const [formData, setFormData] = useState({
    account_holder_name: '',
    account_number: '',
    confirm_account_number: '',
    ifsc_code: '',
    bank_name: '',
  })

  useEffect(() => {
    const fetchBankAccount = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) return

      // Get professional ID
      const { data: professional } = await supabase
        .from('professionals')
        .select('id')
        .eq('auth_user_id', session.user.id)
        .single()

      if (!professional) return

      // Fetch bank account
      const { data: bank } = await supabase
        .from('professional_bank_accounts')
        .select('*')
        .eq('professional_id', professional.id)
        .single()

      if (bank) {
        setBankAccount(bank)
        setFormData({
          account_holder_name: bank.account_holder_name || '',
          account_number: bank.account_number || '',
          confirm_account_number: '',
          ifsc_code: bank.ifsc_code || '',
          bank_name: bank.bank_name || '',
        })
      }

      setIsFetching(false)
    }

    fetchBankAccount()
  }, [])

  const handleIFSCChange = async (value: string) => {
    const upperValue = value.toUpperCase()
    setFormData({ ...formData, ifsc_code: upperValue, bank_name: '' })

    if (upperValue.length === 11) {
      const bankInfo = await lookupIFSC(upperValue)
      if (bankInfo) {
        setFormData((prev) => ({ ...prev, bank_name: bankInfo.bank_name }))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate
    if (!formData.account_holder_name.trim()) {
      setError('Account holder name is required')
      return
    }

    if (!formData.account_number || formData.account_number.length < 8) {
      setError('Please enter a valid account number')
      return
    }

    if (!bankAccount && formData.account_number !== formData.confirm_account_number) {
      setError('Account numbers do not match')
      return
    }

    if (!formData.ifsc_code || formData.ifsc_code.length !== 11) {
      setError('Please enter a valid 11-character IFSC code')
      return
    }

    setIsSubmitting(true)

    const { data, error: apiError } = await callFunction('save-bank-details', {
      account_holder_name: formData.account_holder_name.trim(),
      account_number: formData.account_number,
      ifsc_code: formData.ifsc_code,
      bank_name: formData.bank_name,
    })

    setIsSubmitting(false)

    if (apiError) {
      setError(apiError)
      return
    }

    // Refresh page to show updated status
    window.location.reload()
  }

  if (isFetching) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
        <div className="bg-white rounded-lg border border-border p-6 animate-pulse">
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  // If bank account exists and is verified, show read-only view
  if (bankAccount?.is_verified) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/settings/profile" className="text-muted-text hover:text-body-text">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-body-text">Bank Details</h1>
        </div>

        <div className="bg-green/10 border border-green rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium text-green">Bank account verified</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-border p-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-text">Account Holder Name</p>
              <p className="font-medium text-body-text">{bankAccount.account_holder_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-text">Account Number</p>
              <p className="font-mono text-body-text">
                •••• •••• {bankAccount.account_number?.slice(-4)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-text">IFSC Code</p>
              <p className="font-mono text-body-text">{bankAccount.ifsc_code}</p>
            </div>
            <div>
              <p className="text-sm text-muted-text">Bank Name</p>
              <p className="text-body-text">{bankAccount.bank_name || '-'}</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-sm text-muted-text">
              Need to change your bank details? Please contact support.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/settings/profile" className="text-muted-text hover:text-body-text">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-body-text">Bank Details</h1>
      </div>

      {/* Warning Banner */}
      <div className="bg-amber/10 border border-amber rounded-lg p-4">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-amber mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-medium text-body-text">
              Payouts blocked until bank details verified
            </p>
            <p className="text-sm text-muted-text mt-1">
              Add your bank account to receive Monday payouts. Verification usually takes 1 business day.
            </p>
          </div>
        </div>
      </div>

      {/* Pending Verification Banner */}
      {bankAccount && !bankAccount.is_verified && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-blue-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-medium text-blue-800">Under review</p>
              <p className="text-sm text-blue-700">
                Your bank details are being verified. Usually within 1 business day.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-lg border border-border p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-body-text mb-1">
              Account Holder Name <span className="text-red">*</span>
            </label>
            <input
              type="text"
              value={formData.account_holder_name}
              onChange={(e) => setFormData({ ...formData, account_holder_name: e.target.value })}
              placeholder="Name as on bank account"
              className="w-full rounded-lg border border-border px-4 py-3 text-body-text"
              disabled={bankAccount?.is_verified}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-body-text mb-1">
              Account Number <span className="text-red">*</span>
            </label>
            <div className="relative">
              <input
                type={showAccountNumber ? 'text' : 'password'}
                value={formData.account_number}
                onChange={(e) => setFormData({ ...formData, account_number: e.target.value.replace(/\D/g, '') })}
                placeholder="Enter account number"
                className="w-full rounded-lg border border-border px-4 py-3 text-body-text pr-12"
                disabled={bankAccount?.is_verified}
              />
              <button
                type="button"
                onClick={() => setShowAccountNumber(!showAccountNumber)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-text hover:text-body-text"
              >
                {showAccountNumber ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {!bankAccount && (
            <div>
              <label className="block text-sm font-medium text-body-text mb-1">
                Confirm Account Number <span className="text-red">*</span>
              </label>
              <input
                type="text"
                value={formData.confirm_account_number}
                onChange={(e) => setFormData({ ...formData, confirm_account_number: e.target.value.replace(/\D/g, '') })}
                placeholder="Re-enter account number"
                className="w-full rounded-lg border border-border px-4 py-3 text-body-text"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-body-text mb-1">
              IFSC Code <span className="text-red">*</span>
            </label>
            <input
              type="text"
              value={formData.ifsc_code}
              onChange={(e) => handleIFSCChange(e.target.value)}
              placeholder="e.g., HDFC0001234"
              maxLength={11}
              className="w-full rounded-lg border border-border px-4 py-3 text-body-text uppercase"
              disabled={bankAccount?.is_verified}
            />
          </div>

          {formData.bank_name && (
            <div>
              <label className="block text-sm font-medium text-body-text mb-1">
                Bank Name
              </label>
              <input
                type="text"
                value={formData.bank_name}
                readOnly
                className="w-full rounded-lg border border-border px-4 py-3 text-body-text bg-gray-50"
              />
            </div>
          )}

          {error && (
            <p className="text-red text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting || bankAccount?.is_verified}
            className={`w-full py-3 rounded-lg font-medium transition-colors ${
              isSubmitting || bankAccount?.is_verified
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-navy text-white hover:bg-navy-light'
            }`}
          >
            {isSubmitting ? 'Saving...' : bankAccount ? 'Update Bank Details' : 'Save Bank Details'}
          </button>
        </form>
      </div>
    </div>
  )
}
