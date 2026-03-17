'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatPaisa } from '@ollvy/shared'

interface PromoCode {
  id: string
  code: string
  discount_type: 'percentage' | 'flat'
  discount_value: number
  max_uses: number | null
  current_uses: number
  valid_from: string
  valid_until: string | null
  is_active: boolean
  min_order_paisa: number | null
  max_discount_paisa: number | null
  created_at: string
}

interface PromoCodesClientProps {
  promoCodes: PromoCode[]
}

function formatCurrency(paisa: number): string {
  return formatPaisa(paisa)
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function PromoCodesClient({ promoCodes }: PromoCodesClientProps) {
  const router = useRouter()
  const [showCreate, setShowCreate] = useState(false)
  const [loading, setLoading] = useState(false)

  // Form state
  const [code, setCode] = useState('')
  const [discountType, setDiscountType] = useState<'percentage' | 'flat'>('percentage')
  const [discountValue, setDiscountValue] = useState(10)
  const [maxUses, setMaxUses] = useState<number | ''>('')
  const [validFrom, setValidFrom] = useState(new Date().toISOString().split('T')[0])
  const [validUntil, setValidUntil] = useState('')
  const [minOrderPaisa, setMinOrderPaisa] = useState<number | ''>('')
  const [maxDiscountPaisa, setMaxDiscountPaisa] = useState<number | ''>('')
  const [isActive, setIsActive] = useState(true)

  const handleCreate = async () => {
    if (!code || !discountValue) {
      alert('Code and discount value are required')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/admin/promo-codes/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.toUpperCase(),
          discount_type: discountType,
          discount_value: discountValue,
          max_uses: maxUses || null,
          valid_from: validFrom,
          valid_until: validUntil || null,
          min_order_paisa: minOrderPaisa ? minOrderPaisa * 100 : null,
          max_discount_paisa: maxDiscountPaisa ? maxDiscountPaisa * 100 : null,
          is_active: isActive,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        alert(data.error || 'Failed to create promo code')
        return
      }

      setShowCreate(false)
      resetForm()
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (id: string, active: boolean) => {
    const res = await fetch('/api/admin/promo-codes/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_active: active }),
    })

    if (res.ok) {
      router.refresh()
    }
  }

  const resetForm = () => {
    setCode('')
    setDiscountType('percentage')
    setDiscountValue(10)
    setMaxUses('')
    setValidFrom(new Date().toISOString().split('T')[0])
    setValidUntil('')
    setMinOrderPaisa('')
    setMaxDiscountPaisa('')
    setIsActive(true)
  }

  return (
    <>
      {/* Create Form */}
      {showCreate ? (
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">Create Promo Code</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g., SAVE20"
                className="input font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Discount Type</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as any)}
                className="input"
              >
                <option value="percentage">Percentage</option>
                <option value="flat">Flat Amount</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Discount Value {discountType === 'percentage' ? '(%)' : '(Rs)'}
              </label>
              <input
                type="number"
                value={discountValue}
                onChange={(e) => setDiscountValue(parseFloat(e.target.value))}
                className="input"
                min={0}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Max Uses (optional)</label>
              <input
                type="number"
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value ? parseInt(e.target.value) : '')}
                placeholder="Unlimited"
                className="input"
                min={1}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Valid From</label>
              <input
                type="date"
                value={validFrom}
                onChange={(e) => setValidFrom(e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Valid Until (optional)</label>
              <input
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Min Order (Rs, optional)</label>
              <input
                type="number"
                value={minOrderPaisa}
                onChange={(e) => setMinOrderPaisa(e.target.value ? parseInt(e.target.value) : '')}
                placeholder="No minimum"
                className="input"
                min={0}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Max Discount (Rs, optional)</label>
              <input
                type="number"
                value={maxDiscountPaisa}
                onChange={(e) => setMaxDiscountPaisa(e.target.value ? parseInt(e.target.value) : '')}
                placeholder="No cap"
                className="input"
                min={0}
              />
            </div>
            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
                Active
              </label>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleCreate} className="btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create'}
            </button>
            <button onClick={() => { setShowCreate(false); resetForm() }} className="btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowCreate(true)} className="btn-primary">
          + Create Promo Code
        </button>
      )}

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="table-header">Code</th>
                <th className="table-header">Discount</th>
                <th className="table-header">Uses</th>
                <th className="table-header">Valid Period</th>
                <th className="table-header">Min Order</th>
                <th className="table-header">Status</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {promoCodes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="table-cell text-center text-muted-text py-12">
                    No promo codes created yet
                  </td>
                </tr>
              ) : (
                promoCodes.map((promo) => (
                  <tr key={promo.id} className="border-b border-border hover:bg-gray-50">
                    <td className="table-cell font-mono font-medium">{promo.code}</td>
                    <td className="table-cell">
                      {promo.discount_type === 'percentage'
                        ? `${promo.discount_value}%`
                        : formatCurrency(promo.discount_value * 100)}
                      {promo.max_discount_paisa && (
                        <span className="text-xs text-muted-text block">
                          max {formatCurrency(promo.max_discount_paisa)}
                        </span>
                      )}
                    </td>
                    <td className="table-cell">
                      {promo.current_uses}/{promo.max_uses || '∞'}
                    </td>
                    <td className="table-cell text-sm">
                      {formatDate(promo.valid_from)}
                      {promo.valid_until && ` - ${formatDate(promo.valid_until)}`}
                    </td>
                    <td className="table-cell">
                      {promo.min_order_paisa ? formatCurrency(promo.min_order_paisa) : '-'}
                    </td>
                    <td className="table-cell">
                      <span className={`badge badge-${promo.is_active ? 'approved' : 'suspended'}`}>
                        {promo.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="table-cell">
                      <button
                        onClick={() => handleToggleActive(promo.id, !promo.is_active)}
                        className={`text-sm ${promo.is_active ? 'text-red-600' : 'text-green-600'} hover:underline`}
                      >
                        {promo.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
