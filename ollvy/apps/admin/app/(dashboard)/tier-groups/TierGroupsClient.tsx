'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatPaisa } from '@ollvy/shared'

interface Tier {
  id: string
  name: string
  display_order: number
  price_paisa: number
}

interface TierGroup {
  id: string
  name: string
  description: string | null
  created_at: string
  tierCount: number
  serviceCount: number
  tiers: Tier[]
}

interface TierGroupsClientProps {
  tierGroups: TierGroup[]
}

export default function TierGroupsClient({ tierGroups }: TierGroupsClientProps) {
  const router = useRouter()
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null)
  const [loading, setLoading] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState<TierGroup | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<TierGroup | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tiers: [{ name: '', price_paisa: 0 }] as { name: string; price_paisa: number }[],
  })

  const formatCurrency = (paisa: number) => {
    return formatPaisa(paisa)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const handleCreateGroup = async () => {
    if (!formData.name.trim()) {
      alert('Please enter a group name')
      return
    }

    if (formData.tiers.length === 0 || formData.tiers.every(t => !t.name.trim())) {
      alert('Please add at least one tier')
      return
    }

    setLoading('create')
    try {
      const res = await fetch('/api/admin/tier-groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || null,
          tiers: formData.tiers.filter(t => t.name.trim()).map((t, i) => ({
            name: t.name,
            price_paisa: t.price_paisa,
            display_order: i + 1,
          })),
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        alert(data.error || 'Failed to create tier group')
        return
      }

      setShowCreateModal(false)
      setFormData({ name: '', description: '', tiers: [{ name: '', price_paisa: 0 }] })
      router.refresh()
    } finally {
      setLoading(null)
    }
  }

  const handleUpdateGroup = async () => {
    if (!showEditModal) return

    setLoading('update')
    try {
      const res = await fetch(`/api/admin/tier-groups/${showEditModal.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || null,
          tiers: formData.tiers.filter(t => t.name.trim()).map((t, i) => ({
            name: t.name,
            price_paisa: t.price_paisa,
            display_order: i + 1,
          })),
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        alert(data.error || 'Failed to update tier group')
        return
      }

      setShowEditModal(null)
      setFormData({ name: '', description: '', tiers: [{ name: '', price_paisa: 0 }] })
      router.refresh()
    } finally {
      setLoading(null)
    }
  }

  const handleDeleteGroup = async () => {
    if (!showDeleteConfirm) return

    if (showDeleteConfirm.serviceCount > 0) {
      alert(`Cannot delete: ${showDeleteConfirm.serviceCount} services are using this tier group`)
      setShowDeleteConfirm(null)
      return
    }

    setLoading('delete')
    try {
      const res = await fetch(`/api/admin/tier-groups/${showDeleteConfirm.id}`, {
        method: 'DELETE',
      })

      const data = await res.json()
      if (!res.ok) {
        alert(data.error || 'Failed to delete tier group')
        return
      }

      setShowDeleteConfirm(null)
      router.refresh()
    } finally {
      setLoading(null)
    }
  }

  const openEditModal = (group: TierGroup) => {
    setFormData({
      name: group.name,
      description: group.description || '',
      tiers: group.tiers.map(t => ({ name: t.name, price_paisa: t.price_paisa })),
    })
    setShowEditModal(group)
  }

  const addTier = () => {
    setFormData({
      ...formData,
      tiers: [...formData.tiers, { name: '', price_paisa: 0 }],
    })
  }

  const removeTier = (index: number) => {
    setFormData({
      ...formData,
      tiers: formData.tiers.filter((_, i) => i !== index),
    })
  }

  const updateTier = (index: number, field: 'name' | 'price_paisa', value: string | number) => {
    const newTiers = [...formData.tiers]
    newTiers[index] = { ...newTiers[index], [field]: value }
    setFormData({ ...formData, tiers: newTiers })
  }

  return (
    <>
      {/* Header with Create Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => {
            setFormData({ name: '', description: '', tiers: [{ name: '', price_paisa: 0 }] })
            setShowCreateModal(true)
          }}
          className="btn-primary"
        >
          + Create Tier Group
        </button>
      </div>

      {/* Tier Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tierGroups.map((group) => (
          <div key={group.id} className="card p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-body-text">{group.name}</h3>
                {group.description && (
                  <p className="text-sm text-muted-text mt-1">{group.description}</p>
                )}
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => openEditModal(group)}
                  className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(group)}
                  className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded hover:bg-red-100"
                  disabled={group.serviceCount > 0}
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="flex gap-4 text-sm text-muted-text mb-3">
              <span>{group.tierCount} tiers</span>
              <span>{group.serviceCount} services</span>
            </div>

            {/* Tiers List */}
            <div
              className="cursor-pointer"
              onClick={() => setExpandedGroup(expandedGroup === group.id ? null : group.id)}
            >
              <div className="flex items-center justify-between text-sm text-navy">
                <span>View Tiers</span>
                <span>{expandedGroup === group.id ? '▲' : '▼'}</span>
              </div>
            </div>

            {expandedGroup === group.id && (
              <div className="mt-3 space-y-2 border-t border-border pt-3">
                {group.tiers.map((tier, index) => (
                  <div key={tier.id} className="flex justify-between text-sm">
                    <span className="text-body-text">
                      {index + 1}. {tier.name}
                    </span>
                    <span className="text-muted-text">{formatCurrency(tier.price_paisa)}/mo</span>
                  </div>
                ))}
                {group.tiers.length === 0 && (
                  <p className="text-sm text-muted-text">No tiers defined</p>
                )}
              </div>
            )}

            <div className="mt-3 pt-3 border-t border-border text-xs text-muted-text">
              Created {formatDate(group.created_at)}
            </div>
          </div>
        ))}

        {tierGroups.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-text">
            No tier groups found. Create one to get started.
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Create Tier Group</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-body-text mb-1">Group Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input w-full"
                  placeholder="e.g., Basic Compliance Tiers"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-body-text mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input w-full"
                  rows={2}
                  placeholder="Optional description"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-body-text">Tiers</label>
                  <button
                    type="button"
                    onClick={addTier}
                    className="text-sm text-navy hover:underline"
                  >
                    + Add Tier
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.tiers.map((tier, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={tier.name}
                        onChange={(e) => updateTier(index, 'name', e.target.value)}
                        className="input flex-1"
                        placeholder={`Tier ${index + 1} name`}
                      />
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-text">Rs</span>
                        <input
                          type="number"
                          value={tier.price_paisa / 100}
                          onChange={(e) => updateTier(index, 'price_paisa', Math.round(parseFloat(e.target.value || '0') * 100))}
                          className="input w-28 pl-6"
                          placeholder="Price"
                        />
                      </div>
                      {formData.tiers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTier(index)}
                          className="text-red-500 hover:text-red-700 px-2"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="btn-secondary"
                disabled={loading === 'create'}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateGroup}
                className="btn-primary"
                disabled={loading === 'create'}
              >
                {loading === 'create' ? 'Creating...' : 'Create Group'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Edit Tier Group</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-body-text mb-1">Group Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-body-text mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input w-full"
                  rows={2}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-body-text">Tiers</label>
                  <button
                    type="button"
                    onClick={addTier}
                    className="text-sm text-navy hover:underline"
                  >
                    + Add Tier
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.tiers.map((tier, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={tier.name}
                        onChange={(e) => updateTier(index, 'name', e.target.value)}
                        className="input flex-1"
                        placeholder={`Tier ${index + 1} name`}
                      />
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-text">Rs</span>
                        <input
                          type="number"
                          value={tier.price_paisa / 100}
                          onChange={(e) => updateTier(index, 'price_paisa', Math.round(parseFloat(e.target.value || '0') * 100))}
                          className="input w-28 pl-6"
                          placeholder="Price"
                        />
                      </div>
                      {formData.tiers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTier(index)}
                          className="text-red-500 hover:text-red-700 px-2"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowEditModal(null)}
                className="btn-secondary"
                disabled={loading === 'update'}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateGroup}
                className="btn-primary"
                disabled={loading === 'update'}
              >
                {loading === 'update' ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-2">Delete Tier Group</h2>
            <p className="text-muted-text mb-4">
              Are you sure you want to delete "{showDeleteConfirm.name}"? This action cannot be undone.
            </p>

            {showDeleteConfirm.serviceCount > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-amber-800">
                  This tier group is used by {showDeleteConfirm.serviceCount} service(s). You must reassign those services before deleting.
                </p>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="btn-secondary"
                disabled={loading === 'delete'}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteGroup}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                disabled={loading === 'delete' || showDeleteConfirm.serviceCount > 0}
              >
                {loading === 'delete' ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
