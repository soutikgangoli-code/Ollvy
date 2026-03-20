'use client'

import { useState, useCallback } from 'react'
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
} from 'lucide-react'
import { useDropzone } from 'react-dropzone'

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
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'deliverables' | 'requests'>('deliverables')
  const [uploadingDocId, setUploadingDocId] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Filter documents by stage if activeStageKey is provided
  const filteredDocuments = activeStageKey
    ? workDocuments.filter(d => d.stage_key === activeStageKey)
    : workDocuments

  // Separate documents by direction
  const deliverables = filteredDocuments.filter(d => d.direction === 'to_customer')
  const requests = filteredDocuments.filter(d => d.direction === 'from_customer')

  // Calculate stats
  const pendingRequests = requests.filter(r => r.status === 'pending')
  const uploadedRequests = requests.filter(r => r.status === 'uploaded' || r.status === 'verified')

  const handleDownload = async (doc: OrderWorkDocument) => {
    if (!doc.file_url) return

    // Open in new tab for download
    window.open(doc.file_url, '_blank')
  }

  const handleUpload = useCallback(async (docId: string, file: File) => {
    setUploadingDocId(docId)
    setUploadProgress(0)

    try {
      const supabase = getClient()
      const fileExt = file.name.split('.').pop()
      const fileName = `${orderId}/${docId}/${Date.now()}.${fileExt}`

      // Upload to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('work-documents')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('work-documents')
        .getPublicUrl(fileName)

      // Update the work document record
      const { error: updateError } = await supabase
        .from('order_work_documents')
        .update({
          file_url: urlData.publicUrl,
          file_name: file.name,
          status: 'uploaded',
          uploaded_at: new Date().toISOString(),
          uploaded_by_type: 'customer',
        })
        .eq('id', docId)

      if (updateError) throw updateError

      setUploadProgress(100)
      onDocumentsUpdated()
    } catch (err) {
      console.error('Upload failed:', err)
    } finally {
      setUploadingDocId(null)
      setUploadProgress(0)
    }
  }, [orderId, onDocumentsUpdated])

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

          {/* Tabs */}
          <div className="flex gap-2 border-b border-border pb-2">
            <button
              onClick={() => setActiveTab('deliverables')}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                activeTab === 'deliverables'
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <ArrowDownToLine className="h-4 w-4" />
              Deliverables
              {deliverables.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {deliverables.length}
                </Badge>
              )}
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                activeTab === 'requests'
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <ArrowUpFromLine className="h-4 w-4" />
              Requested
              {pendingRequests.length > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {pendingRequests.length}
                </Badge>
              )}
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto py-4 space-y-3">
            {activeTab === 'deliverables' && (
              deliverables.length === 0 ? (
                <div className="text-center py-12">
                  <ArrowDownToLine className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">No deliverables yet</p>
                  <p className="text-sm text-muted-foreground/70">
                    Documents from your CA will appear here
                  </p>
                </div>
              ) : (
                deliverables.map(doc => (
                  <DeliverableCard
                    key={doc.id}
                    document={doc}
                    onDownload={handleDownload}
                  />
                ))
              )
            )}

            {activeTab === 'requests' && (
              requests.length === 0 ? (
                <div className="text-center py-12">
                  <ArrowUpFromLine className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">No document requests</p>
                  <p className="text-sm text-muted-foreground/70">
                    Additional document requests will appear here
                  </p>
                </div>
              ) : (
                requests.map(doc => (
                  <RequestCard
                    key={doc.id}
                    document={doc}
                    isUploading={uploadingDocId === doc.id}
                    uploadProgress={uploadingDocId === doc.id ? uploadProgress : 0}
                    onUpload={(file) => handleUpload(doc.id, file)}
                  />
                ))
              )
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Deliverable Card Component
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
}: {
  document: OrderWorkDocument
  isUploading: boolean
  uploadProgress: number
  onUpload: (file: File) => void
}) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onUpload(acceptedFiles[0])
    }
  }, [onUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    disabled: isUploading || document.status === 'verified',
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
          <div
            {...getRootProps()}
            className={cn(
              'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50 hover:bg-muted/50',
              isUploading && 'pointer-events-none opacity-70'
            )}
          >
            <input {...getInputProps()} />
            {isUploading ? (
              <div className="space-y-3">
                <Loader2 className="h-8 w-8 text-muted-foreground mx-auto animate-spin" />
                <p className="text-sm text-muted-foreground">Uploading...</p>
                <Progress value={uploadProgress} className="h-1.5 max-w-xs mx-auto" />
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
        </div>
      )}

      {/* Already uploaded */}
      {(document.status === 'uploaded' || document.status === 'verified') && document.file_url && (
        <div className="px-4 pb-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <span className="text-sm text-foreground truncate flex-1">{document.file_name || 'Document'}</span>
            <a
              href={document.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline flex-shrink-0"
            >
              View
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
