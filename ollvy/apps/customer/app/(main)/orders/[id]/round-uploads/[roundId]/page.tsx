'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { getClient } from '@/lib/supabase'
import { useAuthStore } from '@/lib/stores/auth-store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/lib/hooks/use-toast'
import { UploadDropzone } from '@/components/documents/UploadDropzone'
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'

interface DocumentRequest {
  id: string
  round_id: string
  document_label: string
  description: string | null
  status: 'pending' | 'uploaded' | 'verified' | 'rejected'
  rejection_reason: string | null
  file_url: string | null
  file_name: string | null
  linked_request_id: string | null
}

export default function RoundUploadsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuthStore()
  const orderId = params.id as string
  const roundId = params.roundId as string
  const supabase = getClient()

  const [docRequests, setDocRequests] = useState<DocumentRequest[]>([])
  const [staged, setStaged] = useState<Record<string, File>>({})
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [roundTitle, setRoundTitle] = useState('')

  useEffect(() => {
    async function load() {
      // Fetch round and documents in PARALLEL
      const [roundResult, docsResult] = await Promise.all([
        supabase
          .from('order_rounds')
          .select('id, title, status, is_visible_to_user, order_id')
          .eq('id', roundId)
          .eq('order_id', orderId)
          .eq('is_visible_to_user', true)
          .single(),
        supabase
          .from('order_work_documents')
          .select('*')
          .eq('round_id', roundId)
          .eq('direction', 'from_customer')
          .order('created_at', { ascending: true })
      ])

      if (roundResult.error || !roundResult.data) {
        toast({ title: 'Error', variant: 'destructive', description: 'Round not found.' })
        router.push(`/orders/${orderId}`)
        return
      }

      setRoundTitle(roundResult.data.title)

      if (docsResult.error || !docsResult.data) {
        toast({ title: 'Error', variant: 'destructive', description: 'Could not load document requests.' })
        router.push(`/orders/${orderId}`)
        return
      }

      setDocRequests(docsResult.data)
      setLoading(false)
    }
    load()
  }, [orderId, roundId, supabase, toast, router])

  // Separate new requests from re-uploads - new first, re-uploads after
  const newRequests = docRequests.filter(d => !d.linked_request_id && d.status !== 'verified')
  const reuploadRequests = docRequests.filter(d => d.linked_request_id && d.status !== 'verified')
  const pendingDocs = [...newRequests, ...reuploadRequests]
  const hasReuploadRequests = reuploadRequests.length > 0

  const stagedCount = Object.keys(staged).length
  const canSubmit = stagedCount > 0

  const getRejectionLabel = (reason: string | null) => {
    if (!reason) return null
    const labels: Record<string, string> = {
      blurry_or_unclear: 'Document is blurry or unclear',
      wrong_document: 'Wrong document uploaded',
      document_expired: 'Document is expired',
      signature_missing: 'Signature missing',
      name_mismatch: 'Name does not match order details',
      incomplete_document: 'Document is incomplete or partial',
      poor_lighting: 'Poor lighting or low resolution',
      unsupported_format: 'File format not supported',
      other: 'Does not meet requirements',
    }
    return labels[reason] || reason
  }

  // Max file size (50MB)
  const MAX_FILE_SIZE = 50 * 1024 * 1024

  // UploadDropzone requires onUpload: async (file: File) => Promise<void>
  // handleStageFile ONLY stages the file in React state. It does NOT upload yet.
  // The actual upload to Supabase Storage happens in handleSubmit when user taps the CTA.
  const handleStageFile = async (docRequestId: string, file: File): Promise<void> => {
    // Validate file size (redundant with UploadDropzone but ensures safety)
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: 'File too large',
        description: `Maximum file size is 50MB. Your file is ${Math.round(file.size / 1024 / 1024)}MB.`,
        variant: 'destructive'
      })
      return
    }
    setStaged(prev => ({ ...prev, [docRequestId]: file }))
  }

  const handleRemoveStaged = (docRequestId: string) => {
    setStaged(prev => {
      const next = { ...prev }
      delete next[docRequestId]
      return next
    })
  }

  const handleSubmit = async () => {
    if (!canSubmit) return
    setUploading(true)

    const uploadPromises = Object.entries(staged).map(async ([docRequestId, file]) => {
      const ext = file.name.split('.').pop()
      const fileName = `${orderId}/${docRequestId}/${Date.now()}.${ext}`

      // Upload to work-documents bucket (user has write access if path starts with orderId)
      const { error: uploadError } = await supabase.storage
        .from('work-documents')
        .upload(fileName, file, { cacheControl: '3600', upsert: true })

      if (uploadError) throw new Error(`Upload failed for ${file.name}: ${uploadError.message}`)

      // Store the storage path (not public URL) for signed URL generation later
      const storagePath = `work-documents/${fileName}`

      // Update the order_work_documents row
      const { error: updateError } = await supabase
        .from('order_work_documents')
        .update({
          file_url: storagePath,
          file_name: file.name,
          uploaded_at: new Date().toISOString(),
          status: 'uploaded',
          uploaded_by_type: 'customer',
        })
        .eq('id', docRequestId)

      if (updateError) throw new Error(`DB update failed: ${updateError.message}`)

      return { docRequestId, fileName: file.name }
    })

    try {
      // Use allSettled to handle partial failures
      const results = await Promise.allSettled(uploadPromises)
      const failures = results.filter((r): r is PromiseRejectedResult => r.status === 'rejected')
      const successes = results.filter((r): r is PromiseFulfilledResult<{ docRequestId: string; fileName: string }> => r.status === 'fulfilled')

      // Remove successfully uploaded files from staged state
      if (successes.length > 0) {
        setStaged(prev => {
          const next = { ...prev }
          successes.forEach(s => delete next[s.value.docRequestId])
          return next
        })
      }

      if (failures.length > 0) {
        const failedCount = failures.length
        const successCount = successes.length
        if (successCount > 0) {
          toast({
            title: 'Partial upload',
            variant: 'destructive',
            description: `${successCount} uploaded, ${failedCount} failed. Please retry failed uploads.`
          })
        } else {
          toast({
            title: 'Upload failed',
            variant: 'destructive',
            description: failures[0].reason?.message || 'Upload failed'
          })
        }
      } else {
        toast({ title: 'Documents submitted', description: 'Your documents have been submitted for review.' })
        router.push(`/orders/${orderId}`)
      }
    } catch (err: any) {
      toast({ title: 'Upload failed', variant: 'destructive', description: err.message })
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="container max-w-2xl py-12">
        <p className="text-muted-foreground text-sm">Loading documents...</p>
      </div>
    )
  }

  const allVerified = docRequests.every(d => d.status === 'verified')
  if (allVerified && docRequests.length > 0) {
    return (
      <div className="container max-w-2xl py-12">
        <div className="flex flex-col items-center gap-4 text-center">
          <CheckCircle className="w-12 h-12 text-green-500" />
          <h1 className="text-xl font-semibold">All documents verified</h1>
          <p className="text-muted-foreground text-sm">
            Our team has verified all documents for this step.
          </p>
          <Button onClick={() => router.push(`/orders/${orderId}`)}>Back to order</Button>
        </div>
      </div>
    )
  }

  // Determine CTA button label
  const ctaLabel = uploading
    ? 'Uploading...'
    : hasReuploadRequests
    ? 'Submit additional documents'
    : 'Submit documents'

  return (
    <div className="container max-w-2xl py-12">
      <button
        onClick={() => router.push(`/orders/${orderId}`)}
        className="flex items-center gap-2 text-sm text-muted-foreground mb-6 hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to order
      </button>

      <div className="mb-8">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
          {hasReuploadRequests ? 'Additional documents required' : 'Documents required'}
        </p>
        <h1 className="text-2xl font-semibold">{roundTitle}</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Please upload {pendingDocs.length} document{pendingDocs.length !== 1 ? 's' : ''} below.
        </p>
      </div>

      <div className="space-y-6">
        {pendingDocs.map((doc) => {
          const isStaged = !!staged[doc.id]
          const isUploaded = doc.status === 'uploaded'
          const rejectionLabel = getRejectionLabel(doc.rejection_reason)

          return (
            <Card key={doc.id}>
              <CardContent className="pt-6 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-sm">{doc.document_label}</p>
                    {doc.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">{doc.description}</p>
                    )}
                  </div>
                  {isUploaded && (
                    <Badge variant="secondary" className="shrink-0">Awaiting review</Badge>
                  )}
                </div>

                {/* Rejection callout scoped to this document card only */}
                {rejectionLabel && (
                  <div className="flex gap-2 items-start bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md px-3 py-2">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-700 dark:text-red-300">
                      Previously rejected: {rejectionLabel}. Please upload a corrected version.
                    </p>
                  </div>
                )}

                {isUploaded ? (
                  <div className="bg-muted rounded-md px-3 py-2 text-xs text-muted-foreground flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                    {doc.file_name} uploaded - awaiting team review
                  </div>
                ) : isStaged ? (
                  <div className="border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950 rounded-md px-3 py-2 flex items-center justify-between">
                    <span className="text-xs text-green-700 dark:text-green-300 font-medium">
                      {staged[doc.id].name} ready to upload
                    </span>
                    <button
                      onClick={() => handleRemoveStaged(doc.id)}
                      className="text-xs text-red-500 hover:text-red-700 ml-3"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <UploadDropzone
                    onUpload={async (file: File): Promise<void> => {
                      await handleStageFile(doc.id, file)
                    }}
                    label={`Upload ${doc.document_label}`}
                    sublabel="PDF, JPG, PNG up to 50MB"
                    accept=".pdf,.jpg,.jpeg,.png"
                    maxSize={50 * 1024 * 1024}
                  />
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={!canSubmit || uploading}
          size="lg"
        >
          {ctaLabel}
        </Button>
      </div>
    </div>
  )
}
