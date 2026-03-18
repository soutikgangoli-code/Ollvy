'use client'

import { useState, useRef } from 'react'
import { Upload, FileText, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UploadDropzoneProps {
  onUpload: (file: File) => Promise<void>
  accept?: string
  maxSize?: number // in bytes
  label?: string
  sublabel?: string
}

export function UploadDropzone({
  onUpload,
  accept = '.pdf,.jpg,.jpeg,.png',
  maxSize = 10 * 1024 * 1024, // 10MB
  label = 'Drop your file here',
  sublabel = 'or click to browse',
}: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    setError(null)

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a PDF or image file (JPG, PNG)')
      return
    }

    // Validate file size
    if (file.size > maxSize) {
      setError(`File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`)
      return
    }

    setSelectedFile(file)
    setIsUploading(true)
    try {
      await onUpload(file)
    } catch (err: any) {
      setError(err.message || 'Upload failed')
    } finally {
      setIsUploading(false)
      setSelectedFile(null)
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

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelect(file)
    e.target.value = ''
  }

  const clearFile = () => {
    setSelectedFile(null)
    setError(null)
  }

  return (
    <div
      className={cn(
        'relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer',
        isDragging
          ? 'border-[hsl(var(--ollvy-green))] bg-[hsl(var(--ollvy-green))]/5'
          : 'border-border hover:border-muted-foreground/50',
        error && 'border-destructive bg-destructive/5'
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
      />

      {isUploading ? (
        <div className="space-y-3">
          <Loader2 className="h-10 w-10 mx-auto text-[hsl(var(--ollvy-green))] animate-spin" />
          <p className="text-sm text-foreground">
            Uploading {selectedFile?.name}...
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="w-14 h-14 rounded-full bg-muted mx-auto flex items-center justify-center">
            {isDragging ? (
              <FileText className="h-7 w-7 text-[hsl(var(--ollvy-green))]" />
            ) : (
              <Upload className="h-7 w-7 text-muted-foreground" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{label}</p>
            <p className="text-xs text-muted-foreground mt-1">{sublabel}</p>
          </div>
          <p className="text-xs text-muted-foreground">
            PDF, JPG, PNG up to {Math.round(maxSize / (1024 * 1024))}MB
          </p>
        </div>
      )}

      {error && (
        <div className="mt-3 flex items-center justify-center gap-2 text-sm text-destructive">
          <X className="h-4 w-4" />
          {error}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              clearFile()
            }}
            className="underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  )
}
