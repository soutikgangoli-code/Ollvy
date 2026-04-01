'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Download, ExternalLink, X, FileText, Image, Loader2 } from 'lucide-react'
import { downloadFile, getSignedUrl } from '@/lib/storage'

interface DocumentPreviewProps {
  isOpen: boolean
  onClose: () => void
  documentLabel: string
  fileUrl: string  // Can be a signed URL (ready to use) or storage path (needs signing)
  fileName?: string
}

export function DocumentPreview({
  isOpen,
  onClose,
  documentLabel,
  fileUrl,
  fileName,
}: DocumentPreviewProps) {
  const [imageError, setImageError] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [opening, setOpening] = useState(false)

  const isPdf = fileUrl?.toLowerCase().endsWith('.pdf') ||
    fileName?.toLowerCase().endsWith('.pdf')
  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileUrl || '') ||
    /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName || '')

  // Check if the URL is already signed (contains token parameter or is a full https URL with signature)
  const isAlreadySigned = fileUrl?.includes('token=') || fileUrl?.includes('?')

  const handleDownload = async () => {
    setDownloading(true)
    try {
      await downloadFile(fileUrl, fileName || 'document')
    } catch (error) {
      console.error('Download failed:', error)
    } finally {
      setDownloading(false)
    }
  }

  const handleOpenInNewTab = async () => {
    setOpening(true)
    try {
      // If already signed, use directly; otherwise get signed URL
      const urlToOpen = isAlreadySigned ? fileUrl : await getSignedUrl(fileUrl)
      if (urlToOpen) {
        window.open(urlToOpen, '_blank')
      }
    } catch (error) {
      console.error('Failed to open:', error)
    } finally {
      setOpening(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle>{documentLabel}</DialogTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleOpenInNewTab} disabled={opening}>
                {opening ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <ExternalLink className="h-4 w-4 mr-1" />
                )}
                Open
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload} disabled={downloading}>
                {downloading ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-1" />
                )}
                Download
              </Button>
            </div>
          </div>
          {fileName && (
            <p className="text-sm text-muted-foreground">{fileName}</p>
          )}
        </DialogHeader>

        <div className="flex-1 overflow-auto min-h-0 mt-4 bg-muted/50 rounded-lg">
          {isPdf ? (
            <div className="w-full h-[70vh]">
              <iframe
                src={`${fileUrl}#toolbar=1`}
                className="w-full h-full rounded-lg"
                title={documentLabel}
              />
            </div>
          ) : isImage && !imageError ? (
            <div className="flex items-center justify-center p-4">
              <img
                src={fileUrl}
                alt={documentLabel}
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
                onError={() => setImageError(true)}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FileText className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                Preview not available for this file type
              </p>
              <Button onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download to view
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
