'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { getClient } from '@/lib/supabase'
import { useAuthStore } from '@/lib/stores/auth-store'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDateTime, cn } from '@/lib/utils'
import { getSignedUrl } from '@/lib/storage'
import type { OrderRound, OrderWorkDocument, WorkflowDisplayStage } from '@/lib/types'
import { Download, Upload, Loader2, FileText, MessageSquare, Eye } from 'lucide-react'

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
  const [activeTab, setActiveTab] = useState<'documents' | 'answers'>('documents')

  // Fetch function that can be called on initial load and on realtime updates
  const fetchData = useCallback(async () => {
    if (!user?.id) return

    const [roundsRes, answersRes, questionsRes, docsRes] = await Promise.all([
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
    ])

    setRounds((roundsRes.data as OrderRound[]) || [])
    setRound0Data({
      answers: answersRes.data || [],
      questions: questionsRes.data || [],
      initialDocs: docsRes.data || [],
    })
  }, [orderId, servicePackageId, user?.id, supabase])

  // Initial data fetch
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Real-time subscriptions
  useEffect(() => {
    if (!user?.id) return

    const channel = supabase
      .channel(`rounds-timeline-${orderId}`)
      // Subscribe to order_documents changes
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'order_documents',
        filter: `order_id=eq.${orderId}`,
      }, () => {
        fetchData()
      })
      // Subscribe to order_work_documents changes
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'order_work_documents',
        filter: `order_id=eq.${orderId}`,
      }, () => {
        fetchData()
      })
      // Subscribe to order_questionnaire_responses changes
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'order_questionnaire_responses',
        filter: `order_id=eq.${orderId}`,
      }, () => {
        fetchData()
      })
      // Subscribe to round_question_requests changes via order_rounds
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'order_rounds',
        filter: `order_id=eq.${orderId}`,
      }, () => {
        fetchData()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [orderId, user?.id, supabase, fetchData])

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

  // Count documents and answers for badges
  const docsCount = round0Data.initialDocs.length + rounds.reduce((acc, r) =>
    acc + (r.order_work_documents?.length || 0), 0
  )
  const answersCount = allAnswers.filter(a => a.response_value != null).length + roundQuestionResponses.length

  if (!hasData) return null

  return (
    <Card className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
      <CardHeader className="border-b border-border/50 px-6 py-4">
        <CardTitle className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
          Documents and Answers
        </CardTitle>
      </CardHeader>

      <div className="grid grid-cols-1 md:grid-cols-[180px,1fr] min-h-[400px]">
        {/* Left: Vertical Tab List */}
        <div className="border-b md:border-b-0 md:border-r border-border/50 bg-muted/20 p-3 space-y-1">
          <button
            onClick={() => setActiveTab('documents')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left",
              activeTab === 'documents'
                ? "bg-background text-foreground shadow-sm border border-border/50"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            )}
          >
            <FileText className="h-4 w-4" />
            Documents
            {docsCount > 0 && (
              <Badge variant="secondary" className="ml-auto text-xs font-mono">
                {docsCount}
              </Badge>
            )}
          </button>

          <button
            onClick={() => setActiveTab('answers')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left",
              activeTab === 'answers'
                ? "bg-background text-foreground shadow-sm border border-border/50"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            )}
          >
            <MessageSquare className="h-4 w-4" />
            Answers
            {answersCount > 0 && (
              <Badge variant="secondary" className="ml-auto text-xs font-mono">
                {answersCount}
              </Badge>
            )}
          </button>
        </div>

        {/* Right: Tab Content */}
        <div className="p-6">
          {/* Documents Tab Content */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              {Object.entries(documentsByStage).map(([stageKey, docs]) => {
                if (docs.length === 0) return null

                // Find stage title from workflowStages
                const stage = workflowStages.find(s => s.stage_key === stageKey)
                const stageTitle = stage?.title || formatStageKey(stageKey)

                return (
                  <div key={stageKey} className="space-y-3">
                    <h4 className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
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
                  <div key={round.id} className="space-y-3">
                    <h4 className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
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

              {docsCount === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-8 w-8 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">No documents yet</p>
                </div>
              )}
            </div>
          )}

          {/* Answers Tab Content */}
          {activeTab === 'answers' && (
            <div className="space-y-6">
              {/* Initial questionnaire answers */}
              {allAnswers.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                    Initial Submission
                  </h4>
                  <div className="rounded-lg border border-border/50 bg-muted/10 overflow-hidden">
                    {allAnswers.map((answer, idx) => (
                      <div
                        key={answer.question_key}
                        className={cn(
                          "flex items-start justify-between py-3 px-4",
                          idx !== allAnswers.length - 1 && "border-b border-border/30"
                        )}
                      >
                        <span className="text-sm text-muted-foreground flex-1 pr-4">
                          {answer.question_label}
                        </span>
                        <span className={cn(
                          "text-sm font-medium text-right max-w-[50%]",
                          !answer.response_value ? "text-muted-foreground/50 italic" : "text-foreground"
                        )}>
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
                  <div key={round.id} className="space-y-3">
                    <h4 className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                      {round.title}
                    </h4>
                    <div className="rounded-lg border border-border/50 bg-muted/10 overflow-hidden">
                      {answered.map((q, idx) => (
                        <div
                          key={q.id}
                          className={cn(
                            "py-3 px-4",
                            idx !== answered.length - 1 && "border-b border-border/30"
                          )}
                        >
                          <p className="text-sm text-muted-foreground mb-1">{q.question_text}</p>
                          <p className="text-sm font-medium text-foreground">{q.answer_text}</p>
                          <p className="text-[10px] font-mono text-muted-foreground/70 mt-1">
                            {formatDateTime(q.answered_at!)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}

              {allAnswers.length === 0 && roundQuestionResponses.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <MessageSquare className="h-8 w-8 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">No answers submitted yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
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
      return (
        <Badge
          variant="outline"
          className="font-mono text-[10px] uppercase tracking-wider border-red-500/30 text-red-600 dark:text-red-400 bg-red-500/5"
        >
          Rejected
        </Badge>
      )
    }
    if (doc.verified_at) {
      return (
        <Badge
          variant="outline"
          className="font-mono text-[10px] uppercase tracking-wider border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5"
        >
          Verified
        </Badge>
      )
    }
    if (doc.file_url) {
      return (
        <Badge
          variant="outline"
          className="font-mono text-[10px] uppercase tracking-wider border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/5"
        >
          Uploaded
        </Badge>
      )
    }
    return (
      <Badge
        variant="outline"
        className="font-mono text-[10px] uppercase tracking-wider border-border text-muted-foreground"
      >
        Pending
      </Badge>
    )
  }

  return (
    <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-md bg-background border border-border/50 flex items-center justify-center shrink-0">
          <FileText className="h-4 w-4 text-muted-foreground" />
        </div>
        <span className="text-sm font-medium text-foreground truncate">{doc.document_label}</span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {getStatusBadge()}
        {doc.file_url && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={handleView}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
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
      return (
        <Badge
          variant="outline"
          className="font-mono text-[10px] uppercase tracking-wider border-red-500/30 text-red-600 dark:text-red-400 bg-red-500/5"
        >
          Rejected
        </Badge>
      )
    }
    if (doc.status === 'verified') {
      return (
        <Badge
          variant="outline"
          className="font-mono text-[10px] uppercase tracking-wider border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5"
        >
          Verified
        </Badge>
      )
    }
    if (doc.status === 'uploaded') {
      return (
        <Badge
          variant="outline"
          className="font-mono text-[10px] uppercase tracking-wider border-blue-500/30 text-blue-600 dark:text-blue-400 bg-blue-500/5"
        >
          Under Review
        </Badge>
      )
    }
    return (
      <Badge
        variant="outline"
        className="font-mono text-[10px] uppercase tracking-wider border-border text-muted-foreground"
      >
        Pending
      </Badge>
    )
  }

  const getTagBadge = () => {
    if (!doc.tag) return null
    const tagStyles: Record<string, string> = {
      'for_signing': 'border-purple-500/30 text-purple-600 dark:text-purple-400 bg-purple-500/5',
      'government_processing': 'border-orange-500/30 text-orange-600 dark:text-orange-400 bg-orange-500/5',
      'final_output': 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5',
      'informational': 'border-sky-500/30 text-sky-600 dark:text-sky-400 bg-sky-500/5',
    }
    const tagLabels: Record<string, string> = {
      'for_signing': 'For Signing',
      'government_processing': 'Govt Processing',
      'final_output': 'Final Document',
      'informational': 'Informational',
    }
    return (
      <Badge
        variant="outline"
        className={cn(
          "font-mono text-[10px] uppercase tracking-wider",
          tagStyles[doc.tag] || "border-border text-muted-foreground"
        )}
      >
        {tagLabels[doc.tag] || doc.tag}
      </Badge>
    )
  }

  const isFromCustomer = doc.direction === 'from_customer'
  const isToCustomer = doc.direction === 'to_customer'

  return (
    <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className={cn(
          "w-8 h-8 rounded-md border flex items-center justify-center shrink-0",
          isToCustomer
            ? "bg-emerald-500/10 border-emerald-500/30"
            : "bg-background border-border/50"
        )}>
          {isToCustomer ? (
            <Download className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <Upload className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-sm font-medium text-foreground truncate block">{doc.document_label}</span>
          {doc.description && (
            <span className="text-xs text-muted-foreground truncate block">{doc.description}</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {getTagBadge()}
        {getStatusBadge()}
        {isToCustomer && doc.file_url && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 text-xs"
            onClick={handleDownload}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Download className="h-3.5 w-3.5" />
            )}
            Download
          </Button>
        )}
        {isFromCustomer && !doc.file_url && (
          <Link href={`/orders/${orderId}/round-uploads/${roundId}`}>
            <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5">
              <Upload className="h-3.5 w-3.5" />
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
