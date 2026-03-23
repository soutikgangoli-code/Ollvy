# Ollvy: Chat + Round Questions + Round Uploads

## BEFORE YOU START: Prerequisites

This is Document 2 of 3. Before building anything in this file:
1. All migrations from `ollvy_admin_build.md` (Document 1) must already be run in Supabase.
   These tables must exist: `order_rounds`, `round_question_requests`, `round_notifications`,
   `order_work_documents` (with `round_id`, `tag`, `linked_request_id` columns).
2. `lib/admin/get-admin-user.ts` helper must already be created (from Document 1).
3. `AdminChatWindow` built in this file will be wired into the admin order view built in Document 1.

Build these tasks in this priority order. Do not touch anything outside the files
specified. Do not use em dashes anywhere in code or copy.

---

## Context

Existing tables confirmed in DB:
- `chat_messages`: id, conversation_id, sender_id, sender_type (user|professional|system),
  content, sent_at, file_url, file_name, message_type (text|file|system)
- `order_work_documents`: id, order_id, direction, document_label, description, status,
  file_url, file_name, uploaded_at, uploaded_by_type, round_id, linked_request_id
- `round_question_requests`: id, round_id, question_text, answer_text, answered_at, position
- `order_rounds`: id, order_id, round_number, title, status, is_visible_to_user

Storage buckets:
- `order-documents` -- for initial order_documents uploads
- `work-documents` -- for order_work_documents uploads (both admin and user)

Supabase clients:
- `import { getClient } from '@/lib/supabase'` -- for client components
- `import { supabaseServer } from '@/lib/supabase-server'` -- for server components
- `import { getEdgeFunctionUrl } from '@/lib/supabase'` -- for edge functions

Formatting utilities (always use these, never roll your own):
- `import { formatPaisa, formatDate, formatDateTime } from '@/lib/utils'`

User identification in client components:
- `const { user } = useAuthStore()` -- `user.id` is `users.id` (NOT `auth_user_id`)

Do NOT import `auth-store` or `questionnaire-store` in admin components.
Do NOT add a second `<Toaster />` anywhere -- already in root layout.

---

## TASK 1: Fix Customer Chat

The existing chat page at `app/(main)/orders/[id]/chat/page.tsx` renders `ChatWindow`
and is already functional. The order detail page has a placeholder "Chat with CA" card
that never wired up the real component.

### Step 1: Find the placeholder in the order detail page

In `apps/customer/app/(main)/orders/[id]/page.tsx`, find the "Chat with CA" card in
the right sidebar. It renders a static placeholder UI (no real messages, no input).

Replace it with the real `ChatWindow` component:

```tsx
import { ChatWindow } from '@/components/chat/ChatWindow'

// Replace the placeholder card with:
{order.chat_conversation_id ? (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle className="text-sm font-medium">Chat with your CA</CardTitle>
    </CardHeader>
    <CardContent className="p-0">
      <div className="h-[400px]">
        <ChatWindow
          conversationId={order.chat_conversation_id}
          professionalName={order.professionals?.display_name || order.professionals?.full_name || 'Your CA'}
        />
      </div>
    </CardContent>
  </Card>
) : (
  <Card>
    <CardContent className="py-6 text-center text-sm text-muted-foreground">
      Chat will be available once your order is assigned.
    </CardContent>
  </Card>
)}
```

That is the entire customer chat fix. `ChatWindow` already handles realtime, message
history, file uploads, and auto-scroll. Do not modify `ChatWindow.tsx`.

---

## TASK 2: Admin Chat

`ChatWindow` hardcodes `sender_type: 'user'` and uses `useAuthStore().user.id`.
Admin is not in the `users` table -- admin is in `admin_users`. Cannot reuse `ChatWindow`.

Build a new `AdminChatWindow` component using `ChatInput` and `MessageBubble` directly.

### Create `apps/customer/components/chat/AdminChatWindow.tsx`

```tsx
'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { getClient } from '@/lib/supabase'
import { ChatInput } from './ChatInput'
import { MessageBubble } from './MessageBubble'
import { formatDateTime } from '@/lib/utils'

interface AdminUser {
  id: string              // admin_users.id
  auth_user_id: string    // maps to Supabase auth UUID
  name: string
}

interface AdminChatWindowProps {
  conversationId: string
  adminUser: AdminUser
}

interface ChatMessage {
  id: string
  conversation_id: string
  sender_id: string | null
  sender_type: 'user' | 'professional' | 'system'
  content: string
  sent_at: string
  file_url?: string
  file_name?: string
  message_type: 'text' | 'file' | 'system'
}

export function AdminChatWindow({ conversationId, adminUser }: AdminChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const supabase = getClient()

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchMessages = useCallback(async () => {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('sent_at', { ascending: true })

    if (!error && data) {
      setMessages(data)
      setTimeout(scrollToBottom, 100)
    }
    setLoading(false)
  }, [conversationId])

  useEffect(() => {
    fetchMessages()

    const channel = supabase
      .channel(`admin-chat-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as ChatMessage])
          setTimeout(scrollToBottom, 100)
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [conversationId, fetchMessages])

  const handleSendMessage = async (content: string) => {
    setSending(true)
    const { error } = await supabase.from('chat_messages').insert({
      conversation_id: conversationId,
      sender_id: adminUser.auth_user_id,
      sender_type: 'professional',   // admin sends as professional
      content,
      message_type: 'text',
      sent_at: new Date().toISOString(),
    })
    if (error) console.error('Send error:', error)
    setSending(false)
  }

  const handleFileUpload = async (file: File) => {
    setSending(true)
    const ext = file.name.split('.').pop()
    const filePath = `${conversationId}/${Date.now()}-${file.name}`

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file, { upsert: true })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      setSending(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath)

    const { error } = await supabase.from('chat_messages').insert({
      conversation_id: conversationId,
      sender_id: adminUser.auth_user_id,
      sender_type: 'professional',
      content: `Shared a file: ${file.name}`,
      message_type: 'file',
      file_url: publicUrl,
      file_name: file.name,
      sent_at: new Date().toISOString(),
    })
    if (error) console.error('Message insert error:', error)
    setSending(false)
  }

  if (loading) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading chat...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-8">
            No messages yet. Start the conversation.
          </p>
        )}
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            // MessageBubble handles user/professional/system display
            // Professional messages (admin) align right, user messages align left
          />
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="border-t p-3 shrink-0">
        <ChatInput
          onSend={handleSendMessage}
          onFileUpload={handleFileUpload}
          disabled={sending}
        />
      </div>
    </div>
  )
}
```

### Wire AdminChatWindow into the Order View right panel

In `apps/customer/app/(admin)/admin/orders/[orderId]/page.tsx`, replace the chat
placeholder with:

```tsx
import { AdminChatWindow } from '@/components/chat/AdminChatWindow'

// In the right panel:
{order.chat_conversation_id ? (
  <div className="flex flex-col h-full">
    <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
      <span className="font-medium text-sm">Order Chat</span>
      <Badge variant="destructive" className="text-xs">User can see this</Badge>
    </div>
    <AdminChatWindow
      conversationId={order.chat_conversation_id}
      adminUser={{
        id: adminUser.id,
        auth_user_id: adminUser.auth_user_id,  // from session.user.id
        name: adminUser.name,
      }}
    />
  </div>
) : (
  <div className="flex-1 flex items-center justify-center p-6 text-center">
    <p className="text-sm text-muted-foreground">
      Chat unavailable. Payment may not have completed for this order.
    </p>
  </div>
)}
```

Pass `adminUser.auth_user_id` from the server component down to the client. The value
is `session.user.id` from the Supabase auth session fetched in the layout.

To pass it down: add it to the order fetch in the page server component, or pass it
as a prop from layout via a React context or a server-to-client prop pattern.

Simplest approach: fetch it in the page server component and pass as a prop:

```tsx
// In the admin order page server component:
const supabase = await createServerSupabase()
const { data: { session } } = await supabase.auth.getSession()

const { data: adminUser } = await supabaseServer
  .from('admin_users')
  .select('id, name, auth_user_id')
  .eq('auth_user_id', session.user.id)
  .single()

// Pass to client component:
<OrderViewClient order={order} rounds={rounds} adminUser={adminUser} />
```

The client component receives `adminUser` and passes it to `AdminChatWindow`.

---

## TASK 3: Round Questions Page (Customer)

When admin creates a round with questions, the user needs to answer them. Build a new
page at `/orders/[id]/round-questions/[roundId]` that uses the same visual pattern as
the existing questionnaire page but loads from `round_question_requests`.

### Create `apps/customer/app/(main)/orders/[id]/round-questions/[roundId]/page.tsx`

```tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { getClient } from '@/lib/supabase'
import { useAuthStore } from '@/lib/stores/auth-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/lib/hooks/use-toast'
import { ArrowLeft, CheckCircle } from 'lucide-react'

interface QuestionRequest {
  id: string
  round_id: string
  question_text: string
  answer_text: string | null
  answered_at: string | null
  position: number
}

export default function RoundQuestionsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuthStore()
  const orderId = params.id as string
  const roundId = params.roundId as string
  const supabase = getClient()

  const [questions, setQuestions] = useState<QuestionRequest[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [roundTitle, setRoundTitle] = useState('')

  useEffect(() => {
    async function load() {
      // Verify this round belongs to this order and is visible to user
      const { data: round, error: roundError } = await supabase
        .from('order_rounds')
        .select('id, title, status, is_visible_to_user, order_id')
        .eq('id', roundId)
        .eq('order_id', orderId)
        .eq('is_visible_to_user', true)
        .single()

      if (roundError || !round) {
        toast({ title: 'Error', variant: 'destructive', description: 'Round not found.' })
        router.push(`/orders/${orderId}`)
        return
      }

      setRoundTitle(round.title)

      const { data: qs, error: qError } = await supabase
        .from('round_question_requests')
        .select('*')
        .eq('round_id', roundId)
        .order('position', { ascending: true })

      if (qError || !qs) {
        toast({ title: 'Error', variant: 'destructive', description: 'Could not load questions.' })
        router.push(`/orders/${orderId}`)
        return
      }

      setQuestions(qs)

      // Pre-fill any already-answered questions
      const existing: Record<string, string> = {}
      qs.forEach(q => {
        if (q.answer_text) existing[q.id] = q.answer_text
      })
      setAnswers(existing)
      setLoading(false)
    }
    load()
  }, [orderId, roundId])

  const unanswered = questions.filter(q => !answers[q.id]?.trim())
  const allAnswered = unanswered.length === 0 && questions.length > 0

  const handleSubmit = async () => {
    if (!allAnswered) return
    setSubmitting(true)

    const updates = questions.map(q =>
      supabase
        .from('round_question_requests')
        .update({
          answer_text: answers[q.id],
          answered_at: new Date().toISOString(),
        })
        .eq('id', q.id)
    )

    const results = await Promise.all(updates)
    const hasError = results.some(r => r.error)

    if (hasError) {
      toast({ title: 'Error', variant: 'destructive', description: 'Some answers could not be saved. Please try again.' })
      setSubmitting(false)
      return
    }

    toast({ title: 'Answers submitted', description: 'Thank you. Your answers have been saved.' })
    router.push(`/orders/${orderId}`)
  }

  if (loading) {
    return (
      <div className="container max-w-2xl py-12">
        <p className="text-muted-foreground text-sm">Loading questions...</p>
      </div>
    )
  }

  // If all questions already answered, show completion state
  const allPreviouslyAnswered = questions.every(q => q.answered_at)
  if (allPreviouslyAnswered) {
    return (
      <div className="container max-w-2xl py-12">
        <div className="flex flex-col items-center gap-4 text-center">
          <CheckCircle className="w-12 h-12 text-green-500" />
          <h1 className="text-xl font-semibold">All questions answered</h1>
          <p className="text-muted-foreground text-sm">
            You have already answered all questions for this step.
          </p>
          <Button onClick={() => router.push(`/orders/${orderId}`)}>
            Back to order
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-2xl py-12">
      <button
        onClick={() => router.push(`/orders/${orderId}`)}
        className="flex items-center gap-2 text-sm text-muted-foreground mb-6 hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to order
      </button>

      <div className="mb-8">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
          Additional information needed
        </p>
        <h1 className="text-2xl font-semibold">{roundTitle}</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Please answer {questions.length} question{questions.length !== 1 ? 's' : ''} below.
          Your answers help us process your order faster.
        </p>
      </div>

      <div className="space-y-6">
        {questions.map((q, index) => {
          const isAnswered = !!q.answered_at
          return (
            <Card key={q.id} className={isAnswered ? 'opacity-60' : ''}>
              <CardContent className="pt-6">
                <Label htmlFor={q.id} className="text-sm font-medium mb-3 block">
                  {index + 1}. {q.question_text}
                </Label>
                {isAnswered ? (
                  <div className="bg-muted rounded-md px-3 py-2 text-sm text-muted-foreground">
                    {q.answer_text}
                    <span className="ml-2 text-xs text-green-600 font-medium">Answered</span>
                  </div>
                ) : (
                  <Textarea
                    id={q.id}
                    placeholder="Type your answer here..."
                    value={answers[q.id] || ''}
                    onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                    rows={3}
                    className="resize-none"
                  />
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={!allAnswered || submitting}
          size="lg"
        >
          {submitting ? 'Submitting...' : 'Submit answers'}
        </Button>
      </div>
    </div>
  )
}
```

---

## TASK 4: Round Document Uploads Page (Customer)

When admin creates a round with document requests, the user needs to upload them.
Build a new page at `/orders/[id]/round-uploads/[roundId]`.

This page uses `UploadDropzone` and uploads to the `work-documents` bucket. It updates
`order_work_documents` rows directly -- no RPC, no `order-documents` bucket.

### Create `apps/customer/app/(main)/orders/[id]/round-uploads/[roundId]/page.tsx`

```tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { getClient } from '@/lib/supabase'
import { useAuthStore } from '@/lib/stores/auth-store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/lib/hooks/use-toast'
import { UploadDropzone } from '@/components/documents/UploadDropzone'
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'

interface DocumentRequest {
  id: string
  round_id: string
  document_label: string
  description: string | null
  status: 'pending' | 'uploaded' | 'verified' | 'rejected'
  rejection_reason: string | null
  file_url: string | null
  file_name: string | null
  linked_request_id: string | null
}

interface StagedFile {
  docRequestId: string
  file: File
}

export default function RoundUploadsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuthStore()
  const orderId = params.id as string
  const roundId = params.roundId as string
  const supabase = getClient()

  const [docRequests, setDocRequests] = useState<DocumentRequest[]>([])
  const [staged, setStaged] = useState<Record<string, File>>({})
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [roundTitle, setRoundTitle] = useState('')

  useEffect(() => {
    async function load() {
      const { data: round, error: roundError } = await supabase
        .from('order_rounds')
        .select('id, title, status, is_visible_to_user, order_id')
        .eq('id', roundId)
        .eq('order_id', orderId)
        .eq('is_visible_to_user', true)
        .single()

      if (roundError || !round) {
        toast({ title: 'Error', variant: 'destructive', description: 'Round not found.' })
        router.push(`/orders/${orderId}`)
        return
      }

      setRoundTitle(round.title)

      // Load from_customer document requests for this round
      const { data: docs, error: docsError } = await supabase
        .from('order_work_documents')
        .select('*')
        .eq('round_id', roundId)
        .eq('direction', 'from_customer')
        .order('created_at', { ascending: true })

      if (docsError || !docs) {
        toast({ title: 'Error', variant: 'destructive', description: 'Could not load document requests.' })
        router.push(`/orders/${orderId}`)
        return
      }

      setDocRequests(docs)
      setLoading(false)
    }
    load()
  }, [orderId, roundId])

  // Separate new requests from re-uploads -- new first, re-uploads after
  const newRequests = docRequests.filter(d => !d.linked_request_id && d.status !== 'verified')
  const reuploadRequests = docRequests.filter(d => d.linked_request_id && d.status !== 'verified')
  const pendingDocs = [...newRequests, ...reuploadRequests]
  const hasReuploadRequests = reuploadRequests.length > 0

  const stagedCount = Object.keys(staged).length
  const canSubmit = stagedCount > 0

  const getRejectionLabel = (reason: string | null) => {
    if (!reason) return null
    const labels: Record<string, string> = {
      blurry_or_unclear: 'Document is blurry or unclear',
      wrong_document: 'Wrong document uploaded',
      document_expired: 'Document is expired',
      signature_missing: 'Signature missing',
      name_mismatch: 'Name does not match order details',
      incomplete_document: 'Document is incomplete or partial',
      poor_lighting: 'Poor lighting or low resolution',
      unsupported_format: 'File format not supported',
      other: 'Does not meet requirements',
    }
    return labels[reason] || reason
  }

  // UploadDropzone requires onUpload: async (file: File) => Promise<void>
  // handleStageFile ONLY stages the file in React state. It does NOT upload yet.
  // The actual upload to Supabase Storage happens in handleSubmit when user taps the CTA.
  // UploadDropzone will show a success/complete state as soon as this async function resolves,
  // which happens immediately after staging. This is intentional -- the "staged" state shows
  // as the green "ready to upload" card below the dropzone, not an upload-complete state.
  // The upload-complete state only appears AFTER handleSubmit succeeds.
  const handleStageFile = async (docRequestId: string, file: File): Promise<void> => {
    setStaged(prev => ({ ...prev, [docRequestId]: file }))
    // Returns immediately -- UploadDropzone will show the staged file name
  }

  const handleRemoveStaged = (docRequestId: string) => {
    setStaged(prev => {
      const next = { ...prev }
      delete next[docRequestId]
      return next
    })
  }

  const handleSubmit = async () => {
    if (!canSubmit) return
    setUploading(true)

    const uploadPromises = Object.entries(staged).map(async ([docRequestId, file]) => {
      const ext = file.name.split('.').pop()
      const fileName = `${orderId}/${docRequestId}/${Date.now()}.${ext}`

      // Upload to work-documents bucket (user has write access if path starts with orderId)
      const { error: uploadError } = await supabase.storage
        .from('work-documents')
        .upload(fileName, file, { cacheControl: '3600', upsert: true })

      if (uploadError) throw new Error(`Upload failed for ${file.name}: ${uploadError.message}`)

      const { data: { publicUrl } } = supabase.storage
        .from('work-documents')
        .getPublicUrl(fileName)

      // Update the order_work_documents row
      const { error: updateError } = await supabase
        .from('order_work_documents')
        .update({
          file_url: publicUrl,
          file_name: file.name,
          uploaded_at: new Date().toISOString(),
          status: 'uploaded',
          uploaded_by_type: 'customer',
        })
        .eq('id', docRequestId)

      if (updateError) throw new Error(`DB update failed: ${updateError.message}`)
    })

    try {
      await Promise.all(uploadPromises)
      toast({ title: 'Documents submitted', description: 'Your documents have been submitted for review.' })
      router.push(`/orders/${orderId}`)
    } catch (err: any) {
      toast({ title: 'Upload failed', variant: 'destructive', description: err.message })
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="container max-w-2xl py-12">
        <p className="text-muted-foreground text-sm">Loading documents...</p>
      </div>
    )
  }

  const allVerified = docRequests.every(d => d.status === 'verified')
  if (allVerified && docRequests.length > 0) {
    return (
      <div className="container max-w-2xl py-12">
        <div className="flex flex-col items-center gap-4 text-center">
          <CheckCircle className="w-12 h-12 text-green-500" />
          <h1 className="text-xl font-semibold">All documents verified</h1>
          <p className="text-muted-foreground text-sm">
            Our team has verified all documents for this step.
          </p>
          <Button onClick={() => router.push(`/orders/${orderId}`)}>Back to order</Button>
        </div>
      </div>
    )
  }

  // Determine CTA button label
  const ctaLabel = uploading
    ? 'Uploading...'
    : hasReuploadRequests
    ? 'Submit additional documents'
    : 'Submit documents'

  return (
    <div className="container max-w-2xl py-12">
      <button
        onClick={() => router.push(`/orders/${orderId}`)}
        className="flex items-center gap-2 text-sm text-muted-foreground mb-6 hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to order
      </button>

      <div className="mb-8">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
          {hasReuploadRequests ? 'Additional documents required' : 'Documents required'}
        </p>
        <h1 className="text-2xl font-semibold">{roundTitle}</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Please upload {pendingDocs.length} document{pendingDocs.length !== 1 ? 's' : ''} below.
        </p>
      </div>

      <div className="space-y-6">
        {pendingDocs.map((doc) => {
          const isStaged = !!staged[doc.id]
          const isUploaded = doc.status === 'uploaded'
          const rejectionLabel = getRejectionLabel(doc.rejection_reason)

          return (
            <Card key={doc.id}>
              <CardContent className="pt-6 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-sm">{doc.document_label}</p>
                    {doc.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">{doc.description}</p>
                    )}
                  </div>
                  {isUploaded && (
                    <Badge variant="warning" className="shrink-0">Awaiting review</Badge>
                  )}
                </div>

                {/* Rejection callout scoped to this document card only */}
                {rejectionLabel && (
                  <div className="flex gap-2 items-start bg-red-50 border border-red-200 rounded-md px-3 py-2">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-700">
                      Previously rejected: {rejectionLabel}. Please upload a corrected version.
                    </p>
                  </div>
                )}

                {isUploaded ? (
                  <div className="bg-muted rounded-md px-3 py-2 text-xs text-muted-foreground flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                    {doc.file_name} uploaded -- awaiting team review
                  </div>
                ) : isStaged ? (
                  <div className="border border-green-200 bg-green-50 rounded-md px-3 py-2 flex items-center justify-between">
                    <span className="text-xs text-green-700 font-medium">
                      {staged[doc.id].name} ready to upload
                    </span>
                    <button
                      onClick={() => handleRemoveStaged(doc.id)}
                      className="text-xs text-red-500 hover:text-red-700 ml-3"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <UploadDropzone
                    onUpload={async (file: File): Promise<void> => {
                      await handleStageFile(doc.id, file)
                    }}
                    label={`Upload ${doc.document_label}`}
                    sublabel="PDF, JPG, PNG up to 50MB"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={!canSubmit || uploading}
          size="lg"
        >
          {ctaLabel}
        </Button>
      </div>
    </div>
  )
}
```

---

## TASK 5: Wire Action Buttons on Order Detail Page

When a round is active and requires user action, the order detail page must show
a clear call to action that takes the user to the right page.

In the rounds timeline section of `apps/customer/app/(main)/orders/[id]/page.tsx`
(or the `RoundsTimeline` component if it has been extracted), add these action buttons
to each active round card.

The logic is:

```tsx
// For each round where status = 'awaiting_user':

// Check what action is needed
const hasUnansweredQuestions = round.round_question_requests?.some(q => !q.answered_at)
const hasPendingDocRequests = round.order_work_documents
  ?.filter(d => d.direction === 'from_customer')
  ?.some(d => d.status === 'pending' || d.status === 'rejected')

// Questions always link first if both exist
if (hasUnansweredQuestions) {
  return (
    <Button asChild size="sm">
      <Link href={`/orders/${orderId}/round-questions/${round.id}`}>
        Answer questions
      </Link>
    </Button>
  )
}

if (hasPendingDocRequests) {
  const hasReuploadDocs = round.order_work_documents
    ?.filter(d => d.direction === 'from_customer')
    ?.some(d => d.linked_request_id)

  return (
    <Button asChild size="sm">
      <Link href={`/orders/${orderId}/round-uploads/${round.id}`}>
        {hasReuploadDocs ? 'Upload additional documents' : 'Upload documents'}
      </Link>
    </Button>
  )
}
```

Show this button prominently at the bottom of the active round card. Use the same
Button and Link components used elsewhere in the customer app.

Also update the `RoundNotificationBanner` dismiss behavior: tapping "Got it" on a
notification that links to questions should optionally navigate to the questions page
rather than just hiding the banner. This is optional UX polish -- the button link
above is the primary navigation mechanism.

---

## Verification

After building:

- [ ] Customer chat works: existing chat page loads messages, user can send text and files, messages appear in realtime
- [ ] Customer chat on order detail page: "Chat with CA" card now shows real `ChatWindow` (not placeholder)
- [ ] Admin chat works: admin can send messages from `AdminChatWindow`, they appear with `sender_type = 'professional'`
- [ ] Admin messages appear in customer's chat view as professional messages (right-aligned in `MessageBubble`)
- [ ] Customer messages appear in admin's `AdminChatWindow` in realtime (no refresh needed)
- [ ] `/orders/[id]/round-questions/[roundId]` loads questions from `round_question_requests` for the correct round
- [ ] Submitting answers updates `answer_text` and `answered_at` on each row
- [ ] Already-answered questions show as read-only gray boxes
- [ ] `/orders/[id]/round-uploads/[roundId]` loads document requests from `order_work_documents` where `direction = 'from_customer'` and `round_id` matches
- [ ] Re-upload requests show rejection callout above their dropzone only (not section-level)
- [ ] New requests appear before re-upload requests in the list
- [ ] CTA button says "Submit documents" for new requests, "Submit additional documents" when re-uploads present
- [ ] On submit: files uploaded to `work-documents` bucket at `{orderId}/{docRequestId}/{timestamp}.{ext}`
- [ ] On submit: `order_work_documents` row updated with `file_url`, `file_name`, `status = 'uploaded'`, `uploaded_by_type = 'customer'`
- [ ] Success toast shown after submit, user redirected to order detail page
- [ ] Active round cards on order detail page show correct action button linking to questions or uploads page
- [ ] Questions page link appears when there are unanswered questions (even if doc requests also exist)
- [ ] Uploads page link appears only when all questions are answered and doc requests are pending
- [ ] `UploadDropzone` onUpload callback only stages file in state -- actual upload happens on Submit button
- [ ] Staged file shows as green "ready to upload" card, not as an uploaded state
- [ ] After submit, success toast shown and user redirected to `/orders/{orderId}`
