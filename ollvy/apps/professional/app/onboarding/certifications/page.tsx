'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { callFunction } from '@/lib/api'
import type { ProfessionType, ProfessionalCertification } from '@/lib/types'

interface CertificationRequirement {
  type: string
  label: string
  required: boolean
  hasNumber: boolean
  numberLabel?: string
}

const CERTIFICATION_REQUIREMENTS: Record<ProfessionType, CertificationRequirement[]> = {
  ca: [
    { type: 'icai_membership', label: 'ICAI Membership Certificate', required: true, hasNumber: true, numberLabel: 'ICAI Membership Number' },
    { type: 'ca_certificate', label: 'CA Final Certificate', required: true, hasNumber: false },
  ],
  lawyer: [
    { type: 'bar_council', label: 'Bar Council Enrollment Certificate', required: true, hasNumber: true, numberLabel: 'Bar Council Number' },
  ],
  cs: [
    { type: 'icsi_certificate', label: 'ICSI Membership Certificate', required: true, hasNumber: true, numberLabel: 'ICSI Membership Number' },
  ],
  licensing_consultant: [
    { type: 'business_license', label: 'Business Registration Certificate', required: false, hasNumber: false },
    { type: 'experience_letter', label: 'Experience Letter / Portfolio', required: false, hasNumber: false },
  ],
  payroll_specialist: [
    { type: 'qualification_cert', label: 'Professional Qualification Certificate', required: false, hasNumber: false },
    { type: 'experience_letter', label: 'Experience Letter', required: false, hasNumber: false },
  ],
  registered_valuer: [
    { type: 'ibbi_certificate', label: 'IBBI Registration Certificate', required: true, hasNumber: true, numberLabel: 'IBBI Registration Number' },
  ],
}

export default function OnboardingCertificationsPage() {
  const router = useRouter()
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [professionType, setProfessionType] = useState<ProfessionType | null>(null)
  const [existingCerts, setExistingCerts] = useState<ProfessionalCertification[]>([])
  const [uploadProgress, setUploadProgress] = useState<Record<string, 'idle' | 'uploading' | 'done' | 'error'>>({})

  const [certifications, setCertifications] = useState<Record<string, {
    file: File | null
    number: string
    existingUrl?: string
  }>>({})

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) return

      // Fetch professional data
      const { data: professional } = await supabase
        .from('professionals')
        .select('id, profession_type')
        .eq('auth_user_id', session.user.id)
        .single()

      if (professional) {
        setProfessionType(professional.profession_type)

        // Fetch existing certifications
        const { data: certs } = await supabase
          .from('professional_certifications')
          .select('*')
          .eq('professional_id', professional.id)

        if (certs) {
          setExistingCerts(certs)

          // Pre-fill certification data
          const certData: Record<string, { file: File | null; number: string; existingUrl?: string }> = {}
          certs.forEach((cert) => {
            certData[cert.cert_type] = {
              file: null,
              number: cert.cert_number || '',
              existingUrl: cert.document_url,
            }
          })
          setCertifications(certData)
        }
      }

      setIsFetching(false)
    }

    fetchData()
  }, [])

  const requirements = professionType ? CERTIFICATION_REQUIREMENTS[professionType] : []

  const handleFileSelect = (certType: string, file: File | null) => {
    if (!file) return

    // Validate file
    const maxSize = 5 * 1024 * 1024 // 5MB
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']

    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a PDF or image file')
      return
    }

    if (file.size > maxSize) {
      setError('File size must be less than 5MB')
      return
    }

    setError(null)
    setCertifications((prev) => ({
      ...prev,
      [certType]: {
        ...prev[certType],
        file,
      },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate required certifications
    const requiredCerts = requirements.filter((r) => r.required)
    for (const req of requiredCerts) {
      const cert = certifications[req.type]
      if (!cert?.file && !cert?.existingUrl) {
        setError(`${req.label} is required`)
        return
      }
      if (req.hasNumber && !cert?.number) {
        setError(`${req.numberLabel} is required`)
        return
      }
    }

    setIsLoading(true)

    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      setError('Session expired. Please login again.')
      setIsLoading(false)
      return
    }

    // Get professional ID
    const { data: professional } = await supabase
      .from('professionals')
      .select('id')
      .eq('auth_user_id', session.user.id)
      .single()

    if (!professional) {
      setError('Professional not found')
      setIsLoading(false)
      return
    }

    try {
      // Upload each certification file
      for (const req of requirements) {
        const cert = certifications[req.type]
        if (!cert?.file && !cert?.existingUrl) continue

        setUploadProgress((prev) => ({ ...prev, [req.type]: 'uploading' }))

        let documentUrl = cert.existingUrl

        if (cert.file) {
          // Upload file to Supabase Storage
          const fileExt = cert.file.name.split('.').pop()
          const fileName = `${professional.id}/${req.type}_${Date.now()}.${fileExt}`

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('certifications')
            .upload(fileName, cert.file, {
              upsert: true,
            })

          if (uploadError) {
            setUploadProgress((prev) => ({ ...prev, [req.type]: 'error' }))
            throw new Error(`Failed to upload ${req.label}`)
          }

          documentUrl = fileName
        }

        // Call the upload-certification-doc function
        const { error: apiError } = await callFunction('upload-certification-doc', {
          cert_type: req.type,
          cert_number: cert.number || null,
          document_url: documentUrl,
          issuing_body: req.label,
        })

        if (apiError) {
          setUploadProgress((prev) => ({ ...prev, [req.type]: 'error' }))
          throw new Error(apiError)
        }

        setUploadProgress((prev) => ({ ...prev, [req.type]: 'done' }))
      }

      // Update onboarding step
      await callFunction('update-professional-profile', {
        step: 3,
        data: {},
      })

      router.push('/onboarding/pending')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-32 bg-gray-200 rounded mt-6"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      {/* Progress */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center text-sm font-medium">
            3
          </div>
          <span className="ml-2 text-sm font-medium text-body-text">Certifications</span>
        </div>
        <div className="flex-1 mx-4 h-1 bg-gray-200 rounded">
          <div className="w-3/4 h-full bg-navy rounded"></div>
        </div>
        <span className="text-sm text-muted-text">Step 3 of 4</span>
      </div>

      <h2 className="text-xl font-semibold text-body-text mb-2">
        Upload your certifications
      </h2>
      <p className="text-muted-text mb-6">
        These documents help us verify your credentials
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {requirements.map((req) => {
          const cert = certifications[req.type] || { file: null, number: '', existingUrl: undefined }
          const progress = uploadProgress[req.type] || 'idle'
          const existingCert = existingCerts.find((c) => c.cert_type === req.type)

          return (
            <div key={req.type} className="border border-border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-body-text">
                    {req.label}
                    {req.required && <span className="text-red ml-1">*</span>}
                  </h3>
                  {existingCert && (
                    <span className={`badge mt-1 badge-${existingCert.status}`}>
                      {existingCert.status.replace('_', ' ')}
                    </span>
                  )}
                </div>
                {progress === 'done' && (
                  <span className="text-green text-sm flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Uploaded
                  </span>
                )}
              </div>

              {/* File upload */}
              <div
                className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                  cert.file || cert.existingUrl
                    ? 'border-green bg-green/5'
                    : 'border-gray-300 hover:border-navy'
                }`}
                onClick={() => fileInputRefs.current[req.type]?.click()}
              >
                <input
                  ref={(el) => { fileInputRefs.current[req.type] = el }}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileSelect(req.type, e.target.files?.[0] || null)}
                  className="hidden"
                />
                {cert.file ? (
                  <p className="text-sm text-body-text">{cert.file.name}</p>
                ) : cert.existingUrl ? (
                  <p className="text-sm text-green">Document uploaded (click to replace)</p>
                ) : (
                  <>
                    <svg className="w-8 h-8 mx-auto text-muted-text mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-sm text-muted-text">
                      Drag and drop or click to upload
                    </p>
                    <p className="text-xs text-muted-text mt-1">PDF or image, max 5MB</p>
                  </>
                )}
                {progress === 'uploading' && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-navy h-1.5 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Certificate number input */}
              {req.hasNumber && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-body-text mb-1">
                    {req.numberLabel}
                    {req.required && <span className="text-red ml-1">*</span>}
                  </label>
                  <input
                    type="text"
                    value={cert.number}
                    onChange={(e) =>
                      setCertifications((prev) => ({
                        ...prev,
                        [req.type]: { ...prev[req.type], number: e.target.value },
                      }))
                    }
                    placeholder={`Enter ${req.numberLabel?.toLowerCase()}`}
                    className="w-full rounded-lg border border-border px-4 py-2 text-body-text"
                  />
                </div>
              )}
            </div>
          )
        })}

        {error && (
          <p className="text-red text-sm">{error}</p>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push('/onboarding/services')}
            className="flex-1 py-3 rounded-lg font-medium border border-border text-body-text hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
              isLoading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-navy text-white hover:bg-navy-light'
            }`}
          >
            {isLoading ? 'Uploading...' : 'Submit Application'}
          </button>
        </div>
      </form>
    </div>
  )
}
