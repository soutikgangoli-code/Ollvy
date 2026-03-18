'use client'

import { useMemo } from 'react'
import { DocumentUploadCard } from './DocumentUploadCard'
import { Progress } from '@/components/ui/progress'

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

interface DocumentChecklistProps {
  documents: Document[]
  onUpload: (documentKey: string, file: File) => Promise<void>
  onReplace: (documentKey: string, file: File) => Promise<void>
  onPreview: (documentKey: string, fileUrl: string) => void
}

export function DocumentChecklist({
  documents,
  onUpload,
  onReplace,
  onPreview,
}: DocumentChecklistProps) {
  // Group documents by stage
  const groupedDocs = useMemo(() => {
    const groups: Record<string, Document[]> = {}

    documents.forEach(doc => {
      const stage = doc.stage_key || 'doc_collection'
      if (!groups[stage]) {
        groups[stage] = []
      }
      groups[stage].push(doc)
    })

    return groups
  }, [documents])

  // Calculate progress
  const uploadedCount = documents.filter(d => d.uploaded_at).length
  const requiredCount = documents.filter(d => d.is_required).length
  const requiredUploaded = documents.filter(d => d.is_required && d.uploaded_at).length
  const progress = requiredCount > 0 ? Math.round((requiredUploaded / requiredCount) * 100) : 0

  // Stage labels
  const stageLabels: Record<string, string> = {
    doc_collection: 'Identity & Address Documents',
    dsc_procurement: 'Digital Signature Documents',
    dpin_application: 'DPIN Application Documents',
    filing: 'Filing Documents',
    monthly_filing: 'Monthly Filing Documents',
    onboarding: 'Onboarding Documents',
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-medium text-foreground">Document Progress</p>
            <p className="text-xs text-muted-foreground">
              {uploadedCount} of {documents.length} uploaded
            </p>
          </div>
          <span className="font-mono text-2xl font-bold text-foreground">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
        {progress < 100 && (
          <p className="text-xs text-muted-foreground mt-2">
            Upload all required documents to proceed
          </p>
        )}
      </div>

      {/* Document Groups */}
      {Object.entries(groupedDocs).map(([stage, docs]) => (
        <div key={stage} className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {stageLabels[stage] || stage.replace(/_/g, ' ')}
          </h3>
          <div className="space-y-3">
            {docs.map((doc) => (
              <DocumentUploadCard
                key={doc.id}
                documentKey={doc.document_key}
                documentLabel={doc.document_label}
                description={doc.description}
                tips={doc.tips}
                templateUrl={doc.template_url}
                isRequired={doc.is_required}
                uploadedAt={doc.uploaded_at}
                fileUrl={doc.file_url}
                fileName={doc.file_name}
                verifiedAt={doc.verified_at}
                rejectionReason={doc.rejection_reason}
                onUpload={(file) => onUpload(doc.document_key, file)}
                onReplace={(file) => onReplace(doc.document_key, file)}
                onPreview={() => doc.file_url && onPreview(doc.document_key, doc.file_url)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
