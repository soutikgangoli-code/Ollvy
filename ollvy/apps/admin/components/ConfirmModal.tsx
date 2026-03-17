'use client'

import { useState } from 'react'

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'default'
  requireReason?: boolean
  reasonLabel?: string
  minReasonLength?: number
  onConfirm: (reason?: string) => Promise<void> | void
  onCancel: () => void
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  requireReason = false,
  reasonLabel = 'Reason',
  minReasonLength = 0,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleConfirm = async () => {
    if (requireReason && reason.length < minReasonLength) {
      return
    }
    setLoading(true)
    try {
      await onConfirm(reason)
    } finally {
      setLoading(false)
      setReason('')
    }
  }

  const handleCancel = () => {
    setReason('')
    onCancel()
  }

  const isValid = !requireReason || reason.length >= minReasonLength

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={handleCancel} />
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
        <h3 className="text-lg font-semibold text-body-text">{title}</h3>
        <p className="text-muted-text mt-2">{message}</p>

        {requireReason && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-body-text mb-1">
              {reasonLabel} {minReasonLength > 0 && `(min ${minReasonLength} characters)`}
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="input min-h-[100px]"
              placeholder="Enter reason..."
            />
            {minReasonLength > 0 && (
              <p className="text-xs text-muted-text mt-1">
                {reason.length}/{minReasonLength} characters
              </p>
            )}
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={handleCancel}
            disabled={loading}
            className="btn-secondary"
          >
            {cancelLabel}
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading || !isValid}
            className={variant === 'danger' ? 'btn-danger' : 'btn-primary'}
          >
            {loading ? 'Processing...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
