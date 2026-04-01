'use client'

import { useState, useCallback, useMemo, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { getClient } from '@/lib/supabase'
import { cn, formatDate } from '@/lib/utils'
import { useToast } from '@/lib/hooks/use-toast'
import { downloadFile, getSignedUrl } from '@/lib/storage'
import type { OrderWorkDocument } from '@/lib/types'
import {
  FileText,
  Download,
  Upload,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  FolderOpen,
  ArrowDownToLine,
  ArrowUpFromLine,
  Eye,
  RefreshCw,
} from 'lucide-react'
import { useDropzone } from 'react-dropzone'

interface UploadError {
  docId: string
  message: string
}

interface WorkDocumentsSectionProps {
  orderId: string
  workDocuments: OrderWorkDocument[]
  onDocumentsUpdated: () => void
  hasProfessional: boolean
  activeStageKey?: string  // When provided, filter to documents matching this stage
}

export function WorkDocumentsSection({
  orderId,
  workDocuments,
  onDocumentsUpdated,
  hasProfessional,
  activeStageKey,
}: WorkDocumentsSectionProps) {
  const { toast } = useToast()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [uploadingDocId, setUploadingDocId] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState<UploadError | null>(null)
  // Lock to prevent race conditions - only one upload at a time
  const isAnyUploadingRef = useRef(false)

  // Filter documents by stage if activeStageKey is provided
  const filteredDocuments = activeStageKey
    ? workDocuments.filter(d => d.stage_key === activeStageKey)
    : workDocuments

  // Separate documents by direction
  const deliverables = filteredDocuments.filter(d => d.direction === 'to_customer')
  const requests = filteredDocuments.filter(d => d.direction === 'from_customer')

  // Find linked document pairs (for_signing: to_customer doc links to from_customer upload request)
  // Backend convention: to_customer.linked_request_id points to from_customer.id
  const linkedPairs = useMemo(() => {
    const pairs: Array<{
      downloadDoc: OrderWorkDocument
      uploadDoc: OrderWorkDocument
    }> = []
    const usedIds = new Set<string>()

    deliverables.forEach(downloadDoc => {
      if (downloadDoc.linked_request_id) {
        const uploadDoc = requests.find(d => d.id === downloadDoc.linked_request_id)
        if (uploadDoc) {
          pairs.push({ downloadDoc, uploadDoc })
          usedIds.add(downloadDoc.id)
          usedIds.add(uploadDoc.id)
        }
      }
    })

    return { pairs, usedIds }
  }, [deliverables, requests])

  // Standalone documents (not part of a linked pair)
  const standaloneDeliverables = deliverables.filter(d => !linkedPairs.usedIds.has(d.id))
  const standaloneRequests = requests.filter(d => !linkedPairs.usedIds.has(d.id))

  // Calculate stats
  const pendingRequests = requests.filter(r => r.status === 'pending' || r.status === 'rejected')
  const uploadedRequests = requests.filter(r => r.status === 'uploaded' || r.status === 'verified')

  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  const handleDownload = async (doc: OrderWorkDocument) => {
    if (!doc.file_url) return

    setDownloadingId(doc.id)
    try {
      await downloadFile(doc.file_url, doc.file_name || doc.document_label)
    } catch (error) {
      console.error('Download failed:', error)
      toast({
        title: 'Download failed',
        description: 'Could not download the file. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setDownloadingId(null)
    }
  }

  const handleUpload = useCallback(async (docId: string, file: File) => {
    // Prevent race conditions - only one upload at a time
    if (isAnyUploadingRef.current) {
      toast({
        title: 'Upload in progress',
        description: 'Please wait for the current upload to complete',
        variant: 'destructive',
      })
      return
    }

    isAnyUploadingRef.current = true
    setUploadingDocId(docId)
    setUploadProgress(0)
    setUploadError(null)

    let storageFilePath: string | null = null

    try {
      const supabase = getClient()
      const fileExt = file.name.split('.').pop()
      const fileName = `${orderId}/${docId}/${Date.now()}.${fileExt}`
      storageFilePath = fileName

      // Upload to storage
      const { data: uploadData, error: storageError } = await supabase.storage
        .from('work-documents')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
        })

      if (storageError) throw storageError

      // Store the storage path (not public URL) for signed URL generation later
      // Format: bucket/path - the storage helper will parse this
      const storagePath = `work-documents/${fileName}`

      // Update the work document record
      const { error: updateError } = await supabase
        .from('order_work_documents')
        .update({
          file_url: storagePath,
          file_name: file.name,
          status: 'uploaded',
          uploaded_at: new Date().toISOString(),
          uploaded_by_type: 'customer',
        })
        .eq('id', docId)

      if (updateError) {
        // DB update failed - attempt to clean up the orphaned storage file
        try {
          await supabase.storage.from('work-documents').remove([fileName])
        } catch (cleanupErr) {
          console.error('Failed to cleanup orphaned file:', cleanupErr)
        }
        throw updateError
      }

      setUploadProgress(100)
      toast({
        title: 'Upload successful',
        description: 'Your document has been uploaded',
      })
      // Only refresh data if DB update succeeded
      onDocumentsUpdated()
    } catch (err) {
      console.error('Upload failed:', err)
      const errorMessage = err instanceof Error ? err.message : 'Upload failed. Please try again.'
      setUploadError({ docId, message: errorMessage })
      toast({
        title: 'Upload failed',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      isAnyUploadingRef.current = false
      setUploadingDocId(null)
      setUploadProgress(0)
    }
  }, [orderId, onDocumentsUpdated, toast])

  const clearUploadError = useCallback(() => {
    setUploadError(null)
  }, [])

  // Don't show section if no professional assigned yet
  if (!hasProfessional) {
    return null
  }

  // Don't show section if no work documents exist
  if (workDocuments.length === 0) {
    return null
  }

  const hasDeliverables = deliverables.length > 0
  const hasRequests = requests.length > 0

  return (
    <>
      {/* Work Documents Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
              Work Documents
            </div>
            {pendingRequests.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {pendingRequests.length} pending
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          {/* Summary Stats */}
          <div className="flex gap-4 text-sm">
            {hasDeliverables && (
              <div className="flex items-center gap-2">
                <ArrowDownToLine className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-muted-foreground">
                  {deliverables.length} deliverable{deliverables.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
            {hasRequests && (
              <div className="flex items-center gap-2">
                <ArrowUpFromLine className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span className="text-muted-foreground">
                  {uploadedRequests.length}/{requests.length} uploaded
                </span>
              </div>
            )}
          </div>

          {/* Progress bar for requests */}
          {hasRequests && (
            <Progress
              value={requests.length > 0 ? (uploadedRequests.length / requests.length) * 100 : 0}
              className="h-1.5"
            />
          )}

          {/* Open Modal Button */}
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => setIsModalOpen(true)}
          >
            <FolderOpen className="h-4 w-4" />
            View Documents
          </Button>
        </CardContent>
      </Card>

      {/* Work Documents Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-muted-foreground" />
              Work Documents
            </DialogTitle>
          </DialogHeader>

          {/* Content */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4">
            {/* Linked Documents (Download + Upload in one card) */}
            {linkedPairs.pairs.length > 0 && (
              <div className="space-y-3">
                {linkedPairs.pairs.map(({ downloadDoc, uploadDoc }) => (
                  <LinkedDocumentCard
                    key={downloadDoc.id}
                    downloadDoc={downloadDoc}
                    uploadDoc={uploadDoc}
                    onDownload={handleDownload}
                    onUpload={(file) => handleUpload(uploadDoc.id, file)}
                    isUploading={uploadingDocId === uploadDoc.id}
                    uploadProgress={uploadingDocId === uploadDoc.id ? uploadProgress : 0}
                    hasError={uploadError?.docId === uploadDoc.id}
                    errorMessage={uploadError?.docId === uploadDoc.id ? uploadError.message : undefined}
                    onClearError={clearUploadError}
                    isAnyUploading={uploadingDocId !== null}
                  />
                ))}
              </div>
            )}

            {/* Standalone Deliverables */}
            {standaloneDeliverables.length > 0 && (
              <div className="space-y-3">
                {linkedPairs.pairs.length > 0 && (
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    Other Documents
                  </p>
                )}
                {standaloneDeliverables.map(doc => (
                  <DeliverableCard
                    key={doc.id}
                    document={doc}
                    onDownload={handleDownload}
                  />
                ))}
              </div>
            )}

            {/* Standalone Requests */}
            {standaloneRequests.length > 0 && (
              <div className="space-y-3">
                {(linkedPairs.pairs.length > 0 || standaloneDeliverables.length > 0) && (
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    Requested From You
                  </p>
                )}
                {standaloneRequests.map(doc => (
                  <RequestCard
                    key={doc.id}
                    document={doc}
                    isUploading={uploadingDocId === doc.id}
                    uploadProgress={uploadingDocId === doc.id ? uploadProgress : 0}
                    onUpload={(file) => handleUpload(doc.id, file)}
                    hasError={uploadError?.docId === doc.id}
                    errorMessage={uploadError?.docId === doc.id ? uploadError.message : undefined}
                    onClearError={clearUploadError}
                    isAnyUploading={uploadingDocId !== null}
                  />
                ))}
              </div>
            )}

            {/* Empty State */}
            {linkedPairs.pairs.length === 0 && standaloneDeliverables.length === 0 && standaloneRequests.length === 0 && (
              <div className="text-center py-12">
                <FolderOpen className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground">No documents yet</p>
                <p className="text-sm text-muted-foreground/70">
                  Documents will appear here as work progresses
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Linked Document Card (Download + Upload in one card)
function LinkedDocumentCard({
  downloadDoc,
  uploadDoc,
  onDownload,
  onUpload,
  isUploading,
  uploadProgress,
  hasError,
  errorMessage,
  onClearError,
  isAnyUploading,
}: {
  downloadDoc: OrderWorkDocument
  uploadDoc: OrderWorkDocument
  onDownload: (doc: OrderWorkDocument) => void
  onUpload: (file: File) => void
  isUploading: boolean
  uploadProgress: number
  hasError?: boolean
  errorMessage?: string
  onClearError?: () => void
  isAnyUploading?: boolean
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const isUploaded = uploadDoc.status === 'uploaded' || uploadDoc.status === 'verified'
  const isVerified = uploadDoc.status === 'verified'
  const isRejected = uploadDoc.status === 'rejected'

  const handleFileSelect = (file: File) => {
    if (!file) return
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a PDF or image file (JPG, PNG)')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB')
      return
    }
    onUpload(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  return (
    <div
      className={cn(
        'border rounded-xl transition-all overflow-hidden',
        isVerified
          ? 'border-[hsl(var(--ollvy-green))] bg-[hsl(var(--ollvy-green))]/5'
          : isRejected
          ? 'border-destructive bg-destructive/5'
          : isUploaded
          ? 'border-amber-500/50 bg-amber-500/5'
          : 'border-border'
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFileSelect(file)
          e.target.value = ''
        }}
        className="hidden"
      />

      {/* Header */}
      <div className="px-4 py-3 border-b border-border/50 bg-muted/30">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
              isVerified
                ? 'bg-[hsl(var(--ollvy-green))]/20'
                : isRejected
                ? 'bg-destructive/20'
                : isUploaded
                ? 'bg-amber-500/20'
                : 'bg-muted'
            )}
          >
            {isVerified ? (
              <CheckCircle2 className="h-4 w-4 text-[hsl(var(--ollvy-green))]" />
            ) : isRejected ? (
              <AlertCircle className="h-4 w-4 text-destructive" />
            ) : isUploaded ? (
              <FileText className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            ) : (
              <FileText className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm truncate">{downloadDoc.document_label}</span>
              {downloadDoc.tag === 'for_signing' && (
                <Badge variant="secondary" className="text-xs flex-shrink-0">For Signing</Badge>
              )}
              {isVerified && (
                <span className="text-xs text-[hsl(var(--ollvy-green))] font-medium flex-shrink-0">Verified</span>
              )}
            </div>
            {downloadDoc.description && (
              <p className="text-xs text-muted-foreground truncate">{downloadDoc.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Rejection reason */}
      {isRejected && uploadDoc.rejection_reason && (
        <div className="px-4 py-2 bg-destructive/10">
          <p className="text-sm text-destructive">{uploadDoc.rejection_reason}</p>
        </div>
      )}

      {/* Split Content: Download | Upload */}
      <div className="grid grid-cols-2 divide-x divide-border/50">
        {/* Left: Download Section */}
        <div className="p-4">
          <p className="text-xs text-muted-foreground mb-3">Download to sign</p>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{downloadDoc.file_name || 'Document'}</p>
              <p className="text-xs text-muted-foreground">
                {downloadDoc.uploaded_at ? formatDate(downloadDoc.uploaded_at) : ''}
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDownload(downloadDoc)}
            disabled={!downloadDoc.file_url}
            className="gap-1.5 w-full"
          >
            <Download className="h-3.5 w-3.5" />
            Download
          </Button>
        </div>

        {/* Right: Upload Section */}
        <div
          className="p-4"
          onDrop={!isUploaded && !isAnyUploading ? handleDrop : undefined}
          onDragOver={!isUploaded && !isAnyUploading ? (e) => { e.preventDefault(); setIsDragging(true) } : undefined}
          onDragLeave={!isUploaded && !isAnyUploading ? () => setIsDragging(false) : undefined}
        >
          <p className="text-xs text-muted-foreground mb-3">Upload signed version</p>
          {/* Error state with retry */}
          {hasError && (
            <div className="mb-3 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-destructive font-medium">Upload failed</p>
                  <p className="text-xs text-destructive/80 mt-0.5">{errorMessage}</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="mt-2 w-full gap-1.5"
                onClick={() => {
                  onClearError?.()
                  fileInputRef.current?.click()
                }}
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Try Again
              </Button>
            </div>
          )}
          {isUploaded ? (
            <div className="flex items-center gap-3 mb-3">
              <div className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                isVerified ? 'bg-[hsl(var(--ollvy-green))]/10' : 'bg-amber-500/10'
              )}>
                {isVerified ? (
                  <CheckCircle2 className="h-5 w-5 text-[hsl(var(--ollvy-green))]" />
                ) : (
                  <FileText className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{uploadDoc.file_name || 'Uploaded'}</p>
                <p className="text-xs text-muted-foreground">
                  {isVerified ? 'Verified' : 'Under review'}
                </p>
              </div>
            </div>
          ) : !hasError && (
            <div
              onClick={() => !isAnyUploading && fileInputRef.current?.click()}
              className={cn(
                'border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all min-h-[80px]',
                isDragging
                  ? 'border-[hsl(var(--ollvy-green))] bg-[hsl(var(--ollvy-green))]/10'
                  : 'border-border hover:border-muted-foreground/50 hover:bg-muted/50',
                (isUploading || isAnyUploading) && 'pointer-events-none opacity-70'
              )}
            >
              {isUploading ? (
                <div className="space-y-2 text-center">
                  <Loader2 className="h-5 w-5 text-muted-foreground mx-auto animate-spin" />
                  <p className="text-xs text-muted-foreground">Uploading...</p>
                </div>
              ) : isAnyUploading ? (
                <div className="space-y-2 text-center">
                  <Clock className="h-5 w-5 text-muted-foreground mx-auto" />
                  <p className="text-xs text-muted-foreground">Please wait...</p>
                </div>
              ) : (
                <>
                  <Upload className="h-5 w-5 text-muted-foreground mb-1" />
                  <p className="text-xs text-muted-foreground">
                    {isDragging ? 'Drop file here' : 'Drop or click'}
                  </p>
                </>
              )}
            </div>
          )}
          {isUploaded && (
            <div className="flex gap-2">
              {uploadDoc.file_url && (
                <ViewButton fileUrl={uploadDoc.file_url} />
              )}
              {!isVerified && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="gap-1.5 flex-1"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Replace
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Deliverable Card Component (standalone, no linked upload)
function DeliverableCard({
  document,
  onDownload,
}: {
  document: OrderWorkDocument
  onDownload: (doc: OrderWorkDocument) => void
}) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card">
      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
        <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground truncate">{document.document_label}</p>
        {document.description && (
          <p className="text-sm text-muted-foreground line-clamp-1">{document.description}</p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          Added {document.uploaded_at ? formatDate(document.uploaded_at) : formatDate(document.created_at)}
        </p>
      </div>
      <Button
        size="sm"
        variant="outline"
        onClick={() => onDownload(document)}
        disabled={!document.file_url}
        className="gap-1 flex-shrink-0"
      >
        <Download className="h-4 w-4" />
        Download
      </Button>
    </div>
  )
}

// Request Card Component
function RequestCard({
  document,
  isUploading,
  uploadProgress,
  onUpload,
  hasError,
  errorMessage,
  onClearError,
  isAnyUploading,
}: {
  document: OrderWorkDocument
  isUploading: boolean
  uploadProgress: number
  onUpload: (file: File) => void
  hasError?: boolean
  errorMessage?: string
  onClearError?: () => void
  isAnyUploading?: boolean
}) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0 && !isAnyUploading) {
      onClearError?.()
      onUpload(acceptedFiles[0])
    }
  }, [onUpload, isAnyUploading, onClearError])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    disabled: isUploading || isAnyUploading || document.status === 'verified',
  })

  const statusConfig = {
    pending: {
      icon: Clock,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-500/10',
      label: 'Pending Upload',
    },
    uploaded: {
      icon: Clock,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-500/10',
      label: 'Under Review',
    },
    verified: {
      icon: CheckCircle2,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-500/10',
      label: 'Verified',
    },
    rejected: {
      icon: AlertCircle,
      color: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-500/10',
      label: 'Re-upload Required',
    },
  }

  const status = statusConfig[document.status]
  const StatusIcon = status.icon

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 p-4">
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', status.bg)}>
          <StatusIcon className={cn('h-5 w-5', status.color)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium text-foreground truncate">{document.document_label}</p>
            <Badge
              variant={document.status === 'rejected' ? 'destructive' : 'secondary'}
              className="text-xs flex-shrink-0"
            >
              {status.label}
            </Badge>
          </div>
          {document.description && (
            <p className="text-sm text-muted-foreground line-clamp-1">{document.description}</p>
          )}
          {document.due_date && document.status === 'pending' && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
              Due by {formatDate(document.due_date)}
            </p>
          )}
        </div>
      </div>

      {/* Rejection reason */}
      {document.status === 'rejected' && document.rejection_reason && (
        <div className="px-4 pb-3">
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-sm text-red-600 dark:text-red-400">
              <span className="font-medium">Reason: </span>
              {document.rejection_reason}
            </p>
          </div>
        </div>
      )}

      {/* Upload Area */}
      {(document.status === 'pending' || document.status === 'rejected') && (
        <div className="p-4 pt-0">
          {/* Error state with retry */}
          {hasError && (
            <div className="mb-3 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-destructive font-medium">Upload failed</p>
                  <p className="text-xs text-destructive/80 mt-0.5">{errorMessage}</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="mt-2 w-full gap-1.5"
                onClick={(e) => {
                  e.stopPropagation()
                  onClearError?.()
                }}
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Try Again
              </Button>
            </div>
          )}
          {!hasError && (
            <div
              {...getRootProps()}
              className={cn(
                'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
                isDragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50 hover:bg-muted/50',
                (isUploading || isAnyUploading) && 'pointer-events-none opacity-70'
              )}
            >
              <input {...getInputProps()} />
              {isUploading ? (
                <div className="space-y-3">
                  <Loader2 className="h-8 w-8 text-muted-foreground mx-auto animate-spin" />
                  <p className="text-sm text-muted-foreground">Uploading...</p>
                  <Progress value={uploadProgress} className="h-1.5 max-w-xs mx-auto" />
                </div>
              ) : isAnyUploading ? (
                <div className="space-y-3">
                  <Clock className="h-8 w-8 text-muted-foreground mx-auto" />
                  <p className="text-sm text-muted-foreground">Please wait for other upload...</p>
                </div>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm font-medium text-foreground">
                    {isDragActive ? 'Drop file here' : 'Drop file or click to upload'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF, JPG, PNG up to 10MB
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Already uploaded */}
      {(document.status === 'uploaded' || document.status === 'verified') && document.file_url && (
        <div className="px-4 pb-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <span className="text-sm text-foreground truncate flex-1">{document.file_name || 'Document'}</span>
            <ViewLink fileUrl={document.file_url} />
          </div>
        </div>
      )}
    </div>
  )
}

// ViewLink component for opening files with signed URLs (inline text style)
function ViewLink({ fileUrl, className }: { fileUrl: string; className?: string }) {
  const [loading, setLoading] = useState(false)

  const handleView = async () => {
    setLoading(true)
    try {
      const signedUrl = await getSignedUrl(fileUrl)
      if (signedUrl) {
        window.open(signedUrl, '_blank')
      }
    } catch (error) {
      console.error('Failed to get signed URL:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleView}
      disabled={loading}
      className={cn(
        'text-xs text-primary hover:underline flex-shrink-0 disabled:opacity-50',
        className
      )}
    >
      {loading ? 'Loading...' : 'View'}
    </button>
  )
}

// ViewButton component for opening files with signed URLs (button style)
function ViewButton({ fileUrl }: { fileUrl: string }) {
  const [loading, setLoading] = useState(false)

  const handleView = async () => {
    setLoading(true)
    try {
      const signedUrl = await getSignedUrl(fileUrl)
      if (signedUrl) {
        window.open(signedUrl, '_blank')
      }
    } catch (error) {
      console.error('Failed to get signed URL:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      size="sm"
      variant="outline"
      className="gap-1.5 flex-1"
      onClick={handleView}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Eye className="h-3.5 w-3.5" />
      )}
      {loading ? 'Loading...' : 'View'}
    </Button>
  )
}
