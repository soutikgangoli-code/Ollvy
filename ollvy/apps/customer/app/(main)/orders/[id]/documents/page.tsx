'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { getClient } from '@/lib/supabase'
import { useAuthStore } from '@/lib/stores/auth-store'
import { DocumentChecklist, DocumentPreview } from '@/components/documents'
import { ArrowLeft, MessageCircle, HelpCircle } from 'lucide-react'

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
  service_package: {
    name: string
    slug: string
  }
}

export default function DocumentsUploadPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string
  const { user } = useAuthStore()

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
    if (!user) {
      router.push('/login')
      return
    }
    fetchOrderAndDocuments()
  }, [orderId, user])

  const fetchOrderAndDocuments = async () => {
    if (!orderId) return

    try {
      const supabase = getClient()

      // Fetch order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          service_package_id,
          service_package:service_packages(
            name,
            slug
          )
        `)
        .eq('id', orderId)
        .single()

      if (orderError) throw orderError

      setOrder({
        ...orderData,
        service_package: orderData.service_package as any,
      })

      // Fetch documents
      const { data: docsData, error: docsError } = await supabase
        .from('order_documents')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: true })

      if (docsError) throw docsError

      // If no documents exist yet, fetch templates and create them
      if (!docsData || docsData.length === 0) {
        // Try to get documents from service templates
        const { data: templatesData } = await supabase
          .from('service_document_templates')
          .select('*')
          .eq('service_package_id', orderData.service_package_id)
          .order('display_order', { ascending: true })

        if (templatesData && templatesData.length > 0) {
          // Insert documents from templates
          const docsToInsert = templatesData.map(t => ({
            order_id: orderId,
            document_key: t.document_key,
            document_label: t.document_label,
            stage_key: t.stage_key,
            is_required: t.is_required,
          }))

          const { data: insertedDocs } = await supabase
            .from('order_documents')
            .insert(docsToInsert)
            .select()

          // Merge template tips with inserted docs
          const mergedDocs = (insertedDocs || []).map(d => {
            const template = templatesData.find(t => t.document_key === d.document_key)
            return {
              ...d,
              description: template?.description,
              tips: template?.tips,
              template_url: template?.template_url,
            }
          })

          setDocuments(mergedDocs)
        }
      } else {
        // Fetch template details for tips/descriptions
        const { data: templatesData } = await supabase
          .from('service_document_templates')
          .select('document_key, description, tips, template_url')
          .eq('service_package_id', orderData.service_package_id)

        // Merge template data with document data
        const mergedDocs = docsData.map(d => {
          const template = templatesData?.find(t => t.document_key === d.document_key)
          return {
            ...d,
            description: template?.description,
            tips: template?.tips,
            template_url: template?.template_url,
          }
        })

        setDocuments(mergedDocs)
      }
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

    // Update document record
    const { error: updateError } = await supabase
      .from('order_documents')
      .update({
        file_url: urlData.publicUrl,
        file_name: file.name,
        uploaded_at: new Date().toISOString(),
        rejection_reason: null, // Clear any previous rejection
      })
      .eq('order_id', orderId)
      .eq('document_key', documentKey)

    if (updateError) throw updateError

    // Refresh documents
    await fetchOrderAndDocuments()
  }

  const handleReplace = async (documentKey: string, file: File) => {
    // Same as upload since we use upsert
    await handleUpload(documentKey, file)
  }

  const handlePreview = (documentKey: string, fileUrl: string) => {
    const doc = documents.find(d => d.document_key === documentKey)
    setPreviewDoc({
      label: doc?.document_label || 'Document',
      url: fileUrl,
      name: doc?.file_name,
    })
  }

  if (isLoading) {
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

      {/* Document Checklist */}
      <DocumentChecklist
        documents={documents}
        onUpload={handleUpload}
        onReplace={handleReplace}
        onPreview={handlePreview}
      />

      {/* Help Section */}
      <div className="mt-8 p-5 bg-muted/30 rounded-xl">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
            <HelpCircle className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-medium text-foreground mb-1">Need help with documents?</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Our team is available to help you with document requirements and clarifications.
            </p>
            <a
              href={`https://wa.me/919876543210?text=Hi, I need help with documents for order ${order.order_number}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm" className="gap-2">
                <MessageCircle className="h-4 w-4" />
                WhatsApp Us
              </Button>
            </a>
          </div>
        </div>
      </div>

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
