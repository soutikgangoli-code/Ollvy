'use client'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { getClient } from '@/lib/supabase'
import { useAuthStore } from '@/lib/stores/auth-store'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { formatDate, formatDateTime } from '@/lib/utils'
import { useToast } from '@/lib/hooks/use-toast'
import { buildRejectionMessage } from '@/lib/constants/rejection-reasons'
import { getSignedUrl } from '@/lib/storage'
import type { OrderRound, RoundQuestionRequest, OrderWorkDocument, WorkflowDisplayStage } from '@/lib/types'
import { Download, Upload, Check, AlertCircle, Loader2, FileText, MessageSquare } from 'lucide-react'

interface RoundsTimelineProps {
  orderId: string
  servicePackageId: string
  workflowStages?: WorkflowDisplayStage[]
}

interface Round0Data {
  answers: Array<{ question_key: string; response_value: any }>
  questions: Array<{
    question_key: string
    question_label: string
    question_type: string
    options?: Array<{ value: string; label: string }>
  }>
  initialDocs: Array<{
    id: string
    document_label: string
    file_url?: string
    file_name?: string
    verified_at?: string
    rejection_reason?: string
    stage_key?: string
  }>
}

export function RoundsTimeline({ orderId, servicePackageId, workflowStages = [] }: RoundsTimelineProps) {
  const { user } = useAuthStore()
  const supabase = getClient()
  const [rounds, setRounds] = useState<OrderRound[]>([])
  const [round0Data, setRound0Data] = useState<Round0Data>({ answers: [], questions: [], initialDocs: [] })

  useEffect(() => {
    if (!user?.id) return

    // Fetch all data in parallel for better performance
    Promise.all([
      // Fetch all visible rounds with their questions and doc requests
      supabase
        .from('order_rounds')
        .select(`
          id, order_id, round_number, title, status, created_at, completed_at,
          round_question_requests (id, question_text, answer_text, answered_at, position),
          order_work_documents (
            id, direction, document_label, description, tag, status, stage_key,
            file_url, file_name, uploaded_at, rejection_reason, linked_request_id
          )
        `)
        .eq('order_id', orderId)
        .eq('is_visible_to_user', true)
        .order('round_number', { ascending: true }),
      // Questionnaire responses
      supabase
        .from('order_questionnaire_responses')
        .select('question_key, response_value')
        .eq('order_id', orderId),
      // Service questionnaires (questions with labels)
      supabase
        .from('service_questionnaires')
        .select('question_key, question_label, question_type, options, display_order')
        .eq('service_package_id', servicePackageId)
        .order('display_order', { ascending: true }),
      // All order documents (not just doc_collection stage)
      supabase
        .from('order_documents')
        .select('id, document_label, file_url, file_name, verified_at, rejection_reason, stage_key')
        .eq('order_id', orderId),
    ]).then(([roundsRes, answersRes, questionsRes, docsRes]) => {
      setRounds((roundsRes.data as OrderRound[]) || [])
      setRound0Data({
        answers: answersRes.data || [],
        questions: questionsRes.data || [],
        initialDocs: docsRes.data || [],
      })
    })
  }, [orderId, servicePackageId, user?.id])

  // Compute all answers for the Answers tab
  const allAnswers = round0Data.questions.map(q => {
    const answer = round0Data.answers.find(a => a.question_key === q.question_key)
    return {
      question_key: q.question_key,
      question_label: q.question_label,
      question_type: q.question_type,
      options: q.options,
      response_value: answer?.response_value,
    }
  })

  // Compute all round question responses
  const roundQuestionResponses = rounds
    .filter(r => r.round_number > 0)
    .flatMap(r => (r.round_question_requests || []).filter(q => q.answered_at))

  // Compute documents grouped by stage
  const documentsByStage = groupDocumentsByStage(round0Data.initialDocs, rounds, workflowStages)

  const hasData = allAnswers.length > 0 || round0Data.initialDocs.length > 0 || rounds.some(r =>
    (r.round_question_requests?.length ?? 0) > 0 || (r.order_work_documents?.length ?? 0) > 0
  )

  if (!hasData) return null

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Documents and Answers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="documents" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="documents" className="gap-2">
              <FileText className="h-4 w-4" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="answers" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Answers
            </TabsTrigger>
          </TabsList>

          {/* Documents Tab */}
          <TabsContent value="documents" className="mt-4 space-y-4">
            {Object.entries(documentsByStage).map(([stageKey, docs]) => {
              if (docs.length === 0) return null

              // Find stage title from workflowStages
              const stage = workflowStages.find(s => s.stage_key === stageKey)
              const stageTitle = stage?.title || formatStageKey(stageKey)

              return (
                <div key={stageKey} className="space-y-2">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {stageTitle}
                  </h4>
                  <div className="space-y-2">
                    {docs.map(doc => (
                      <DocumentRow key={doc.id} doc={doc} />
                    ))}
                  </div>
                </div>
              )
            })}

            {/* Work documents from rounds */}
            {rounds.filter(r => r.round_number > 0).map(round => {
              const workDocs = round.order_work_documents || []
              if (workDocs.length === 0) return null

              return (
                <div key={round.id} className="space-y-2">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {round.title}
                  </h4>
                  <div className="space-y-2">
                    {workDocs.map(doc => (
                      <WorkDocumentRow key={doc.id} doc={doc} orderId={orderId} roundId={round.id} />
                    ))}
                  </div>
                </div>
              )
            })}
          </TabsContent>

          {/* Answers Tab */}
          <TabsContent value="answers" className="mt-4 space-y-4">
            {/* Initial questionnaire answers */}
            {allAnswers.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Initial Submission
                </h4>
                <div className="space-y-2 rounded-lg border border-border p-4">
                  {allAnswers.map(answer => (
                    <div key={answer.question_key} className="flex justify-between items-start gap-4">
                      <span className="text-sm text-muted-foreground flex-1">{answer.question_label}</span>
                      <span className="text-sm font-medium text-foreground text-right max-w-[50%]">
                        {renderResponseValue(answer.response_value, answer.question_type, answer.options)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Round question responses */}
            {rounds.filter(r => r.round_number > 0).map(round => {
              const answered = (round.round_question_requests || []).filter(q => q.answered_at)
              if (answered.length === 0) return null

              return (
                <div key={round.id} className="space-y-2">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {round.title}
                  </h4>
                  <div className="space-y-2 rounded-lg border border-border p-4">
                    {answered.map(q => (
                      <div key={q.id} className="space-y-1">
                        <p className="text-sm text-muted-foreground">{q.question_text}</p>
                        <p className="text-sm font-medium text-foreground">{q.answer_text}</p>
                        <p className="text-xs text-muted-foreground">{formatDateTime(q.answered_at!)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}

            {allAnswers.length === 0 && roundQuestionResponses.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No answers submitted yet</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

// Document Row Component - for initial order_documents
function DocumentRow({ doc }: { doc: Round0Data['initialDocs'][0] }) {
  const [loading, setLoading] = useState(false)

  const handleView = async () => {
    if (!doc.file_url) return
    setLoading(true)
    try {
      const signedUrl = await getSignedUrl(doc.file_url)
      if (signedUrl) {
        window.open(signedUrl, '_blank')
      }
    } catch (error) {
      console.error('Failed to get signed URL:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = () => {
    if (doc.rejection_reason) {
      return <Badge variant="destructive" className="text-xs">Rejected</Badge>
    }
    if (doc.verified_at) {
      return <Badge variant="default" className="text-xs bg-emerald-600">Verified</Badge>
    }
    if (doc.file_url) {
      return <Badge variant="secondary" className="text-xs">Uploaded</Badge>
    }
    return <Badge variant="outline" className="text-xs">Pending</Badge>
  }

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <span className="text-sm font-medium text-foreground truncate">{doc.document_label}</span>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {getStatusBadge()}
        {doc.file_url && (
          <button
            onClick={handleView}
            disabled={loading}
            className="text-xs text-primary hover:underline disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'View'}
          </button>
        )}
      </div>
    </div>
  )
}

// Work Document Row Component - for order_work_documents
function WorkDocumentRow({
  doc,
  orderId,
  roundId
}: {
  doc: OrderWorkDocument
  orderId: string
  roundId: string
}) {
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    if (!doc.file_url) return
    setLoading(true)
    try {
      const signedUrl = await getSignedUrl(doc.file_url)
      if (signedUrl) {
        const link = document.createElement('a')
        link.href = signedUrl
        link.download = doc.file_name || doc.document_label
        link.target = '_blank'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } catch (error) {
      console.error('Failed to download file:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = () => {
    if (doc.status === 'rejected') {
      return <Badge variant="destructive" className="text-xs">Rejected</Badge>
    }
    if (doc.status === 'verified') {
      return <Badge variant="default" className="text-xs bg-emerald-600">Verified</Badge>
    }
    if (doc.status === 'uploaded') {
      return <Badge variant="secondary" className="text-xs">Under Review</Badge>
    }
    return <Badge variant="outline" className="text-xs">Pending</Badge>
  }

  const getTagBadge = () => {
    if (!doc.tag) return null
    const tagLabels: Record<string, string> = {
      'for_signing': 'For Signing',
      'government_processing': 'Govt Processing',
      'final_output': 'Final Document',
      'informational': 'Informational',
    }
    return (
      <Badge variant="outline" className="text-xs">
        {tagLabels[doc.tag] || doc.tag}
      </Badge>
    )
  }

  const isFromCustomer = doc.direction === 'from_customer'
  const isToCustomer = doc.direction === 'to_customer'

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {isToCustomer ? (
          <Download className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
        ) : (
          <Upload className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <span className="text-sm font-medium text-foreground truncate block">{doc.document_label}</span>
          {doc.description && (
            <span className="text-xs text-muted-foreground truncate block">{doc.description}</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {getTagBadge()}
        {getStatusBadge()}
        {isToCustomer && doc.file_url && (
          <button
            onClick={handleDownload}
            disabled={loading}
            className="flex items-center gap-1 text-xs text-primary hover:underline disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Download className="h-3 w-3" />
            )}
            {loading ? 'Loading...' : 'Download'}
          </button>
        )}
        {isFromCustomer && !doc.file_url && (
          <Link href={`/orders/${orderId}/round-uploads/${roundId}`}>
            <Button size="sm" variant="outline" className="h-7 text-xs">
              Upload
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}

// Helper functions
function groupDocumentsByStage(
  initialDocs: Round0Data['initialDocs'],
  rounds: OrderRound[],
  workflowStages: WorkflowDisplayStage[]
): Record<string, Round0Data['initialDocs']> {
  const grouped: Record<string, Round0Data['initialDocs']> = {}

  // Default stage for docs without stage_key
  const defaultStageKey = 'doc_collection'

  // Initialize groups for each workflow stage
  for (const stage of workflowStages) {
    if (stage.stage_key) {
      grouped[stage.stage_key] = []
    }
  }
  grouped[defaultStageKey] = []

  // Group initial documents by their stage_key
  for (const doc of initialDocs) {
    const stageKey = doc.stage_key || defaultStageKey
    if (!grouped[stageKey]) {
      grouped[stageKey] = []
    }
    grouped[stageKey].push(doc)
  }

  // Filter out empty groups and keep order from workflowStages
  const orderedGroups: Record<string, Round0Data['initialDocs']> = {}

  // First add doc_collection if it has docs
  if (grouped[defaultStageKey]?.length > 0) {
    orderedGroups[defaultStageKey] = grouped[defaultStageKey]
  }

  // Then add other stages in order
  for (const stage of workflowStages) {
    if (stage.stage_key && grouped[stage.stage_key]?.length > 0) {
      orderedGroups[stage.stage_key] = grouped[stage.stage_key]
    }
  }

  return orderedGroups
}

function formatStageKey(stageKey: string): string {
  // Convert stage_key to human-readable title
  // e.g., 'doc_collection' -> 'Document Collection'
  const specialCases: Record<string, string> = {
    'doc_collection': 'Initial Documents',
    'initial_submission': 'Initial Submission',
  }

  if (specialCases[stageKey]) {
    return specialCases[stageKey]
  }

  return stageKey
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function renderResponseValue(
  responseValue: string | number | string[] | null | undefined,
  questionType: string,
  options?: Array<{ value: string; label: string }>
): string {
  if (responseValue == null) return 'Not answered'
  if (questionType === 'multiselect' && Array.isArray(responseValue)) {
    return responseValue
      .map(v => options?.find(o => o.value === v)?.label ?? v)
      .join(', ')
  }
  if ((questionType === 'select' || questionType === 'radio') && options) {
    return options.find(o => o.value === String(responseValue))?.label ?? String(responseValue)
  }
  return String(responseValue)
}
