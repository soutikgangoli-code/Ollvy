'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { LearnToolConfig } from '@/lib/guides/pages';
import { ServiceConfig } from '@/lib/services';

interface PenaltyResult {
  lateFee: number;
  interest: number;
  total: number;
  breakdown: string;
  note?: string;
}

export function PenaltyTool({ config, ctaService }: {
  config: LearnToolConfig;
  ctaService: ServiceConfig;
}) {
  const [returnType, setReturnType] = useState<'gstr1' | 'gstr3b' | 'gstr9'>('gstr3b');
  const [daysLate, setDaysLate] = useState<string>('');
  const [taxDue, setTaxDue] = useState<string>('');
  const [turnover, setTurnover] = useState<string>('');
  const [isNil, setIsNil] = useState(false);
  const [result, setResult] = useState<PenaltyResult | null>(null);

  const calculatePenalty = () => {
    const days = parseInt(daysLate) || 0;
    const tax = parseInt(taxDue) || 0;
    const turnoverAmount = parseInt(turnover) || 0;

    // Per Section 47, CGST Act 2017:
    // Nil return: Rs. 10 CGST + Rs. 10 SGST = Rs. 20/day, max Rs. 500 CGST + Rs. 500 SGST = Rs. 1,000
    // Regular return: Rs. 25 CGST + Rs. 25 SGST = Rs. 50/day, max Rs. 2,500 CGST + Rs. 2,500 SGST = Rs. 5,000
    let lateFeePerDay = isNil ? 20 : 50;
    let maxLateFee = isNil ? 1000 : 5000;
    let note: string | undefined;

    if (returnType === 'gstr9') {
      // GSTR-9: Rs. 100 CGST + Rs. 100 SGST = Rs. 200/day
      // Max: 0.25% of total turnover in the state
      lateFeePerDay = 200;
      if (turnoverAmount > 0) {
        maxLateFee = Math.round(turnoverAmount * 0.0025); // 0.25% of turnover
        note = `Cap calculated as 0.25% of your turnover (Rs. ${turnoverAmount.toLocaleString('en-IN')})`;
      } else {
        // If no turnover provided, use a reasonable placeholder and add note
        maxLateFee = 50000;
        note = 'Maximum late fee depends on your annual turnover (0.25% of turnover). Enter turnover for accurate cap.';
      }
    }

    const lateFee = Math.min(days * lateFeePerDay, maxLateFee);
    const interest = tax > 0 ? Math.round((tax * 0.18 / 365) * days) : 0;
    const total = lateFee + interest;

    const breakdown = `${days} days × ₹${lateFeePerDay}/day = ₹${days * lateFeePerDay}${
      days * lateFeePerDay > maxLateFee ? ` (capped at ₹${maxLateFee.toLocaleString('en-IN')})` : ''
    }`;

    setResult({
      lateFee,
      interest,
      total,
      breakdown,
      note,
    });
  };

  return (
    <div className="border border-border rounded-xl bg-card overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-background">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Penalty calculator
        </p>
        <p className="font-semibold text-foreground mt-1">{config.title}</p>
      </div>

      <div className="p-6 space-y-4">
        {/* Return type selector */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block">
            Which return?
          </label>
          <div className="flex gap-2">
            {[
              { value: 'gstr1', label: 'GSTR-1' },
              { value: 'gstr3b', label: 'GSTR-3B' },
              { value: 'gstr9', label: 'GSTR-9' },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => setReturnType(opt.value as typeof returnType)}
                className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                  returnType === opt.value
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border text-muted-foreground hover:border-foreground/40'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Days late input */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block">
            How many days late?
          </label>
          <input
            type="number"
            value={daysLate}
            onChange={(e) => setDaysLate(e.target.value)}
            placeholder="e.g., 30"
            className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/40"
          />
        </div>

        {/* Tax due input */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block">
            Outstanding tax (₹)
          </label>
          <input
            type="number"
            value={taxDue}
            onChange={(e) => setTaxDue(e.target.value)}
            placeholder="e.g., 100000"
            className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/40"
          />
        </div>

        {/* Turnover input for GSTR-9 */}
        {returnType === 'gstr9' && (
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Annual turnover in your state (₹)
            </label>
            <input
              type="number"
              value={turnover}
              onChange={(e) => setTurnover(e.target.value)}
              placeholder="e.g., 50000000"
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/40"
            />
            <p className="text-xs text-muted-foreground mt-1">
              GSTR-9 late fee is capped at 0.25% of your turnover in the state
            </p>
          </div>
        )}

        {/* Nil return toggle */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="nil-return"
            checked={isNil}
            onChange={(e) => setIsNil(e.target.checked)}
            className="w-4 h-4 rounded border-border"
          />
          <label htmlFor="nil-return" className="text-xs text-muted-foreground">
            This is a nil return (no tax due)
          </label>
        </div>

        <Button onClick={calculatePenalty} className="w-full">
          Calculate penalty
        </Button>

        {/* Result */}
        {result && (
          <div className="mt-4 p-4 rounded-lg bg-[hsl(var(--ollvy-amber))]/5 border border-[hsl(var(--ollvy-amber))]/20">
            <div className="flex items-start gap-3">
              <AlertTriangle size={16} className="text-[hsl(var(--ollvy-amber))] mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">
                  Total penalty: ₹{result.total.toLocaleString('en-IN')}
                </p>
                <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                  <p>Late fee: ₹{result.lateFee.toLocaleString('en-IN')}</p>
                  <p className="text-xs">{result.breakdown}</p>
                  {result.interest > 0 && (
                    <p>Interest (18% p.a.): ₹{result.interest.toLocaleString('en-IN')}</p>
                  )}
                  {result.note && (
                    <p className="text-xs italic mt-2">{result.note}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[hsl(var(--ollvy-amber))]/20">
              <Button size="sm" className="w-full" asChild>
                <a href={`/services/${ctaService.slug}?utm_source=guides_tool&utm_medium=penalty_calculator`}>
                  Avoid future penalties - ₹{ctaService.ollvyFee.toLocaleString('en-IN')}/mo
                </a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
