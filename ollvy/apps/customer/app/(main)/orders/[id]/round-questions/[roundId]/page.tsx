'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { getClient } from '@/lib/supabase'
import { useAuthStore } from '@/lib/stores/auth-store'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
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
  }, [orderId, roundId, supabase, toast, router])

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
