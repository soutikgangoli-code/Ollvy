'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';
import { LearnToolConfig, EligibilityQuestion, EligibilityResult } from '@/lib/learn/pages';
import Link from 'next/link';

// Get result styling based on type
function getResultStyle(type: EligibilityResult['type']) {
  switch (type) {
    case 'eligible':
    case 'mandatory':
      return {
        bg: 'bg-[hsl(var(--ollvy-green))]/5 border border-[hsl(var(--ollvy-green))]/20',
        icon: CheckCircle,
        iconColor: 'text-[hsl(var(--ollvy-green))]',
      };
    case 'recommended':
    case 'optional':
    case 'conditional':
    default:
      return {
        bg: 'bg-[hsl(var(--ollvy-amber))]/5 border border-[hsl(var(--ollvy-amber))]/20',
        icon: Info,
        iconColor: 'text-[hsl(var(--ollvy-amber))]',
      };
  }
}

export function ComparisonTool({ config }: {
  config: LearnToolConfig;
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
      setResult(evaluateAnswers(questions, newAnswers, config.defaultResult));
    }
  };

  // Determine recommendation based on result headline
  const recommendation = result?.headline?.includes('Private Limited')
    ? { slug: 'pvt-ltd-incorporation', name: 'Pvt Ltd Incorporation', price: 'Rs. 24,999' }
    : result?.headline?.includes('LLP')
    ? { slug: 'llp-incorporation', name: 'LLP Incorporation', price: 'Rs. 12,999' }
    : null;

  const resultStyle = result ? getResultStyle(result.type) : null;
  const Icon = resultStyle?.icon;

  return (
    <div className="border border-border rounded-xl bg-card overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-background">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Decision tool
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
            resultStyle?.bg
          )}>
            {Icon && <Icon size={16} className={cn(resultStyle?.iconColor, "mt-0.5 shrink-0")} />}
            <div>
              <p className="text-sm font-semibold text-foreground">{result.headline}</p>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{result.body}</p>
            </div>
          </div>

          {recommendation && (result.type === 'eligible' || result.type === 'mandatory' || result.type === 'recommended') && (
            <Button className="w-full" asChild>
              <Link href={result.ctaHref ?? `/checkout/${recommendation.slug}?utm_source=learn_tool&utm_medium=comparison_result`}>
                {result.ctaLabel ?? `Book ${recommendation.name} - ${recommendation.price}`}
              </Link>
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

function evaluateAnswers(
  questions: EligibilityQuestion[],
  answers: Record<number, string>,
  defaultResult?: EligibilityResult
): EligibilityResult {
  for (const [i, q] of questions.entries()) {
    const result = q.evaluator?.(answers[i], answers);
    if (result) return result;
  }
  return defaultResult ?? {
    type: 'conditional',
    headline: 'Either can work for your situation.',
    body: 'Both options are viable. Consider consulting with a CA to understand the specific implications for your business model.',
  };
}

function getEarlyResult(
  questions: EligibilityQuestion[],
  answers: Record<number, string>,
  currentStep: number
): EligibilityResult | null {
  return questions[currentStep]?.earlyExit?.(answers[currentStep]) ?? null;
}
