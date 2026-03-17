'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { callFunction } from '@/lib/api'
import { formatPaisa } from '@ollvy/shared'
import type { Order, Document, DocumentRequest, WorkflowStage, OrderStageHistory } from '@/lib/types'

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string

  const [order, setOrder] = useState<Order | null>(null)
  const [documents, setDocuments] = useState<Document[]>([])
  const [documentRequests, setDocumentRequests] = useState<DocumentRequest[]>([])
  const [workflowStages, setWorkflowStages] = useState<WorkflowStage[]>([])
  const [isFetching, setIsFetching] = useState(true)
  const [isAdvancing, setIsAdvancing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Govt fee reimbursement
  const [govtFeeAmount, setGovtFeeAmount] = useState('')
  const [govtFeeReceipt, setGovtFeeReceipt] = useState<File | null>(null)
  const [isSubmittingGovtFee, setIsSubmittingGovtFee] = useState(false)
  const govtFeeInputRef = useRef<HTMLInputElement>(null)

  // Document request
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [requestMessage, setRequestMessage] = useState('')
  const [requestDueDate, setRequestDueDate] = useState('')
  const [isRequestingDoc, setIsRequestingDoc] = useState(false)

  useEffect(() => {
    const fetchOrderData = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) return

      // Fetch order with related data
      const { data: orderData } = await supabase
        .from('orders')
        .select(`
          *,
          service_package:service_packages(*),
          user:users(city, business_type),
          order_stage_history(*)
        `)
        .eq('id', orderId)
        .single()

      if (!orderData) {
        router.push('/orders')
        return
      }

      setOrder(orderData)
      setWorkflowStages(orderData.service_package?.workflow_stages || [])

      // Pre-fill govt fee if already submitted
      if (orderData.govt_fees_paid_paisa) {
        setGovtFeeAmount((orderData.govt_fees_paid_paisa / 100).toString())
      }

      // Fetch documents
      const { data: docs } = await supabase
        .from('documents')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: false })

      setDocuments(docs || [])

      // Fetch document requests
      const { data: requests } = await supabase
        .from('document_requests')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: false })

      setDocumentRequests(requests || [])

      setIsFetching(false)
    }

    fetchOrderData()

    // Set up realtime subscription
    const supabase = createClient()
    const channel = supabase
      .channel(`order-${orderId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders', filter: `id=eq.${orderId}` },
        () => fetchOrderData()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'documents', filter: `order_id=eq.${orderId}` },
        () => fetchOrderData()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [orderId, router])

  const getCurrentStage = (): OrderStageHistory | null => {
    if (!order?.order_stage_history) return null
    return order.order_stage_history.find((s) => !s.completed_at) || null
  }

  const handleAdvanceStage = async () => {
    const currentStage = getCurrentStage()
    if (!currentStage || !order) return

    setIsAdvancing(true)
    setError(null)

    const { data, error: apiError } = await callFunction('advance-stage', {
      order_id: orderId,
      stage_key: currentStage.stage_key,
    })

    setIsAdvancing(false)

    if (apiError) {
      setError(apiError)
      return
    }

    // Check if this was the final stage
    const currentIndex = workflowStages.findIndex((s) => s.stage_key === currentStage.stage_key)
    if (currentIndex === workflowStages.length - 1) {
      router.push(`/orders/${orderId}/complete`)
    } else {
      // Refresh order data
      window.location.reload()
    }
  }

  const handleSubmitGovtFee = async () => {
    if (!govtFeeAmount || !govtFeeReceipt) {
      setError('Please enter amount and upload receipt')
      return
    }

    setIsSubmittingGovtFee(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) throw new Error('Not authenticated')

      // Upload receipt
      const fileExt = govtFeeReceipt.name.split('.').pop()
      const fileName = `${orderId}/govt_fee_receipt_${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, govtFeeReceipt, { upsert: true })

      if (uploadError) throw new Error('Failed to upload receipt')

      // Submit reimbursement
      const { error: apiError } = await callFunction('submit-govt-fee-reimbursement', {
        order_id: orderId,
        govt_fees_paid_paisa: Math.round(parseFloat(govtFeeAmount) * 100),
        receipt_storage_path: fileName,
      })

      if (apiError) throw new Error(apiError)

      // Refresh
      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit')
    } finally {
      setIsSubmittingGovtFee(false)
    }
  }

  const handleRequestDocument = async () => {
    if (!requestMessage.trim()) {
      setError('Please enter a message')
      return
    }

    setIsRequestingDoc(true)
    setError(null)

    const { error: apiError } = await callFunction('request-document', {
      order_id: orderId,
      message: requestMessage.trim(),
      due_date: requestDueDate || null,
    })

    setIsRequestingDoc(false)

    if (apiError) {
      setError(apiError)
      return
    }

    setShowRequestModal(false)
    setRequestMessage('')
    setRequestDueDate('')
    window.location.reload()
  }

  const getSlaCountdown = (): { text: string; isUrgent: boolean; daysRemaining: number } => {
    const currentStage = getCurrentStage()
    if (!currentStage) {
      return { text: '-', isUrgent: false, daysRemaining: 0 }
    }

    const dueDate = new Date(currentStage.stage_due_date)
    const now = new Date()
    const diffMs = dueDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60))

    if (diffDays < 0) {
      return { text: 'Overdue', isUrgent: true, daysRemaining: diffDays }
    } else if (diffDays === 0) {
      return { text: `${diffHours}h remaining`, isUrgent: true, daysRemaining: 0 }
    } else {
      return { text: `${diffDays}d ${diffHours % 24}h remaining`, isUrgent: diffDays <= 1, daysRemaining: diffDays }
    }
  }

  if (isFetching) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
        <div className="bg-white rounded-lg border border-border p-6 animate-pulse">
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return <div>Order not found</div>
  }

  const currentStage = getCurrentStage()
  const sla = getSlaCountdown()
  const showGovtFeeSection = order.status === 'in_progress' &&
    order.service_package?.price_govt_fees_paisa &&
    order.service_package.price_govt_fees_paisa > 0

  // Calculate professional payout (80% of base)
  const professionalPayout = Math.round(order.price_base_paisa_snapshot * 0.8)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/orders" className="text-muted-text hover:text-body-text">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-body-text">
              {order.service_package?.name}
            </h1>
            <p className="text-muted-text">Order #{order.id.slice(0, 8)}</p>
          </div>
        </div>
        <span className={`badge badge-${order.status}`}>
          {order.status.replace('_', ' ')}
        </span>
      </div>

      {/* SLA Banner */}
      {order.status === 'in_progress' && currentStage && (
        <div className={`rounded-lg p-4 ${sla.isUrgent ? 'bg-red/10 border border-red' : 'bg-blue-50 border border-blue-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className={`w-5 h-5 mr-3 ${sla.isUrgent ? 'text-red' : 'text-blue-500'}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <div>
                <p className={`font-medium ${sla.isUrgent ? 'text-red' : 'text-body-text'}`}>
                  {currentStage.stage_name}: {sla.text}
                </p>
                <p className="text-sm text-muted-text">
                  Due: {new Date(currentStage.stage_due_date).toLocaleDateString('en-IN', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-lg border border-border p-6">
            <h2 className="font-semibold text-body-text mb-4">Order Summary</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-text">Client City</p>
                <p className="font-medium text-body-text">{order.city || order.user?.city || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-text">Business Type</p>
                <p className="font-medium text-body-text">{order.user?.business_type || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-text">Your Payout</p>
                <p className="font-medium text-navy">{formatPaisa(professionalPayout)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-text">Order Type</p>
                <p className="font-medium text-body-text capitalize">{order.order_type.replace('_', ' ')}</p>
              </div>
            </div>
          </div>

          {/* Workflow Stages */}
          <div className="bg-white rounded-lg border border-border p-6">
            <h2 className="font-semibold text-body-text mb-4">Workflow Stages</h2>
            <div className="space-y-4">
              {workflowStages.map((stage, index) => {
                const stageHistory = order.order_stage_history?.find((s) => s.stage_key === stage.stage_key)
                const isCompleted = stageHistory?.completed_at
                const isCurrent = currentStage?.stage_key === stage.stage_key
                const isPending = !stageHistory

                return (
                  <div
                    key={stage.stage_key}
                    className={`flex items-start gap-4 p-4 rounded-lg ${
                      isCurrent ? 'bg-navy/5 border border-navy' :
                      isCompleted ? 'bg-green/5' : 'bg-gray-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isCompleted ? 'bg-green text-white' :
                      isCurrent ? 'bg-navy text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      {isCompleted ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${isCurrent ? 'text-navy' : 'text-body-text'}`}>
                        {stage.stage_name}
                      </p>
                      <p className="text-sm text-muted-text">
                        SLA: {stage.sla_working_days} working day{stage.sla_working_days !== 1 ? 's' : ''}
                        {stage.wait_for_govt && ' (waiting for govt)'}
                      </p>
                      {stageHistory?.completed_at && (
                        <p className="text-xs text-green mt-1">
                          Completed {new Date(stageHistory.completed_at).toLocaleDateString('en-IN')}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Advance Stage Button */}
            {order.status === 'disputed' && (
              <div className="mt-6 p-4 bg-red/10 border border-red rounded-lg">
                <p className="text-red font-medium">Dispute in progress</p>
                <p className="text-sm text-red/80 mt-1">
                  This order is under dispute review.
                </p>
              </div>
            )}
            {order.status === 'in_progress' && currentStage && (
              <div className="mt-6">
                {order.payment_paused ? (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800 font-medium">Payment issue - contact client</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      The client's payment has been paused. Please contact them to resolve.
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={handleAdvanceStage}
                    disabled={isAdvancing}
                    className={`w-full py-3 rounded-lg font-medium transition-colors ${
                      isAdvancing
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-navy text-white hover:bg-navy-light'
                    }`}
                  >
                    {isAdvancing ? 'Advancing...' : `Mark "${currentStage.stage_name}" as Complete`}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Govt Fee Reimbursement */}
          {showGovtFeeSection && (
            <div className="bg-white rounded-lg border border-border p-6">
              <h2 className="font-semibold text-body-text mb-4">Govt Fee Reimbursement</h2>

              {order.govt_fees_paid_paisa ? (
                <div className="p-4 bg-green/5 border border-green rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="font-medium text-body-text">
                        {formatPaisa(order.govt_fees_paid_paisa)} reimbursement recorded
                      </p>
                      <p className="text-sm text-muted-text">
                        {order.govt_fee_reimbursement_status === 'pending_review'
                          ? 'Amount flagged for admin review. You will be notified once approved.'
                          : 'Included in next Monday payout.'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-body-text mb-1">
                      Actual govt fees paid (Rs)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={govtFeeAmount}
                      onChange={(e) => setGovtFeeAmount(e.target.value)}
                      placeholder="Enter the exact amount paid"
                      className="w-full rounded-lg border border-border px-4 py-2 text-body-text"
                    />
                    <p className="text-xs text-muted-text mt-1">
                      Enter the exact amount paid to the government portal
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-body-text mb-1">
                      Upload receipt
                    </label>
                    <div
                      className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                        govtFeeReceipt ? 'border-green bg-green/5' : 'border-gray-300 hover:border-navy'
                      }`}
                      onClick={() => govtFeeInputRef.current?.click()}
                    >
                      <input
                        ref={govtFeeInputRef}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => setGovtFeeReceipt(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                      {govtFeeReceipt ? (
                        <p className="text-sm text-body-text">{govtFeeReceipt.name}</p>
                      ) : (
                        <p className="text-sm text-muted-text">PDF or image, max 5MB</p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={handleSubmitGovtFee}
                    disabled={isSubmittingGovtFee || !govtFeeAmount || !govtFeeReceipt}
                    className={`w-full py-2 rounded-lg font-medium transition-colors ${
                      isSubmittingGovtFee || !govtFeeAmount || !govtFeeReceipt
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-navy text-white hover:bg-navy-light'
                    }`}
                  >
                    {isSubmittingGovtFee ? 'Submitting...' : 'Submit Reimbursement'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Documents */}
          <div className="bg-white rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-body-text">Documents</h2>
              <button
                onClick={() => setShowRequestModal(true)}
                className="text-sm text-navy hover:underline"
              >
                Request Document
              </button>
            </div>

            {documents.length === 0 ? (
              <p className="text-sm text-muted-text">No documents yet</p>
            ) : (
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-muted-text mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-body-text">
                          {doc.document_type.replace('_', ' ')}
                        </p>
                        <p className="text-xs text-muted-text">
                          {new Date(doc.created_at).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                    </div>
                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-navy hover:underline text-sm"
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>
            )}

            {/* Document Requests */}
            {documentRequests.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm font-medium text-body-text mb-2">Pending Requests</p>
                <div className="space-y-2">
                  {documentRequests.filter((r) => !r.fulfilled_at).map((req) => (
                    <div key={req.id} className="p-3 bg-amber/10 rounded-lg">
                      <p className="text-sm text-body-text">{req.message}</p>
                      {req.due_date && (
                        <p className="text-xs text-muted-text mt-1">
                          Due: {new Date(req.due_date).toLocaleDateString('en-IN')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Chat Button */}
          <Link
            href={`/orders/${orderId}/chat`}
            className="flex items-center justify-center w-full py-3 px-4 bg-white border border-border rounded-lg hover:border-navy transition-colors"
          >
            <svg className="w-5 h-5 text-navy mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="font-medium text-navy">Chat with Client</span>
          </Link>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red text-white px-4 py-2 rounded-lg shadow-lg">
          {error}
        </div>
      )}

      {/* Document Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-body-text mb-4">Request Document</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-body-text mb-1">
                  What document do you need?
                </label>
                <textarea
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  placeholder="Describe the document you need from the client..."
                  rows={3}
                  className="w-full rounded-lg border border-border px-4 py-2 text-body-text"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-body-text mb-1">
                  Due date (optional)
                </label>
                <input
                  type="date"
                  value={requestDueDate}
                  onChange={(e) => setRequestDueDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full rounded-lg border border-border px-4 py-2 text-body-text"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowRequestModal(false)}
                className="flex-1 py-2 rounded-lg font-medium border border-border text-body-text hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestDocument}
                disabled={isRequestingDoc || !requestMessage.trim()}
                className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                  isRequestingDoc || !requestMessage.trim()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-navy text-white hover:bg-navy-light'
                }`}
              >
                {isRequestingDoc ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
