'use client'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { getClient } from '@/lib/supabase'
import { useAuthStore } from '@/lib/stores/auth-store'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { formatDate, formatDateTime } from '@/lib/utils'
import { useToast } from '@/lib/hooks/use-toast'
import { buildRejectionMessage, getRejectionLabel } from '@/lib/constants/rejection-reasons'
import type { OrderRound, RoundQuestionRequest, OrderWorkDocument } from '@/lib/types'
import { Download, Upload, Check, AlertCircle } from 'lucide-react'

interface RoundsTimelineProps {
  orderId: string
  servicePackageId: string
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
  }>
}

export function RoundsTimeline({ orderId, servicePackageId }: RoundsTimelineProps) {
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
            id, direction, document_label, description, tag, status,
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
      // Initial documents
      supabase
        .from('order_documents')
        .select('id, document_label, file_url, file_name, verified_at, rejection_reason, stage_key')
        .eq('order_id', orderId)
        .eq('stage_key', 'doc_collection'),
    ]).then(([roundsRes, answersRes, questionsRes, docsRes]) => {
      setRounds((roundsRes.data as OrderRound[]) || [])
      setRound0Data({
        answers: answersRes.data || [],
        questions: questionsRes.data || [],
        initialDocs: docsRes.data || [],
      })
    })
  }, [orderId, servicePackageId, user?.id])

  if (!rounds.length) return null

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Steps
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {rounds.map(round => (
          <RoundCard
            key={round.id}
            round={round}
            orderId={orderId}
            round0Data={round.round_number === 0 ? round0Data : null}
          />
        ))}
      </CardContent>
    </Card>
  )
}

// Round Card Component
function RoundCard({
  round,
  orderId,
  round0Data,
}: {
  round: OrderRound
  orderId: string
  round0Data: Round0Data | null
}) {
  const questions = round.round_question_requests || []
  const fromCustomerDocs = (round.order_work_documents || []).filter(d => d.direction === 'from_customer')
  const toCustomerDocs = (round.order_work_documents || []).filter(d => d.direction === 'to_customer')

  const actionTag = getActionTag(round, questions, fromCustomerDocs, toCustomerDocs)

  // For Round 0, render read-only content
  if (round.round_number === 0) {
    return (
      <div className="border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-foreground">{round.title}</h4>
          <Badge variant="default" className="text-xs">Completed</Badge>
        </div>
        {round0Data && round0Data.answers.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-muted-foreground mb-2">Your answers</p>
            <div className="space-y-1 text-sm">
              {round0Data.questions.map(q => {
                const answer = round0Data.answers.find(a => a.question_key === q.question_key)
                return (
                  <div key={q.question_key} className="flex justify-between">
                    <span className="text-muted-foreground">{q.question_label}</span>
                    <span className="font-medium text-foreground">
                      {renderResponseValue(answer?.response_value, q.question_type, q.options)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
        {round0Data && round0Data.initialDocs.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground mb-2">Uploaded documents</p>
            <div className="space-y-2">
              {round0Data.initialDocs.map(doc => (
                <div key={doc.id} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{doc.document_label}</span>
                  {doc.file_url ? (
                    <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="text-primary text-xs">
                      View
                    </a>
                  ) : (
                    <span className="text-muted-foreground text-xs">Not uploaded</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // For Round 1+, render interactive content
  // Check what action is needed
  const hasUnansweredQuestions = questions.some(q => !q.answered_at)
  const hasPendingDocRequests = fromCustomerDocs.some(d => d.status === 'pending' || d.status === 'rejected')
  const hasReuploadDocs = fromCustomerDocs.some(d => d.linked_request_id)

  // Determine action button
  const getActionButton = () => {
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
      return (
        <Button asChild size="sm">
          <Link href={`/orders/${orderId}/round-uploads/${round.id}`}>
            {hasReuploadDocs ? 'Upload additional documents' : 'Upload documents'}
          </Link>
        </Button>
      )
    }

    return null
  }

  const actionButton = getActionButton()

  return (
    <div className="border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-foreground">{round.title}</h4>
        <Badge variant={actionTag.variant as any} className="text-xs">{actionTag.label}</Badge>
      </div>

      {/* Questions Section */}
      {questions.length > 0 && (
        <RoundQuestionsSection round={round} questions={questions} orderId={orderId} />
      )}

      {/* Documents Section */}
      {(fromCustomerDocs.length > 0 || toCustomerDocs.length > 0) && (
        <RoundDocumentsSection
          round={round}
          fromCustomerDocs={fromCustomerDocs}
          toCustomerDocs={toCustomerDocs}
          orderId={orderId}
          questionsAnswered={questions.every(q => q.answered_at)}
        />
      )}

      {/* Action Button - prominent CTA at bottom of active round card */}
      {round.status !== 'completed' && actionButton && (
        <div className="mt-4 pt-4 border-t border-border">
          {actionButton}
        </div>
      )}
    </div>
  )
}

// Questions Section
function RoundQuestionsSection({
  round,
  questions,
  orderId,
}: {
  round: OrderRound
  questions: RoundQuestionRequest[]
  orderId: string
}) {
  const { toast } = useToast()
  const supabase = getClient()
  const [loading, setLoading] = useState(false)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  // Ref to prevent double submissions from rapid clicks
  const submitInFlightRef = useRef(false)

  const unansweredQuestions = questions.filter(q => !q.answered_at)
  const answeredQuestions = questions.filter(q => q.answered_at)

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  const handleSubmit = async () => {
    // Prevent double submission
    if (submitInFlightRef.current) return
    submitInFlightRef.current = true

    const allFilled = unansweredQuestions.every(q => answers[q.id]?.trim())
    if (!allFilled) {
      toast({ title: 'Please answer all questions', variant: 'destructive' })
      submitInFlightRef.current = false
      return
    }

    setLoading(true)
    try {
      for (const q of unansweredQuestions) {
        await supabase
          .from('round_question_requests')
          .update({
            answer_text: answers[q.id].trim(),
            answered_at: new Date().toISOString(),
          })
          .eq('id', q.id)
      }
      toast({ title: 'Answers submitted' })
      // Reload page to refresh state
      window.location.reload()
    } catch (err) {
      toast({ title: 'Error submitting answers', variant: 'destructive' })
      submitInFlightRef.current = false
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mb-4">
      <p className="text-xs text-muted-foreground mb-2">Questions</p>

      {/* Answered questions */}
      {answeredQuestions.map(q => (
        <div key={q.id} className="mb-2 p-3 bg-muted rounded-lg">
          <p className="text-sm font-medium text-foreground">{q.question_text}</p>
          <p className="text-sm text-muted-foreground mt-1">{q.answer_text}</p>
          <p className="text-xs text-muted-foreground mt-1">{formatDateTime(q.answered_at!)}</p>
        </div>
      ))}

      {/* Unanswered questions */}
      {unansweredQuestions.length > 0 && (
        <div className="space-y-3">
          {unansweredQuestions.map(q => (
            <div key={q.id}>
              <p className="text-sm font-medium text-foreground mb-1">{q.question_text}</p>
              <Textarea
                placeholder="Your answer..."
                value={answers[q.id] || ''}
                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
              />
            </div>
          ))}
          <Button
            onClick={handleSubmit}
            disabled={loading || !unansweredQuestions.every(q => answers[q.id]?.trim())}
          >
            {loading ? 'Submitting...' : 'Submit answers'}
          </Button>
        </div>
      )}
    </div>
  )
}

// Documents Section
function RoundDocumentsSection({
  round,
  fromCustomerDocs,
  toCustomerDocs,
  orderId,
  questionsAnswered,
}: {
  round: OrderRound
  fromCustomerDocs: OrderWorkDocument[]
  toCustomerDocs: OrderWorkDocument[]
  orderId: string
  questionsAnswered: boolean
}) {
  const { toast } = useToast()
  const supabase = getClient()
  const [loading, setLoading] = useState(false)
  const [stagedFiles, setStagedFiles] = useState<Record<string, File>>({})
  // Ref to prevent double submissions from rapid clicks
  const submitInFlightRef = useRef(false)

  const handleFileStage = (docId: string, file: File) => {
    setStagedFiles(prev => ({ ...prev, [docId]: file }))
  }

  const handleSubmitDocs = async () => {
    // Prevent double submission
    if (submitInFlightRef.current) return
    submitInFlightRef.current = true

    setLoading(true)
    try {
      for (const [docId, file] of Object.entries(stagedFiles)) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${orderId}/${docId}/${Date.now()}.${fileExt}`
        await supabase.storage.from('work-documents').upload(fileName, file, { cacheControl: '3600', upsert: true })
        const { data: { publicUrl } } = supabase.storage.from('work-documents').getPublicUrl(fileName)

        await supabase.from('order_work_documents').update({
          file_url: publicUrl,
          file_name: file.name,
          uploaded_at: new Date().toISOString(),
          status: 'uploaded',
          uploaded_by_type: 'customer',
        }).eq('id', docId)
      }
      toast({ title: 'Documents uploaded successfully' })
      window.location.reload()
    } catch (err) {
      toast({ title: 'Error uploading documents', variant: 'destructive' })
      submitInFlightRef.current = false
    } finally {
      setLoading(false)
    }
  }

  const pendingDocs = fromCustomerDocs.filter(d => d.status === 'pending' || d.status === 'rejected')
  const hasStagedFiles = Object.keys(stagedFiles).length > 0

  // If questions not answered, gray out docs section
  if (!questionsAnswered && round.round_question_requests && round.round_question_requests.length > 0) {
    return (
      <div className="opacity-50 pointer-events-none">
        <p className="text-xs text-muted-foreground mb-2">Documents</p>
        <p className="text-sm text-muted-foreground">Complete the questions above first.</p>
      </div>
    )
  }

  return (
    <div>
      <p className="text-xs text-muted-foreground mb-2">Documents</p>

      {/* Admin uploads (to_customer) */}
      {toCustomerDocs.map(doc => {
        // Find linked from_customer doc if this is for_signing
        const linkedFromDoc = doc.linked_request_id
          ? fromCustomerDocs.find(d => d.id === doc.linked_request_id)
          : null

        return (
          <div key={doc.id} className="mb-3">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{doc.document_label}</p>
                {doc.description && (
                  <p className="text-xs text-muted-foreground mt-0.5">{doc.description}</p>
                )}
                {doc.tag && (
                  <Badge variant="outline" className="text-xs mt-1">
                    {doc.tag === 'for_signing' ? 'For Signing' :
                     doc.tag === 'government_processing' ? 'Government Processing' :
                     doc.tag === 'final_output' ? 'Final Document' : 'Informational'}
                  </Badge>
                )}
              </div>
              <a
                href={doc.file_url}
                download
                className="flex items-center gap-1 text-sm text-primary hover:underline"
              >
                <Download className="h-4 w-4" />
                Download
              </a>
            </div>

            {/* If for_signing, show linked upload slot */}
            {linkedFromDoc && linkedFromDoc.status === 'pending' && (
              <div className="mt-2 ml-4 p-3 border border-dashed border-amber-400 rounded-lg bg-amber-50 dark:bg-amber-950">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-2">
                  Upload signed: {linkedFromDoc.document_label}
                </p>
                <input
                  type="file"
                  onChange={(e) => e.target.files?.[0] && handleFileStage(linkedFromDoc.id, e.target.files[0])}
                  className="text-sm"
                />
                {stagedFiles[linkedFromDoc.id] && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Staged: {stagedFiles[linkedFromDoc.id].name}
                  </p>
                )}
              </div>
            )}
          </div>
        )
      })}

      {/* From customer docs (not linked to for_signing) */}
      {fromCustomerDocs.filter(d => !toCustomerDocs.some(t => t.linked_request_id === d.id)).map(doc => (
        <div key={doc.id} className="mb-3">
          {doc.status === 'rejected' && doc.rejection_reason && (
            <div className="mb-2 p-2 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded text-sm text-red-700 dark:text-red-300">
              <AlertCircle className="h-4 w-4 inline mr-1" />
              {buildRejectionMessage(doc.document_label, doc.rejection_reason)}
            </div>
          )}
          <div className="p-3 border border-dashed border-border rounded-lg">
            <p className="text-sm font-medium text-foreground mb-2">{doc.document_label}</p>
            {doc.description && (
              <p className="text-xs text-muted-foreground mb-2">{doc.description}</p>
            )}
            {doc.status === 'pending' || doc.status === 'rejected' ? (
              <>
                <input
                  type="file"
                  onChange={(e) => e.target.files?.[0] && handleFileStage(doc.id, e.target.files[0])}
                  className="text-sm"
                />
                {stagedFiles[doc.id] && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Staged: {stagedFiles[doc.id].name}
                  </p>
                )}
              </>
            ) : doc.status === 'uploaded' ? (
              <div className="flex items-center gap-2 text-sm text-amber-600">
                <Upload className="h-4 w-4" />
                Uploaded - Awaiting review
              </div>
            ) : doc.status === 'verified' ? (
              <div className="flex items-center gap-2 text-sm text-emerald-600">
                <Check className="h-4 w-4" />
                Verified
              </div>
            ) : null}
          </div>
        </div>
      ))}

      {/* Submit button */}
      {hasStagedFiles && (
        <Button onClick={handleSubmitDocs} disabled={loading} className="mt-3">
          {loading ? 'Uploading...' : `Submit ${Object.keys(stagedFiles).length} document${Object.keys(stagedFiles).length > 1 ? 's' : ''}`}
        </Button>
      )}
    </div>
  )
}

// Helper functions
function getActionTag(
  round: OrderRound,
  questions: RoundQuestionRequest[],
  fromCustomerDocs: OrderWorkDocument[],
  toCustomerDocs: OrderWorkDocument[]
): { label: string; variant: string } {
  if (round.status === 'completed') return { label: 'Completed', variant: 'default' }

  const hasUnansweredQ = questions.some(q => !q.answered_at)
  const hasPendingDocs = fromCustomerDocs.some(d => d.status === 'pending' || d.status === 'rejected')
  const hasReuploadDocs = fromCustomerDocs.some(d => d.linked_request_id)
  const hasForSigning = toCustomerDocs.some(d => d.tag === 'for_signing')
  const hasGovt = toCustomerDocs.some(d => d.tag === 'government_processing')

  if (hasUnansweredQ && !hasPendingDocs) return { label: 'Answer questions', variant: 'secondary' }
  if (hasForSigning) return { label: 'Sign and re-upload', variant: 'destructive' }
  if (hasPendingDocs && hasReuploadDocs) return { label: 'Upload additional documents', variant: 'secondary' }
  if (hasPendingDocs) return { label: 'Upload documents', variant: 'secondary' }
  if (hasGovt) return { label: 'Awaiting government processing', variant: 'outline' }
  return { label: 'Awaiting review', variant: 'outline' }
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
