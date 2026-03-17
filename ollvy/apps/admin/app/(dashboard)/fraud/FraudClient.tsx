'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface FraudClientProps {
  flaggedUsers: any[]
  fraudSignals: any[]
  restrictedAccounts: any[]
  currentTab: string
}

const TABS = [
  { key: 'flagged', label: 'Flagged Users' },
  { key: 'signals', label: 'Fraud Signals' },
  { key: 'restricted', label: 'Restricted Accounts' },
]

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function FraudClient({
  flaggedUsers,
  fraudSignals,
  restrictedAccounts,
  currentTab,
}: FraudClientProps) {
  const router = useRouter()

  const setTab = (tab: string) => {
    router.push(`/fraud?tab=${tab}`)
  }

  return (
    <>
      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setTab(tab.key)}
            className={`px-4 py-2 text-sm rounded-md transition-colors ${
              currentTab === tab.key
                ? 'bg-white text-navy font-medium shadow-sm'
                : 'text-muted-text hover:text-body-text'
            }`}
          >
            {tab.label}
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
              currentTab === tab.key ? 'bg-navy text-white' : 'bg-gray-200'
            }`}>
              {tab.key === 'flagged' && flaggedUsers.length}
              {tab.key === 'signals' && fraudSignals.length}
              {tab.key === 'restricted' && restrictedAccounts.length}
            </span>
          </button>
        ))}
      </div>

      {/* Flagged Users Tab */}
      {currentTab === 'flagged' && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="table-header">Phone</th>
                  <th className="table-header">City</th>
                  <th className="table-header">Business Type</th>
                  <th className="table-header">Flag Reason</th>
                  <th className="table-header">Flagged At</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {flaggedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="table-cell text-center text-muted-text py-12">
                      No flagged users
                    </td>
                  </tr>
                ) : (
                  flaggedUsers.map((user) => (
                    <tr key={user.id} className="border-b border-border hover:bg-gray-50">
                      <td className="table-cell font-mono">{user.phone}</td>
                      <td className="table-cell">{user.city || '-'}</td>
                      <td className="table-cell">{user.business_type || '-'}</td>
                      <td className="table-cell max-w-xs truncate">{user.flag_reason || '-'}</td>
                      <td className="table-cell text-sm">{formatDate(user.flagged_at)}</td>
                      <td className="table-cell">
                        <Link href={`/users/${user.id}`} className="text-navy hover:underline text-sm">
                          Review
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Fraud Signals Tab */}
      {currentTab === 'signals' && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="table-header">Signal Type</th>
                  <th className="table-header">User</th>
                  <th className="table-header">Description</th>
                  <th className="table-header">Severity</th>
                  <th className="table-header">Created At</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {fraudSignals.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="table-cell text-center text-muted-text py-12">
                      No fraud signals detected
                    </td>
                  </tr>
                ) : (
                  fraudSignals.map((signal) => (
                    <tr key={signal.id} className="border-b border-border hover:bg-gray-50">
                      <td className="table-cell font-medium">{signal.signal_type}</td>
                      <td className="table-cell">
                        <Link href={`/users/${signal.users?.id}`} className="text-navy hover:underline">
                          {signal.users?.phone || 'Unknown'}
                        </Link>
                        <p className="text-xs text-muted-text">{signal.users?.city}</p>
                      </td>
                      <td className="table-cell max-w-xs truncate">{signal.description}</td>
                      <td className="table-cell">
                        <span className={`badge ${
                          signal.severity === 'high' ? 'badge-cancelled' :
                          signal.severity === 'medium' ? 'badge-disputed' :
                          'badge-pending_review'
                        }`}>
                          {signal.severity}
                        </span>
                      </td>
                      <td className="table-cell text-sm">{formatDate(signal.created_at)}</td>
                      <td className="table-cell">
                        <Link href={`/users/${signal.users?.id}`} className="text-navy hover:underline text-sm">
                          Investigate
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Restricted Accounts Tab */}
      {currentTab === 'restricted' && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="table-header">Phone</th>
                  <th className="table-header">City</th>
                  <th className="table-header">Business Type</th>
                  <th className="table-header">Restriction Reason</th>
                  <th className="table-header">Restricted At</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {restrictedAccounts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="table-cell text-center text-muted-text py-12">
                      No restricted accounts
                    </td>
                  </tr>
                ) : (
                  restrictedAccounts.map((user) => (
                    <tr key={user.id} className="border-b border-border hover:bg-gray-50">
                      <td className="table-cell font-mono">{user.phone}</td>
                      <td className="table-cell">{user.city || '-'}</td>
                      <td className="table-cell">{user.business_type || '-'}</td>
                      <td className="table-cell max-w-xs truncate">{user.restriction_reason || '-'}</td>
                      <td className="table-cell text-sm">{formatDate(user.restricted_at)}</td>
                      <td className="table-cell">
                        <Link href={`/users/${user.id}`} className="text-navy hover:underline text-sm">
                          Review
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  )
}
