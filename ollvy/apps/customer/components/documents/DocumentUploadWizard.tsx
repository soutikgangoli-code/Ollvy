'use client'

import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { useToast } from '@/lib/hooks/use-toast'
import { getWhatsAppLink } from '@/lib/constants'
import {
  Upload,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  FileText,
  Image as ImageIcon,
  X,
  Sparkles,
  ChevronRight,
  Eye,
  RefreshCw,
  Info,
  Loader2,
} from 'lucide-react'

interface Document {
  id: string
  document_key: string
  document_label: string
  description?: string
  tips?: string[]
  template_url?: string
  is_required: boolean
  uploaded_at?: string
  file_url?: string
  file_name?: string
  verified_at?: string
  rejection_reason?: string
}

interface DocumentUploadWizardProps {
  documents: Document[]
  onUpload: (documentKey: string, file: File) => Promise<void>
  onComplete: () => void
  onPreview?: (documentKey: string, fileUrl: string) => void
}

export function DocumentUploadWizard({
  documents,
  onUpload,
  onComplete,
  onPreview,
}: DocumentUploadWizardProps) {
  // Start at the first document that hasn't been uploaded yet
  const getFirstIncompleteIndex = () => {
    const index = documents.findIndex(d => !d.uploaded_at)
    // If all uploaded, start at last one (for review/replace)
    return index === -1 ? Math.max(0, documents.length - 1) : index
  }

  const [currentIndex, setCurrentIndex] = useState(() => getFirstIncompleteIndex())
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedInSession, setUploadedInSession] = useState<Set<string>>(new Set())
  const [showCompletion, setShowCompletion] = useState(false)
  const hasInitialized = useRef(false)
  const { toast } = useToast()

  // Update index when documents load/change (only on first meaningful load)
  useEffect(() => {
    if (documents.length > 0 && !hasInitialized.current) {
      hasInitialized.current = true
      const firstIncomplete = getFirstIncompleteIndex()
      if (firstIncomplete !== currentIndex) {
        setCurrentIndex(firstIncomplete)
      }
    }
  }, [documents])

  // Scroll to top on every doc change (Next/Skip/Back/auto-advance/completion)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentIndex, showCompletion])

  const currentDoc = documents[currentIndex]
  const totalDocs = documents.length
  const uploadedCount = documents.filter(d => d.uploaded_at || uploadedInSession.has(d.document_key)).length
  // Progress based on current position (more intuitive)
  const progress = totalDocs > 0 ? ((currentIndex + 1) / totalDocs) * 100 : 0

  const isCurrentUploaded = currentDoc?.uploaded_at || uploadedInSession.has(currentDoc?.document_key)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0 || !currentDoc) return

    const file = acceptedFiles[0]

    // File size validation (20MB max)
    const maxSizeBytes = 20 * 1024 * 1024
    if (file.size > maxSizeBytes) {
      toast({
        title: 'File too large',
        description: 'Maximum file size is 20MB.',
        variant: 'destructive',
      })
      return
    }

    setIsUploading(true)
    try {
      await onUpload(currentDoc.document_key, file)
      setUploadedInSession(prev => new Set(prev).add(currentDoc.document_key))

      // Auto-advance after short delay
      setTimeout(() => {
        if (currentIndex < totalDocs - 1) {
          setCurrentIndex(currentIndex + 1)
        } else {
          setShowCompletion(true)
        }
      }, 800)
    } catch (error) {
      console.error('Upload failed:', error)
      toast({
        title: 'Upload failed',
        description: 'Please try again or contact support.',
        variant: 'destructive',
      })
    } finally {
      setIsUploading(false)
    }
  }, [currentDoc, currentIndex, totalDocs, onUpload, toast])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.heic', '.heif'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/zip': ['.zip'],
      'application/x-zip-compressed': ['.zip'],
    },
  })

  const goNext = () => {
    if (currentIndex < totalDocs - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setShowCompletion(true)
    }
  }

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleComplete = () => {
    onComplete()
  }

  // Completion screen
  if (showCompletion) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center text-center px-6">
        <div className="w-20 h-20 rounded-full bg-[hsl(var(--ollvy-green))]/20 flex items-center justify-center mb-6 animate-in zoom-in-50 duration-500">
          <Sparkles className="h-10 w-10 text-[hsl(var(--ollvy-green))]" />
        </div>

        <h2 className="text-2xl font-semibold text-foreground mb-2 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
          Documents Submitted!
        </h2>

        <p className="text-muted-foreground mb-8 max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
          {uploadedCount === totalDocs
            ? "You've uploaded all documents. Our team will review them shortly."
            : `You've uploaded ${uploadedCount} of ${totalDocs} documents. You can always come back to upload the rest.`
          }
        </p>

        <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
          {uploadedCount < totalDocs && (
            <Button
              variant="outline"
              onClick={() => setShowCompletion(false)}
            >
              Upload More
            </Button>
          )}
          <Button onClick={handleComplete} className="gap-2">
            Continue
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  if (!currentDoc) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <p className="text-muted-foreground">No documents to upload</p>
      </div>
    )
  }

  const fileIcon = currentDoc.document_key.includes('photo') || currentDoc.document_key.includes('logo')
    ? ImageIcon
    : FileText

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">
              {currentDoc?.document_label}
            </p>
            <p className="text-xs text-muted-foreground font-mono">
              {currentIndex + 1} of {totalDocs} - {uploadedCount} uploaded
            </p>
          </div>
          <span className="text-2xl font-semibold text-foreground font-mono">
            {Math.round(progress)}%
          </span>
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>

      {/* Document Card */}
      <div
        key={currentDoc.document_key}
        className="animate-in fade-in slide-in-from-right-4 duration-300"
      >
        {/* Document Info */}
        <div className="mb-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              {React.createElement(fileIcon, { className: "h-6 w-6 text-primary" })}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-semibold text-foreground mb-1">
                {currentDoc.document_label}
              </h2>
              {currentDoc.description && (
                <p className="text-muted-foreground text-sm">
                  {currentDoc.description}
                </p>
              )}
            </div>
          </div>

          {/* Tips */}
          {currentDoc.tips && currentDoc.tips.length > 0 && (
            <div className="bg-muted/50 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <Info className="h-3.5 w-3.5" />
                Tips
              </div>
              <ul className="space-y-1.5">
                {currentDoc.tips.map((tip, i) => (
                  <li key={i} className="text-sm text-foreground flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Upload Zone or Uploaded State */}
        {isCurrentUploaded ? (
          <div className="border-2 border-[hsl(var(--ollvy-green))]/30 bg-[hsl(var(--ollvy-green))]/5 rounded-2xl p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-[hsl(var(--ollvy-green))]/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-7 w-7 text-[hsl(var(--ollvy-green))]" />
            </div>
            <p className="font-medium text-foreground mb-1">Uploaded</p>
            <p className="text-sm text-muted-foreground mb-4">
              {currentDoc.file_name || 'Document uploaded successfully'}
            </p>
            <div className="flex items-center justify-center gap-2">
              {currentDoc.file_url && onPreview && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPreview(currentDoc.document_key, currentDoc.file_url!)}
                  className="gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Preview
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                {...getRootProps()}
                className="gap-2"
              >
                <input {...getInputProps()} />
                <RefreshCw className="h-4 w-4" />
                Replace
              </Button>
            </div>
          </div>
        ) : (
          <div
            {...getRootProps()}
            className={cn(
              'border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200',
              isDragActive
                ? 'border-primary bg-primary/5 scale-[1.02]'
                : 'border-border hover:border-primary/50 hover:bg-muted/30',
              isUploading && 'pointer-events-none opacity-70'
            )}
          >
            <input {...getInputProps()} />

            {isUploading ? (
              <>
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Loader2 className="h-7 w-7 text-primary animate-spin" />
                </div>
                <p className="font-medium text-foreground">Uploading...</p>
              </>
            ) : isDragActive ? (
              <>
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Upload className="h-7 w-7 text-primary" />
                </div>
                <p className="font-medium text-foreground">Drop it here</p>
              </>
            ) : (
              <>
                <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-7 w-7 text-muted-foreground" />
                </div>
                <p className="font-medium text-foreground mb-1">
                  Drag & drop or click to upload
                </p>
                <p className="text-sm text-muted-foreground">
                  PNG, JPG, PDF, DOC, DOCX, XLS, XLSX, or ZIP up to 20MB
                </p>
              </>
            )}
          </div>
        )}

        {/* Template Download */}
        {currentDoc.template_url && (
          <div className="mt-4 text-center">
            <a
              href={currentDoc.template_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline inline-flex items-center gap-1"
            >
              <FileText className="h-4 w-4" />
              Download template
            </a>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button
          variant="ghost"
          onClick={goPrev}
          disabled={currentIndex === 0}
          className={cn('gap-2', currentIndex === 0 && 'invisible')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <Button
          onClick={goNext}
          className="gap-2"
        >
          {currentIndex === totalDocs - 1 ? (
            <>
              Finish
              <CheckCircle2 className="h-4 w-4" />
            </>
          ) : isCurrentUploaded ? (
            <>
              Next
              <ArrowRight className="h-4 w-4" />
            </>
          ) : (
            <>
              Skip
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      {/* WhatsApp Support */}
      <div className="text-center pt-4">
        <p className="text-sm text-muted-foreground">
          Need help with documents?{' '}
          <a
            href={getWhatsAppLink('Hi, I need help uploading documents')}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            WhatsApp Us
          </a>
        </p>
      </div>
    </div>
  )
}
