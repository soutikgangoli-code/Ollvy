'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { useToast } from '@/lib/hooks/use-toast'
import {
  createRound,
  adminUploadFile,
} from '@/app/(admin)/admin/orders/[orderId]/actions'
import type { OrderDocument } from '@/lib/types'

export interface AddRoundDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  orderId: string
  initialDocs: OrderDocument[]
}

export function AddRoundDialog({
  open,
  onOpenChange,
  orderId,
  initialDocs,
}: AddRoundDialogProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const [title, setTitle] = useState('')
  const [includeQuestions, setIncludeQuestions] = useState(false)
  const [includeDocs, setIncludeDocs] = useState(false)
  const [includeUpload, setIncludeUpload] = useState(false)
  const [questions, setQuestions] = useState<string[]>([''])
  const [docRequests, setDocRequests] = useState<Array<{ label: string; description: string; checked: boolean; isReupload?: boolean; reuploadId?: string }>>([])
  const [notificationMessage, setNotificationMessage] = useState('')
  const [isVisibleToUser, setIsVisibleToUser] = useState(true)

  // Admin upload state
  const [uploadTag, setUploadTag] = useState<string>('')
  const [uploadLabel, setUploadLabel] = useState('')
  const [uploadDescription, setUploadDescription] = useState('')
  const [uploadSignLabel, setUploadSignLabel] = useState('')
  const [stagedFile, setStagedFile] = useState<{ fileUrl: string; fileName: string } | null>(null)

  // Get rejected initial docs for pre-fill prompt
  const rejectedInitialDocs = initialDocs.filter(d => d.rejection_reason)

  const handleAddQuestion = () => {
    setQuestions([...questions, ''])
  }

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions]
    newQuestions[index] = value
    setQuestions(newQuestions)
  }

  const handleAddDocRequest = () => {
    setDocRequests([...docRequests, { label: '', description: '', checked: true }])
  }

  const handleDocRequestChange = (index: number, field: 'label' | 'description', value: string) => {
    const newDocRequests = [...docRequests]
    newDocRequests[index][field] = value
    setDocRequests(newDocRequests)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    try {
      // Use server action to upload via service role (bypasses RLS)
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
    if (!title.trim()) {
      toast({ title: 'Title required', variant: 'destructive' })
      return
    }

    setLoading(true)
    try {
      const formData = {
        title: title.trim(),
        questions: includeQuestions ? questions.filter(q => q.trim()) : [],
        docRequests: includeDocs ? docRequests.filter(d => d.checked && d.label.trim()).map(d => ({
          label: d.label.trim(),
          description: d.description.trim() || undefined,
          isReuploadOfWorkDocId: d.reuploadId,
        })) : [],
        adminUpload: includeUpload && stagedFile ? {
          tag: uploadTag,
          label: uploadLabel.trim(),
          description: uploadDescription.trim() || undefined,
          fileUrl: stagedFile.fileUrl,
          fileName: stagedFile.fileName,
          signLabel: uploadTag === 'for_signing' ? uploadSignLabel.trim() : undefined,
        } : undefined,
        notificationMessage: notificationMessage.trim() || undefined,
        isVisibleToUser,
      }

      await createRound(orderId, formData)
      toast({ title: 'Round created' })
      onOpenChange(false)

      // Reset form
      setTitle('')
      setIncludeQuestions(false)
      setIncludeDocs(false)
      setIncludeUpload(false)
      setQuestions([''])
      setDocRequests([])
      setNotificationMessage('')
      setStagedFile(null)
      setUploadTag('')
      setUploadLabel('')
      setUploadDescription('')
      setUploadSignLabel('')
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to create round', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  // Update notification message based on selections
  const getDefaultMessage = () => {
    if (includeQuestions && !includeDocs && !includeUpload) {
      return 'We have some additional questions for you. Please see the latest step in your order.'
    }
    if (includeDocs && !includeQuestions && !includeUpload) {
      return 'We need some additional documents. Please see the latest step in your order.'
    }
    if (uploadTag === 'for_signing') {
      return 'We have shared a document for your signature. Please see the latest step in your order.'
    }
    if (uploadTag === 'government_processing') {
      return 'Your application has been submitted to the government. We will update you when we hear back.'
    }
    if (uploadTag === 'final_output') {
      return 'Your final document is ready. Please download it from your order page.'
    }
    return 'Action required on your order. Please see the latest step in your order.'
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Round</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label>Round Title *</Label>
            <Input
              placeholder="e.g., Additional Information Required"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Checkboxes */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Switch checked={includeQuestions} onCheckedChange={setIncludeQuestions} />
              <Label>Include Questions</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={includeDocs} onCheckedChange={setIncludeDocs} />
              <Label>Include Document Requests</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={includeUpload} onCheckedChange={setIncludeUpload} />
              <Label>Include Admin Upload</Label>
            </div>
          </div>

          {/* Questions */}
          {includeQuestions && (
            <div className="space-y-3">
              <Label>Questions</Label>
              {questions.map((q, i) => (
                <Input
                  key={i}
                  placeholder="Enter question..."
                  value={q}
                  onChange={(e) => handleQuestionChange(i, e.target.value)}
                />
              ))}
              <Button type="button" variant="ghost" size="sm" onClick={handleAddQuestion}>
                + Add another question
              </Button>
            </div>
          )}

          {/* Document Requests */}
          {includeDocs && (
            <div className="space-y-3">
              <Label>Document Requests</Label>

              {/* Pre-fill rejected docs */}
              {rejectedInitialDocs.length > 0 && (
                <div className="text-xs text-muted-foreground mb-2">
                  Rejected initial documents (auto-added):
                </div>
              )}

              {docRequests.map((doc, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    placeholder="Document label"
                    value={doc.label}
                    onChange={(e) => handleDocRequestChange(i, 'label', e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Description (optional)"
                    value={doc.description}
                    onChange={(e) => handleDocRequestChange(i, 'description', e.target.value)}
                    className="flex-1"
                  />
                </div>
              ))}
              <Button type="button" variant="ghost" size="sm" onClick={handleAddDocRequest}>
                + Add document request
              </Button>
            </div>
          )}

          {/* Admin Upload */}
          {includeUpload && (
            <div className="space-y-3">
              <Label>Admin Upload</Label>
              <input type="file" onChange={handleFileUpload} className="text-sm" />
              {stagedFile && (
                <p className="text-xs text-green-600">Uploaded: {stagedFile.fileName}</p>
              )}
              <Select value={uploadTag} onValueChange={setUploadTag}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="for_signing">For Signing</SelectItem>
                  <SelectItem value="government_processing">Government Processing</SelectItem>
                  <SelectItem value="final_output">Final Output</SelectItem>
                  <SelectItem value="informational">Informational</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Document label"
                value={uploadLabel}
                onChange={(e) => setUploadLabel(e.target.value)}
              />
              <Input
                placeholder="Description (optional)"
                value={uploadDescription}
                onChange={(e) => setUploadDescription(e.target.value)}
              />
              {uploadTag === 'for_signing' && (
                <Input
                  placeholder="Label for signed upload request"
                  value={uploadSignLabel}
                  onChange={(e) => setUploadSignLabel(e.target.value)}
                />
              )}
            </div>
          )}

          {/* Notification */}
          <div className="space-y-2">
            <Label>Notification Message</Label>
            <Textarea
              placeholder={getDefaultMessage()}
              value={notificationMessage}
              onChange={(e) => setNotificationMessage(e.target.value)}
            />
          </div>

          {/* Visibility */}
          <div className="flex items-center gap-2">
            <Switch checked={isVisibleToUser} onCheckedChange={setIsVisibleToUser} />
            <Label>Visible to user</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading || !title.trim()}>
            Create Round
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
