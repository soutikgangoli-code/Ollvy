'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import {
  Check,
  X,
  Upload,
  FileText,
  Eye,
  RefreshCw,
  AlertCircle,
  Loader2,
  Download,
  Info,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface DocumentUploadCardProps {
  documentKey: string
  documentLabel: string
  description?: string
  tips?: string[]
  templateUrl?: string
  isRequired: boolean
  uploadedAt?: string
  fileUrl?: string
  fileName?: string
  verifiedAt?: string
  rejectionReason?: string
  onUpload: (file: File) => Promise<void>
  onReplace: (file: File) => Promise<void>
  onPreview: () => void
}

export function DocumentUploadCard({
  documentKey,
  documentLabel,
  description,
  tips = [],
  templateUrl,
  isRequired,
  uploadedAt,
  fileUrl,
  fileName,
  verifiedAt,
  rejectionReason,
  onUpload,
  onReplace,
  onPreview,
}: DocumentUploadCardProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [showTips, setShowTips] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isUploaded = !!uploadedAt
  const isVerified = !!verifiedAt
  const isRejected = !!rejectionReason

  const handleFileSelect = async (file: File) => {
    if (!file) return

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a PDF or image file (JPG, PNG)')
      return
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB')
      return
    }

    setIsUploading(true)
    try {
      if (isUploaded) {
        await onReplace(file)
      } else {
        await onUpload(file)
      }
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelect(file)
    // Reset input so same file can be selected again
    e.target.value = ''
  }

  return (
    <div
      className={cn(
        'border rounded-xl p-4 transition-all',
        isVerified
          ? 'border-[hsl(var(--ollvy-green))] bg-[hsl(var(--ollvy-green))]/5'
          : isRejected
          ? 'border-destructive bg-destructive/5'
          : isUploaded
          ? 'border-amber-500/50 bg-amber-500/5'
          : 'border-border',
        isDragging && 'border-[hsl(var(--ollvy-green))] bg-[hsl(var(--ollvy-green))]/10'
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleInputChange}
        className="hidden"
      />

      <div className="flex items-start gap-4">
        {/* Status Icon */}
        <div
          className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
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
            <Check className="h-5 w-5 text-[hsl(var(--ollvy-green))]" />
          ) : isRejected ? (
            <AlertCircle className="h-5 w-5 text-destructive" />
          ) : isUploaded ? (
            <FileText className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          ) : (
            <Upload className="h-5 w-5 text-muted-foreground" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-foreground">{documentLabel}</h4>
            {isRequired && !isUploaded && (
              <span className="text-xs text-destructive">*Required</span>
            )}
            {isVerified && (
              <span className="text-xs text-[hsl(var(--ollvy-green))] font-medium">Verified</span>
            )}
          </div>

          {/* Description or Status */}
          {isRejected ? (
            <p className="text-sm text-destructive mb-2">{rejectionReason}</p>
          ) : isUploaded ? (
            <p className="text-sm text-muted-foreground truncate mb-2">{fileName}</p>
          ) : description ? (
            <p className="text-sm text-muted-foreground mb-2">{description}</p>
          ) : null}

          {/* Tips Toggle */}
          {tips.length > 0 && !isUploaded && (
            <button
              type="button"
              onClick={() => setShowTips(!showTips)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-2"
            >
              <Info className="h-3 w-3" />
              {showTips ? 'Hide tips' : 'Show tips'}
            </button>
          )}

          {/* Tips List */}
          {showTips && tips.length > 0 && (
            <ul className="space-y-1 mb-3">
              {tips.map((tip, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                  <Check className="h-3 w-3 text-[hsl(var(--ollvy-green))] flex-shrink-0 mt-0.5" />
                  {tip}
                </li>
              ))}
            </ul>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {isUploaded ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onPreview}
                  className="gap-1.5"
                >
                  <Eye className="h-3.5 w-3.5" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClick}
                  disabled={isUploading}
                  className="gap-1.5"
                >
                  {isUploading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <RefreshCw className="h-3.5 w-3.5" />
                  )}
                  Replace
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClick}
                disabled={isUploading}
                className="gap-1.5"
              >
                {isUploading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Upload className="h-3.5 w-3.5" />
                )}
                {isUploading ? 'Uploading...' : 'Upload'}
              </Button>
            )}

            {templateUrl && !isUploaded && (
              <a href={templateUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
                  <Download className="h-3.5 w-3.5" />
                  Template
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
