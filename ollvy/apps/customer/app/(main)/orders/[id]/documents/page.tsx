'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { getClient } from '@/lib/supabase'
import { useAuthStore } from '@/lib/stores/auth-store'
import { DocumentUploadWizard, DocumentPreview } from '@/components/documents'
import { ArrowLeft } from 'lucide-react'

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

export default function DocumentsUploadPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string
  const { user, isHydrated } = useAuthStore()

  const [order, setOrder] = useState<OrderData | null>(null)
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Preview modal state
  const [previewDoc, setPreviewDoc] = useState<{
    label: string
    url: string
    name?: string
  } | null>(null)

  useEffect(() => {
    if (!isHydrated) return

    if (!user) {
      router.push('/login')
      return
    }
    fetchOrderAndDocuments()
  }, [orderId, user, isHydrated])

  const fetchOrderAndDocuments = async () => {
    if (!orderId) return

    try {
      const supabase = getClient()

      // Fetch order and documents in PARALLEL
      const [orderResult, docsResult] = await Promise.all([
        supabase.rpc('get_user_order', { p_order_id: orderId }),
        supabase.rpc('initialize_order_documents', { p_order_id: orderId })
      ])

      if (orderResult.error) {
        console.error('Order fetch error:', orderResult.error)
        throw orderResult.error
      }

      const orderData = orderResult.data
      if (!orderData) {
        console.error('Order not found or access denied')
        setIsLoading(false)
        return
      }

      const servicePackage = orderData.service_package as { id: string; name: string; slug: string }

      // Check if questionnaire needs to be completed first
      if (!orderData.questionnaire_completed_at) {
        // Check if service has questionnaire questions
        const { count: questionCount } = await supabase
          .from('service_questionnaires')
          .select('id', { count: 'exact', head: true })
          .eq('service_package_id', servicePackage.id)
          .eq('is_active', true)

        if (questionCount && questionCount > 0) {
          router.push(`/orders/${orderId}/questionnaire`)
          return
        }
      }

      setOrder({
        id: orderData.id,
        order_number: orderData.order_number,
        questionnaire_completed_at: orderData.questionnaire_completed_at,
        service_package: servicePackage,
      })

      if (docsResult.error) {
        console.error('Documents fetch error:', docsResult.error)
        throw docsResult.error
      }

      setDocuments(docsResult.data || [])
    } catch (err) {
      console.error('Failed to fetch order:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpload = async (documentKey: string, file: File) => {
    const supabase = getClient()

    // Upload to storage
    const fileExt = file.name.split('.').pop()
    const filePath = `orders/${orderId}/documents/${documentKey}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('order-documents')
      .upload(filePath, file, { upsert: true })

    if (uploadError) throw uploadError

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('order-documents')
      .getPublicUrl(filePath)

    // Update document record using RPC
    const { data: updateResult, error: updateError } = await supabase
      .rpc('update_order_document', {
        p_order_id: orderId,
        p_document_key: documentKey,
        p_file_url: urlData.publicUrl,
        p_file_name: file.name,
      })

    if (updateError) throw updateError

    if (updateResult && !updateResult.success) {
      throw new Error(updateResult.error || 'Failed to update document')
    }

    // Refresh documents
    await fetchOrderAndDocuments()
  }

  const handlePreview = (documentKey: string, fileUrl: string) => {
    const doc = documents.find(d => d.document_key === documentKey)
    setPreviewDoc({
      label: doc?.document_label || 'Document',
      url: fileUrl,
      name: doc?.file_name,
    })
  }

  if (!isHydrated || isLoading) {
    return (
      <div className="container py-12 max-w-3xl">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64 mb-8" />
        <Skeleton className="h-24 rounded-xl mb-6" />
        <div className="space-y-3">
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground">Order not found</p>
        <Link href="/orders">
          <Button className="mt-4">View All Orders</Button>
        </Link>
      </div>
    )
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
