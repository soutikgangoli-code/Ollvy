'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import type { Professional, ProfessionalCertification } from '@/lib/types'

export default function OnboardingPendingPage() {
  const router = useRouter()
  const [professional, setProfessional] = useState<Professional | null>(null)
  const [certifications, setCertifications] = useState<ProfessionalCertification[]>([])
  const [isFetching, setIsFetching] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) return

      // Fetch professional data
      const { data: prof } = await supabase
        .from('professionals')
        .select('*')
        .eq('auth_user_id', session.user.id)
        .single()

      if (prof) {
        setProfessional(prof)

        // Fetch certifications
        const { data: certs } = await supabase
          .from('professional_certifications')
          .select('*')
          .eq('professional_id', prof.id)

        if (certs) {
          setCertifications(certs)
        }
      }

      setIsFetching(false)
    }

    fetchData()

    // Poll for status change every 30 seconds
    const pollInterval = setInterval(async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) return

      const { data: prof } = await supabase
        .from('professionals')
        .select('status')
        .eq('auth_user_id', session.user.id)
        .single()

      if (prof?.status === 'approved') {
        router.push('/dashboard')
      }
    }, 30000)

    // Also set up realtime subscription
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) return

      const channel = supabase
        .channel('professional-status')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'professionals',
            filter: `auth_user_id=eq.${session.user.id}`,
          },
          (payload) => {
            const newStatus = payload.new.status
            if (newStatus === 'approved') {
              router.push('/dashboard')
            }
            setProfessional(payload.new as Professional)
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    })

    return () => {
      clearInterval(pollInterval)
    }
  }, [router])

  if (isFetching) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  const isRejected = professional?.status === 'rejected'

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      {/* Progress */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            isRejected ? 'bg-red text-white' : 'bg-navy text-white'
          }`}>
            4
          </div>
          <span className="ml-2 text-sm font-medium text-body-text">
            {isRejected ? 'Application Status' : 'Review'}
          </span>
        </div>
        <div className="flex-1 mx-4 h-1 bg-gray-200 rounded">
          <div className={`h-full rounded ${isRejected ? 'bg-red' : 'bg-navy'}`} style={{ width: '100%' }}></div>
        </div>
        <span className="text-sm text-muted-text">Step 4 of 4</span>
      </div>

      {isRejected ? (
        <>
          {/* Rejected State */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-body-text mb-2">
              Application Not Approved
            </h2>
            <p className="text-muted-text">
              Unfortunately, we were unable to approve your application at this time.
            </p>
          </div>

          {professional.rejection_reason && (
            <div className="bg-red/5 border border-red/20 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-body-text mb-2">Reason:</h3>
              <p className="text-muted-text">{professional.rejection_reason}</p>
            </div>
          )}

          {professional.reapply_after_date && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-muted-text">
                You can reapply after{' '}
                <span className="font-medium text-body-text">
                  {new Date(professional.reapply_after_date).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </p>
            </div>
          )}

          {(!professional.reapply_after_date || new Date(professional.reapply_after_date) <= new Date()) && (
            <button
              onClick={async () => {
                const { callFunction } = await import('@/lib/api')
                const { error } = await callFunction('reapply-professional', {})
                if (!error) {
                  router.push('/onboarding/basics')
                }
              }}
              className="w-full py-3 rounded-lg font-medium bg-navy text-white hover:bg-navy-light transition-colors"
            >
              Reapply
            </button>
          )}
        </>
      ) : (
        <>
          {/* Pending State */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-amber/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-amber animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-body-text mb-2">
              Application Under Review
            </h2>
            <p className="text-muted-text">
              Your application is being reviewed by our team. We'll notify you via SMS within 48 hours.
            </p>
          </div>

          {/* Submitted Certifications */}
          {certifications.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium text-body-text mb-3">Submitted Documents</h3>
              <div className="space-y-2">
                {certifications.map((cert) => (
                  <div
                    key={cert.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-muted-text mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-body-text">
                          {cert.cert_type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                        </p>
                        {cert.cert_number && (
                          <p className="text-xs text-muted-text">#{cert.cert_number}</p>
                        )}
                      </div>
                    </div>
                    <span className={`badge badge-${cert.status}`}>
                      {cert.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <svg className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm text-blue-800 font-medium">What happens next?</p>
                <ul className="text-sm text-blue-700 mt-1 list-disc list-inside">
                  <li>Our team will verify your credentials</li>
                  <li>You'll receive an SMS once approved</li>
                  <li>This page will automatically redirect when ready</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
