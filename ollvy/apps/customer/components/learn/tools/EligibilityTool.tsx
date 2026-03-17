'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { LearnToolConfig, EligibilityQuestion, EligibilityResult } from '@/lib/learn/pages';
import { ServiceConfig } from '@/lib/services';

export function EligibilityTool({ config, ctaService }: {
  config: LearnToolConfig;
  ctaService: ServiceConfig;
}) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<EligibilityResult | null>(null);
  const [step, setStep] = useState(0);

  const questions = config.questions ?? [];
  const currentQ = questions[step];

  const handleAnswer = (answer: string) => {
    const newAnswers = { ...answers, [step]: answer };
    setAnswers(newAnswers);

    // Check for early-exit branches
    const earlyResult = getEarlyResult(questions, newAnswers, step);
    if (earlyResult) {
      setResult(earlyResult);
      return;
    }

    if (step < questions.length - 1) {
      setStep(prev => prev + 1);
    } else {
      setResult(evaluateAnswers(questions, newAnswers));
    }
  };

  return (
    <div className="border border-border rounded-xl bg-card overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-background">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Quick check
        </p>
        <p className="font-semibold text-foreground mt-1">{config.title}</p>
      </div>

      {!result ? (
        <div className="p-6">
          {/* Progress */}
          <div className="flex gap-1.5 mb-6">
            {questions.map((_, i) => (
              <div key={i} className={cn(
                "h-1 flex-1 rounded-full transition-colors",
                i <= step ? "bg-[hsl(var(--ollvy-green))]" : "bg-muted"
              )} />
            ))}
          </div>

          <p className="text-sm font-medium text-foreground mb-4">
            {currentQ?.text}
          </p>
          <div className="space-y-2">
            {currentQ?.options.map(opt => (
              <button
                key={opt.value}
                onClick={() => handleAnswer(opt.value)}
                className="w-full text-left px-4 py-3 rounded-lg border border-border
                           text-sm text-foreground hover:border-foreground/40
                           hover:bg-muted/30 transition-colors"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-6">
          <div className={cn(
            "flex items-start gap-3 rounded-lg p-4 mb-5",
            result.type === 'eligible'
              ? "bg-[hsl(var(--ollvy-green))]/5 border border-[hsl(var(--ollvy-green))]/20"
              : result.type === 'ineligible'
              ? "bg-muted/40 border border-border"
              : "bg-[hsl(var(--ollvy-amber))]/5 border border-[hsl(var(--ollvy-amber))]/20"
          )}>
            {result.type === 'eligible'
              ? <CheckCircle size={16} className="text-[hsl(var(--ollvy-green))] mt-0.5 shrink-0" />
              : <AlertCircle size={16} className="text-[hsl(var(--ollvy-amber))] mt-0.5 shrink-0" />
            }
            <div>
              <p className="text-sm font-semibold text-foreground">{result.headline}</p>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{result.body}</p>
            </div>
          </div>

          {result.type === 'eligible' && (
            <Button className="w-full" asChild>
              <a href={`/services/${ctaService.slug}?utm_source=learn_tool&utm_medium=eligibility_result`}>
                {result.ctaLabel ?? `Book ${ctaService.shortName} — ₹${(ctaService.ollvyFee + (ctaService.govtFee ?? 0)).toLocaleString('en-IN')}`}
              </a>
            </Button>
          )}

          <button
            onClick={() => { setAnswers({}); setStep(0); setResult(null); }}
            className="w-full mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Start over
          </button>
        </div>
      )}
    </div>
  );
}

// Evaluation logic is defined per tool in the LearnPageConfig
// These are pure functions — no side effects
function evaluateAnswers(
  questions: EligibilityQuestion[],
  answers: Record<number, string>
): EligibilityResult {
  // Each question has an `evaluator` function that returns a result or null
  for (const [i, q] of questions.entries()) {
    const result = q.evaluator?.(answers[i], answers);
    if (result) return result;
  }
  // Default
  return {
    type: 'conditional',
    headline: 'It depends on your situation.',
    body: 'WhatsApp us with your specific details and we\'ll tell you in 2 minutes.',
  };
}

function getEarlyResult(
  questions: EligibilityQuestion[],
  answers: Record<number, string>,
  currentStep: number
): EligibilityResult | null {
  return questions[currentStep]?.earlyExit?.(answers[currentStep]) ?? null;
}
