'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { useToast } from '@/lib/hooks/use-toast'
import {
  uploadAdminDocument,
  createRound,
  adminUploadFile,
} from '@/app/(admin)/admin/orders/[orderId]/actions'
import type { OrderRound } from '@/lib/types'

export interface QuickUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  orderId: string
  rounds: OrderRound[]
}

export function QuickUploadDialog({
  open,
  onOpenChange,
  orderId,
  rounds,
}: QuickUploadDialogProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [uploadTag, setUploadTag] = useState<string>('')
  const [uploadLabel, setUploadLabel] = useState('')
  const [uploadDescription, setUploadDescription] = useState('')
  const [signedUploadLabel, setSignedUploadLabel] = useState('') // For "for_signing" - label for customer's signed upload
  const [stagedFile, setStagedFile] = useState<{ fileUrl: string; fileName: string } | null>(null)
  const [selectedRoundId, setSelectedRoundId] = useState<string>('')
  const [notifyUser, setNotifyUser] = useState(true)

  // Get existing rounds (excluding Round 0)
  const existingRounds = rounds.filter(r => r.round_number > 0)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('orderId', orderId)

      const { storagePath, fileName } = await adminUploadFile(formData)
      setStagedFile({ fileUrl: storagePath, fileName })
      if (!uploadLabel) setUploadLabel(fileName)
    } catch (err) {
      toast({ title: 'Upload failed', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!stagedFile || !uploadTag || !uploadLabel.trim()) {
      toast({ title: 'Please fill in all required fields', variant: 'destructive' })
      return
    }

    // For signing documents, require the signed upload label
    if (uploadTag === 'for_signing' && !signedUploadLabel.trim()) {
      toast({ title: 'Please provide a label for the signed document upload', variant: 'destructive' })
      return
    }

    setLoading(true)
    try {
      // If no round selected, create a new round for this upload
      if (!selectedRoundId) {
        const formData = {
          title: uploadTag === 'for_signing'
            ? `Sign: ${uploadLabel.trim()}`
            : `Document: ${uploadLabel.trim()}`,
          questions: [],
          docRequests: [],
          adminUpload: {
            tag: uploadTag,
            label: uploadLabel.trim(),
            description: uploadDescription.trim() || undefined,
            fileUrl: stagedFile.fileUrl,
            fileName: stagedFile.fileName,
            signLabel: uploadTag === 'for_signing' ? signedUploadLabel.trim() : undefined,
          },
          notificationMessage: notifyUser ? getNotificationMessage(uploadTag) : undefined,
          isVisibleToUser: true,
        }
        await createRound(orderId, formData)
      } else {
        // Upload to existing round
        await uploadAdminDocument(
          orderId,
          selectedRoundId,
          stagedFile.fileUrl,
          stagedFile.fileName,
          uploadTag,
          uploadLabel.trim(),
          uploadDescription.trim() || null,
          uploadTag === 'for_signing' ? signedUploadLabel.trim() : undefined
        )
      }

      toast({ title: 'Document uploaded successfully' })
      onOpenChange(false)
      resetForm()
    } catch (err) {
      toast({ title: 'Error uploading document', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setUploadTag('')
    setUploadLabel('')
    setUploadDescription('')
    setSignedUploadLabel('')
    setStagedFile(null)
    setSelectedRoundId('')
    setNotifyUser(true)
  }

  const getNotificationMessage = (tag: string) => {
    switch (tag) {
      case 'for_signing':
        return 'We have shared a document for your signature. Please check your order.'
      case 'government_processing':
        return 'Your application has been submitted to the government. We will update you on progress.'
      case 'final_output':
        return 'Your final document is ready! Please download it from your order page.'
      default:
        return 'A new document has been added to your order.'
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) resetForm() }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Upload */}
          <div className="space-y-2">
            <Label>Select File *</Label>
            <input type="file" onChange={handleFileUpload} className="text-sm w-full" />
            {stagedFile && (
              <p className="text-xs text-green-600">Uploaded: {stagedFile.fileName}</p>
            )}
          </div>

          {/* Tag */}
          <div className="space-y-2">
            <Label>Document Type *</Label>
            <Select value={uploadTag} onValueChange={setUploadTag}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="for_signing">For Signing (customer needs to sign)</SelectItem>
                <SelectItem value="government_processing">Government Processing (submitted to govt)</SelectItem>
                <SelectItem value="final_output">Final Output (deliverable)</SelectItem>
                <SelectItem value="informational">Informational (for reference)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Label */}
          <div className="space-y-2">
            <Label>Document Label *</Label>
            <Input
              placeholder="e.g., Certificate of Incorporation"
              value={uploadLabel}
              onChange={(e) => setUploadLabel(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description (optional)</Label>
            <Input
              placeholder="Additional details about this document"
              value={uploadDescription}
              onChange={(e) => setUploadDescription(e.target.value)}
            />
          </div>

          {/* For Signing: Customer upload label */}
          {uploadTag === 'for_signing' && (
            <div className="space-y-2 p-3 bg-muted rounded-lg">
              <Label>Signed Document Upload Label *</Label>
              <Input
                placeholder="e.g., Signed MOA, Stamped Agreement"
                value={signedUploadLabel}
                onChange={(e) => setSignedUploadLabel(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                This creates a document request for the customer to upload the signed version back.
              </p>
            </div>
          )}

          {/* Add to existing round or create new */}
          {existingRounds.length > 0 && (
            <div className="space-y-2">
              <Label>Add to Round (optional)</Label>
              <Select value={selectedRoundId} onValueChange={setSelectedRoundId}>
                <SelectTrigger>
                  <SelectValue placeholder="Create new round" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Create new round</SelectItem>
                  {existingRounds.map(round => (
                    <SelectItem key={round.id} value={round.id}>
                      Round {round.round_number}: {round.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Notify user */}
          {!selectedRoundId && (
            <div className="flex items-center gap-2">
              <Switch checked={notifyUser} onCheckedChange={setNotifyUser} />
              <Label>Notify user about this document</Label>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !stagedFile || !uploadTag || !uploadLabel.trim() || (uploadTag === 'for_signing' && !signedUploadLabel.trim())}
          >
            {loading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
