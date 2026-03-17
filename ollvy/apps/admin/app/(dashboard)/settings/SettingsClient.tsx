'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

interface SettingsClientProps {
  currentAdmin: any
  allAdmins: any[]
  settings: any
  isSuperAdmin: boolean
}

const ROLES = [
  { value: 'super_admin', label: 'Super Admin', description: 'Full access to all features' },
  { value: 'ops_admin', label: 'Ops Admin', description: 'Orders, professionals, disputes' },
  { value: 'finance_admin', label: 'Finance Admin', description: 'Payouts, invoices, refunds' },
]

function formatDate(dateString: string | null): string {
  if (!dateString) return 'Never'
  return new Date(dateString).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function SettingsClient({
  currentAdmin,
  allAdmins,
  settings,
  isSuperAdmin,
}: SettingsClientProps) {
  const router = useRouter()
  const [showAddAdmin, setShowAddAdmin] = useState(false)
  const [loading, setLoading] = useState(false)

  // Add admin form
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newRole, setNewRole] = useState('ops_admin')

  // TOTP setup
  const [showTotpSetup, setShowTotpSetup] = useState(false)
  const [totpSecret, setTotpSecret] = useState<string | null>(null)
  const [totpUri, setTotpUri] = useState<string | null>(null)
  const [totpFactorId, setTotpFactorId] = useState<string | null>(null)
  const [totpCode, setTotpCode] = useState('')
  const [totpLoading, setTotpLoading] = useState(false)
  const [totpError, setTotpError] = useState<string | null>(null)

  const handleStartTotpSetup = async () => {
    setTotpLoading(true)
    setTotpError(null)
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: 'Ollvy Admin TOTP'
      })

      if (error) {
        setTotpError(error.message)
        return
      }

      if (data) {
        setTotpSecret(data.totp.secret)
        setTotpUri(data.totp.uri)
        setTotpFactorId(data.id)
        setShowTotpSetup(true)
      }
    } catch (err) {
      setTotpError('Failed to start TOTP setup')
    } finally {
      setTotpLoading(false)
    }
  }

  const handleVerifyTotp = async () => {
    if (!totpFactorId || totpCode.length !== 6) {
      setTotpError('Please enter a valid 6-digit code')
      return
    }

    setTotpLoading(true)
    setTotpError(null)
    try {
      const supabase = createClient()
      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId: totpFactorId
      })

      if (challengeError) {
        setTotpError(challengeError.message)
        return
      }

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId: totpFactorId,
        challengeId: challenge.id,
        code: totpCode
      })

      if (verifyError) {
        setTotpError(verifyError.message)
        return
      }

      // Update admin record to mark TOTP as enabled
      await fetch('/api/admin/settings/enable-totp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_id: currentAdmin.id })
      })

      setShowTotpSetup(false)
      setTotpSecret(null)
      setTotpUri(null)
      setTotpCode('')
      router.refresh()
    } catch (err) {
      setTotpError('Verification failed')
    } finally {
      setTotpLoading(false)
    }
  }

  const handleCancelTotpSetup = async () => {
    if (totpFactorId) {
      try {
        const supabase = createClient()
        await supabase.auth.mfa.unenroll({ factorId: totpFactorId })
      } catch (err) {
        // Ignore unenroll errors
      }
    }
    setShowTotpSetup(false)
    setTotpSecret(null)
    setTotpUri(null)
    setTotpFactorId(null)
    setTotpCode('')
    setTotpError(null)
  }

  const handleAddAdmin = async () => {
    if (!newEmail || !newPassword) {
      alert('Email and password are required')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/admin/settings/add-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newEmail,
          password: newPassword,
          role: newRole,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        alert(data.error || 'Failed to add admin')
        return
      }

      setShowAddAdmin(false)
      setNewEmail('')
      setNewPassword('')
      setNewRole('ops_admin')
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  const handleRevokeAdmin = async (adminId: string) => {
    if (!confirm('Are you sure you want to revoke this admin\'s access?')) return

    const res = await fetch('/api/admin/settings/revoke-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ admin_id: adminId }),
    })

    if (res.ok) {
      router.refresh()
    } else {
      const data = await res.json()
      alert(data.error || 'Failed to revoke admin')
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Current Admin Profile */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-body-text mb-4">Your Profile</h2>
        <div className="space-y-4 text-sm">
          <div>
            <p className="text-muted-text">Email</p>
            <p className="font-medium">{currentAdmin?.email}</p>
          </div>
          <div>
            <p className="text-muted-text">Role</p>
            <span className={`badge badge-${currentAdmin?.role === 'super_admin' ? 'approved' : 'pending_review'}`}>
              {ROLES.find(r => r.value === currentAdmin?.role)?.label || currentAdmin?.role}
            </span>
          </div>
          <div>
            <p className="text-muted-text">TOTP Two-Factor Auth</p>
            {currentAdmin?.totp_enabled ? (
              <p className="font-medium text-green-600">Enabled</p>
            ) : (
              <div className="mt-2">
                <button
                  onClick={handleStartTotpSetup}
                  disabled={totpLoading}
                  className="btn-primary text-sm"
                >
                  {totpLoading ? 'Setting up...' : 'Enable TOTP'}
                </button>
              </div>
            )}
          </div>
          <div>
            <p className="text-muted-text">Last Login</p>
            <p className="font-medium">{formatDate(currentAdmin?.last_login)}</p>
          </div>
        </div>

        {/* TOTP Setup Modal */}
        {showTotpSetup && totpSecret && totpUri && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-border">
            <h3 className="font-semibold text-body-text mb-3">Set Up Two-Factor Authentication</h3>
            <p className="text-sm text-muted-text mb-4">
              Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
            </p>

            {/* QR Code using Google Charts API */}
            <div className="flex justify-center mb-4">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(totpUri)}`}
                alt="TOTP QR Code"
                className="border border-border rounded"
                width={200}
                height={200}
              />
            </div>

            {/* Manual secret entry */}
            <div className="mb-4">
              <p className="text-xs text-muted-text mb-1">Or enter this secret manually:</p>
              <code className="block bg-gray-100 p-2 rounded text-xs font-mono break-all">
                {totpSecret}
              </code>
            </div>

            {/* Verification code input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-body-text mb-1">
                Enter verification code from app
              </label>
              <input
                type="text"
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                className="input w-full text-center text-lg tracking-widest font-mono"
                autoFocus
              />
            </div>

            {totpError && (
              <p className="text-red-600 text-sm mb-4">{totpError}</p>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleVerifyTotp}
                disabled={totpLoading || totpCode.length !== 6}
                className="btn-primary text-sm flex-1"
              >
                {totpLoading ? 'Verifying...' : 'Verify & Enable'}
              </button>
              <button
                onClick={handleCancelTotpSetup}
                className="btn-secondary text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* App Settings (Super Admin Only) */}
      {isSuperAdmin && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-body-text mb-4">App Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings?.maintenance_mode || false}
                  onChange={() => {/* TODO: Update setting */}}
                  className="rounded border-border"
                />
                <span className="text-sm">Maintenance Mode</span>
              </label>
              <p className="text-xs text-muted-text ml-6">Disable user access temporarily</p>
            </div>
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings?.new_registrations_enabled !== false}
                  onChange={() => {/* TODO: Update setting */}}
                  className="rounded border-border"
                />
                <span className="text-sm">New Registrations</span>
              </label>
              <p className="text-xs text-muted-text ml-6">Allow new user sign-ups</p>
            </div>
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings?.professional_onboarding_enabled !== false}
                  onChange={() => {/* TODO: Update setting */}}
                  className="rounded border-border"
                />
                <span className="text-sm">Professional Onboarding</span>
              </label>
              <p className="text-xs text-muted-text ml-6">Allow new professional applications</p>
            </div>
          </div>
        </div>
      )}

      {/* Admin Users (Super Admin Only) */}
      {isSuperAdmin && (
        <div className="card p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-body-text">Admin Users</h2>
            <button onClick={() => setShowAddAdmin(true)} className="btn-primary text-sm">
              + Add Admin
            </button>
          </div>

          {showAddAdmin && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-3">Add New Admin</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="input text-sm"
                    placeholder="admin@ollvy.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="input text-sm"
                    placeholder="Minimum 8 characters"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Role</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="input text-sm"
                  >
                    {ROLES.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={handleAddAdmin} className="btn-primary text-sm" disabled={loading}>
                  {loading ? 'Adding...' : 'Add Admin'}
                </button>
                <button onClick={() => setShowAddAdmin(false)} className="btn-secondary text-sm">
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-muted-text font-medium">Email</th>
                  <th className="text-left py-2 text-muted-text font-medium">Role</th>
                  <th className="text-left py-2 text-muted-text font-medium">TOTP</th>
                  <th className="text-left py-2 text-muted-text font-medium">Last Login</th>
                  <th className="text-left py-2 text-muted-text font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allAdmins.map((admin) => (
                  <tr key={admin.id} className="border-b border-border">
                    <td className="py-2">{admin.email}</td>
                    <td className="py-2">
                      <span className={`badge badge-${admin.role === 'super_admin' ? 'approved' : 'pending_review'}`}>
                        {ROLES.find(r => r.value === admin.role)?.label || admin.role}
                      </span>
                    </td>
                    <td className="py-2">
                      {admin.totp_enabled ? (
                        <span className="text-green-600">Enabled</span>
                      ) : (
                        <span className="text-yellow-600">Disabled</span>
                      )}
                    </td>
                    <td className="py-2">{formatDate(admin.last_login)}</td>
                    <td className="py-2">
                      {admin.id !== currentAdmin?.id && (
                        <button
                          onClick={() => handleRevokeAdmin(admin.id)}
                          className="text-red-600 hover:underline"
                        >
                          Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
