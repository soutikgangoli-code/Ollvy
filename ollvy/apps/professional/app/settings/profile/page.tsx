'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { callFunction } from '@/lib/api'
import type { Professional, ProfessionalCertification, ProfessionType } from '@/lib/types'

const LANGUAGES = [
  'English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam',
  'Marathi', 'Gujarati', 'Bengali', 'Punjabi', 'Odia', 'Assamese'
]

export default function ProfileSettingsPage() {
  const [professional, setProfessional] = useState<Professional | null>(null)
  const [certifications, setCertifications] = useState<ProfessionalCertification[]>([])
  const [isFetching, setIsFetching] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Leave management
  const [showLeaveModal, setShowLeaveModal] = useState(false)
  const [leaveStart, setLeaveStart] = useState('')
  const [leaveEnd, setLeaveEnd] = useState('')
  const [isSettingLeave, setIsSettingLeave] = useState(false)
  const [onLeaveUntil, setOnLeaveUntil] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    bio: '',
    experience_years: '',
    languages: [] as string[],
    max_concurrent_orders: 5,
  })

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) return

      // Fetch professional
      const { data: prof } = await supabase
        .from('professionals')
        .select('*')
        .eq('auth_user_id', session.user.id)
        .single()

      if (prof) {
        setProfessional(prof)
        setFormData({
          bio: prof.bio || '',
          experience_years: prof.experience_years?.toString() || '',
          languages: prof.languages || [],
          max_concurrent_orders: prof.max_concurrent_orders || 5,
        })

        // Fetch certifications
        const { data: certs } = await supabase
          .from('professional_certifications')
          .select('*')
          .eq('professional_id', prof.id)

        setCertifications(certs || [])

        // Fetch leave status
        const { data: availability } = await supabase
          .from('professional_availability')
          .select('on_leave_until')
          .eq('professional_id', prof.id)
          .single()

        if (availability?.on_leave_until) {
          const leaveDate = new Date(availability.on_leave_until)
          if (leaveDate > new Date()) {
            setOnLeaveUntil(availability.on_leave_until)
          }
        }
      }

      setIsFetching(false)
    }

    fetchData()
  }, [])

  const handleSaveProfile = async () => {
    setError(null)
    setSuccess(null)
    setIsSaving(true)

    const { error: apiError } = await callFunction('update-professional-profile', {
      step: 4,
      data: {
        bio: formData.bio.trim(),
        years_experience: parseInt(formData.experience_years) || 0,
        languages: formData.languages,
        max_concurrent_orders: formData.max_concurrent_orders,
      },
    })

    setIsSaving(false)

    if (apiError) {
      setError(apiError)
    } else {
      setSuccess('Profile updated successfully')
      setTimeout(() => setSuccess(null), 3000)
    }
  }

  const handleToggleAvailability = async () => {
    if (!professional) return

    const supabase = createClient()
    const newValue = !professional.is_available

    const { error } = await supabase
      .from('professionals')
      .update({ is_available: newValue })
      .eq('id', professional.id)

    if (!error) {
      setProfessional({ ...professional, is_available: newValue })
    }
  }

  const handleSetLeave = async () => {
    if (!leaveStart || !leaveEnd) {
      setError('Please select both start and end dates')
      return
    }

    setIsSettingLeave(true)
    setError(null)

    const { error: apiError } = await callFunction('set-professional-leave', {
      leave_start: leaveStart,
      leave_end: leaveEnd,
    })

    setIsSettingLeave(false)

    if (apiError) {
      setError(apiError)
    } else {
      setOnLeaveUntil(leaveEnd)
      setShowLeaveModal(false)
      setLeaveStart('')
      setLeaveEnd('')
    }
  }

  const handleEndLeave = async () => {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session || !professional) return

    const { error } = await supabase
      .from('professional_availability')
      .update({ on_leave_until: null })
      .eq('professional_id', professional.id)

    if (!error) {
      setOnLeaveUntil(null)
    }
  }

  const toggleLanguage = (lang: string) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter((l) => l !== lang)
        : [...prev.languages, lang],
    }))
  }

  const handleRegisterWebPush = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setError('Push notifications are not supported in this browser')
      return
    }

    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      })

      await callFunction('register-web-push', {
        subscription: subscription.toJSON(),
      })

      setSuccess('Push notifications enabled')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError('Failed to enable push notifications')
    }
  }

  if (isFetching) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
        <div className="bg-white rounded-lg border border-border p-6 animate-pulse">
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-body-text">Profile & Settings</h1>

      {/* Availability Toggle */}
      <div className="bg-white rounded-lg border border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-body-text">Availability</h2>
            <p className="text-sm text-muted-text">
              {professional?.is_available
                ? 'You are accepting new orders'
                : 'You are not accepting new orders'}
            </p>
          </div>
          <button
            onClick={handleToggleAvailability}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              professional?.is_available ? 'bg-green' : 'bg-gray-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                professional?.is_available ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Leave Management */}
      <div className="bg-white rounded-lg border border-border p-6">
        <h2 className="font-semibold text-body-text mb-4">Leave Management</h2>

        {onLeaveUntil ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-body-text">You are on leave</p>
                <p className="text-sm text-muted-text">
                  Until {new Date(onLeaveUntil).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <button
                onClick={handleEndLeave}
                className="px-4 py-2 border border-blue-300 text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition-colors"
              >
                End Leave
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowLeaveModal(true)}
            className="w-full py-2 px-4 border border-border rounded-lg text-body-text hover:bg-gray-50 transition-colors"
          >
            Set Leave Dates
          </button>
        )}
      </div>

      {/* Profile Edit */}
      <div className="bg-white rounded-lg border border-border p-6">
        <h2 className="font-semibold text-body-text mb-4">Edit Profile</h2>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-body-text mb-1">
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell clients about your expertise..."
              rows={4}
              maxLength={500}
              className="w-full rounded-lg border border-border px-4 py-3 text-body-text resize-none"
            />
            <p className="text-xs text-muted-text mt-1">
              {formData.bio.length}/500 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-body-text mb-1">
              Years of Experience
            </label>
            <input
              type="number"
              min="0"
              max="50"
              value={formData.experience_years}
              onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
              className="w-full rounded-lg border border-border px-4 py-3 text-body-text"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-body-text mb-3">
              Languages
            </label>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => toggleLanguage(lang)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    formData.languages.includes(lang)
                      ? 'bg-navy text-white'
                      : 'bg-gray-100 text-body-text hover:bg-gray-200'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-body-text mb-3">
              Max Concurrent Orders
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="20"
                value={formData.max_concurrent_orders}
                onChange={(e) => setFormData({ ...formData, max_concurrent_orders: parseInt(e.target.value) })}
                className="flex-1"
              />
              <span className="text-lg font-medium text-navy w-8 text-center">
                {formData.max_concurrent_orders}
              </span>
            </div>
          </div>

          {error && <p className="text-red text-sm">{error}</p>}
          {success && <p className="text-green text-sm">{success}</p>}

          <button
            onClick={handleSaveProfile}
            disabled={isSaving}
            className={`w-full py-3 rounded-lg font-medium transition-colors ${
              isSaving
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-navy text-white hover:bg-navy-light'
            }`}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Certifications */}
      <div className="bg-white rounded-lg border border-border p-6">
        <h2 className="font-semibold text-body-text mb-4">Certification Status</h2>

        {certifications.length === 0 ? (
          <p className="text-muted-text">No certifications uploaded</p>
        ) : (
          <div className="space-y-3">
            {certifications.map((cert) => (
              <div
                key={cert.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-body-text">
                    {cert.cert_type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                  </p>
                  {cert.cert_number && (
                    <p className="text-sm text-muted-text">#{cert.cert_number}</p>
                  )}
                </div>
                <div className="text-right">
                  <span className={`badge badge-${cert.status}`}>
                    {cert.status.replace('_', ' ')}
                  </span>
                  {cert.status === 'invalid' && cert.rejection_reason && (
                    <p className="text-xs text-red mt-1">{cert.rejection_reason}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-lg border border-border p-6">
        <h2 className="font-semibold text-body-text mb-4">Notifications</h2>
        <button
          onClick={handleRegisterWebPush}
          className="w-full py-2 px-4 border border-border rounded-lg text-body-text hover:bg-gray-50 transition-colors"
        >
          Enable Push Notifications
        </button>
      </div>

      {/* Bank Details Link */}
      <Link
        href="/settings/bank"
        className="block bg-white rounded-lg border border-border p-6 hover:border-navy transition-colors"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-body-text">Bank Details</h2>
            <p className="text-sm text-muted-text">Manage your payout account</p>
          </div>
          <svg className="w-5 h-5 text-muted-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Link>

      {/* Danger Zone */}
      <div className="bg-white rounded-lg border border-red p-6">
        <h2 className="font-semibold text-red mb-2">Danger Zone</h2>
        <p className="text-sm text-muted-text mb-4">
          Deleting your account will remove all your data and cannot be undone.
        </p>
        <button
          disabled
          className="px-4 py-2 border border-red text-red rounded-lg font-medium opacity-50 cursor-not-allowed"
        >
          Request Account Deletion (Coming Soon)
        </button>
      </div>

      {/* Leave Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-body-text mb-4">Set Leave Dates</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-body-text mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={leaveStart}
                  onChange={(e) => setLeaveStart(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full rounded-lg border border-border px-4 py-2 text-body-text"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-body-text mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={leaveEnd}
                  onChange={(e) => setLeaveEnd(e.target.value)}
                  min={leaveStart || new Date().toISOString().split('T')[0]}
                  className="w-full rounded-lg border border-border px-4 py-2 text-body-text"
                />
              </div>
            </div>

            <p className="text-sm text-muted-text mt-4">
              During leave, you won't receive new order assignments.
            </p>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowLeaveModal(false)
                  setLeaveStart('')
                  setLeaveEnd('')
                }}
                className="flex-1 py-2 rounded-lg font-medium border border-border text-body-text hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSetLeave}
                disabled={isSettingLeave || !leaveStart || !leaveEnd}
                className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                  isSettingLeave || !leaveStart || !leaveEnd
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-navy text-white hover:bg-navy-light'
                }`}
              >
                {isSettingLeave ? 'Setting...' : 'Set Leave'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
