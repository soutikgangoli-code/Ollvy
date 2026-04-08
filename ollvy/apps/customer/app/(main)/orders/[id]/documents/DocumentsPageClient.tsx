'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { getClient } from '@/lib/supabase'
import { getSignedUrl } from '@/lib/storage'
import { DocumentUploadWizard, DocumentPreview } from '@/components/documents'
import { ArrowLeft } from 'lucide-react'
import { logCustomerDocumentUpload } from '../actions'

interface Document {
  id: string
  document_key: string
  document_label: string
  description?: string
  tips?: string[]
  template_url?: string
  stage_key?: string
  is_required: boolean
  uploaded_at?: string
  file_url?: string
  file_name?: string
  verified_at?: string
  rejection_reason?: string
}

interface OrderData {
  id: string
  order_number: string
  questionnaire_completed_at: string | null
  service_package: {
    id: string
    name: string
    slug: string
  }
}

interface DocumentsPageClientProps {
  order: OrderData
  initialDocuments: Document[]
}

export function DocumentsPageClient({ order, initialDocuments }: DocumentsPageClientProps) {
  const router = useRouter()
  const [documents, setDocuments] = useState<Document[]>(initialDocuments)

  // Preview modal state
  const [previewDoc, setPreviewDoc] = useState<{
    label: string
    url: string
    name?: string
  } | null>(null)

  const fetchDocuments = async () => {
    const supabase = getClient()
    const { data, error } = await supabase
      .rpc('initialize_order_documents', { p_order_id: order.id })

    if (!error && data) {
      setDocuments(data)
    }
  }

  const handleUpload = async (documentKey: string, file: File) => {
    const supabase = getClient()

    // Verify auth session exists before upload
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Not authenticated - please sign in again')
    }

    // Upload to storage
    const fileExt = file.name.split('.').pop()
    const filePath = `orders/${order.id}/documents/${documentKey}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('order-documents')
      .upload(filePath, file, { upsert: true })

    if (uploadError) throw uploadError

    // Store the file path (not URL) - we'll generate signed URLs on demand
    // Format: bucket-name/path for easy retrieval
    const storagePath = `order-documents/${filePath}`

    // Update document record using RPC
    const { data: updateResult, error: updateError } = await supabase
      .rpc('update_order_document', {
        p_order_id: order.id,
        p_document_key: documentKey,
        p_file_url: storagePath,
        p_file_name: file.name,
      })

    if (updateError) throw updateError

    if (updateResult && !updateResult.success) {
      throw new Error(updateResult.error || 'Failed to update document')
    }

    // Log to activity log
    await logCustomerDocumentUpload(order.id, file.name)

    // Refresh documents
    await fetchDocuments()
  }

  const handlePreview = async (documentKey: string, storagePath: string) => {
    const doc = documents.find(d => d.document_key === documentKey)

    // Generate signed URL for private bucket access
    const signedUrl = await getSignedUrl(storagePath)

    if (!signedUrl) {
      console.error('Failed to generate signed URL')
      return
    }

    setPreviewDoc({
      label: doc?.document_label || 'Document',
      url: signedUrl,
      name: doc?.file_name,
    })
  }

  return (
    <div className="container py-12 max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <Link href={`/orders/${order.id}`}>
          <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground -ml-4 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Order
          </Button>
        </Link>

        <h1 className="text-2xl font-semibold text-foreground mb-1">
          Upload Documents
        </h1>
        <p className="text-muted-foreground">
          Order #{order.order_number} - {order.service_package?.name}
        </p>
      </div>

      {/* Document Upload Wizard */}
      <DocumentUploadWizard
        documents={documents}
        onUpload={handleUpload}
        onComplete={() => router.push(`/orders/${order.id}`)}
        onPreview={handlePreview}
      />

      {/* Preview Modal */}
      {previewDoc && (
        <DocumentPreview
          isOpen={!!previewDoc}
          onClose={() => setPreviewDoc(null)}
          documentLabel={previewDoc.label}
          fileUrl={previewDoc.url}
          fileName={previewDoc.name}
        />
      )}
    </div>
  )
}
