'use client'
import { useEffect, useState, useCallback, useRef } from 'react'
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
import { DocumentPreview } from '@/components/documents/DocumentPreview'
import { DOC_STATUS_META, initialDocStatus, workDocStatus } from '@/lib/documents/doc-status'
import { deriveAnswerLabel } from '@/lib/questionnaire/answer-label'

interface RoundsTimelineProps {
  orderId: string
  servicePackageId: string
  workflowStages?: WorkflowDisplayStage[]
  // Already fetched by the order page's server render and passed in, so this
  // component does NOT re-query them. Documents stay live via the parent's own
  // realtime subscription; answers are static for the life of this page.
  initialDocs?: Round0Data['initialDocs']
  initialAnswers?: Round0Data['answers']
  locked?: boolean   // setup approved by admin — hide customer edit/upload affordances
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

export function RoundsTimeline({ orderId, servicePackageId, workflowStages = [], initialDocs = [], initialAnswers = [], locked = false }: RoundsTimelineProps) {
  const { user } = useAuthStore()
  const supabase = getClient()
  const [rounds, setRounds] = useState<OrderRound[]>([])
  const [questions, setQuestions] = useState<Round0Data['questions']>([])
  const [activeTab, setActiveTab] = useState<'documents' | 'final' | 'answers'>('documents')
  const [previewDoc, setPreviewDoc] = useState<{ documentLabel: string; fileUrl: string; fileName?: string } | null>(null)

  // Documents (initialDocs) and questionnaire answers (initialAnswers) are
  // already fetched by the order page's server render and handed in as props,
  // so we do NOT re-query them here. We only fetch what the server batch does
  // not already have: the rounds and the question definitions.
  const fetchData = useCallback(async () => {
    if (!user?.id) return

    const [roundsRes, questionsRes] = await Promise.all([
      // All visible rounds with their questions and doc requests
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
      // Service questionnaires (question definitions: labels, types, options)
      supabase
        .from('service_questionnaires')
        .select('question_key, question_label, question_type, options, display_order')
        .eq('service_package_id', servicePackageId)
        .order('display_order', { ascending: true }),
    ])

    setRounds((roundsRes.data as OrderRound[]) || [])
    setQuestions(questionsRes.data || [])
  }, [orderId, servicePackageId, user?.id, supabase])

  // Initial fetch — rounds + question definitions only.
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Debounced refetch: a single admin action (e.g. createRound, which inserts a
  // round plus several work-document rows) fires a BURST of realtime events.
  // Previously each event triggered its own full nested refetch — a refetch
  // storm. Coalesce a burst into one fetch shortly after it settles. Still a
  // full refetch (correct + simple), just not N of them.
  const refetchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const scheduleRefetch = useCallback(() => {
    if (refetchTimer.current) clearTimeout(refetchTimer.current)
    refetchTimer.current = setTimeout(() => { fetchData() }, 250)
  }, [fetchData])

  // Real-time subscriptions for the data this component owns: rounds + work
  // documents. order_documents / order_questionnaire_responses changes reach
  // this component via the parent's `initialDocs` prop (kept live by the parent's
  // own subscription) and a fresh server render, so we don't subscribe to them.
  useEffect(() => {
    if (!user?.id) return

    const channel = supabase
      .channel(`rounds-timeline-${orderId}`)
      // order_work_documents changes
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'order_work_documents',
        filter: `order_id=eq.${orderId}`,
      }, () => {
        scheduleRefetch()
      })
      // round_question_requests changes via order_rounds
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'order_rounds',
        filter: `order_id=eq.${orderId}`,
      }, () => {
        scheduleRefetch()
      })
      .subscribe()

    return () => {
      if (refetchTimer.current) clearTimeout(refetchTimer.current)
      channel.unsubscribe()
      supabase.removeChannel(channel)
    }
  }, [orderId, user?.id, supabase, scheduleRefetch])

  // Compute all answers for the Answers tab
  const knownAnswerKeys = new Set(questions.map(q => q.question_key))
  const allAnswers = [
    ...questions.map(q => {
      const answer = initialAnswers.find(a => a.question_key === q.question_key)
      return {
        question_key: q.question_key,
        question_label: q.question_label,
        question_type: q.question_type,
        options: q.options,
        response_value: answer?.response_value,
      }
    }),
    // Orphan answers: saved responses with no question definition (e.g. the
    // injected per-class trademark fields) so the customer sees them here too.
    ...initialAnswers
      .filter(a => !knownAnswerKeys.has(a.question_key) && a.response_value != null && a.response_value !== '')
      .map(a => ({
        question_key: a.question_key,
        question_label: deriveAnswerLabel(a.question_key),
        question_type: 'text',
        options: undefined,
        response_value: a.response_value,
      })),
  ]

  // Compute all round question responses
  const roundQuestionResponses = rounds
    .filter(r => r.round_number > 0)
    .flatMap(r => (r.round_question_requests || []).filter(q => q.answered_at))

  // Compute documents grouped by stage
  const documentsByStage = groupDocumentsByStage(initialDocs, rounds, workflowStages)

  // "Final Documents" = only the completed deliverables (tag final_output). Everything
  // else Ollvy exchanges mid-process — requests, for-signing, acknowledgements, info —
  // stays in the Documents tab; the row UI already shows whether it's from Ollvy or you.
  const roundsWithWork = rounds.filter(r => r.round_number > 0)
  const documentsByRound = roundsWithWork
    .map(r => ({ round: r, docs: (r.order_work_documents || []).filter(d => d.tag !== 'final_output') }))
    .filter(x => x.docs.length > 0)
  const finalByRound = roundsWithWork
    .map(r => ({ round: r, docs: (r.order_work_documents || []).filter(d => d.tag === 'final_output') }))
    .filter(x => x.docs.length > 0)

  const hasData = allAnswers.length > 0 || initialDocs.length > 0 || rounds.some(r =>
    (r.round_question_requests?.length ?? 0) > 0 || (r.order_work_documents?.length ?? 0) > 0
  )

  // Counts for the badges/pings (one consistent green style throughout).
  const docsCount = initialDocs.length + documentsByRound.reduce((acc, x) => acc + x.docs.length, 0)
  const finalCount = finalByRound.reduce((acc, x) => acc + x.docs.length, 0)
  const answersCount = allAnswers.filter(a => a.response_value != null).length + roundQuestionResponses.length
  // Documents the customer still needs to provide (asked for, not yet uploaded).
  const pendingDocsCount =
    initialDocs.filter(d => !d.file_url).length +
    documentsByRound.reduce(
      (acc, x) => acc + x.docs.filter(d => d.direction === 'from_customer' && !d.file_url).length,
      0,
    )

  if (!hasData) return null

  return (
    <Card className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
      <CardHeader className="border-b border-border/50 px-6 py-4">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
            Documents and Answers
          </CardTitle>
          {/* Pending = amber + grey "pending", matching the small service-card badges
              and the order page's existing amber "Documents Requested" convention. */}
          {pendingDocsCount > 0 && (
            <span className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider px-2 py-1 rounded-md bg-amber-500/10 border border-amber-500/20">
              <span className="font-semibold text-amber-600 dark:text-amber-400">{pendingDocsCount}</span>
              <span className="text-muted-foreground">pending</span>
            </span>
          )}
        </div>
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
            <CountPill count={docsCount} className="ml-auto" />
          </button>

          <button
            onClick={() => setActiveTab('final')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left",
              activeTab === 'final'
                ? "bg-background text-foreground shadow-sm border border-border/50"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            )}
          >
            <Download className="h-4 w-4" />
            Final Documents
            <CountPill count={finalCount} className="ml-auto" />
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
            <CountPill count={answersCount} className="ml-auto" />
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
                    <h4 className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                      {stageTitle}
                      <CountPill count={docs.length} />
                    </h4>
                    <div className="space-y-2">
                      {docs.map(doc => (
                        <DocumentRow key={doc.id} doc={doc} orderId={orderId} onPreview={setPreviewDoc} locked={locked} />
                      ))}
                    </div>
                  </div>
                )
              })}

              {/* Mid-process round documents — your uploads AND Ollvy's non-final docs (the row icon shows which). Only final_output lives in the Final Documents tab. */}
              {documentsByRound.map(({ round, docs }) => (
                <div key={round.id} className="space-y-3">
                  <h4 className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                    {round.title}
                    <CountPill count={docs.length} />
                  </h4>
                  <div className="space-y-2">
                    {docs.map(doc => (
                      <WorkDocumentRow key={doc.id} doc={doc} orderId={orderId} roundId={round.id} locked={locked} />
                    ))}
                  </div>
                </div>
              ))}

              {docsCount === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-8 w-8 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">No documents yet</p>
                </div>
              )}
            </div>
          )}

          {/* Final Documents Tab Content — Ollvy's deliverables (to_customer) */}
          {activeTab === 'final' && (
            <div className="space-y-6">
              {finalByRound.map(({ round, docs }) => (
                <div key={round.id} className="space-y-3">
                  <h4 className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                    {round.title}
                    <CountPill count={docs.length} />
                  </h4>
                  <div className="space-y-2">
                    {docs.map(doc => (
                      <WorkDocumentRow key={doc.id} doc={doc} orderId={orderId} roundId={round.id} locked={locked} />
                    ))}
                  </div>
                </div>
              ))}

              {finalCount === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Download className="h-8 w-8 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">No final documents yet</p>
                  <p className="text-xs mt-1">Completed deliverables will appear here to download.</p>
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
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "text-sm font-medium text-right",
                            !answer.response_value ? "text-muted-foreground/50 italic" : "text-foreground"
                          )}>
                            {renderResponseValue(answer.response_value, answer.question_type, answer.options)}
                          </span>
                          {!locked && answer.response_value == null && (
                            <Link href={`/orders/${orderId}/questionnaire`}>
                              <button className="shrink-0 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-muted/60 text-muted-foreground border border-border/50 hover:bg-muted transition-colors">
                                Answer
                              </button>
                            </Link>
                          )}
                        </div>
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
      {previewDoc && (
        <DocumentPreview
          isOpen
          onClose={() => setPreviewDoc(null)}
          documentLabel={previewDoc.documentLabel}
          fileUrl={previewDoc.fileUrl}
          fileName={previewDoc.fileName}
        />
      )}
    </Card>
  )
}

// Small neutral count circle, reused wherever a plain doc count appears so the
// styling stays consistent. Neutral grey — colour (amber=pending, green=new) is
// reserved for the status badges, matching the order page's existing convention.
function CountPill({ count, className }: { count: number; className?: string }) {
  if (count <= 0) return null
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-muted text-muted-foreground text-[10px] font-mono font-semibold leading-none',
        className,
      )}
    >
      {count}
    </span>
  )
}

// Document Row Component - for initial order_documents
function DocumentRow({ doc, orderId, onPreview, locked = false }: { doc: Round0Data['initialDocs'][0]; orderId: string; onPreview: (d: { documentLabel: string; fileUrl: string; fileName?: string }) => void; locked?: boolean }) {
  const [loading, setLoading] = useState(false)

  const handleView = async () => {
    if (!doc.file_url) return
    setLoading(true)
    try {
      const signedUrl = await getSignedUrl(doc.file_url)
      if (signedUrl) {
        onPreview({ documentLabel: doc.document_label, fileUrl: signedUrl, fileName: doc.file_name })
      }
    } catch (error) {
      console.error('Failed to get signed URL:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = () => {
    const meta = DOC_STATUS_META[initialDocStatus(doc)]
    return (
      <Badge
        variant="outline"
        className={cn('font-mono text-[10px] uppercase tracking-wider', meta.className)}
      >
        {meta.label}
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
        {doc.file_url ? (
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
        ) : locked ? null : (
          <Link href={`/orders/${orderId}/documents`}>
            <button className="shrink-0 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-muted/60 text-muted-foreground border border-border/50 hover:bg-muted transition-colors">
              Upload
            </button>
          </Link>
        )}
      </div>
    </div>
  )
}

// Work Document Row Component - for order_work_documents
function WorkDocumentRow({
  doc,
  orderId,
  roundId,
  locked = false
}: {
  doc: OrderWorkDocument
  orderId: string
  roundId: string
  locked?: boolean
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
    const meta = DOC_STATUS_META[workDocStatus(doc.status)]
    return (
      <Badge
        variant="outline"
        className={cn('font-mono text-[10px] uppercase tracking-wider', meta.className)}
      >
        {meta.label}
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
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 px-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors gap-1.5 sm:gap-0">
      {/* Left: icon + filename - full width on mobile */}
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
      {/* Right: tags + buttons - wraps below on mobile */}
      <div className="flex items-center gap-2 flex-wrap sm:shrink-0 pl-11 sm:pl-0">
        {getTagBadge()}
        {doc.tag !== 'for_signing' && getStatusBadge()}
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
        {isFromCustomer && !doc.file_url && !locked && (
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
