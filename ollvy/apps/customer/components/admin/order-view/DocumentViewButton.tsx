'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/lib/hooks/use-toast'
import { adminGetSignedUrls } from '@/app/(admin)/admin/orders/[orderId]/actions'

export interface DocumentViewButtonProps {
  fileUrl: string
  bucket: 'order-documents' | 'work-documents'
  label?: string
  download?: boolean
  fileName?: string
}

export function DocumentViewButton({
  fileUrl,
  bucket,
  label = 'View',
  download = false,
  fileName,
}: DocumentViewButtonProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    try {
      const results = await adminGetSignedUrls([{ url: fileUrl, bucket }])
      const result = results[0]
      if (!result?.signedUrl) {
        console.error('No signed URL returned for', { fileUrl, bucket })
        toast({
          title: 'Could not open file',
          description: 'File path may be invalid or storage is unreachable. Check console.',
          variant: 'destructive',
        })
        return
      }
      if (download) {
        const link = document.createElement('a')
        link.href = result.signedUrl
        link.download = fileName || 'download'
        link.target = '_blank'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        window.open(result.signedUrl, '_blank')
      }
    } catch (error) {
      console.error('Failed to get signed URL:', error)
      toast({ title: 'Failed to open file', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleClick} disabled={loading}>
      {loading ? 'Loading...' : label}
    </Button>
  )
}
