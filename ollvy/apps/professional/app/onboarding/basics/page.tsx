'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { callFunction } from '@/lib/api'
import type { ProfessionType } from '@/lib/types'

const PROFESSION_TYPES: { value: ProfessionType; label: string }[] = [
  { value: 'ca', label: 'Chartered Accountant' },
  { value: 'lawyer', label: 'Lawyer' },
  { value: 'cs', label: 'Company Secretary' },
  { value: 'licensing_consultant', label: 'Licensing Consultant' },
  { value: 'payroll_specialist', label: 'Payroll Specialist' },
  { value: 'registered_valuer', label: 'Registered Valuer' },
]

export default function OnboardingBasicsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    full_name: '',
    display_name: '',
    email: '',
    bio: '',
    years_experience: '',
    profession_type: '' as ProfessionType | '',
  })

  useEffect(() => {
    // Pre-fill with existing data if any
    const fetchProfessional = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) return

      const { data: professional } = await supabase
        .from('professionals')
        .select('*')
        .eq('auth_user_id', session.user.id)
        .single()

      if (professional) {
        setFormData({
          full_name: professional.name || '',
          display_name: professional.display_name || '',
          email: professional.email || '',
          bio: professional.bio || '',
          years_experience: professional.experience_years?.toString() || '',
          profession_type: professional.profession_type || '',
        })
      }
    }

    fetchProfessional()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate
    if (!formData.full_name.trim()) {
      setError('Full name is required')
      return
    }
    if (!formData.profession_type) {
      setError('Please select your profession type')
      return
    }
    if (!formData.years_experience || parseInt(formData.years_experience) < 0) {
      setError('Please enter valid years of experience')
      return
    }

    setIsLoading(true)

    const { data, error: apiError } = await callFunction('update-professional-profile', {
      step: 1,
      data: {
        full_name: formData.full_name.trim(),
        display_name: formData.display_name.trim() || formData.full_name.trim(),
        email: formData.email.trim() || null,
        bio: formData.bio.trim() || null,
        years_experience: parseInt(formData.years_experience),
        profession_type: formData.profession_type,
      },
    })

    setIsLoading(false)

    if (apiError) {
      setError(apiError)
      return
    }

    router.push('/onboarding/services')
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      {/* Progress */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center text-sm font-medium">
            1
          </div>
          <span className="ml-2 text-sm font-medium text-body-text">Basic Info</span>
        </div>
        <div className="flex-1 mx-4 h-1 bg-gray-200 rounded">
          <div className="w-1/4 h-full bg-navy rounded"></div>
        </div>
        <span className="text-sm text-muted-text">Step 1 of 4</span>
      </div>

      <h2 className="text-xl font-semibold text-body-text mb-2">
        Tell us about yourself
      </h2>
      <p className="text-muted-text mb-6">
        This information will be visible to clients
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-body-text mb-1">
            Full Name <span className="text-red">*</span>
          </label>
          <input
            type="text"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            placeholder="Enter your full name"
            className="w-full rounded-lg border border-border px-4 py-3 text-body-text"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-body-text mb-1">
            Display Name
          </label>
          <input
            type="text"
            value={formData.display_name}
            onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
            placeholder="How should clients address you?"
            className="w-full rounded-lg border border-border px-4 py-3 text-body-text"
          />
          <p className="text-xs text-muted-text mt-1">
            Defaults to your full name if not provided
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-body-text mb-1">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="your.email@example.com"
            className="w-full rounded-lg border border-border px-4 py-3 text-body-text"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-body-text mb-1">
            Profession Type <span className="text-red">*</span>
          </label>
          <select
            value={formData.profession_type}
            onChange={(e) => setFormData({ ...formData, profession_type: e.target.value as ProfessionType })}
            className="w-full rounded-lg border border-border px-4 py-3 text-body-text bg-white"
          >
            <option value="">Select your profession</option>
            {PROFESSION_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-body-text mb-1">
            Years of Experience <span className="text-red">*</span>
          </label>
          <input
            type="number"
            min="0"
            max="50"
            value={formData.years_experience}
            onChange={(e) => setFormData({ ...formData, years_experience: e.target.value })}
            placeholder="Years of experience"
            className="w-full rounded-lg border border-border px-4 py-3 text-body-text"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-body-text mb-1">
            Bio
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Tell us about your expertise and experience..."
            rows={4}
            maxLength={500}
            className="w-full rounded-lg border border-border px-4 py-3 text-body-text resize-none"
          />
          <p className="text-xs text-muted-text mt-1">
            {formData.bio.length}/500 characters
          </p>
        </div>

        {error && (
          <p className="text-red text-sm">{error}</p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 rounded-lg font-medium transition-colors ${
            isLoading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-navy text-white hover:bg-navy-light'
          }`}
        >
          {isLoading ? 'Saving...' : 'Continue'}
        </button>
      </form>
    </div>
  )
}
