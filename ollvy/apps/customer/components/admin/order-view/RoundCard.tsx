'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useToast } from '@/lib/hooks/use-toast'
import { formatDate, formatDateTime } from '@/lib/utils'
import {
  updateRoundTitle,
  markRoundComplete,
} from '@/app/(admin)/admin/orders/[orderId]/actions'
import type { OrderRound, OrderWorkDocument } from '@/lib/types'
import { WorkDocumentCard } from './WorkDocumentCard'
import { AdminLinkedDocumentCard } from './AdminLinkedDocumentCard'

export function RoundCard({
  round,
  orderId,
  adminNamesMap,
}: {
  round: OrderRound
  orderId: string
  adminNamesMap: Record<string, string>
}) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [editingTitle, setEditingTitle] = useState(false)
  const [titleValue, setTitleValue] = useState(round.title)

  const questions = round.round_question_requests || []
  const fromCustomerDocs = round.order_work_documents?.filter(d => d.direction === 'from_customer') || []
  const toCustomerDocs = round.order_work_documents?.filter(d => d.direction === 'to_customer') || []

  // Find linked document pairs (to_customer doc with linked_request_id -> from_customer doc)
  // Backend convention: to_customer.linked_request_id points to from_customer.id
  const linkedPairs = useMemo(() => {
    const pairs: Array<{
      downloadDoc: OrderWorkDocument
      uploadDoc: OrderWorkDocument
    }> = []
    const usedIds = new Set<string>()

    toCustomerDocs.forEach(downloadDoc => {
      if (downloadDoc.linked_request_id) {
        const uploadDoc = fromCustomerDocs.find(d => d.id === downloadDoc.linked_request_id)
        if (uploadDoc) {
          pairs.push({ downloadDoc, uploadDoc })
          usedIds.add(downloadDoc.id)
          usedIds.add(uploadDoc.id)
        }
      }
    })

    return { pairs, usedIds }
  }, [fromCustomerDocs, toCustomerDocs])

  // Standalone documents (not part of a linked pair)
  const standaloneFromCustomer = fromCustomerDocs.filter(d => !linkedPairs.usedIds.has(d.id))
  const standaloneToCustomer = toCustomerDocs.filter(d => !linkedPairs.usedIds.has(d.id))

  // Check if round can be completed
  const allQuestionsAnswered = questions.every(q => q.answered_at)
  const allDocsProcessed = fromCustomerDocs.every(d =>
    d.status === 'verified' || d.skipped_at
  )
  const canComplete = allQuestionsAnswered && allDocsProcessed && round.status !== 'completed' && round.round_number > 0

  const handleTitleSave = async () => {
    if (titleValue.trim() === round.title) {
      setEditingTitle(false)
      return
    }
    setLoading(true)
    try {
      await updateRoundTitle(round.id, orderId, titleValue.trim())
      setEditingTitle(false)
      toast({ title: 'Title updated' })
    } catch (err) {
      toast({ title: 'Error', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const handleMarkComplete = async () => {
    setLoading(true)
    try {
      await markRoundComplete(round.id, orderId)
      toast({ title: 'Round completed' })
    } catch (err) {
      toast({ title: 'Error', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card id={`round-${round.round_number}`} className="scroll-mt-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {editingTitle ? (
              <Input
                value={titleValue}
                onChange={(e) => setTitleValue(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()}
                className="w-48"
                autoFocus
              />
            ) : (
              <CardTitle
                className="cursor-pointer hover:text-muted-foreground"
                onClick={() => setEditingTitle(true)}
              >
                Round {round.round_number}: {round.title}
              </CardTitle>
            )}
            <Badge variant={
              round.status === 'completed' ? 'default' :
              round.status === 'awaiting_user' ? 'secondary' :
              'outline'
            }>
              {round.status.replace('_', ' ')}
            </Badge>
          </div>
          {canComplete && (
            <Button size="sm" onClick={handleMarkComplete} disabled={loading}>
              Mark Round Complete
            </Button>
          )}
        </div>
        {round.created_by_admin_id && (
          <p className="text-xs text-muted-foreground">
            Created by {adminNamesMap[round.created_by_admin_id] || 'Admin'} on {formatDate(round.created_at)}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Questions */}
        {questions.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-3">Questions</h4>
            <div className="space-y-3">
              {questions.map(q => (
                <div key={q.id} className="p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-1">{q.question_text}</p>
                  {q.answered_at ? (
                    <div>
                      <p className="text-sm text-muted-foreground">{q.answer_text}</p>
                      <p className="text-xs text-muted-foreground mt-1">{formatDateTime(q.answered_at)}</p>
                    </div>
                  ) : (
                    <Badge variant="secondary">Awaiting answer</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Linked Document Pairs (For Signing: Download + Upload in one card) */}
        {linkedPairs.pairs.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-3">Linked Documents (For Signing)</h4>
            <div className="space-y-3">
              {linkedPairs.pairs.map(({ downloadDoc, uploadDoc }) => (
                <AdminLinkedDocumentCard
                  key={downloadDoc.id}
                  downloadDoc={downloadDoc}
                  uploadDoc={uploadDoc}
                  orderId={orderId}
                />
              ))}
            </div>
          </div>
        )}

        {/* Standalone From Customer Docs */}
        {standaloneFromCustomer.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-3">Documents from Customer</h4>
            <div className="space-y-3">
              {standaloneFromCustomer.map(doc => (
                <WorkDocumentCard key={doc.id} doc={doc} orderId={orderId} direction="from_customer" />
              ))}
            </div>
          </div>
        )}

        {/* Standalone To Customer Docs */}
        {standaloneToCustomer.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-3">Documents to Customer</h4>
            <div className="space-y-3">
              {standaloneToCustomer.map(doc => (
                <WorkDocumentCard key={doc.id} doc={doc} orderId={orderId} direction="to_customer" />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
